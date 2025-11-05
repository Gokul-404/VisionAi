# Vision AI - Behaviour Analysis

A comprehensive full-stack application that combines advanced Vision AI for real-time facial expression detection with intelligent behaviour analytics and an emotionally adaptive AI assistant.

## Overview

This system analyzes facial expressions from your webcam in real-time, tracks emotion patterns over time, and provides detailed analytics dashboards. It also features an AI chatbot that adapts its responses based on your current emotional state, creating a truly intelligent and empathetic user experience.

## Key Features

### 🎭 Real-time Emotion Detection
- Advanced facial expression recognition using DeepFace
- Detects 7 emotions: happy, sad, angry, surprise, fear, disgust, neutral
- Real-time webcam analysis with confidence scores
- Visual emotion overlay and detailed breakdowns

### 📊 Interactive Analytics Dashboard
- Live emotion timeline chart with historical tracking
- Real-time emotion trends and patterns
- Interactive data visualization with hover details
- Average emotion statistics and insights

### 🤖 Emotion-Aware AI Assistant
- GPT-4 powered chatbot that adapts to your emotions
- Dynamic tone, complexity, and empathy adjustments
- Context-aware responses based on emotional state
- Natural, conversational interactions

### 🎮 Advanced Controls
- **Start/Pause/Reset**: Full control over emotion analysis
- **Video Upload Mode**: Analyze pre-recorded videos (coming soon)
- **Data Export**: Export emotion data as CSV or JSON
- **Interactive Tooltips**: Helpful guidance throughout the interface

### 🔒 Privacy-First Design
- All emotion processing happens locally
- Images analyzed in real-time, never stored
- User controls all data export and deletion
- Transparent privacy indicators

### 🎨 Modern Glassmorphism UI
- Beautiful frosted glass design with smooth animations
- Professional gradient backgrounds
- Responsive 3-column layout
- Touch-friendly and accessible

## Tech Stack

### Frontend
- **React 18** (with Vite for fast development)
- **Tailwind CSS 3.4** (Glassmorphism styling)
- **Framer Motion** (smooth animations)
- **Recharts** (interactive emotion charts)
- **React Tooltip** (user guidance)
- **react-webcam** (webcam integration)
- **Axios** (API communication)

### Backend
- **FastAPI** (Python web framework)
- **DeepFace** (emotion recognition AI)
- **OpenCV** (image processing)
- **OpenAI GPT-4** (adaptive AI responses)
- **Uvicorn** (ASGI server)

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
#use it
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

### Quick Start

1. **Allow Webcam Access**: Grant permission when prompted
2. **Automatic Detection**: Emotion analysis starts automatically (every 3 seconds)
3. **View Analytics**: Watch the real-time emotion timeline chart
4. **Chat with AI**: Type messages and get emotion-aware responses
5. **Control Analysis**: Use Start/Pause/Reset buttons as needed
6. **Export Data**: Download your emotion data as CSV or JSON

### Using the Interface

#### Left Panel - AI Chat
- Type messages in the input field
- AI adapts responses to your current emotion
- View conversation history with emotion context

#### Middle Panel - Camera & Controls
- **Input Source**: Toggle between webcam and video upload
- **Live Camera**: See real-time emotion detection
- **Emotion Analysis**: Detailed breakdown of all emotions
- **Controls**: Start/Pause analysis, Reset history, Export data

#### Right Panel - Analytics
- **Timeline Chart**: Historical emotion trends
- **Interactive Visualization**: Hover for details
- **Statistics**: Average emotion levels over time

### Emotion-Aware AI Behavior

The AI adjusts its responses based on your detected emotion:
- **Happy** 😊 → Enthusiastic and engaging
- **Sad** 😢 → Empathetic and supportive
- **Angry** 😠 → Patient and calming
- **Confused** (Surprise) 😲 → Clear explanations with context
- **Fear** 😨 → Reassuring and step-by-step guidance
- **Disgust** 🤢 → Professional and neutral
- **Neutral** 😐 → Balanced and informative

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
│   │   │   ├── ChatPanel.jsx         # Chat interface
│   │   │   ├── CameraPanel.jsx       # Webcam & emotion display
│   │   │   ├── EmotionChart.jsx      # Analytics visualization
│   │   │   ├── ControlPanel.jsx      # Analysis controls
│   │   │   └── VideoUpload.jsx       # Input source selector
│   │   ├── App.jsx                   # Main application
│   │   ├── main.jsx                  # Entry point
│   │   ├── index.css                 # Global styles
│   │   └── api.js                    # API client
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── README.md                 # This file
├── USER_GUIDE.md            # Detailed user guide
├── ARCHITECTURE.md          # Technical architecture docs
├── PROJECT_SUMMARY.md       # Project overview
└── QUICKSTART.md            # Quick setup guide
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

## Future Enhancements

- [x] Real-time emotion analytics dashboard
- [x] Interactive emotion timeline chart
- [x] Data export (CSV/JSON)
- [x] Start/Pause/Reset controls
- [x] Comprehensive tooltips and guidance
- [ ] Video upload and analysis
- [ ] Speech synthesis (text-to-speech responses)
- [ ] Voice input mode
- [ ] Multiple language support
- [ ] Offline emotion detection model
- [ ] Chat history export
- [ ] Multi-person detection

## Documentation

- **[USER_GUIDE.md](USER_GUIDE.md)**: Comprehensive user manual with tips and troubleshooting
- **[ARCHITECTURE.md](ARCHITECTURE.md)**: Technical architecture, data flows, and API reference
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)**: Quick project overview and success criteria
- **[QUICKSTART.md](QUICKSTART.md)**: Fast setup guide for developers

## Performance Tips

1. **GPU Acceleration**: For better performance, install TensorFlow with GPU support
2. **Adjust Detection Frequency**: Modify the interval in `CameraPanel.jsx` (default: 3 seconds)
3. **Model Selection**: Change OpenAI model in `backend/main.py` (e.g., `gpt-3.5-turbo` for faster responses)
4. **Lighting**: Ensure good lighting for more accurate and faster emotion detection

## Privacy & Security

- All facial emotion processing happens locally on your machine
- Images are analyzed in real-time and not stored
- Only the detected emotion label is sent to the backend
- Your conversations are processed through OpenAI's API (subject to their privacy policy)


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

## Demo Scenario (2-Minute Walkthrough)

1. **Launch App** → Beautiful glassmorphism interface loads
2. **Grant Webcam Permission** → Camera feed appears
3. **Automatic Detection** → Emotion detected with confidence score
4. **View Analytics** → Real-time chart shows emotion trends
5. **Try Controls** → Pause/Resume analysis
6. **Chat with AI** → Ask "How do I learn React?"
7. **Observe Adaptation** → AI responds based on your emotion
8. **Change Expression** → Make different facial expressions
9. **Watch Chart Update** → Timeline shows emotion changes
10. **Export Data** → Download CSV for further analysis

---

**Built with React, FastAPI, DeepFace, and GPT-4**

Transform facial expressions into actionable insights! 🎭📊✨
