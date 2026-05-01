from datetime import datetime, timezone
from app.database import db_instance
from app.utils.mongo_serializer import mongo_to_json
from app.utils.datetime import utcnow
from app.config import settings
from fastapi import HTTPException, status, UploadFile
from fastapi.responses import StreamingResponse, Response
import fitz  # PyMuPDF
from io import BytesIO

import httpx

ar_pdf_url =settings.PDF_SERVICE_BASE_URL


# ======================================================
# SEMESTER
# ======================================================

async def create_semester(body, admin):

    code = body["code"]
    existing = await db_instance.db.semesters.find_one({"code": code})
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Semester with code '{code}' already exists",
            
        )

    now = utcnow()
    await db_instance.db.semesters.insert_one({
        "code": body["code"],
        "name": body["name"],
        "created_at": now,
        "updated_at": now,
        "admin_userids": [admin["admin_userid"]]
    })
    return {"success": True}

async def list_semesters():
    sem = await db_instance.db.semesters.find().sort("code", 1).to_list(100)
    return {"success": True, 'data': mongo_to_json(sem)}

async def update_semester(code: str, body, admin):
    await db_instance.db.semesters.update_one(
        {"code": code},
        {
            "$set": {
                "name": body["name"],
                "updated_at": utcnow()
            },
            "$addToSet": {
                "admin_userids": admin["admin_userid"]
            }

        }
    )
    return {"success": True}

async def delete_semester(code: str):
    await db_instance.db.semesters.delete_one({"code": code})
    return {"success": True}

async def count_semester():
    sem_count = await db_instance.db.semesters.count_documents({})
    return {
        "success": True,
        "data": int(sem_count)
    }


# ======================================================
# BRANCH
# ======================================================

async def create_branch(body, admin):

    code = body["code"]
    existing = await db_instance.db.branches.find_one({"code": code})
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Branch with code '{code}' already exists",
            
        )


    await db_instance.db.branches.insert_one({
        "code": body["code"],
        "short_name": body["short_name"],
        "full_name": body["full_name"],
        "created_at": utcnow(),
        "updated_at": utcnow(),
        "admin_userids": [admin["admin_userid"]]
    })
    return {"success": True}

async def list_branches():
    branch =  await db_instance.db.branches.find().sort("code", 1).to_list(100)
    return {"success": True, 'data': mongo_to_json(branch)}

async def update_branch(code: str, body, admin):
    await db_instance.db.branches.update_one(
        {"code": code},
        {
            "$set": {
                "short_name": body["short_name"],
                "full_name": body["full_name"],
                "updated_at": utcnow()
            },
            "$addToSet": {
                "admin_userids": admin["admin_userid"]
            }
        }
    )
    return {"success": True}

async def delete_branch(code: str):
    await db_instance.db.branches.delete_one({"code": code})
    return {"success": True}

async def count_branch():
    br_count = await db_instance.db.branches.count_documents({})
    return {
        "success": True,
        "data": int(br_count)
    }


# ======================================================
# SUBJECT
# ======================================================

async def create_subject(body, admin):

    code = body["code"]
    existing = await db_instance.db.subjects.find_one({"code": code})
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Subjects with code '{code}' already exists",
            
        )
    
    subject_type = body["subject_type"]
    max_marks = int(body["max_marks"])
    branch_code = body.get("branch_code")

    if not branch_code:
        raise HTTPException(
            status_code=400,
            detail="branch_code is required"
        )

    if not isinstance(branch_code, (str, list)):
        raise HTTPException(
            status_code=400,
            detail="branch_code must be string or list"
        )

    if subject_type == "Theory" and max_marks != 100:
        raise HTTPException(
            status_code=400,
            detail="Theory subjects must have max_marks = 100"
        )

    if subject_type == "Practical" and max_marks not in (50, 100):
        raise HTTPException(
            status_code=400,
            detail="Practical subjects must have max_marks = 50 or 100"
        )


    await db_instance.db.subjects.insert_one({
        "code": body["code"],
        "short_name": body["short_name"],
        "full_name": body["full_name"],
        "semester_code": body["semester_code"],
        "branch_code": branch_code,
        "subject_type": subject_type,
        "subject_credit": body["subject_credit"],
        "max_marks": max_marks,
        "all_paper_pdf": body.get("all_paper_pdf"),
        "created_at": datetime.now(timezone.utc),
        "updated_at": utcnow(),
        "admin_userids": [admin["admin_userid"]]
    })
    return {"success": True}

