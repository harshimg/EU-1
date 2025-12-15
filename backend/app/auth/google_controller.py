# backend/app/auth/google_controller.py
import httpx
from datetime import datetime, timezone
from starlette.concurrency import run_in_threadpool

from app.config import settings
from app.database import db_instance
from .utils import create_access_token  # uses create_access_token(user_id, role, semester, branch, login_type)

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo"  # recommended OpenID endpoint

async def build_google_auth_url():
    """
    Build Google OAuth URL for user redirect (optional endpoint).
    Frontend can also construct this client-side; this endpoint just returns the URL.
    """
    client_id = settings.GOOGLE_CLIENT_ID
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    scope = "openid email profile"
    # response_type=code and access_type=offline if you want refresh tokens later
    url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={client_id}"
        f"&redirect_uri={redirect_uri}"
        f"&response_type=code"
        f"&scope={scope}"
        f"&prompt=select_account"
    )
    return url


async def exchange_code_for_token(code: str) -> dict:
    """
    Exchange authorization code for tokens from Google.
    Returns token response (dict) or raises httpx exception.
    """
    async with httpx.AsyncClient() as client:
        data = {
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": settings.GOOGLE_REDIRECT_URI,
            "grant_type": "authorization_code",
        }
        resp = await client.post(GOOGLE_TOKEN_URL, data=data, timeout=10.0)
        resp.raise_for_status()
        return resp.json()


async def fetch_google_userinfo(access_token: str) -> dict:
    """
    Fetch user info using access_token (OpenID userinfo endpoint).
    """
    headers = {"Authorization": f"Bearer {access_token}"}
    async with httpx.AsyncClient() as client:
        resp = await client.get(GOOGLE_USERINFO_URL, headers=headers, timeout=10.0)
        resp.raise_for_status()
        return resp.json()


async def handle_google_callback(code: str) -> dict:
    """
    Main flow:
      1) exchange code -> tokens
      2) fetch userinfo
      3) create or update user in DB (users collection)
      4) create JWT (same structure as email login)
      5) return token + user info
    """
    # 1) Exchange code for tokens
    token_response = await exchange_code_for_token(code)
    access_token = token_response.get("access_token")
    id_token = token_response.get("id_token")  # optionally used
    if not access_token:
        raise Exception("No access_token in token response")

    # 2) Get user info
    userinfo = await fetch_google_userinfo(access_token)
    # userinfo fields typically: sub (google id), email, email_verified, name, picture, given_name, family_name
    google_id = userinfo.get("sub")
    email = userinfo.get("email")
    email_verified = userinfo.get("email_verified", False)
    name = userinfo.get("name", "")
    picture = userinfo.get("picture")

    if not email or not email_verified:
        raise Exception("Google account does not have verified email")

    # 3) Create or update user in DB
    users_coll = db_instance.db["users"]

    # Try to find existing user by email
    existing = await (users_coll.find_one, {"email": email})

    now = datetime.now(timezone.utc)

    if existing:
        # Update existing user to include google metadata if not present
        update_fields = {}
        # if the user previously signed up with email, keep their password but add google info
        if existing.get("login_type") is None:
            update_fields["login_type"] = "google"
        else:
            # append google to login_type if needed (store as comma separated or list)
            lt = existing.get("login_type", "")
            if "google" not in lt:
                update_fields["login_type"] = f"{lt}|google" if lt else "google"

        # store google_id and picture
        update_fields["google_id"] = google_id
        update_fields["picture"] = picture
        update_fields["updated_at"] = now

        if update_fields:
            await (
                users_coll.update_one,
                {"email": email},
                {"$set": update_fields}
            )

        user_doc = await (users_coll.find_one, {"email": email})
    else:
        # Create new user: minimal fields, mark verified
        user_doc = {
            "name": name or email.split("@")[0],
            "email": email,
            "password_hash": None,
            "semester": None,   # user can set later in profile
            "branch": None,     # user can set later
            "mobile": None,
            "reg_no": None,
            "role": "user",
            "login_type": "google",
            "google_id": google_id,
            "picture": picture,
            "is_verified": True,
            "created_at": now,
            "updated_at": now,
        }
        result = await (users_coll.insert_one, user_doc)
        user_doc["_id"] = result.inserted_id

    # 4) Build token payload values (if missing, put safe defaults)
    user_id = str(user_doc["_id"])
    role = user_doc.get("role", "user")
    semester = user_doc.get("semester") or 0
    branch = user_doc.get("branch") or ""
    login_type = user_doc.get("login_type", "google")

    token, expires_at = create_access_token(
        user_id=user_id,
        role=role,
        semester=semester,
        branch=branch,
        login_type=login_type
    )

    # 5) Return same structure as email login
    return {
        "success": True,
        "message": "Google login successful",
        "token": token,
        "expires_at": expires_at.isoformat(),
        "user": {
            "user_id": user_id,
            "email": email,
            "name": user_doc.get("name"),
            "role": role,
            "semester": semester,
            "branch": branch,
            "picture": user_doc.get("picture"),
            "login_type": login_type
        }
    }
