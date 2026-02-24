"""
Internal API Routes - Updated Chat Endpoint Only
Only the chat endpoint is modified for educational quality
"""

from typing import List

from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import StreamingResponse

from app.core import settings, groq_client
from app.logging_config import logger
from app.models import (
    VideoSearchRequest,
    Video,
    TranscriptRequest,
    TranscriptResponse,
    GenerateSummaryRequest,
    GenerateQuizRequest,
    SummaryResponse,
    QuizResponse
)
from app.security import verify_internal_auth
from app.services import youtube_service, transcript_service, ai_service
from app.validation import validate_messages

router = APIRouter()


@router.post("/internal/search-videos", response_model=List[Video], tags=["internal", "youtube"])
async def internal_search_videos(
    request: Request,
    search_request: VideoSearchRequest,
    authenticated: bool = Depends(verify_internal_auth)
):
    """
    🔒 INTERNAL: Search YouTube videos
    Requires HMAC authentication from Express
    """
    logger.info(f"🔍 Video search: '{search_request.query}' (max_results: {search_request.max_results})")

    try:
        videos = youtube_service.search_videos(
            search_request.query,
            search_request.max_results
        )
        logger.info(f"✅ Found {len(videos)} videos for query: '{search_request.query}'")
        return videos

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Search error: {e}")
        raise HTTPException(status_code=500, detail="Search failed")


