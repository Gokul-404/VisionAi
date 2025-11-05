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

# Load environment variables from .env 
load_dotenv()

app = FastAPI(title="Emotion-Aware AI Assistant API")

# CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# No initialization needed for DeepFace - it's imported directly when used

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class ChatRequest(BaseModel):
    message: str
    emotion: Optional[str] = "neutral"


@app.get("/")
async def root():
    return {
        "message": "Emotion-Aware AI Assistant API",
        "version": "1.0.0",
        "endpoints": ["/api/emotion", "/api/chat"]
    }

#we are
@app.post("/api/emotion")
async def detect_emotion(image: str = Form(...)):
    """
    Detect emotion from base64 encoded image.

    Args:
        image: Base64 encoded image string from webcam

    Returns:
        dict: Detected emotion and confidence score
    """
    try:
        from deepface import DeepFace

        # Decode base64 image
        if ',' in image:
            imgdata = base64.b64decode(image.split(',')[1])
        else:
            imgdata = base64.b64decode(image)

        # Convert to numpy array and decode image
        img = cv2.imdecode(np.frombuffer(imgdata, np.uint8), cv2.IMREAD_COLOR)

        print(f"Image shape: {img.shape}")  # Debug: Check image dimensions

        # Detect emotions using DeepFace
        # Use enforce_detection=False to handle cases where no face is detected
        result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False, silent=True)

        print(f"Detection results: {result}")  # Debug: See what DeepFace returns

        # DeepFace returns a list or dict depending on version
        if isinstance(result, list):
            result = result[0]

        emotions = result['emotion']
        dominant_emotion = result['dominant_emotion']
        confidence = emotions[dominant_emotion] / 100.0  # Convert percentage to decimal

        print(f"Detected emotion: {dominant_emotion} with confidence: {confidence}")  # Debug

        return {
            "emotion": dominant_emotion,
            "confidence": round(confidence, 2),
            "all_emotions": {k: round(v / 100.0, 2) for k, v in emotions.items()}
        }

    except Exception as e:
        print(f"Error in emotion detection: {str(e)}")  # Debug: Print errors
        import traceback
        traceback.print_exc()  # Full stack trace
        return {
            "emotion": "neutral",
            "confidence": 0.0,
            "error": str(e)
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

        # Create adaptive system prompt based on emotion
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
            model="gpt-4o-mini",  # Using gpt-4o-mini (faster and more cost-effective)
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
