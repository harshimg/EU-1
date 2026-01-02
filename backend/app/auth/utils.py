import random
# from jose import jwt
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from app.config import settings
from passlib.context import CryptContext
from fastapi import HTTPException
from typing import Optional
from email_validator import validate_email, EmailNotValidError

pwd_ctx = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")

# -------------------------------------
# Password Hashing
# -------------------------------------
def hash_password(password: str) -> str:
    return pwd_ctx.hash(password)

def verify_password(password: str, hashed: str) -> bool:
    return pwd_ctx.verify(password, hashed)


# -------------------------------------
# OTP Generator
# -------------------------------------
def generate_otp() -> str:
    return str(random.randint(100000, 999999))


# -------------------------------------
# JWT Token Creation
# -------------------------------------
def create_access_token(user_id: str, role: str, semester: int, branch: str, login_type: str):
    expire_at = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "user_id": user_id,
        "role": role,
        "semester": semester,
        "branch": branch,
        "login_type": login_type,
        "exp": expire_at
    }

    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    
    return token, expire_at


# -------------------------------------
# Decode Token
# -------------------------------------
def decode_token(token: str):
    try:
        return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except:
        raise HTTPException(401, "Invalid or expired token")

def verify_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except JWTError:
        return None



from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.auth.utils import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    return payload


oauth2_optional = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)

async def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_optional)
):
    if not token:
        return None

    payload = decode_token(token)
    return payload



def validate_user_email(email: str):

    try:
        v = validate_email(email)
        return v.email

    except EmailNotValidError as e:
        raise HTTPException(
        status_code=400,
        detail=str(e)
        )