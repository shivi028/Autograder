# =====================================================
# app/routers/student_results.py
# =====================================================
from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from app.database.connection import get_supabase

router = APIRouter()

# -----------------------------------------------------
# Helper function: Calculate grade safely
# -----------------------------------------------------
def calculate_grade(percentage: float) -> str:
    """Return letter grade from percentage."""
    if percentage >= 90:
        return "A+"
    elif percentage >= 80:
        return "A"
    elif percentage >= 70:
        return "B+"
    elif percentage >= 60:
        return "B"
    elif percentage >= 50:
        return "C+"
    elif percentage >= 40:
        return "C"
    else:
        return "F"


# -----------------------------------------------------
# Get all available exams for a student
# -----------------------------------------------------
@router.get("/results/student/{student_id}/available-exams")
async def get_student_available_exams(student_id: str, supabase_client=Depends(get_supabase)):
    """Get all exams with their upload/result status for a student"""
    try:
        exams_result = supabase_client.table("exams").select(
            "id, exam_code, exam_name, exam_type, exam_date, total_marks, status"
        ).eq("status", "active").order("exam_date", desc=True).execute()

        exams_with_status = []
        for exam in exams_result.data or []:
            upload_result = supabase_client.table("exam_uploads").select(
                "id, processing_status, created_at"
            ).eq("exam_id", exam["id"]).eq("student_id", student_id).execute()

            has_upload = len(upload_result.data) > 0
            upload_status = upload_result.data[0]["processing_status"] if has_upload else None

            results = supabase_client.table("grading_results").select(
                "id, final_marks"
            ).eq("exam_id", exam["id"]).eq("student_id", student_id).execute()

            has_results = len(results.data) > 0

            exams_with_status.append({
                "exam_id": exam["id"],
                "exam_code": exam["exam_code"],
                "exam_name": exam["exam_name"],
                "exam_type": exam["exam_type"],
                "exam_date": exam["exam_date"],
                "total_marks": exam["total_marks"],
                "has_upload": has_upload,
                "upload_status": upload_status,
                "has_results": has_results,
            })

        return {"exams": exams_with_status}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -----------------------------------------------------
