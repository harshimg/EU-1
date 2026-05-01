from bson import ObjectId
from app.database import db_instance
from app.utils.mongo_serializer import mongo_to_json
from datetime import datetime, timezone
from fastapi import HTTPException



# ---------------- GET ACCOUNT ----------------
async def get_account_ctrl(user_id):
    user = await db_instance.db.users.find_one(
        {"_id": ObjectId(user_id)},
        {"password_hash": 0}
    )
    return {"success": True, "data": mongo_to_json(user)}

# ---------------- UPDATE SEMESTER ----------------
async def update_semester_ctrl(user_id, body):
    semester = body.get("semester")

    if not semester:
        raise HTTPException(status_code=400, detail="Semester is required")

    await db_instance.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "semester": semester,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )

    return {"success": True, "message": "Semester updated successfully"}

async def update_account_ctrl(user_id, body):
    semester = body.get("semester")
    branch = body.get("branch")

    if not semester:
        raise HTTPException(status_code=400, detail="Semester is required")
    if not branch:
        raise HTTPException(status_code=400, detail="Branch is required")

    await db_instance.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$set": {
                "semester": semester,
                "branch": branch,
                "updated_at": datetime.now(timezone.utc)
            }
        }
    )

    return {"success": True, "message": "Semester updated successfully"}





async def list_semesters():
    sem = await db_instance.db.semesters.find().sort("code", 1).to_list(100)
    return {"success": True, 'data': mongo_to_json(sem)}


async def list_branches():
    br = await db_instance.db.branches.find().sort("code", 1).to_list(100)
    return {"success": True, 'data': mongo_to_json(br)}

# -------------------------------------------------
# GET SUBJECTS (by semester + branch)
# -------------------------------------------------
async def list_subjects(semester_code: int, branch_code: str):
    cursor = db_instance.db.subjects.find(
        {"semester_code": semester_code, "branch_code": branch_code}
    )

    docs = await cursor.to_list(length=None)

    return {
        "success": True,
        "data": [mongo_to_json(d) for d in docs],
    }


# -------------------------------------------------
# GET PAPERS (by subject_code)
# -------------------------------------------------
# async def list_papers(subject_code: str):
#     cursor = db_instance.db.papers.find(
#         {"subject_code": subject_code}
#     ).sort("year", -1)

#     docs = await cursor.to_list(length=None)

#     return {
#         "success": True,
#         "data": [mongo_to_json(d) for d in docs],
#     }

async def list_papers(subject_code: str):
    docs = await db_instance.db.papers.find(
        {
            "subject_code": subject_code,
            "questions.0": {"$exists": True}  # ✅ at least 1 question
        }
    ).sort("year", -1).to_list(None)

    return {
        "success": True,
        "data": mongo_to_json(docs)
    }


# -------------------------------------------------
# GET FULL PAPER (with questions)
# -------------------------------------------------
async def get_full_paper(paper_id: str):
    doc = await db_instance.db.papers.find_one(
        {"_id": ObjectId(paper_id)}
    )

    if not doc:
        return {
            "success": False,
            "message": "Paper not found",
            "data": None,
        }

    return {
        "success": True,
        "data": mongo_to_json(doc),
    }
