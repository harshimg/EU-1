from datetime import datetime, timezone
from fastapi import HTTPException

from app.database import db_instance
from app.utils.email_sender import send_otp_email
from .utils import hash_password, verify_password, generate_otp, create_access_token


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

    otp = generate_otp()

    temp_record = {
        "name": body.name,
        "email": body.email,
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
        {"email": body.email},
        {"$set": temp_record},
        upsert=True
    )

    send_ok = send_otp_email(body.email, otp)

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
