import asyncio
import httpx
from fastapi import APIRouter

from app.public2.result.controllers import fetch_student


router = APIRouter()


@router.get("/batch-result")
async def batch_result(reg: int, semester: str, examHeld: str, year: int):

    students = []

    async with httpx.AsyncClient(timeout=10) as client:

        async def scan_range(start, end, fail_threshold):
            # print(start,end)

            consecutive_fail = 0
            results_students = []

            regs = list(range(start, end + 1))

            tasks = [
                fetch_student(client, r, semester, examHeld, year)
                for r in regs
            ]

            results = await asyncio.gather(*tasks)

            for r in results:
                # results_students.append(r)

                if r and r["valid"]:
                    results_students.append(r)
                    consecutive_fail = 0   # reset because valid result found

                else:
                    consecutive_fail += 1

                if consecutive_fail >= fail_threshold:
                    return results_students, True   # stop signal

            return results_students, False   # continue scanning


        prefix = str(reg)[:-3]

        # -------- Regular Students --------

        start1 = int(prefix + "001")
        end1 = int(prefix + "070")

        res, stop = await scan_range(start1, end1, 20)
        students += res

        if not stop:

            start2 = int(prefix + "071")
            end2 = int(prefix + "080")

            res, stop = await scan_range(start2, end2, 10)
            students += res

        if not stop:

            start3 = int(prefix + "081")
            end3 = int(prefix + "130")

            res, stop = await scan_range(start3, end3, 10)
            students += res


        # -------- LE Students --------

        if semester not in ["I", "II"]:

            year_prefix = str(reg)[:2]
            branch_prefix = str(reg)[2:8]

            le_prefix = f"{int(year_prefix)+1}{branch_prefix}"

            start4 = int(le_prefix + "901")
            end4 = int(le_prefix + "920")

            res, stop = await scan_range(start4, end4, 5)
            students += res

            if not stop:
          
                start5 = int(le_prefix + "921")
                end5 = int(le_prefix + "940")

                res, stop = await scan_range(start5, end5, 5)
                students += res

            if not stop:

                start5 = int(le_prefix + "941")
                end5 = int(le_prefix + "960")

                res, stop = await scan_range(start5, end5, 5)
                students += res


    return {"students": students}