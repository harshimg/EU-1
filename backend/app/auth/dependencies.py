from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.utils import verify_access_token
from app.auth.utils import get_current_user

security = HTTPBearer()

# -----Super admin -----------------------------
async def superalpha_required(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    if payload.get("role") != "superalpha":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="super admin access required",
        )

    return payload


#-----------------admin ----------------------
async def admin_required(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    payload = verify_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    if payload.get("role") != "admin" and payload.get("role") != "superalpha":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )

    return payload  # optional, useful if needed later






#--------user looged in----------
async def user_required(current_user: dict = Depends(get_current_user)):
    """
    Allows any authenticated user (admin or normal user)
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    return current_user
