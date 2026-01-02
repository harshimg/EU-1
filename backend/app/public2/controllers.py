from email import message
import re
from app.database import db_instance
from app.utils.mongo_serializer import mongo_to_json
from fastapi import HTTPException
from bson import ObjectId
from zoneinfo import ZoneInfo
from datetime import datetime
from pymongo import ReturnDocument


async def list_semesters():
    sem = await db_instance.db.semesters.find().sort("code", 1).to_list(100)
    return {"success": True, 'data': mongo_to_json(sem)}


async def list_branches():
    br = await db_instance.db.branches.find().sort("code", 1).to_list(100)
    return {"success": True, 'data': mongo_to_json(br)}


async def list_subjects(semester=None, branch=None):
    query = {
        "subject_credit": {
            "$exists": True,
            "$nin": [None, "", "0"]
        },
        "subject_type": {"$in": ["Theory", "Practical"]},
        "max_marks": {
            "$exists": True,
            "$nin": [None, "", 0]
        },
    }

    if semester:
        query["semester_code"] = semester

    if branch:
        query["branch_code"] = branch

    subjects = await (
        db_instance.db.subjects
        .find(query)
        .sort("code", 1)
        .to_list(length=200)
    )

    return {
        "success": True,
        "data": mongo_to_json(subjects),
    }


async def get_next_gpa1_count():
    doc = await db_instance.db.counters.find_one_and_update(
        {"_id": "gpa1"},
        {"$inc": {"seq": 1}},
        return_document=ReturnDocument.AFTER,
        upsert=True
    )
    return doc["seq"]


def marks_to_grade_point(percent: float) -> int:
    if percent >= 90:
        return 10
    elif percent >= 80:
        return 9
    elif percent >= 70:
        return 8
    elif percent >= 60:
        return 7
    elif percent >= 50:
        return 6
    elif percent >= 35:
        return 5
    else:
        return 0


async def sgpa(body, current_user):

    sem = body.get("semester")
    br = body.get("branch")
    marks = body.get("marks")

    if not sem or not br or not marks:
        raise HTTPException(status_code=400, message="Invalid subject details")

    cursor = db_instance.db.subjects.find(
        {"semester_code": sem, "branch_code": br}
        )

    subs = await cursor.to_list(length=None)
    if not subs:
        raise HTTPException(status_code=404, message="Subjects not found")

    subject_map = {}
    for sub in subs:
        
        if not sub.get("subject_credit"):
            print(f"Credit missing for subject {sub["code"]}")
            continue
            raise HTTPException(
                status_code=400,
                detail=f"Credit missing for subject {sub["code"]}"
            )

        subject_map[sub["code"]] = {
            "credit": float(sub["subject_credit"]),
            "type": sub["subject_type"],
            "max_marks": int(sub.get("max_marks", 100))
        }

    result  = -1
    total_credit = 0.0
    total_grade_points = 0.0
    for sub_code, sub_mark in marks.items():
        if sub_code not in subject_map:
            raise HTTPException(
                status_code=400,
                detail=f"subject {sub_code} not found"
            )
        

        meta = subject_map[sub_code]
        credit = meta["credit"]
        subject_type = meta["type"]
        max_marks = meta["max_marks"]


        # ---------------- THEORY ----------------
        if subject_type == "Theory":
            ext = sub_mark.get("external")
            inte = sub_mark.get("internal")
            if ext > 70:
                raise HTTPException(
                status_code=400,
                detail=f"Maximum marks for external ({sub_code}) is 70"
            )
            if inte > 30:
                raise HTTPException(
                status_code=400,
                detail=f"Maximum marks for internal ({sub_code}) is 30"
            )

            if ext is None or inte is None:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing marks for {sub_code}"
                )

            total = ext + inte

            # PASS RULES
            if ext < 25 or total < 35:
                grade_point = 0
            else:
                percent = (total / max_marks) * 100
                grade_point = marks_to_grade_point(percent)

        # ---------------- PRACTICAL ----------------
        elif subject_type == "Practical":
            total = sub_mark.get("total")

            if total is None:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing practical marks for {sub_code}"
                )
            if total > max_marks:
                raise HTTPException(
                status_code=400,
                detail=f"Maximum marks for Practical ({sub_code}) is {max_marks}"
            )

            percent = (total / max_marks) * 100
            grade_point = marks_to_grade_point(percent)


        total_grade_points += grade_point * credit
        total_credit += credit

    if total_credit == 0:
        raise HTTPException(status_code=400, detail="Credits not found, contact Alpha Result")

    result = round(total_grade_points / total_credit, 2)

    email = ""
    if current_user and current_user.get("user_id"):
        user = await db_instance.db.users.find_one(
            {"_id": ObjectId(current_user["user_id"])}
        )
        if user:
            email = user.get("email", "")


    count = await get_next_gpa1_count()


    await db_instance.db.gpa1.insert_one({
        "count": count,
        "email": email or "",
        "semester": sem,
        "branch": br,
        "marks": marks,
        "sgpa": result,
        "created_at": datetime.now(ZoneInfo("Asia/Kolkata"))
    })


    return {
            "success": True,
            "sgpa": result
        }


