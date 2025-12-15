# backend/app/auth/google_routes.py
from fastapi import APIRouter, Request, HTTPException, Depends
from starlette.responses import RedirectResponse, JSONResponse

from app.auth.google_controller import build_google_auth_url, handle_google_callback

router = APIRouter()


@router.get("/login")
async def google_login():
    """
    Optional: return the Google auth URL to frontend
    Frontend can redirect user to this URL.
    """
    url = await build_google_auth_url()
    return {"url": url}


@router.get("/callback")
async def google_callback(request: Request):
    """
    Google will redirect to this endpoint with ?code=...
    Exchange it and return a JWT. Typically you would redirect user back to frontend
    with the token as part of query or better set a short-lived cookie.
    For SPA, we return JSON; if you prefer redirect, return RedirectResponse to FRONTEND_URL with token.
    """
    code = request.query_params.get("code")
    if not code:
        raise HTTPException(status_code=400, detail="Missing code in callback")

    try:
        result = await handle_google_callback(code)
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=400, detail=f"Google token error: {e}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Option A: Return JSON (frontend should receive token and store it)
    return JSONResponse(result)

    # Option B (alternative): Redirect to frontend with token in URL (less secure)
    # from app.config import settings
    # redirect_url = f"{settings.FRONTEND_URL}/auth/google/success?token={result['token']}"
    # return RedirectResponse(redirect_url)