@router.post("/internal/get-transcript", response_model=TranscriptResponse, tags=["internal", "transcript"])
async def internal_get_transcript(
    request: Request,
    transcript_request: TranscriptRequest,
    authenticated: bool = Depends(verify_internal_auth)
):
    """
    🔒 INTERNAL: Fetch video transcript
    Requires HMAC authentication from Express
    """
    video_id = transcript_service.extract_video_id(transcript_request.video_id)
    logger.info(f"📝 Fetching transcript for video: {video_id}")

    try:
        transcript, method = transcript_service.fetch_transcript(video_id)

        logger.info(f"✅ Transcript fetched using {method} for video: {video_id} (length: {len(transcript)})")

        return TranscriptResponse(
            video_id=video_id,
            transcript=transcript,
            method=method,
            length=len(transcript)
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Transcript error for video {video_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch transcript")


@router.post("/internal/generate-summary", response_model=SummaryResponse, tags=["internal", "ai"])
async def internal_generate_summary(
    request: Request,
    summary_request: GenerateSummaryRequest,
    authenticated: bool = Depends(verify_internal_auth)
):
    """
    🔒 INTERNAL: Generate summary from transcript
    Requires HMAC authentication from Express
    """
    try:
        logger.info(f"📊 Generating summary (transcript length: {len(summary_request.transcript)})")

        summary = ai_service.generate_summary(summary_request.transcript)

        return SummaryResponse(summary=summary)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Summary generation error: {e}")
        raise HTTPException(500, detail="Failed to generate summary")


@router.post("/internal/generate-quiz", response_model=QuizResponse, tags=["internal", "ai"])
async def internal_generate_quiz(
    request: Request,
    quiz_request: GenerateQuizRequest,
    authenticated: bool = Depends(verify_internal_auth)
):
    """
    🔒 INTERNAL: Generate quiz from transcript
    Requires HMAC authentication from Express
    """
    try:
        logger.info(f"❓ Generating quiz (transcript length: {len(quiz_request.transcript)})")

        quiz = ai_service.generate_quiz(quiz_request.transcript)

        return QuizResponse(quiz=quiz)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Quiz generation error: {e}")
        raise HTTPException(500, detail="Failed to generate quiz")


@router.post("/internal/chat", tags=["internal", "ai"])
async def internal_chat(
    request: Request,
    authenticated: bool = Depends(verify_internal_auth)
):
    """
    🔒 INTERNAL: Educational AI Chat endpoint with streaming
    Requires HMAC authentication from Express
    
    Enhanced with:
    - Video context awareness
    - Educational teaching style
    - Personalized greetings
    - Deep learning focus
    """
    try:
        body = await request.json()

        messages = body.get("messages", [])
        userContext = body.get("userContext", {})

        is_valid, error_msg = validate_messages(messages)
        if not is_valid:
            logger.warning(f"⚠️  Invalid messages: {error_msg}")
            raise HTTPException(400, detail=error_msg)

        # Extract user info
        user_name = userContext.get("name")
        if not isinstance(user_name, str) or not user_name.strip() or len(user_name) > 100:
            user_name = "User"
        user_id = userContext.get("id", "unknown")

        logger.info(f"💬 Educational chat request from user: {user_id} ({user_name})")

        # make sure the model is told the user's name even if frontend forgot
        # prepend a system message if one doesn't already mention the name
        name_msg = f"The user\'s name is {user_name}."
        if not any(m.get("role") == "system" and user_name in m.get("content", "") for m in messages):
            messages.insert(0, {"role": "system", "content": name_msg})

        # Extract video context from messages (if present in system message)
        video_title = "this video"
        transcript_context = ""
        
        # Look for system message with video context
        for msg in messages:
            if msg.get("role") == "system":
                content = msg.get("content", "")
                # Try to extract video title
                if "video:" in content.lower() and "'" in content:
                    lines = content.split("\n")
                    for line in lines:
                        if "video:" in line.lower() and "'" in line:
                            parts = line.split("'")
                            if len(parts) >= 2:
                                video_title = parts[1]
                                break
                
                # Extract transcript preview
                if "transcript:" in content.lower():
                    transcript_start = content.lower().find("transcript:")
                    if transcript_start != -1:
                        transcript_context = content[transcript_start:transcript_start + 2000]

        # Build enhanced educational system prompt
        system_prompt = f"""You are an expert educational AI tutor helping {user_name} learn from {video_title}

YOUR ROLE:
- Help {user_name} deeply understand concepts from the video
- Answer questions clearly and pedagogically
- Use the Socratic method when appropriate (ask guiding questions)
- Provide examples and analogies to reinforce learning
- Encourage critical thinking

COMMUNICATION STYLE:
- ALWAYS start your FIRST response with: "Hello {user_name}!"
- ALWAYS address {user_name} by name in every response
- After the first message, continue naturally without repeating the greeting
- Keep a humble, respectful tone at all times
- Avoid overconfidence; acknowledge uncertainty when needed
- Be encouraging and supportive
- Explain concepts step-by-step
- Use simple language first, then add complexity if needed
- Ask if they want more details or examples
- Connect concepts to real-world applications

TEACHING PRINCIPLES:
1. Understand before you explain
2. Use analogies and examples
3. Check for understanding
4. Build on what they already know
5. Make learning engaging and relevant

{transcript_context}

Your goal: Help {user_name} truly understand and retain the knowledge from this video."""

        # Rebuild messages with enhanced system prompt
        # Remove old system messages and add our enhanced one
        filtered_messages = [msg for msg in messages if msg.get("role") != "system"]
        enhanced_messages = [
            {"role": "system", "content": system_prompt}
        ] + filtered_messages

        async def generate_stream():
            try:
                stream = groq_client.chat.completions.create(
                    model=settings.groq_model,
                    messages=enhanced_messages,
                    stream=True,
                    temperature=0.7,  # Balanced for educational content
                    max_tokens=settings.groq_max_tokens_chat
                )

                chunk_count = 0
                for chunk in stream:
                    chunk_count += 1

                    if chunk_count > 1000:
                        logger.warning(f"Stream exceeded chunk limit for user {user_id}")
                        break

                    if chunk.choices[0].delta.content:
                        yield chunk.choices[0].delta.content or ""

                logger.info(f"Educational chat completed for {user_name} ({chunk_count} chunks)")

            except Exception as e:
                error_msg = f"I apologize, {user_name}, but I'm having trouble right now. Error: {str(e)}"
                logger.error(f"Groq API error for user {user_id}: {e}")
                yield error_msg

        return StreamingResponse(
            generate_stream(),
            media_type="text/plain",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Content-Type-Options": "nosniff"
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Internal chat error: {e}")
        raise HTTPException(500, detail="Internal server error")
