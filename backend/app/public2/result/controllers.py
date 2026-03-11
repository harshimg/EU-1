


BEU_API = "https://beu-bih.ac.in/backend/v1/result/get-result"



async def fetch_student(client, reg, semester, examHeld, year):

    url = f"{BEU_API}?year={year}&redg_no={reg}&semester={semester}&exam_held={examHeld}"

    try:
        res = await client.get(url)
        data = res.json()


        if data.get("status") != 200:
            return {"valid": False}

        if data.get("status") == 200:
            r = data["data"]


            subjects = []

            for s in r["theorySubjects"]:
                subjects.append({
                    "name": s["name"],
                    "marks": s["total"]
                })

            for s in r["practicalSubjects"]:
                subjects.append({
                    "name": s["name"],
                    "marks": s["total"]
                })

            return {
                "valid": True,
                "reg": r["redg_no"],
                "name": r["name"],
                "sgpa": r["sgpa"],
                "cgpa": (r["cgpa"]),
                "subjects": subjects
            }

    except:
        return None


