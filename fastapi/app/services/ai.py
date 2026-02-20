"""
AI Service - Educational Quality
Improved quiz generation and summary with educational best practices
"""

import json
import re
from typing import List

from fastapi import HTTPException
from groq import Groq

from config import get_settings
from app.logging_config import logger
from app.models import QuizQuestion

settings = get_settings()


class AIService:
    """AI service for summaries, quizzes, and chat - Educational focus"""

    def __init__(self, client: Groq):
        self.client = client

    def generate_summary(self, transcript: str) -> str:
        """Generate educational summary from transcript"""
        transcript = transcript[:settings.transcript_max_length]

        prompt = f"""You are an expert educational content summarizer. Based on the following video transcript, create a comprehensive summary that helps students learn effectively.

Your summary should:
- Identify the main concepts and key learning objectives
- Highlight the most important takeaways
- Organize information in a logical, easy-to-understand way
- Use clear, concise language
- Include 3-5 well-structured paragraphs

Transcript:
{transcript}

Create an educational summary that maximizes learning retention:"""

        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=settings.groq_model,
                temperature=settings.groq_temperature,
                max_tokens=settings.groq_max_tokens_summary
            )
            summary = response.choices[0].message.content
            logger.info(f"Generated educational summary ({len(summary)} chars)")
            return summary

        except Exception as e:
            logger.error(f"Error generating summary: {e}")
            raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

    def generate_quiz(self, transcript: str) -> List[QuizQuestion]:
        """Generate HIGH-QUALITY educational quiz questions"""
        transcript = transcript[:settings.transcript_max_length]

        prompt = f"""You are an expert educational assessment designer. Create 5 multiple-choice questions to test deep understanding of this video content.

CRITICAL RULES:
1. NEVER ask about video metadata (title, creator, channel, length, upload date)
2. NEVER ask trivial recall questions ("What did the speaker say in minute 3?")
3. ALWAYS focus on CONCEPTS, PRINCIPLES, and UNDERSTANDING
4. Test application of knowledge, not just memorization
5. Use real-world scenarios where possible
6. Make wrong answers plausible but clearly incorrect to those who understand

Question Quality Levels (aim for levels 1-3):
- Level 1 (Understanding): "What is the main purpose of X?"
- Level 2 (Application): "How would you use X in situation Y?"
- Level 3 (Analysis): "Why does X work better than Y?"
- Level 4 (Evaluation): "What would happen if you combined X and Y?"

Create questions at levels 1-3 (avoid pure memorization).

Format each question as JSON:
{{
    "question": "Clear, specific question testing understanding",
    "options": [
        "A) Plausible answer that tests a concept",
        "B) Another plausible option",
        "C) Common misconception",
        "D) Another common misconception"
    ],
    "correct": "A"
}}

Return ONLY a JSON array of 5 high-quality questions, no other text.

Video Transcript:
{transcript}

Generate 5 educational assessment questions:"""

        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=settings.groq_model,
                temperature=0.7,  # Slightly higher for creativity in question design
                max_tokens=settings.groq_max_tokens_quiz
            )

            quiz_text = response.choices[0].message.content

            # Extract JSON array from response
            json_match = re.search(r'\[.*\]', quiz_text, re.DOTALL)

            if json_match:
                quiz_data = json.loads(json_match.group())
                quiz_questions = [QuizQuestion(**q) for q in quiz_data]
                logger.info(f"Generated {len(quiz_questions)} high-quality educational quiz questions")
                return quiz_questions

            logger.warning("Could not parse quiz JSON, returning empty list")
            return []

        except Exception as e:
            logger.error(f" Error generating quiz: {e}")
            raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")