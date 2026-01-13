from datetime import datetime, timezone, timedelta
import numbers
from fastapi import HTTPException

from app.database import db_instance
from app.utils.email_sender import send_otp_email
from .utils import hash_password,hash_otp, verify_password, generate_otp, create_access_token, validate_user_email


# ======================================================
# 1) CHECK USER EXISTS
# ======================================================
async def user_exists(email: str) -> bool:
    user = await db_instance.db.users.find_one({"email": email})
    return user is not None


# ======================================================
# 2) SIGNUP: Save to email_otps only
# ======================================================
async def initiate_signup(body):
    if await user_exists(body.email):
        return {"success": False, "message": "Email already registered"}

    email = validate_user_email(body.email)

    otp = generate_otp()

    temp_record = {
        "name": body.name,
        "email": email,
        "password_hash": hash_password(body.password),
        "semester": body.semester,
        "branch": body.branch,
        "mobile": body.mobile,
        "reg_no": body.reg_no,
        "otp": otp,
        "created_at": datetime.now(timezone.utc)
    }

    # Save or overwrite OTP record
    await db_instance.db.email_otps.update_one(
        {"email": email},
        {"$set": temp_record},
        upsert=True
    )

    send_ok = send_otp_email(email, otp)

    if not send_ok:
        return {"success": False, "message": "Failed to send OTP"}

    return {"success": True, "message": "OTP sent successfully"}


# ======================================================
# 3) VERIFY OTP → Move email_otps → users
# ======================================================
async def verify_otp(email, otp):
    record = await db_instance.db.email_otps.find_one(
        {"email": email, "otp": otp}
    )

    if not record:
        return {"success": False, "message": "Invalid or expired OTP"}

    # Build final user document
    user_doc = {
        "name": record["name"],
        "email": email,
        "password_hash": record["password_hash"],
        "semester": record["semester"],
        "branch": record["branch"],
        "mobile": record["mobile"],
        "reg_no": record["reg_no"],
        "role": "user",
        "login_type": "email",
        "is_verified": True,
        "created_at": datetime.now(timezone.utc)
    }

    result = await db_instance.db.users.insert_one(user_doc)

    # Delete all OTP records for this email
    await db_instance.db.email_otps.delete_many({"email": email})

    return {
        "success": True,
        "message": "Email verified & user created",
        "user_id": str(result.inserted_id)
    }


# ======================================================
# LOGIN (User + Admin)
# ======================================================
async def login_user(email, password):
    user = await db_instance.db.users.find_one({"email": email})

    if not user:
        return {"success": False, "message": "Invalid credentials"}

    if not verify_password(password, user["password_hash"]):
        return {"success": False, "message": "Invalid credentials"}

    token, expires_at = create_access_token(
        user_id=str(user["_id"]),
        role=user["role"],                     # "user" or "admin"
        semester=user.get("semester"),         # None for admin
        branch=user.get("branch"),             # None for admin
        login_type=user.get("login_type", "password")
    )

    return {
        "success": True,
        "message": "Login successful",
        "token": token,
        "expires_at": expires_at.isoformat(),
        "user_id": str(user["_id"]),
        "role": user["role"],
        "semester": user.get("semester"),
        "branch": user.get("branch")
    }


async def send_otp(email):

    if not email:
        return {"success": True, "message": "OTP was sent on your email"}

    user = await db_instance.db.users.find_one({"email": email})

    # Always return success (anti-enumeration)
    if not user:
        return {"success": True, "message": "OTP was sent on your email"}

    # 🔒 Invalidate previous OTPs
    await db_instance.db.password_otps.update_many(
        {"user_id": user["_id"], "used": False},
        {"$set": {"used": True}}
    )

    otp = generate_otp()
    otp_hash = hash_otp(otp)

    await db_instance.db.password_otps.insert_one({
        "user_id": user["_id"],
        "otp_hash": otp_hash,
        "expires_at": datetime.now(timezone.utc) + timedelta(minutes=10),
        "attempts": 0,
        "used": False,
        "created_at": datetime.now(timezone.utc)
    })

    # 📧 Send email (Google SMTP already used by you)
    send_ok = send_otp_email(email, otp)

    if not send_ok:
        return {"success": False, "message": "Failed to send OTP"}

    return {
        "success": True,
        "message": "OTP was sent on your email."
    }

async def change_password(email, otp, new_password):

    if not all([email, otp, new_password]):
        raise HTTPException(status_code=400, detail="Invalid request")

    user = await db_instance.db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email, Create new account if not registered")

    otp_hash = hash_otp(otp)

    record = await db_instance.db.password_otps.find_one({
        "user_id": user["_id"],
        # "otp_hash": otp_hash,           # gives query result even user enterd wrong otp
        "used": False
    })

    if not record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    #  Expiry check
    now_utc_naive = datetime.now(timezone.utc).replace(tzinfo=None)
    if record["expires_at"] < now_utc_naive:
        await db_instance.db.password_otps.update_one(
            {"_id": record["_id"]},
            {"$inc": {"attempts": 1}}
        )
        raise HTTPException(status_code=400, detail="OTP expired")

    #  Attempt limit
    if record["attempts"] >= 5:
        await db_instance.db.password_otps.update_one(
            {"_id": record["_id"]},
            {"$inc": {"attempts": 1}}
        )
        raise HTTPException(status_code=400, detail="Maximum OTP request reached")

    #  Wrong OTP
    if record["otp_hash"] != otp_hash:
        await db_instance.db.password_otps.update_one(
            {"_id": record["_id"]},
            {"$inc": {"attempts": 1}}
        )
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # Update password
    hashed_pw = hash_password(new_password)

    await db_instance.db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"password_hash": hashed_pw}}
    )

    # Invalidate OTP
    await db_instance.db.password_otps.update_one(
        {"_id": record["_id"]},
        {"$set": {"used": True}}
    )


    return {"success": True, "message": "Password reset successful"}