# Get detailed results for a student (robust version)
# -----------------------------------------------------
@router.get("/results/student/{student_id}")
async def get_student_results(
    student_id: str,
    exam_id: Optional[str] = None,
    supabase_client=Depends(get_supabase)
):
    """Fetch all results for a student (with fallback if no FKs)."""
    try:
        gr_query = supabase_client.table("grading_results").select(
            "id, exam_id, question_id, student_answer_id, "
            "ai_assigned_marks, teacher_assigned_marks, final_marks, "
            "ai_feedback, teacher_feedback, ai_confidence, is_reviewed_by_teacher"
        ).eq("student_id", student_id)

        if exam_id:
            gr_query = gr_query.eq("exam_id", exam_id)

        gr_res = gr_query.execute()
        rows = gr_res.data or []
        if not rows:
            return {"student_id": student_id, "exams": []}

        exam_ids = sorted({r["exam_id"] for r in rows if r.get("exam_id")})
        question_ids = sorted({r["question_id"] for r in rows if r.get("question_id")})
        ans_ids = sorted({r["student_answer_id"] for r in rows if r.get("student_answer_id")})

        # Bulk fetch related tables
        exams_map, questions_map, answers_map = {}, {}, {}

        if exam_ids:
            ex_res = supabase_client.table("exams").select(
                "id, exam_code, exam_name, exam_type, exam_date, total_marks"
            ).in_("id", exam_ids).execute()
            for ex in ex_res.data or []:
                exams_map[ex["id"]] = ex

        if question_ids:
            q_res = supabase_client.table("questions").select(
                "id, question_number, question_text, max_marks"
            ).in_("id", question_ids).execute()
            for q in q_res.data or []:
                questions_map[q["id"]] = q

        if ans_ids:
            a_res = supabase_client.table("student_answers").select(
                "id, extracted_answer"
            ).in_("id", ans_ids).execute()
            for a in a_res.data or []:
                answers_map[a["id"]] = a

        # Assemble exams
        exams_dict = {}
        for r in rows:
            ex_id = r["exam_id"]
            ex = exams_map.get(ex_id)
            if not ex:
                continue

            if ex_id not in exams_dict:
                exams_dict[ex_id] = {
                    "exam_id": ex_id,
                    "exam_code": ex.get("exam_code"),
                    "exam_name": ex.get("exam_name"),
                    "exam_type": ex.get("exam_type"),
                    "exam_date": ex.get("exam_date"),
                    "max_obtainable": ex.get("total_marks") or 0,
                    "obtained_marks": 0.0,
                    "percentage": 0.0,
                    "grade": "",
                    "questions": [],
                }

            q = questions_map.get(r.get("question_id"), {})
            ans = answers_map.get(r.get("student_answer_id"), {})
            obtained = float(r.get("final_marks") or 0)
            ai_conf = float(r.get("ai_confidence") or 0)

            exams_dict[ex_id]["questions"].append({
                "question_number": q.get("question_number"),
                "question_text": q.get("question_text"),
                "max_marks": q.get("max_marks"),
                "obtained_marks": obtained,
                "ai_feedback": r.get("ai_feedback"),
                "teacher_feedback": r.get("teacher_feedback"),
                "ai_confidence": ai_conf,
                "is_reviewed": bool(r.get("is_reviewed_by_teacher")),
                "student_answer": ans.get("extracted_answer") or "",
            })
            exams_dict[ex_id]["obtained_marks"] += obtained

        # Calculate grade and percentage
        for ex in exams_dict.values():
            total = float(ex["max_obtainable"] or 0)
            obtained = float(ex["obtained_marks"] or 0)
            ex["percentage"] = round((obtained / total * 100), 2) if total > 0 else 0.0
            ex["grade"] = calculate_grade(ex["percentage"])
            ex["questions"].sort(
                key=lambda x: (x["question_number"] is None, x.get("question_number", 0))
            )

        return {"student_id": student_id, "exams": list(exams_dict.values())}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -----------------------------------------------------
# Get student upload history (robust)
# -----------------------------------------------------
@router.get("/upload/student/{student_id}/uploads")
async def get_student_uploads(student_id: str, supabase_client=Depends(get_supabase)):
    """Return all uploads for a student safely"""
    try:
        up_res = supabase_client.table("exam_uploads").select(
            "id, exam_id, file_name, file_path, file_size, file_type, "
            "processing_status, confidence_score, error_message, created_at, processed_at"
        ).eq("student_id", student_id).order("created_at", desc=True).execute()

        uploads = up_res.data or []
        if not uploads:
            return {"uploads": []}

        exam_ids = sorted({u["exam_id"] for u in uploads if u.get("exam_id")})
        exams_map = {}
        if exam_ids:
            ex_res = supabase_client.table("exams").select(
                "id, exam_code, exam_name, exam_date"
            ).in_("id", exam_ids).execute()
            for ex in ex_res.data or []:
                exams_map[ex["id"]] = ex

        formatted = []
        for u in uploads:
            ex = exams_map.get(u.get("exam_id"), {})
            formatted.append({
                "id": u["id"],
                "exam_id": u.get("exam_id"),
                "exam_code": ex.get("exam_code"),
                "exam_name": ex.get("exam_name"),
                "exam_date": ex.get("exam_date"),
                "file_name": u.get("file_name"),
                "file_path": u.get("file_path"),
                "file_size": u.get("file_size"),
                "file_type": u.get("file_type"),
                "processing_status": u.get("processing_status"),
                "confidence_score": float(u.get("confidence_score") or 0),
                "error_message": u.get("error_message"),
                "uploaded_at": u.get("created_at"),
                "processed_at": u.get("processed_at"),
            })

        return {"uploads": formatted}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
