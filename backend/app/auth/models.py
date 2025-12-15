from pydantic import BaseModel, EmailStr
from typing import Optional

# Incoming Signup Request
from pydantic import BaseModel, EmailStr

class SignupModel(BaseModel):
    name: str
    email: EmailStr
    password: str
    semester: str
    branch: str
    mobile: str
    reg_no: str

class VerifyOtpModel(BaseModel):
    email: EmailStr
    otp: str

class LoginModel(BaseModel):
    email: EmailStr
    password: str
# MongoDB User Schema
class User(BaseModel):
    name: str
    email: EmailStr
    password: Optional[str] = None  # Google users won't have password
    semester: int
    branch: str
    mobile: str
    reg_no: str
    is_verified: bool = False
    login_type: str = "email"  # or "google"
