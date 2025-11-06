# emergency_grade.py - Run this script directly to force grading
import asyncio
from app.database.connection import get_supabase_admin
from app.services.ocr_service import OCRService
from app.services.ai_service import AIGradingService

async def emergency_grade_exam(exam_id: str):
    """Emergency grading for all uploads in an exam"""
    
    supabase_admin = get_supabase_admin()
    ocr_service = OCRService()
    ai_service = AIGradingService()
    
    print(f"\n{'='*80}")
    print(f"🚨 EMERGENCY GRADING FOR EXAM: {exam_id}")
    print(f"{'='*80}\n")
    
    try:
        # Step 1: Get all uploads for this exam
        print("Step 1: Fetching uploads...")
        uploads_result = supabase_admin.table("exam_uploads").select("*").eq(
            "exam_id", exam_id
        ).eq("processing_status", "processed").execute()
        
        if not uploads_result.data:
            print("❌ No processed uploads found!")
            return
        
        print(f"✅ Found {len(uploads_result.data)} processed uploads\n")
        
        # Step 2: Get exam questions
        print("Step 2: Fetching exam questions...")
        questions_result = supabase_admin.table("questions").select("*").eq(
            "exam_id", exam_id
        ).order("question_number").execute()
        
        if not questions_result.data:
            print("❌ No questions found for this exam!")
            return
        
        questions = questions_result.data
        print(f"✅ Found {len(questions)} questions\n")
        
        # Step 3: Process each upload
        for idx, upload in enumerate(uploads_result.data):
            upload_id = upload['id']
            student_id = upload['student_id']
            ocr_text = upload.get('ocr_extracted_text', '')
            
            print(f"\n{'─'*80}")
            print(f"Processing Upload {idx + 1}/{len(uploads_result.data)}")
            print(f"Upload ID: {upload_id}")
            print(f"Student ID: {student_id}")
            print(f"{'─'*80}")
            
            if not ocr_text:
                print("❌ No OCR text found, skipping...")
                continue
            
            print(f"📄 OCR Text length: {len(ocr_text)} characters")
            print(f"📄 Preview: {ocr_text[:150]}...\n")
            
            # Parse answers
            print("🔍 Parsing answers...")
            parsed_answers = ocr_service._parse_answers_botanical(ocr_text)
            print(f"✅ Parsed {len(parsed_answers)} answers: {list(parsed_answers.keys())}\n")
            
            # Grade each question
            graded_count = 0
            for question in questions:
                question_key = f"question_{question['question_number']}"
                student_answer = parsed_answers.get(question_key, "")
                
                if not student_answer:
                    print(f"⚠️  Q{question['question_number']}: No answer found")
                    continue
                
                print(f"📝 Grading Q{question['question_number']}...")
                print(f"   Answer: {student_answer[:80]}...")
                
                # Prepare question data
                question_data = {
                    "question": question["question_text"],
                    "model_answer": question.get("sample_answer", ""),
                    "marks": float(question["max_marks"]),
                    "question_number": question["question_number"],
                    "keywords": question.get("keywords", []) if question.get("keywords") else [],
                    "type": "descriptive"
                }
                
                try:
                    # Grade the question
                    result = await ai_service.grade_question(question_data, student_answer)
                    
                    # Save student answer
                    answer_data = {
                        "upload_id": upload_id,
                        "question_id": question["id"],
                        "student_id": student_id,
                        "extracted_answer": student_answer,
                        "confidence_score": float(result.confidence_score)
                    }
                    
                    # Check if answer already exists
                    existing_answer = supabase_admin.table("student_answers").select("id").eq(
                        "upload_id", upload_id
                    ).eq("question_id", question["id"]).execute()
                    
                    if existing_answer.data:
                        answer_id = existing_answer.data[0]["id"]
                        print(f"   ℹ️  Answer exists, using ID: {answer_id}")
                    else:
                        answer_result = supabase_admin.table("student_answers").insert(answer_data).execute()
                        answer_id = answer_result.data[0]["id"]
                        print(f"   ✅ Answer saved, ID: {answer_id}")
                    
                    # Save grading result
                    grading_data = {
                        "student_answer_id": answer_id,
                        "exam_id": exam_id,
                        "student_id": student_id,
                        "question_id": question["id"],
                        "ai_assigned_marks": float(result.marks_obtained),
                        "final_marks": float(result.marks_obtained),
                        "ai_feedback": result.feedback,
                        "similarity_score": 0.0,
                        "ai_confidence": float(result.confidence_score),
                        "is_reviewed_by_teacher": False
                    }
                    
                    # Check if grading result already exists
                    existing_grade = supabase_admin.table("grading_results").select("id").eq(
                        "student_answer_id", answer_id
                    ).execute()
                    
                    if existing_grade.data:
                        # Update existing
                        supabase_admin.table("grading_results").update(grading_data).eq(
                            "id", existing_grade.data[0]["id"]
                        ).execute()
                        print(f"   ✅ Grade updated: {result.marks_obtained}/{question['max_marks']}")
                    else:
                        # Insert new
                        supabase_admin.table("grading_results").insert(grading_data).execute()
                        print(f"   ✅ Grade saved: {result.marks_obtained}/{question['max_marks']}")
                    
                    print(f"   💬 Feedback: {result.feedback[:80]}...")
                    
                    graded_count += 1
                    
                except Exception as e:
                    print(f"   ❌ Grading failed: {str(e)}")
                    import traceback
                    traceback.print_exc()
            
            print(f"\n✅ Completed: {graded_count}/{len(questions)} questions graded")
        
        print(f"\n{'='*80}")
        print(f"🎉 EMERGENCY GRADING COMPLETED!")
        print(f"{'='*80}\n")
        
    except Exception as e:
        print(f"\n❌ Emergency grading failed: {str(e)}")
        import traceback
        traceback.print_exc()

# Run the script
if __name__ == "__main__":
    EXAM_ID = "2445bc21-a59a-4305-8605-86f74f318232"  # Your exam ID
    
    print("\n" + "="*80)
    print("🚨 EMERGENCY GRADING SCRIPT")
    print("="*80)
    print(f"Exam ID: {EXAM_ID}")
    print("This will grade all processed uploads for this exam")
    print("="*80 + "\n")
    
    asyncio.run(emergency_grade_exam(EXAM_ID))