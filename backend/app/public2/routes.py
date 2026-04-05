from fastapi import APIRouter, Depends
from typing import Optional
from app.public2.controllers import *
from app.auth.utils import get_current_user_optional
# from app.user.controllers import list_subjects          #it list all subjects which haven't credit also

router = APIRouter()



@router.get("/semester")
async def get_semesters():
    return await list_semesters()


@router.get("/branch")
async def get_brach():
    return await list_branches()

@router.get("/subjects")
async def get_subjects(semester_code: int, branch_code: str):
    return await list_subjects(str(semester_code), branch_code)

@router.get("/subject/{code}")
async def get_subject(code: str):
    subject = await db_instance.db.subjects.find_one({"code": code})

    if not subject:
        return {"success": False, "message": "Not found"}

    return {
        "success": True,
        "data": mongo_to_json(subject)
    }

@router.post("/sgpa/calculate")
async def calculate_sgpa(body : dict, current_user: Optional[dict] = Depends(get_current_user_optional)):
    return await sgpa(body, current_user)


# To get quest. papers pdf link of one subject
@router.get("/papers/{subject_code}")
async def get_papers_by_subject(subject_code: str):
    """
    Returns all paper PDF links for a subject
    """

    # 🔹 Replace with your DB logic
    papers = await db_instance.db.papers.find({"subject_code": subject_code}).sort("year", -1).to_list(length=200)

    result = []

    for p in papers:
        if p.get("paper_pdf"):
            result.append({
                "id": str(p["_id"]),
                "year": p.get("year"),
                "name": p.get("name"),
                "pdf": p.get("paper_pdf"),
            })

    return {
        "success": True,
        "count": len(result),
        "data": result
    }