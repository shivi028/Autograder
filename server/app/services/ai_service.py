# app/services/ai_service.py
from typing import Dict, Any, List
import asyncio
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import re
from decimal import Decimal

class QuestionResult:
    def __init__(self, question_number, extracted_answer, marks_obtained, max_marks, feedback, confidence_score):
        self.question_number = question_number
        self.extracted_answer = extracted_answer
        self.marks_obtained = marks_obtained
        self.max_marks = max_marks
        self.feedback = feedback
        self.confidence_score = confidence_score

class AIGradingService:
    def __init__(self):
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.similarity_threshold = 0.7

    async def grade_question(
        self, 
        question_data: Dict[str, Any], 
        student_answer: str
    ) -> QuestionResult:
        """Grade a single question using AI"""
        question_text = question_data.get("question", "")
        model_answer = question_data.get("model_answer", "")
        max_marks = float(question_data.get("marks", 0))
        question_number = question_data.get("question_number", 0)
        
        if not student_answer.strip():
            return QuestionResult(
                question_number=question_number,
                extracted_answer=student_answer,
                marks_obtained=0.0,
                max_marks=max_marks,
                feedback="No answer provided",
                confidence_score=1.0
            )
        
        # Calculate semantic similarity
        similarity_score = await self._calculate_similarity(model_answer, student_answer)
        
        # Calculate marks and feedback
        marks_obtained, feedback, confidence = await self._calculate_marks(
            question_data, student_answer, model_answer, similarity_score
        )
        
        return QuestionResult(
            question_number=question_number,
            extracted_answer=student_answer,
            marks_obtained=round(marks_obtained, 2),
            max_marks=max_marks,
            feedback=feedback,
            confidence_score=round(confidence, 2)
        )

    async def _calculate_similarity(self, model_answer: str, student_answer: str) -> float:
        """Calculate semantic similarity between model and student answers"""
        if not model_answer.strip() or not student_answer.strip():
            return 0.0
        
        try:
            loop = asyncio.get_running_loop()
            model_embedding = await loop.run_in_executor(
                None, self.embedding_model.encode, [model_answer]
            )
            student_embedding = await loop.run_in_executor(
                None, self.embedding_model.encode, [student_answer]
            )
            similarity = cosine_similarity(model_embedding, student_embedding)[0][0]
            return float(similarity)
        except Exception as e:
            print(f"Error calculating similarity: {e}")
            return 0.0
    
    async def _calculate_marks(
        self, 
        question_data: Dict[str, Any], 
        student_answer: str, 
        model_answer: str, 
        similarity_score: float
    ) -> tuple:
        """Calculate marks, feedback, and confidence"""
        max_marks = float(question_data.get("marks", 0))
        keywords = question_data.get("keywords", [])
        
        # Base scoring based on similarity
        if similarity_score >= 0.85:
            marks_ratio = 1.0
            feedback = "Excellent answer with comprehensive understanding"
        elif similarity_score >= 0.70:
            marks_ratio = 0.85
            feedback = "Very good answer with minor gaps"
        elif similarity_score >= 0.55:
            marks_ratio = 0.70
            feedback = "Good answer, some key points covered"
        elif similarity_score >= 0.40:
            marks_ratio = 0.55
            feedback = "Partial answer, missing important details"
        elif similarity_score >= 0.25:
            marks_ratio = 0.35
            feedback = "Basic understanding shown, needs improvement"
        else:
            marks_ratio = 0.15
            feedback = "Answer needs significant improvement"
        
        # Adjust for keywords if provided
        if keywords and len(keywords) > 0:
            keyword_score = await self._check_keywords(student_answer, keywords)
            # Weight: 70% similarity, 30% keywords
            marks_ratio = (marks_ratio * 0.7) + (keyword_score * 0.3)
            
            if keyword_score > 0.8:
                feedback += ". Contains all key terminology."
            elif keyword_score > 0.5:
                feedback += ". Contains most key terms."
            else:
                feedback += ". Missing important keywords."
        
        marks_obtained = max_marks * marks_ratio
        confidence = max(0.6, min(0.95, similarity_score + 0.15))
        
        return marks_obtained, feedback, confidence

    async def _check_keywords(self, student_answer: str, keywords: List[str]) -> float:
        """Check for presence of keywords in student answer"""
        if not keywords:
            return 0.5
        
        student_answer_lower = student_answer.lower()
        found_keywords = sum(1 for keyword in keywords if keyword.lower() in student_answer_lower)
        return found_keywords / len(keywords)

    async def generate_overall_feedback(self, question_results: List[QuestionResult], percentage: float) -> str:
        """Generate overall feedback for the exam"""
        if percentage >= 90:
            grade = "Excellent (A+)"
            feedback = "Outstanding performance! Comprehensive understanding demonstrated."
        elif percentage >= 80:
            grade = "Very Good (A)"
            feedback = "Very good work! Strong grasp of concepts with minor improvements needed."
        elif percentage >= 70:
            grade = "Good (B+)"
            feedback = "Good performance. Some areas need more attention."
        elif percentage >= 60:
            grade = "Satisfactory (B)"
            feedback = "Satisfactory understanding, but significant improvement needed."
        elif percentage >= 50:
            grade = "Pass (C)"
            feedback = "Basic understanding shown, major gaps need addressing."
        else:
            grade = "Needs Improvement (F)"
            feedback = "Significant study required to improve performance."

        low_scoring = [qr for qr in question_results if (qr.marks_obtained / qr.max_marks) < 0.6]
        if low_scoring:
            feedback += f" Focus on questions: {', '.join([str(qr.question_number) for qr in low_scoring[:3]])}."

        return f"{grade}: {feedback}"