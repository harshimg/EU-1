from fastapi import APIRouter, Depends
from app.auth.dependencies import admin_required
from app.admin.controllers import *

# router = APIRouter(prefix="/ssb", tags=["Admin SSB"])
router = APIRouter()   

# ---------- SEMESTER ----------
@router.post("/ssb/semester", dependencies=[Depends(admin_required)])
async def add_semester(body: dict):
    return await create_semester(body)

@router.get("/ssb/semester", dependencies=[Depends(admin_required)])
async def get_semesters():
    return await list_semesters()

@router.put("/ssb/semester/{code}", dependencies=[Depends(admin_required)])
async def edit_semester(code: str, body: dict):
    return await update_semester(code, body)

@router.delete("/ssb/semester/{code}", dependencies=[Depends(admin_required)])
async def remove_semester(code: str):
    return await delete_semester(code)

@router.get("/ssb/semester/count", dependencies=[Depends(admin_required)])
async def countsemester():
    return await count_semester()


# ---------- BRANCH ----------
@router.post("/ssb/branch", dependencies=[Depends(admin_required)])
async def add_branch(body: dict):
    return await create_branch(body)

@router.get("/ssb/branch", dependencies=[Depends(admin_required)])
async def get_branches():
    return await list_branches()

@router.put("/ssb/branch/{code}", dependencies=[Depends(admin_required)])
async def edit_branch(code: str, body: dict):
    return await update_branch(code, body)

@router.delete("/ssb/branch/{code}", dependencies=[Depends(admin_required)])
async def remove_branch(code: str):
    return await delete_branch(code)

@router.get("/ssb/branch/count", dependencies=[Depends(admin_required)])
async def countbranch():
    return await count_branch()


# ---------- SUBJECT ----------
@router.post("/ssb/subject", dependencies=[Depends(admin_required)])
async def add_subject(body: dict):
    return await create_subject(body)

@router.get("/ssb/subject", dependencies=[Depends(admin_required)])
async def get_subjects(
    semester: str | None = None,
    branch: str | None = None
):
    return await list_subjects(semester, branch)

@router.put("/ssb/subject/{code}", dependencies=[Depends(admin_required)])
async def edit_subject(code: str, body: dict):
    return await update_subject(code, body)

@router.delete("/ssb/subject/{code}", dependencies=[Depends(admin_required)])
async def remove_subject(code: str):
    return await delete_subject(code)

@router.get("/ssb/subject/count", dependencies=[Depends(admin_required)])
async def countsubject():
    return await count_subject()


#----------------PAPERS-------------------------------

# router = APIRouter()

# ---------- PAPERS ----------
from fastapi import APIRouter, Depends
from app.auth.dependencies import admin_required
from app.admin.controllers import *


# ---------- PAPERS ----------

@router.post("/papers", dependencies=[Depends(admin_required)])
async def add_paper(body: dict):
    return await create_paper(body)


@router.get("/papers/{subject_code}", dependencies=[Depends(admin_required)])
async def get_papers(subject_code: str):
    return await list_papers(subject_code)


@router.get("/paper/{paper_id}", dependencies=[Depends(admin_required)])
async def get_paper_by_id(paper_id: str):

    return await get_paper_with_questions(paper_id)



@router.put("/papers/{paper_id}", dependencies=[Depends(admin_required)])
async def edit_paper(paper_id: str, body: dict):
    return await update_paper(paper_id, body)


@router.delete("/papers/{paper_id}", dependencies=[Depends(admin_required)])
async def remove_paper(paper_id: str):
    return await delete_paper(paper_id)

@router.get("/ssb/papers/count", dependencies=[Depends(admin_required)])
async def countpapers():
    return await count_papers()



# ---------------- QUESTIONS ----------------
@router.post("/papers/{paper_id}/questions", dependencies=[Depends(admin_required)])
async def add_question(paper_id: str, body: dict):
    return await add_question_ctrl(paper_id, body)

@router.put("/papers/{paper_id}/questions/{q_no}", dependencies=[Depends(admin_required)])
async def update_question(paper_id: str, q_no: int, body: dict):
    return await update_question_ctrl(paper_id, q_no, body)

@router.delete("/papers/{paper_id}/questions/{q_no}", dependencies=[Depends(admin_required)])
async def delete_question(paper_id: str, q_no: int):
    return await delete_question_ctrl(paper_id, q_no)

# ---------------- SUB QUESTIONS ----------------
@router.post("/papers/{paper_id}/questions/{q_no}/sub", dependencies=[Depends(admin_required)])
async def add_sub_question(paper_id: str, q_no: int, body: dict):
    return await add_sub_question_ctrl(paper_id, q_no, body)

@router.delete("/papers/{paper_id}/questions/{q_no}/sub/{sq_no}",
              dependencies=[Depends(admin_required)])
async def delete_sub_question(paper_id: str, q_no: int, sq_no: str):
    return await delete_sub_question_ctrl(paper_id, q_no, sq_no)