async def list_subjects(semester=None, branch=None):
    query = {}
    if semester:
        query["semester_code"] = semester
    if branch:
        query["branch_code"] = branch

    subject =  await db_instance.db.subjects.find(query).sort("code", 1).to_list(200)
    return {"success": True, 'data': mongo_to_json(subject)}

async def update_subject(code: str, body, admin):

    subject_type = body["subject_type"]
    max_marks = int(body["max_marks"])
    branch_code = body.get("branch_code")

    if not branch_code:
        raise HTTPException(
            status_code=400,
            detail="branch_code is required"
        )

    if not isinstance(branch_code, (str, list)):
        raise HTTPException(
            status_code=400,
            detail="branch_code must be string or list"
        )

    if subject_type == "Theory" and max_marks != 100:
        raise HTTPException(
            status_code=400,
            detail="Theory subjects must have max_marks = 100"
        )

    if subject_type == "Practical" and max_marks not in (50, 100):
        raise HTTPException(
            status_code=400,
            detail="Practical subjects must have max_marks = 50 or 100"
        )

    await db_instance.db.subjects.update_one(
        {"code": code},
        {
            "$set": {
                "short_name": body["short_name"],
                "full_name": body["full_name"],
                "semester_code": body["semester_code"],
                "branch_code": branch_code,
                "subject_type": subject_type,
                "subject_credit": body["subject_credit"],
                "max_marks": max_marks,
                "all_paper_pdf": body.get("all_paper_pdf"),
                "updated_at": utcnow()
            },
            "$addToSet": {
                "admin_userids": admin["admin_userid"]
            }
        }
    )
    return {"success": True}

async def delete_subject(code: str):
    await db_instance.db.subjects.delete_one({"code": code})
    return {"success": True}

async def count_subject():
    sub_count = await db_instance.db.subjects.count_documents({})
    return {
        "success": True,
        "data": int(sub_count)
    }


    #------------SYLLABUS-----------------------
async def update_syllabus(code: str, body: dict):

    syllabus = body.get("syllabus", [])

    await db_instance.db.subjects.update_one(
        {"code": code},
        {"$set": {"syllabus": syllabus}}
    )

    return {
        "success": True,
        "message": "Updated syllabus"}


#=============================================
#----------PAPERS-----------------------------
#=============================================
from datetime import datetime, timezone
from bson import ObjectId

from app.database import db_instance
from app.utils.mongo_serializer import mongo_to_json




async def create_paper(body: dict, admin):

    doc = {
        "subject_code": body["subject_code"],
        "name": body["name"],
        "type": body["type"],          # MID / END / QUIZ / PRACTICE
        "year": body["year"],
        "description": body.get("description", ""),
        "paper_pdf": body.get("paper_pdf", ""),
        "questions": [],
        "admin_userids": [admin["admin_userid"]],
        "created_at": utcnow(),
        "updated_at": utcnow(),
    }

    res = await db_instance.db.papers.insert_one(doc)
    doc["_id"] = res.inserted_id

    return {"success": True,
        "data": mongo_to_json(doc)
    }


async def list_papers(subject_code: str):
    docs = await db_instance.db.papers.find(
        {
            "subject_code": subject_code
        }
    ).sort("year", -1).to_list(None)

    return {
        "success": True,
        "data": mongo_to_json(docs)
    }


# async def list_papers(subject_code: str):
#     docs = await db_instance.db.papers.find(
#         {
#             "subject_code": subject_code,
#             "questions.0": {"$exists": True}  # ✅ at least 1 question
#         }
#     ).sort("year", -1).to_list(None)

#     return {
#         "success": True,
#         "data": mongo_to_json(docs)
#     }




async def get_paper_with_questions(paper_id: str):
    doc = await db_instance.db.papers.find_one({"_id": ObjectId(paper_id)})
    if not doc:
        return {
            "success": False,
            "data": None
        }

    return {"success": True, "data": mongo_to_json(doc)}



async def update_paper(paper_id: str, body: dict, admin):

    await db_instance.db.papers.update_one(
        {"_id": ObjectId(paper_id)},
        {
            "$set": {
                "name": body["name"],
                "type": body["type"],
                "year": body["year"],
                "description": body.get("description", ""),
                "paper_pdf": body.get("paper_pdf", ""),
                "updated_at": utcnow(),
            },
            "$addToSet": {
                "admin_userids": admin["admin_userid"]
            }
        }
    )

    return {"success": True, "message": "Paper updated successfully"}


async def delete_paper(paper_id: str):
    await db_instance.db.papers.delete_one({"_id": ObjectId(paper_id)})
    return {"success": True,"message": "Paper deleted successfully"}


