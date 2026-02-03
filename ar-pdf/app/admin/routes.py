from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Header
from fastapi.responses import FileResponse
import os
from fastapi import BackgroundTasks


from app.utils.temp import create_temp_dir, cleanup_temp_dir
from app.admin.controllers import process_pdf
from app.security import verify_api_key

router = APIRouter()

@router.post("/process-pdf")
async def process_pdf_api(
    file: UploadFile = File(...),
    admin_id: str = Header(...),
    _=Depends(verify_api_key)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    temp_dir = create_temp_dir(admin_id)

    input_path = os.path.join(temp_dir, "input.pdf")
    output_path = os.path.join(temp_dir, "output.pdf")

    with open(input_path, "wb") as f:
        f.write(await file.read())

    process_pdf(input_path, output_path)

    original_name = os.path.splitext(file.filename)[0]
    download_name = f"{original_name}_ar.pdf"

    return FileResponse(
        output_path,
        media_type="application/pdf",
        filename=download_name
    )

