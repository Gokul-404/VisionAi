"""
FastAPI Backend with Optimized Emotion Detection

This version uses a custom lightweight model for 10x faster emotion detection!

Switch between models by setting USE_FAST_MODEL = True/False
"""

from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
import cv2
import base64
import numpy as np
from openai import OpenAI
import os
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ⚡ CONFIGURATION: Choose your emotion detection model
USE_FAST_MODEL = True  # Set to True for 10x faster detection!
USE_TFLITE = True      # Use TFLite for maximum speed (requires .tflite file)

app = FastAPI(title="Vision AI - Behaviour Analysis API (Optimized)")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize emotion detector
if USE_FAST_MODEL:
    try:
        from fast_emotion_detector import get_detector
        emotion_detector = get_detector(
            model_path='emotion_model_best.h5',
            use_tflite=USE_TFLITE
        )
        print("✅ Using FAST custom model (optimized for speed)")
    except Exception as e:
        print(f"⚠️  Fast model not available: {e}")
        print("📥 Falling back to DeepFace (slower)")
        USE_FAST_MODEL = False

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class ChatRequest(BaseModel):
    message: str
    emotion: Optional[str] = "neutral"


@app.get("/")
async def root():
    model_info = "Fast Custom Model (TFLite)" if USE_FAST_MODEL and USE_TFLITE else \
                 "Fast Custom Model (Keras)" if USE_FAST_MODEL else \
                 "DeepFace"

    return {
        "message": "Vision AI - Behaviour Analysis API",
        "version": "2.0.0 (Optimized)",
        "emotion_model": model_info,
        "endpoints": ["/api/emotion", "/api/chat"],
        "performance": "~50-200ms per detection" if USE_FAST_MODEL else "~800-1500ms per detection"
    }


@app.post("/api/emotion")
async def detect_emotion(image: str = Form(...)):
    """
    Detect emotion from base64 encoded image.

    Uses either:
    - Fast custom model (50-200ms) - RECOMMENDED
    - DeepFace (800-1500ms) - Fallback

    Args:
        image: Base64 encoded image string from webcam

    Returns:
        dict: Detected emotion and confidence score
    """
    try:
        # Decode base64 image
        if ',' in image:
            imgdata = base64.b64decode(image.split(',')[1])
        else:
            imgdata = base64.b64decode(image)

        # Convert to numpy array
        img = cv2.imdecode(np.frombuffer(imgdata, np.uint8), cv2.IMREAD_COLOR)

        if USE_FAST_MODEL:
            # Use fast custom model
            result = emotion_detector.analyze(img)

            return {
                "emotion": result['emotion'],
                "confidence": round(result['confidence'], 2),
                "all_emotions": {k: round(v, 2) for k, v in result['all_emotions'].items()},
                "model": "fast_custom"
            }
        else:
            # Fallback to DeepFace
            from deepface import DeepFace

            result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False, silent=True)

            if isinstance(result, list):
                result = result[0]

            emotions = result['emotion']
            dominant_emotion = result['dominant_emotion']
            confidence = emotions[dominant_emotion] / 100.0

            return {
                "emotion": dominant_emotion,
                "confidence": round(confidence, 2),
                "all_emotions": {k: round(v / 100.0, 2) for k, v in emotions.items()},
                "model": "deepface"
            }

    except Exception as e:
        print(f"Error in emotion detection: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "emotion": "neutral",
            "confidence": 0.0,
            "error": str(e),
            "model": "error"
        }


@app.post("/api/chat")
async def chat_with_emotion(payload: ChatRequest):
    """
    Generate adaptive AI response based on user's emotion.

    Args:
        payload: ChatRequest with message and emotion

    Returns:
        dict: AI-generated response adapted to user's emotional state
    """
    try:
        msg = payload.message
        emotion = payload.emotion or "neutral"

        # Emotion-specific prompts
        emotion_prompts = {
            "angry": """
            You are an empathetic AI assistant. The user appears frustrated or angry.
            - Be extremely patient and understanding
            - Use a calm, soothing tone
            - Acknowledge their feelings
            - Offer to help resolve their concerns step-by-step
            - Keep responses clear and concise
            """,
            "disgust": """
            You are a supportive AI assistant. The user appears uncomfortable or displeased.
            - Be respectful and non-judgmental
            - Use a professional, neutral tone
            - Offer alternative perspectives if appropriate
            - Keep responses factual and helpful
            """,
            "fear": """
            You are a reassuring AI assistant. The user appears worried or anxious.
            - Be encouraging and supportive
            - Use a warm, comforting tone
            - Provide clear, step-by-step guidance
            - Help break down complex problems into manageable parts
            - Reassure them that it's okay to ask questions
            """,
            "happy": """
            You are an enthusiastic AI assistant. The user appears happy and positive.
            - Match their positive energy
            - Be friendly and engaging
            - Use a conversational, upbeat tone
            - Feel free to be slightly more casual
            - Continue the positive momentum
            """,
            "sad": """
            You are a compassionate AI assistant. The user appears sad or down.
            - Be gentle and understanding
            - Use an empathetic, supportive tone
            - Offer encouragement
            - Be patient with their questions
            - Show that you're here to help
            """,
            "surprise": """
            You are an engaging AI assistant. The user appears surprised or curious.
            - Be informative and clear
            - Use an interesting, engaging tone
            - Provide detailed explanations when appropriate
            - Encourage their curiosity
            - Make learning enjoyable
            """,
            "neutral": """
            You are a helpful AI assistant. The user appears calm and focused.
            - Be professional and friendly
            - Use a balanced, clear tone
            - Provide thorough but concise answers
            - Stay on topic
            """,
        }

        system_prompt = emotion_prompts.get(emotion, emotion_prompts["neutral"])
        system_prompt += "\nKeep responses conversational, natural, and under 150 words unless more detail is specifically needed."

        # Generate response using OpenAI
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": msg}
            ],
            temperature=0.7,
            max_tokens=300
        )

        return {
            "response": response.choices[0].message.content,
            "emotion_detected": emotion
        }

    except Exception as e:
        return {
            "response": f"I apologize, but I encountered an error: {str(e)}. Please try again.",
            "emotion_detected": emotion,
            "error": str(e)
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