async def count_papers():
    paper_count = await db_instance.db.papers.count_documents({})
    return {
        "success": True,
        "data": int(paper_count)
    }




# ---------------- QUESTIONS ----------------



def papers_col():
    return db_instance.db["papers"]



async def add_question_ctrl(paper_id, body, admin):
    # if body.get("sub_questions"):
    #     total = sum(sq["marks"] for sq in body["sub_questions"])
    #     if total != body["marks"]:
    #         raise ValueError("Marks mismatch")

    body["admin_userids"] = [admin["admin_userid"]]
    body["updated_at"] = utcnow()

    await papers_col().update_one(
        {"_id": ObjectId(paper_id)},
        {
            "$push": {"questions": body}
        }
    )
    return {"message": "Question added"}

# async def update_question_ctrl(paper_id, q_no, body, admin):
#     await papers_col().update_one(
#         {"_id": ObjectId(paper_id), "questions.q_no": q_no},
#         {
#             "$set": {"questions.$": body, "updated_at": utcnow()},
#             "$addToSet": {"questions.$.admin_userids": admin["admin_userid"]},
#         }
#     )
#     return {"message": "Question updated"}


async def update_question_ctrl(paper_id, q_no, body, admin):
    paper = await papers_col().find_one(
        {"_id": ObjectId(paper_id), "questions.q_no": q_no},
        {"questions.$": 1}
    )

    if not paper or not paper.get("questions"):
        raise HTTPException(404, "Question not found")

    existing = paper["questions"][0]
    now = utcnow()

    # merge dynamic payload safely
    updated_question = {
        **existing,
        **body,
        "updated_at": now,
    }

    # preserve + extend admin list
    admins = set(existing.get("admin_userids", []))
    admins.add(admin["admin_userid"])
    updated_question["admin_userids"] = list(admins)

    await papers_col().update_one(
        {"_id": ObjectId(paper_id), "questions.q_no": q_no},
        {"$set": {"questions.$": updated_question}}
    )

    return {"message": "Question updated"}



async def delete_question_ctrl(paper_id, q_no, admin):
    await papers_col().update_one(
        {"_id": ObjectId(paper_id)},
        {"$pull": {"questions": {"q_no": q_no}}}
    )
    return {"message": "Question deleted"}

# ---------------- SUB QUESTIONS ----------------
async def add_sub_question_ctrl(paper_id, q_no, body, admin):
    await papers_col().update_one(
        {"_id": ObjectId(paper_id), "questions.q_no": q_no},
        {
            "$push": {"questions.$.sub_questions": body},

        }
    )
    return {"message": "Sub-question added"}

async def delete_sub_question_ctrl(paper_id, q_no, sq_no, admin):
    await papers_col().update_one(
        {"_id": ObjectId(paper_id), "questions.q_no": q_no},
        {"$pull": {"questions.$.sub_questions": {"sq_no": sq_no}}}
    )
    return {"message": "Sub-question deleted"}


    #============PDf Microservice======================

async def call_pdf_service(file: UploadFile, admin):

    admin_id="AR1"
    admin_id = str(admin.get("admin_userid"))
    if not admin_id:
        raise HTTPException(status_code=403, detail="Admin ID missing")
    
    try:
        async with httpx.AsyncClient(
            timeout=float(settings.PDF_SERVICE_TIMEOUT)
        ) as client:

            files = {
                "file": (
                    file.filename,
                    await file.read(),
                    "application/pdf"
                )
            }


            headers = {
                "admin-id": str(admin_id),   # REQUIRED by PDF service
                "Authorization": f"Bearer {settings.PDF_SERVICE_KEY}",
            }

            response = await client.post(
                f"{ar_pdf_url}/admin/process-pdf",
                files=files,
                headers=headers,
            )

            if response.status_code != 200:
                raise HTTPException(
                    status_code=502,
                   detail=f"PDF service error {response.status_code}: {response.text}",
                )

             # FIX: Stream the content back to the user
            content_disposition = response.headers.get("content-disposition")

            headers = {
                "Access-Control-Expose-Headers": "Content-Disposition"
            } 

            if content_disposition:
                headers["Content-Disposition"] = content_disposition

            if "content-length" in response.headers:
                headers["Content-Length"] = response.headers["content-length"]

            return Response(
            content=response.content,   # 👈 buffer once
            media_type="application/pdf",
            headers=headers
        )

            # return StreamingResponse(
            #     response.aiter_bytes(),  # Stream chunks to keep memory usage low
            #     media_type="application/pdf",
            #     headers=headers
            # )

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="PDF processing service timeout",
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"PDF processing error: {str(e)}",
        )







#===============ALL Upload CONTROLLERS===================#

