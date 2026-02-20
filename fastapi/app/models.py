from pydantic import BaseModel, Field
from typing import List


class VideoSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=200)
    max_results: int = Field(default=10, ge=1, le=50)


class Video(BaseModel):
    id: str
    title: str
    description: str
    thumbnail: str
    channel: str


class TranscriptRequest(BaseModel):
    video_id: str = Field(..., min_length=1, max_length=50)


class TranscriptResponse(BaseModel):
    video_id: str
    transcript: str
    method: str
    length: int


class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct: str


class GenerateSummaryRequest(BaseModel):
    transcript: str = Field(..., max_length=15000)


class GenerateQuizRequest(BaseModel):
    transcript: str = Field(..., max_length=15000)


class SummaryResponse(BaseModel):
    summary: str


class QuizResponse(BaseModel):
    quiz: List[QuizQuestion]


class ChatMessage(BaseModel):
    role: str
    content: str
