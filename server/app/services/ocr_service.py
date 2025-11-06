# app/services/ocr_service.py
import pytesseract
from PIL import Image
import cv2
import numpy as np
from typing import Dict, List
import PyPDF2
import fitz  # PyMuPDF
import io
import os
import re

class OCRService:
    def __init__(self):
        self.confidence_threshold = 30

    async def extract_text_from_image(self, image_data: bytes) -> Dict[str, any]:
        """Extract text from image bytes"""
        try:
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to numpy array
            image_np = np.array(image)
            
            # Preprocess
            processed_image = self._preprocess_image(image_np)
            
            # Extract text
            text = pytesseract.image_to_string(processed_image)
            
            # Get confidence
            data = pytesseract.image_to_data(processed_image, output_type=pytesseract.Output.DICT)
            confidences = [int(conf) for conf in data['conf'] if int(conf) > 0]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0
            
            return {
                "text": text.strip(),
                "confidence": avg_confidence / 100,
                "status": "success"
            }
        except Exception as e:
            return {
                "text": "",
                "confidence": 0.0,
                "status": "error",
                "error": str(e)
            }

    async def extract_text_from_pdf(self, pdf_data: bytes) -> Dict[str, any]:
        """Extract text from PDF bytes"""
        try:
            # Open PDF from bytes
            pdf_document = fitz.open(stream=pdf_data, filetype="pdf")
            
            extracted_pages = []
            total_confidence = 0
            
            for page_num in range(pdf_document.page_count):
                page = pdf_document[page_num]
                
                # Try to extract text directly first
                text = page.get_text()
                
                if text.strip():
                    # Text-based PDF
                    extracted_pages.append({
                        "page": page_num + 1,
                        "text": text.strip(),
                        "confidence": 0.95,
                        "method": "direct"
                    })
                    total_confidence += 0.95
                else:
                    # Image-based PDF, use OCR
                    pix = page.get_pixmap()
                    img_data = pix.tobytes("png")
                    
                    ocr_result = await self.extract_text_from_image(img_data)
                    
                    extracted_pages.append({
                        "page": page_num + 1,
                        "text": ocr_result["text"],
                        "confidence": ocr_result["confidence"],
                        "method": "ocr"
                    })
                    total_confidence += ocr_result["confidence"]
            
            pdf_document.close()
            
            # Combine all text
            combined_text = "\n\n".join([page["text"] for page in extracted_pages])
            avg_confidence = total_confidence / len(extracted_pages) if extracted_pages else 0
            
            return {
                "text": combined_text,
                "confidence": avg_confidence,
                "pages": extracted_pages,
                "status": "success"
            }
        except Exception as e:
            return {
                "text": "",
                "confidence": 0.0,
                "status": "error",
                "error": str(e)
            }

    async def extract_text_from_txt(self, file_path: str) -> Dict[str, any]:
        """Extract text from TXT file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
            
            return {
                "text": text.strip(),
                "confidence": 1.0,  # TXT files have perfect confidence
                "status": "success"
            }
        except Exception as e:
            return {
                "text": "",
                "confidence": 0.0,
                "status": "error",
                "error": str(e)
            }

    async def extract_answers(self, file_path: str) -> Dict[str, str]:
        """Extract answers from exam copy"""
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if file_extension == '.txt':
            result = await self.extract_text_from_txt(file_path)
        elif file_extension == '.pdf':
            with open(file_path, 'rb') as f:
                pdf_data = f.read()
            result = await self.extract_text_from_pdf(pdf_data)
        else:
            # Image file
            with open(file_path, 'rb') as f:
                image_data = f.read()
            result = await self.extract_text_from_image(image_data)
        
        if result["status"] == "success" and result["text"]:
            # Parse text to extract question-wise answers
            return self._parse_answers_botanical(result["text"])
        else:
            return {}

    def _preprocess_image(self, image):
        """Preprocess image for better OCR results"""
        # Convert to grayscale if needed
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image
        
        # Apply Gaussian blur
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Apply threshold
        _, threshold = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        return threshold

    def _parse_answers_botanical(self, text: str) -> Dict[str, str]:
        """
        Parse extracted text specifically for botanical exam format
        Handles formats like:
        - "Answer 1:", "ANSWER 1:", "Answer 1", "Q1:", "Question 1:"
        """
        answers = {}
        lines = text.split('\n')
        current_question = None
        current_answer = []
        
        # Patterns to match question numbers
        question_patterns = [
            r'^\s*(?:Answer|ANSWER|Ans|ANS)\s*(\d+)[:\s]',
            r'^\s*(?:Question|QUESTION|Q)\s*(\d+)[:\s]',
            r'^\s*Q(\d+)[:\s]',
            r'^\s*(\d+)[:.]\s*'  # Just number with colon/period
        ]
        
        for line in lines:
            line_stripped = line.strip()
            
            if not line_stripped:
                continue
            
            # Check if this line starts a new question
            is_question = False
            question_num = None
            
            for pattern in question_patterns:
                match = re.match(pattern, line_stripped, re.IGNORECASE)
                if match:
                    is_question = True
                    question_num = int(match.group(1))
                    # Get remaining text after question marker
                    remaining = re.sub(pattern, '', line_stripped, flags=re.IGNORECASE).strip()
                    break
            
            if is_question and question_num:
                # Save previous question's answer
                if current_question is not None:
                    answers[f"question_{current_question}"] = ' '.join(current_answer).strip()
                
                # Start new question
                current_question = question_num
                current_answer = [remaining] if remaining else []
            
            elif current_question is not None:
                # Continue collecting answer for current question
                # Skip lines that look like metadata
                if not any(keyword in line_stripped.lower() for keyword in 
                          ['student id:', 'student name:', 'date:', 'exam:', 'botanical']):
                    current_answer.append(line_stripped)
        
        # Save last question's answer
        if current_question is not None and current_answer:
            answers[f"question_{current_question}"] = ' '.join(current_answer).strip()
        
        return answers

    def _is_question_line(self, line: str) -> bool:
        """Check if line contains question number"""
        pattern = r'^\s*(?:Q\.?|Question|Ans\.?|Answer)?\s*(\d+)[.:]?\s*'
        return bool(re.match(pattern, line, re.IGNORECASE))

    def _extract_question_number(self, line: str) -> str:
        """Extract question number from line"""
        pattern = r'^\s*(?:Q\.?|Question|Ans\.?|Answer)?\s*(\d+)[.:]?\s*'
        match = re.match(pattern, line, re.IGNORECASE)
        if match:
            return f"question_{match.group(1)}"
        return "question_unknown"