import cloudinary.uploader

async def upload_pdf_to_cloudinary(file, branch, sem, subject, year, exam_type, admin):

    # content_type = file.content_type
    file.seek(0)
    resource_type = "raw"

    # 🔥 detect type using MIME
    # if content_type == "application/pdf":
    #     resource_type = "raw"
    # elif content_type.startswith("image/"):
    #     resource_type = "image"
    # else:
    #     return {
    #         "success": False,
    #         "error": "Unsupported file type"
    #     }

    # 🔥 public_id
    if exam_type:
        public_id = f"BEU/pyq/{branch}/sem-{sem}/{subject}/{year}_{exam_type}"
    else:
        public_id = f"BEU/pyq/{branch}/sem-{sem}/{subject}/{year}"

    clean_name = f"{subject}_{year}_{exam_type}".replace(" ", "_")
    public_id = f"{public_id}/{clean_name}.pdf"   

    result = cloudinary.uploader.upload(
        file, # file.file,
        resource_type=resource_type,
        public_id=public_id,
        overwrite=True,    #Upload again → replaces old file❗
    )

    return {
        "secure_url": result.get("secure_url"),
        "public_id": result.get("public_id"),
        "resource_type": resource_type
    }




#===============Branding===================#
logo_path = "app/assets/ar_only_logo_watermark.png"
ALPHA_URL = "https://alpharesult.in"

# -------------------------
# 1. LOGO WATERMARK (CENTER)
# -------------------------
def add_logo_watermark(page, logo_path):
    rect = page.rect

    logo_size = 150  # adjust
    x0 = (rect.width - logo_size) / 2
    y0 = (rect.height - logo_size) / 2

    logo_rect = fitz.Rect(
        x0, y0,
        x0 + logo_size,
        y0 + logo_size
    )

    page.insert_image(
        logo_rect,
        filename=logo_path,
        overlay=True,
        keep_proportion=True
    )


# -------------------------
# 2. DIAGONAL TEXT
# -------------------------
def add_diagonal_text(page):
    rect = page.rect
    text = "ALPHA RESULT"

    # Create a BIG box larger than page
    box = fitz.Rect(
        -rect.width,             # start far left
        rect.height * 0.2,
        rect.width * 2,          # extend beyond right
        rect.height * 0.8
    )

    # Center point for rotation
    center = fitz.Point(rect.width / 2, rect.height / 2)

    # 45 degree rotation
    matrix = fitz.Matrix(1, 1).prerotate(45)

    page.insert_textbox(
        box,
        text,
        fontsize=140,                    # 🔥 BIG (key)
        color=(0.65, 0.65, 0.65),        # grey (visible but light)
        align=1,                         # center
        morph=(center, matrix),          # rotate around center
        overlay=True                     # must be true for scanned PDFs
    )


# def add_diagonal_text(page):
#     rect = page.rect
#     text = "ALPHA RESULT"

#     center = fitz.Point(rect.width / 2, rect.height / 2)
#     matrix = fitz.Matrix(1, 1).prerotate(45)

#     page.insert_text(
#         center,
#         text,
#         fontsize=100,
#         color=(0.95, 0.95, 0.95),  # 🔥 very light
#         morph=(center, matrix),
#         overlay=True  # ✅ MUST
#     )


# -------------------------
# 3. FOOTER
# -------------------------
def add_footer(page):
    rect = page.rect

    text = "Click here for PYQ & Solutions - alpharesult.in"

    text_width = fitz.get_text_length(text, fontsize=10)
    x = (rect.width - text_width) / 2
    y = rect.height - 20

    page.insert_text(
        (x, y),
        text,
        fontsize=14,
        color=(0.2, 0.4, 0.8),
    )


# -------------------------
# 4. FULL PAGE CLICKABLE LINK
# -------------------------
def add_clickable_link(page):
    page.insert_link({
        "kind": fitz.LINK_URI,
        "from": page.rect,  # FULL PAGE
        "uri": ALPHA_URL
    })


# -------------------------
# MAIN PROCESS FUNCTION
# -------------------------
async def process_pdf_branding(file_bytes):
    doc = fitz.open(stream=file_bytes, filetype="pdf")

    for page in doc:
        # add_logo_watermark(page, logo_path)
        # print("watermark added")
        # add_diagonal_text(page)
        # print("Diagonal text added")
        add_footer(page)
        # print("footer added")
        add_clickable_link(page)
        # print("link clickable added")

    # Save to memory (NO TEMP FILE)
    output = BytesIO()
    doc.save(output)
    doc.close()

    output.seek(0)
    return output



    