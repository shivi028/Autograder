from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.database.connection import get_supabase_admin
from app.routers.auth import get_current_user
from typing import Optional, List

router = APIRouter()

# Use unique names to avoid conflicts with app.schemas.exam
class AdminSubjectCreate(BaseModel):
    subject_code: str
    subject_name: str
    department: Optional[str] = None
    credits: int = 3
    semester: Optional[int] = None
    description: Optional[str] = None

class AdminExamCreate(BaseModel):
    exam_code: str
    subject_code: str  # API accepts subject_code, NOT subject_id
    exam_name: str
    exam_type: str = "midterm"
    exam_date: str
    start_time: str = "10:00"
    duration_minutes: int = 180
    total_marks: int = 100
    passing_marks: Optional[int] = 40
    instructions: Optional[str] = None

class AdminQuestionCreate(BaseModel):
    question_number: int
    question_text: str
    max_marks: float
    sample_answer: Optional[str] = None
    keywords: Optional[list] = []

@router.post("/subjects")
async def create_subject(
    subject_data: AdminSubjectCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new subject (teachers only)"""
    
    user_type = current_user.get("user_type", current_user.get("role"))
    if user_type != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can create subjects")
    
    supabase_admin = get_supabase_admin()
    
    try:
        # Check if subject already exists
        existing = supabase_admin.table("subjects").select("*").eq(
            "subject_code", subject_data.subject_code
        ).execute()
        
        if existing.data:
            raise HTTPException(status_code=400, detail="Subject code already exists")
        
        # Create subject
        subject_dict = subject_data.model_dump()
        result = supabase_admin.table("subjects").insert(subject_dict).execute()
        
        return {
            "message": "Subject created successfully",
            "subject": result.data[0]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating subject: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create subject: {str(e)}")
    
@router.post("/exams")
async def create_exam(
    exam_data: AdminExamCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new exam (teachers only)"""
    
    user_type = current_user.get("user_type", current_user.get("role"))
    if user_type != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can create exams")
    
    supabase_admin = get_supabase_admin()
    
    try:
        # Get subject ID from subject_code
        subject_result = supabase_admin.table("subjects").select("id").eq(
            "subject_code", exam_data.subject_code
        ).execute()
        
        if not subject_result.data:
            raise HTTPException(
                status_code=404, 
                detail=f"Subject with code '{exam_data.subject_code}' not found"
            )
        
        subject_id = subject_result.data[0]["id"]
        
        # Check if exam code already exists
        existing = supabase_admin.table("exams").select("*").eq(
            "exam_code", exam_data.exam_code
        ).execute()
        
        if existing.data:
            raise HTTPException(status_code=400, detail="Exam code already exists")
        
        # Prepare exam data - exclude subject_code, add subject_id
        exam_dict = exam_data.model_dump(exclude={"subject_code"})
        exam_dict["subject_id"] = subject_id
        teacher_id = current_user.get("user_id", current_user.get("id"))
        exam_dict["created_by"] = teacher_id
        exam_dict["status"] = "active"
        
        # Create exam
        result = supabase_admin.table("exams").insert(exam_dict).execute()
        
        return {
            "message": "Exam created successfully",
            "exam": result.data[0]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating exam: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create exam: {str(e)}")
        
@router.delete("/exams/{exam_id}/questions")
async def delete_exam_questions(
    exam_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete all questions for an exam (teachers only)"""
    
    user_type = current_user.get("user_type", current_user.get("role"))
    if user_type != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can delete questions")
    
    supabase_admin = get_supabase_admin()
    
    try:
        # Verify exam exists and teacher owns it
        teacher_id = current_user.get("user_id", current_user.get("id"))
        exam_result = supabase_admin.table("exams").select("*").eq(
            "id", exam_id
        ).eq("created_by", teacher_id).execute()
        
        if not exam_result.data:
            raise HTTPException(status_code=404, detail="Exam not found or access denied")
        
        # Delete all questions for this exam
        result = supabase_admin.table("questions").delete().eq("exam_id", exam_id).execute()
        
        return {
            "message": "All questions deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting questions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete questions: {str(e)}")

@router.post("/exams/{exam_id}/questions")
async def add_questions_to_exam(
    exam_id: str,
    questions: List[AdminQuestionCreate],
    current_user: dict = Depends(get_current_user),
    replace: bool = False  # New parameter: if True, delete existing questions first
):
    """Add questions to an exam (teachers only)"""
    
    print(f"📝 Adding questions to exam {exam_id}")
    print(f"👤 Current user: {current_user}")
    print(f"❓ Number of questions: {len(questions)}")
    print(f"🔄 Replace existing: {replace}")
    
    user_type = current_user.get("user_type", current_user.get("role"))
    if user_type != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can add questions")
    
    supabase_admin = get_supabase_admin()
    
    try:
        # Verify exam exists and teacher owns it
        teacher_id = current_user.get("user_id", current_user.get("id"))
        print(f"🔍 Checking exam ownership for teacher_id: {teacher_id}")
        
        exam_result = supabase_admin.table("exams").select("*").eq(
            "id", exam_id
        ).eq("created_by", teacher_id).execute()
        
        print(f"📊 Exam query result: {exam_result.data}")
        
        if not exam_result.data:
            raise HTTPException(status_code=404, detail="Exam not found or access denied")
        
        # If replace=True, delete existing questions first
        if replace:
            print("🗑️ Deleting existing questions...")
            supabase_admin.table("questions").delete().eq("exam_id", exam_id).execute()
            print("✅ Existing questions deleted")
        
        # Check for existing question numbers
        existing_questions = supabase_admin.table("questions").select(
            "question_number"
        ).eq("exam_id", exam_id).execute()
        
        existing_numbers = [q["question_number"] for q in existing_questions.data]
        
        # Add questions
        questions_data = []
        skipped = []
        
        for i, q in enumerate(questions):
            print(f"Processing question {i+1}: {q.question_text[:50]}...")
            
            # Skip if question number already exists
            if q.question_number in existing_numbers and not replace:
                print(f"⚠️ Skipping question {q.question_number} - already exists")
                skipped.append(q.question_number)
                continue
            
            q_dict = q.model_dump()
            q_dict["exam_id"] = exam_id
            
            # Ensure keywords is a valid JSON structure
            if q_dict.get("keywords") is None:
                q_dict["keywords"] = []
            
            questions_data.append(q_dict)
        
        if not questions_data:
            message = "All questions already exist. Use replace=True to overwrite."
            if skipped:
                message = f"Skipped {len(skipped)} existing questions: {skipped}"
            return {
                "message": message,
                "questions": [],
                "skipped": skipped
            }
        
        print(f"💾 Inserting {len(questions_data)} questions into database...")
        
        result = supabase_admin.table("questions").insert(questions_data).execute()
        
        print(f"✅ Successfully inserted questions: {result.data}")
        
        message = f"Added {len(questions_data)} questions successfully"
        if skipped:
            message += f". Skipped {len(skipped)} existing: {skipped}"
        
        return {
            "message": message,
            "questions": result.data,
            "skipped": skipped
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error adding questions: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        
        # Check if it's a duplicate key error
        if "23505" in str(e) or "duplicate key" in str(e):
            raise HTTPException(
                status_code=409, 
                detail="Questions with these numbers already exist. Delete existing questions first or use different question numbers."
            )
        
        raise HTTPException(status_code=500, detail=f"Failed to add questions: {str(e)}")

@router.get("/exams/{exam_id}/questions")
async def get_exam_questions(
    exam_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get all questions for an exam"""
    
    user_type = current_user.get("user_type", current_user.get("role"))
    if user_type != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can view questions")
    
    supabase_admin = get_supabase_admin()
    
    try:
        teacher_id = current_user.get("user_id", current_user.get("id"))
        
        # Get questions without checking exam ownership first (for debugging)
        questions_result = supabase_admin.table("questions").select("*").eq(
            "exam_id", exam_id
        ).order("question_number").execute()
        
        # Get exam details
        exam_result = supabase_admin.table("exams").select("*").eq(
            "id", exam_id
        ).execute()
        
        exam_name = exam_result.data[0]["exam_name"] if exam_result.data else "Unknown Exam"
        
        return {
            "exam_id": exam_id,
            "exam_name": exam_name,
            "questions": questions_result.data or [],
            "total_questions": len(questions_result.data) if questions_result.data else 0
        }
        
    except Exception as e:
        print(f"Error getting questions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get questions: {str(e)}")

@router.get("/test")
async def test_route():
    """Test if admin routes are working"""
    return {"message": "Admin router is working!", "prefix": "/api/v1"}
    
# async def get_exam_questions(
#     exam_id: str,
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get all questions for an exam"""
    
#     user_type = current_user.get("user_type", current_user.get("role"))
#     if user_type != "teacher":
#         raise HTTPException(status_code=403, detail="Only teachers can view questions")
    
#     supabase_admin = get_supabase_admin()
    
#     try:
#         # Verify exam exists and teacher has access
#         teacher_id = current_user.get("user_id", current_user.get("id"))
#         exam_result = supabase_admin.table("exams").select("*").eq(
#             "id", exam_id
#         ).eq("created_by", teacher_id).execute()
        
#         if not exam_result.data:
#             raise HTTPException(status_code=404, detail="Exam not found or access denied")
        
#         # Get questions
#         questions_result = supabase_admin.table("questions").select("*").eq(
#             "exam_id", exam_id
#         ).order("question_number").execute()
        
#         return {
#             "exam_id": exam_id,
#             "exam_name": exam_result.data[0]["exam_name"],
#             "questions": questions_result.data,
#             "total_questions": len(questions_result.data)
#         }
        
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to get questions: {str(e)}")

# @router.get("/exams/teacher")
# async def get_teacher_exams(
#     current_user: dict = Depends(get_current_user)
# ):
#     """Get all exams created by the current teacher"""
    
#     user_type = current_user.get("user_type", current_user.get("role"))
#     if user_type != "teacher":
#         raise HTTPException(status_code=403, detail="Only teachers can access this endpoint")
    
#     supabase_admin = get_supabase_admin()
    
#     try:
#         teacher_id = current_user.get("user_id", current_user.get("id"))
#         result = supabase_admin.table("exams").select("""
#             *,
#             subjects (subject_name, subject_code)
#         """).eq("created_by", teacher_id).execute()
        
#         return {
#             "teacher_id": teacher_id,
#             "exams": result.data
#         }
        
#     except Exception as e:
#         print(f"Error getting exams: {str(e)}")
#         raise HTTPException(status_code=500, detail=f"Failed to get exams: {str(e)}")

@router.get("/exams/teacher")
async def get_teacher_exams(
    current_user: dict = Depends(get_current_user)
):
    """Get all exams created by the current teacher"""
    
    user_type = current_user.get("user_type", current_user.get("role"))
    if user_type != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can access this endpoint")
    
    supabase_admin = get_supabase_admin()
    
    try:
        teacher_id = current_user.get("user_id", current_user.get("id"))
        
        # Get exams with nested subject information
        result = supabase_admin.table("exams").select("""
            *,
            subjects (
                id,
                subject_name, 
                subject_code,
                department
            )
        """).eq("created_by", teacher_id).order("exam_date", desc=True).execute()
        
        # Get question counts for each exam
        exams_with_counts = []
        for exam in result.data:
            questions = supabase_admin.table("questions").select("id").eq(
                "exam_id", exam["id"]
            ).execute()
            
            exam["question_count"] = len(questions.data) if questions.data else 0
            exams_with_counts.append(exam)
        
        return {
            "teacher_id": teacher_id,
            "exams": exams_with_counts
        }
        
    except Exception as e:
        print(f"Error fetching teacher exams: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Failed to get exams: {str(e)}")

@router.get("/exams/student")
async def get_available_exams(
    current_user: dict = Depends(get_current_user)
):
    """Get all available exams for students"""
    
    user_type = current_user.get("user_type", current_user.get("role"))
    if user_type != "student":
        raise HTTPException(status_code=403, detail="Only students can access this endpoint")
    
    supabase_admin = get_supabase_admin()
    
    try:
        # Get all active exams
        result = supabase_admin.table("exams").select("""
            *,
            subjects (subject_name, subject_code)
        """).eq("status", "active").execute()
        
        # Check which exams student has already uploaded for
        student_id = current_user.get("user_id", current_user.get("id"))
        student_uploads = supabase_admin.table("exam_uploads").select(
            "exam_id"
        ).eq("student_id", student_id).execute()
        
        uploaded_exam_ids = [upload["exam_id"] for upload in student_uploads.data]
        
        # Add upload status to each exam
        for exam in result.data:
            exam["already_uploaded"] = exam["id"] in uploaded_exam_ids
        
        return {
            "student_id": student_id,
            "available_exams": result.data
        }
        
    except Exception as e:
        print(f"Error getting exams: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get exams: {str(e)}")
    
@router.get("/debug/token")
async def debug_token(current_user: dict = Depends(get_current_user)):
    """Debug endpoint to check token structure"""
    return {
        "token_contents": current_user,
        "has_user_type": "user_type" in current_user,
        "has_role": "role" in current_user,
        "has_user_id": "user_id" in current_user,
        "has_id": "id" in current_user
    }

@router.get("/debug/exam-schema")
async def debug_exam_schema():
    """Debug endpoint to see ExamCreate schema"""
    return {
        "model_name": "AdminExamCreate",
        "schema": AdminExamCreate.model_json_schema()
    }