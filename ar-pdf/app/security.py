
from app.config import PDF_SERVICE_KEY

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

API_KEY = PDF_SERVICE_KEY

if not API_KEY:
    raise RuntimeError("PDF_SERVICE_KEY is not set")

security = HTTPBearer(auto_error=True)

def verify_api_key(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    if credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication scheme"
        )

    if credentials.credentials != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )

    return True



