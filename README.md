# Emotion-Aware AI Assistant

A full-stack application that combines Vision AI (facial expression detection) with a Large Language Model (LLM) to create an adaptive, emotionally intelligent chatbot.

## Overview

The assistant uses your facial expressions captured from the webcam to detect emotional states (happy, confused, bored, frustrated, etc.) and adjusts the tone, complexity, and empathy level of its responses in real-time.

## Features

- **Real-time Emotion Detection**: Uses computer vision to analyze facial expressions
- **Adaptive AI Responses**: LLM adjusts communication style based on detected emotions
- **Modern Glassmorphism UI**: Beautiful frosted glass design with smooth animations
- **Privacy-First**: All emotion processing happens locally - no data stored
- **Responsive Design**: Works seamlessly on different screen sizes

## Tech Stack

### Frontend
- **React** (with Vite)
- **Tailwind CSS** (Glassmorphism styling)
- **Framer Motion** (smooth animations)
- **react-webcam** (webcam integration)
- **Axios** (API communication)

### Backend
- **FastAPI** (Python web framework)
- **OpenCV** (image processing)
- **FER** (Facial Expression Recognition)
- **OpenAI API** (GPT-4 for adaptive responses)

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **pip** (Python package manager)
- **OpenAI API Key** ([Get one here](https://platform.openai.com/api-keys))
- **Webcam** (for emotion detection)

## Installation

### 1. Clone or Navigate to the Project

```bash
cd emotionrecognizer
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
# OR
cp .env.example .env    # macOS/Linux

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=your_actual_api_key_here
```

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

## Running the Application

### 1. Start the Backend Server

```bash
# In the backend directory (with virtual environment activated)
cd backend
uvicorn main:app --reload
```

The backend will start at `http://localhost:8000`

### 2. Start the Frontend Development Server

```bash
# In a new terminal, navigate to frontend directory
cd frontend
npm run dev
```

The frontend will start at `http://localhost:3000` and should open automatically in your browser.

## Usage

1. **Allow Webcam Access**: When prompted, allow the application to access your webcam
2. **Start Chatting**: Type your message in the chat input
3. **Emotion Detection**: The app continuously analyzes your facial expressions
4. **Adaptive Responses**: The AI adjusts its tone based on your detected emotion:
   - **Happy** → Enthusiastic and engaging
   - **Confused** → Simplified explanations with analogies
   - **Frustrated** → Patient, gentle, and clarifying
   - **Bored** → Energetic and interesting
   - **Sad** → Empathetic and supportive

## API Endpoints

### POST `/api/emotion`
Detects emotion from base64 encoded webcam image.

**Request:**
```json
{
  "image": "base64_encoded_image"
}
```

**Response:**
```json
{
  "emotion": "happy",
  "confidence": 0.89,
  "all_emotions": {
    "happy": 0.89,
    "neutral": 0.06,
    "surprise": 0.03
  }
}
```

### POST `/api/chat`
Generates adaptive AI response based on message and emotion.

**Request:**
```json
{
  "message": "How do I learn React?",
  "emotion": "confused"
}
```

**Response:**
```json
{
  "response": "I'll help you learn React step by step...",
  "emotion_detected": "confused"
}
```

## Project Structure

```
emotionrecognizer/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment variables template
│   └── .env                 # Your API keys (create this)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatPanel.jsx      # Chat interface
│   │   │   └── CameraPanel.jsx    # Webcam & emotion display
│   │   ├── App.jsx                # Main application
│   │   ├── main.jsx               # Entry point
│   │   ├── index.css              # Global styles
│   │   └── api.js                 # API client
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Troubleshooting

### Webcam not working
- Ensure you've granted webcam permissions in your browser
- Check if another application is using the webcam
- Try refreshing the page

### Backend errors
- Make sure your OpenAI API key is correctly set in `.env`
- Verify all Python packages are installed: `pip install -r requirements.txt`
- Check if port 8000 is available

### Frontend connection issues
- Ensure the backend is running on `http://localhost:8000`
- Check for CORS errors in browser console
- Verify the API base URL in `frontend/src/api.js`

### Emotion detection not working
- Ensure adequate lighting for facial detection
- Position your face clearly in front of the camera
- Wait a few seconds for the model to initialize

## Performance Tips

1. **GPU Acceleration**: For better performance, install TensorFlow with GPU support
2. **Adjust Detection Frequency**: Modify the interval in `CameraPanel.jsx` (default: 3 seconds)
3. **Model Selection**: Change OpenAI model in `backend/main.py` (e.g., `gpt-3.5-turbo` for faster responses)

## Privacy & Security

- All facial emotion processing happens locally on your machine
- Images are analyzed in real-time and not stored
- Only the detected emotion label is sent to the backend
- Your conversations are processed through OpenAI's API (subject to their privacy policy)

## Future Enhancements

- [ ] Speech synthesis (text-to-speech responses)
- [ ] Voice input mode
- [ ] Emotion trend graph over time
- [ ] Multiple language support
- [ ] Offline emotion detection model
- [ ] Chat history export

## License

This project is for educational purposes.

## Acknowledgments

- **FER** - Facial Expression Recognition library
- **OpenAI** - GPT-4 API
- **FastAPI** - Modern Python web framework
- **React** - UI library

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the console/terminal for error messages
3. Ensure all dependencies are correctly installed

---

**Built with React, FastAPI, and Emotion Recognition AI**

Enjoy your emotion-aware AI companion! 🤖✨
