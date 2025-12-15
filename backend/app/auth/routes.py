from fastapi import APIRouter, HTTPException
from .models import SignupModel, VerifyOtpModel, LoginModel
from .controller import initiate_signup, verify_otp, login_user

router = APIRouter()   


@router.post("/signup")
async def signup_route(body: SignupModel):
    result = await initiate_signup(body)

    if not result.get("success", False):
        raise HTTPException(status_code=400, detail=result["message"])

    return result


@router.post("/verify-email")
async def verify_route(body: VerifyOtpModel):
    result = await verify_otp(body.email, body.otp)

    if not result.get("success", False):
        raise HTTPException(status_code=400, detail=result["message"])

    return result


@router.post("/login")
async def login_route(body: LoginModel):
    result = await login_user(body.email, body.password)

    if not result.get("success", False):
        raise HTTPException(status_code=400, detail=result["message"])

    return result
