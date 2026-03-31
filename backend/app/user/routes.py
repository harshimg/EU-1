from fastapi import APIRouter, Depends
from app.auth.dependencies import user_required
from app.user.controllers import *
from app.auth.utils import get_current_user

router = APIRouter()

@router.get("/account", dependencies=[Depends(user_required)])
async def get_account(user=Depends(get_current_user)):
    return await get_account_ctrl(user["user_id"])

@router.put("/account/semester", dependencies=[Depends(user_required)])
async def update_semester(body: dict, user=Depends(get_current_user)):
    return await update_semester_ctrl(user["user_id"], body)

@router.put("/account/edit", dependencies=[Depends(user_required)])
async def update_semester(body: dict, user=Depends(get_current_user)):
    return await update_account_ctrl(user["user_id"], body)



@router.get("/semester", dependencies=[Depends(user_required)])
async def get_semesters():
    return await list_semesters()


@router.get("/branch", dependencies=[Depends(user_required)])
async def get_brach():
    return await list_branches()


# @router.get("/subjects", dependencies=[Depends(user_required)])
@router.get("/subjects")
async def get_subjects(semester_code: int, branch_code: str):
    return await list_subjects(str(semester_code), branch_code)


# @router.get("/papers", dependencies=[Depends(user_required)])
@router.get("/papers")
async def get_papers(subject_code: str):
    return await list_papers(subject_code)


# @router.get("/paper/{paper_id}", dependencies=[Depends(user_required)])
@router.get("/paper/{paper_id}")
async def get_paper(paper_id: str):
    return await get_full_paper(paper_id)
