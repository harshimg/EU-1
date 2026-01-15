from datetime import datetime, timezone
from app.database import db_instance
from app.utils.mongo_serializer import mongo_to_json
from app.utils.datetime import utcnow
from fastapi import HTTPException, status

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


#=============================================
#----------PAPERS-----------------------------
#=============================================
from datetime import datetime, timezone
from bson import ObjectId

from app.database import db_instance
from app.utils.mongo_serializer import mongo_to_json




async def create_paper(body: dict, admin):
    # doc = {
    #     "subject_code": body["subject_code"],   # auto same as subject
    #     "name": body["name"],
    #     "type": body["type"],                   # MID / END / QUIZ / PRACTICE
    #     "year": body["year"],
    #     "description": body.get("description", ""),
    #     "created_at": datetime.now(timezone.utc).isoformat(),  # ✅ FIXED
    #     "questions" : []
    # }


    doc = {
        "subject_code": body["subject_code"],
        "name": body["name"],
        "type": body["type"],          # MID / END / QUIZ / PRACTICE
        "year": body["year"],
        "description": body.get("description", ""),
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
        {"subject_code": subject_code}
    ).sort("year", -1).to_list(None)

    return {"success": True,
        "data": mongo_to_json(docs)
    }


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