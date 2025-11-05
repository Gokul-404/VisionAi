# Vision AI - Behaviour Analysis: Technical Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                            │
│  ┌────────────┐  ┌────────────────┐  ┌──────────────────────┐  │
│  │   Chat     │  │ Camera/Controls│  │  Analytics Dashboard │  │
│  │   Panel    │  │     Panel      │  │   (Emotion Chart)    │  │
│  └─────┬──────┘  └────────┬───────┘  └──────────┬───────────┘  │
│        │                  │                      │               │
│        └──────────┬───────┴──────────────────────┘               │
│                   │                                              │
│              React App (Vite)                                    │
└───────────────────┼──────────────────────────────────────────────┘
                    │ HTTP/REST API
┌───────────────────┼──────────────────────────────────────────────┐
│              FastAPI Backend                                     │
│  ┌────────────────┴────────────┐  ┌──────────────────────────┐  │
│  │   /api/emotion              │  │    /api/chat             │  │
│  │   - Image Processing        │  │    - Emotion Context     │  │
│  │   - Face Detection          │  │    - Adaptive Prompting  │  │
│  │   - Emotion Classification  │  │                          │  │
│  └──────────┬──────────────────┘  └──────────┬───────────────┘  │
│             │                                 │                  │
│  ┌──────────┴──────────┐           ┌─────────┴───────────────┐  │
│  │  DeepFace Library   │           │   OpenAI GPT-4 API      │  │
│  │  - CNN Model        │           │   - Emotion-Aware       │  │
│  │  - MTCNN Detector   │           │   - Response Generation │  │
│  └─────────────────────┘           └─────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend (React + Vite)

#### Core Components

1. **App.jsx** - Main Application Container
   - State management for emotion history
   - Orchestrates component communication
   - Handles data export logic
   - Manages analysis controls

2. **ChatPanel.jsx** - AI Chat Interface
   - Message history management
   - Real-time emotion-aware messaging
   - Smooth animations with Framer Motion
   - Auto-scroll behavior

3. **CameraPanel.jsx** - Webcam & Detection
   - Webcam stream management
   - Periodic emotion detection (3s intervals)
   - Real-time emotion overlay
   - Detailed emotion breakdown visualization

4. **EmotionChart.jsx** - Analytics Visualization
   - Interactive line chart (Recharts)
   - Historical emotion tracking
   - Custom tooltips
   - Average statistics calculation

5. **ControlPanel.jsx** - Analysis Controls
   - Start/Pause/Reset functionality
   - CSV/JSON export triggers
   - Status indicators
   - Tooltips for user guidance

6. **VideoUpload.jsx** - Input Source Manager
   - Webcam/Video mode switching
   - Drag-and-drop file upload
   - File validation
   - Future: Video playback controls

#### State Management

```javascript
// Central State in App.jsx
{
  currentEmotion: string,        // Latest detected emotion
  emotionHistory: Array<{        // Time-series emotion data
    timestamp: number,
    emotion: string,
    confidence: number,
    emotions: {
      happy: number,
      sad: number,
      // ... all 7 emotions
    }
  }>,
  isAnalyzing: boolean,          // Detection active/paused
  inputMode: 'webcam' | 'video', // Input source
  selectedVideo: File | null     // Uploaded video file
}
```

#### Data Flow

```
User Action → Component Event → State Update → Re-render
     ↓
Webcam Capture (every 3s)
     ↓
API Call: /api/emotion
     ↓
Update State: currentEmotion, emotionHistory
     ↓
Re-render: CameraPanel, EmotionChart
     ↓
User sends chat message
     ↓
API Call: /api/chat (with current emotion)
     ↓
Display adaptive AI response
```

### Backend (FastAPI + Python)

#### API Endpoints

##### POST /api/emotion

**Purpose**: Detect emotion from webcam image

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Processing:**
1. Decode base64 image
2. Convert to OpenCV format
3. Run DeepFace.analyze()
4. Extract emotion scores
5. Return structured response

**Response:**
```json
{
  "emotion": "happy",
  "confidence": 0.89,
  "all_emotions": {
    "happy": 0.89,
    "sad": 0.02,
    "angry": 0.01,
    "surprise": 0.03,
    "fear": 0.01,
    "disgust": 0.01,
    "neutral": 0.03
  }
}
```

**Error Handling:**
- Returns "neutral" with 0 confidence on error
- Includes error message for debugging
- enforce_detection=False (works even without clear face)

##### POST /api/chat

**Purpose**: Generate emotion-adaptive AI response

**Request:**
```json
{
  "message": "How do I learn React?",
  "emotion": "confused"
}
```

**Processing:**
1. Select emotion-specific system prompt
2. Construct OpenAI API request
3. Include emotion context
4. Generate adaptive response

**Response:**
```json
{
  "response": "I'll help you learn React step by step...",
  "emotion_detected": "confused"
}
```

**Emotion Prompt Strategies:**

| Emotion  | AI Tone & Approach |
|----------|-------------------|
| Happy    | Enthusiastic, engaging, conversational |
| Sad      | Gentle, empathetic, supportive |
| Angry    | Patient, calm, understanding |
| Confused | Simplified, clear, uses analogies |
| Fear     | Reassuring, step-by-step guidance |
| Disgust  | Professional, neutral, factual |
| Neutral  | Balanced, thorough, friendly |

#### Core Dependencies

```python
# Computer Vision & AI
deepface      # Emotion detection model
opencv-python # Image processing
tensorflow    # Deep learning backend

# API Framework
fastapi       # Modern Python web framework
uvicorn       # ASGI server
python-dotenv # Environment management

# AI Integration
openai        # GPT-4 API client
```

## Data Models

### Emotion Detection Result

```typescript
interface EmotionResult {
  emotion: string;              // Dominant emotion
  confidence: number;           // 0.0 to 1.0
  all_emotions: {
    happy: number;
    sad: number;
    angry: number;
    surprise: number;
    fear: number;
    disgust: number;
    neutral: number;
  };
  error?: string;               // Optional error message
}
```

### Emotion History Entry

```typescript
interface EmotionHistoryEntry {
  timestamp: number;            // Unix timestamp (ms)
  emotion: string;              // Dominant emotion
  confidence: number;           // 0.0 to 1.0
  emotions: EmotionScores;      // All emotion scores
}
```

### Chat Message

```typescript
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  emotion?: string;             // User's emotion at time of message
}
```

## Performance Characteristics

### Frontend Performance

| Metric | Value | Notes |
|--------|-------|-------|
| Initial Load | 1-2s | Includes React bundle, libraries |
| Webcam Init | 0.5-1s | Browser permission + stream setup |
| Chart Render | 50-100ms | Recharts rendering |
| State Update | 10-30ms | React re-render cycle |

### Backend Performance

| Metric | Value | Notes |
|--------|-------|-------|
| DeepFace Init | 2-3s | First request only (model load) |
| Emotion Detection | 300-800ms | Per image, depends on face clarity |
| OpenAI API Call | 1-3s | Network + GPT-4 generation |
| Image Processing | 50-100ms | Base64 decode + OpenCV |

### Data Storage

| Component | Size | Persistence |
|-----------|------|-------------|
| Emotion Entry | ~200 bytes | Browser memory only |
| 1 Hour Session | ~1.5 MB | Cleared on refresh |
| Exported CSV | Variable | User's download folder |
| Exported JSON | Variable | User's download folder |

## Security & Privacy

### Data Handling

```
┌──────────────────────────────────────────────────┐
│  Webcam Image Capture                            │
│  ↓                                                │
│  Base64 Encoding (Frontend)                      │
│  ↓                                                │
│  HTTP POST to /api/emotion                       │
│  ↓                                                │
│  DeepFace Analysis (Backend)                     │
│  ↓                                                │
│  Extract Emotion Scores                          │
│  ↓                                                │
│  ❌ IMAGE DISCARDED (not stored)                 │
│  ↓                                                │
│  Return JSON Response                            │
│  ↓                                                │
│  Store in emotionHistory (browser memory)        │
└──────────────────────────────────────────────────┘
```

**Privacy Guarantees:**
- ✅ Images processed in real-time, never saved
- ✅ No server-side storage of images
- ✅ Emotion data stored in browser memory only
- ✅ User controls data export and deletion
- ⚠️ Chat messages sent to OpenAI API

### Security Measures

1. **CORS Configuration**
   - Allows frontend-backend communication
   - Currently allows all origins (development)
   - Should restrict in production

2. **API Key Management**
   - OpenAI key stored in .env file
   - Never exposed to frontend
   - Loaded via environment variables

3. **Input Validation**
   - Image format validation
   - Base64 decoding error handling
   - Message content sanitization

## Scalability Considerations

### Current Limitations

- **Single User**: Designed for one person at a time
- **Browser Memory**: Limited emotion history storage
- **No Persistence**: Data cleared on page refresh
- **Synchronous Processing**: Sequential emotion detection

### Future Enhancements

1. **Multi-User Support**
   - User authentication
   - Session management
   - Per-user data isolation

2. **Database Integration**
   - PostgreSQL/MongoDB for persistence
   - Historical analysis across sessions
   - Long-term trend tracking

3. **Real-Time Processing**
   - WebSocket connections
   - Streaming emotion data
   - Live multi-person detection

4. **Video Analysis**
   - Upload and process video files
   - Frame-by-frame emotion extraction
   - Video timeline visualization

5. **Advanced Analytics**
   - Emotion pattern recognition
   - Behavioral insights
   - Predictive analytics

## Development Workflow

### Local Development Setup

```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### Build & Deployment

```bash
# Frontend Production Build
cd frontend
npm run build
# Output: dist/ folder

# Backend Deployment (Example: Docker)
cd backend
docker build -t emotion-ai-backend .
docker run -p 8000:8000 --env-file .env emotion-ai-backend
```

## Testing Strategy

### Unit Tests (Recommended)

**Frontend:**
- Component rendering tests (Jest + React Testing Library)
- State management logic
- Export functionality
- Chart data transformation

**Backend:**
- Emotion detection endpoint
- Chat endpoint
- Error handling
- Image processing utilities

### Integration Tests

- End-to-end webcam → detection → UI update
- Chat message → emotion context → AI response
- Export → file generation → download

### Manual Testing Checklist

- [ ] Webcam permission grant
- [ ] Emotion detection accuracy
- [ ] Chart updates in real-time
- [ ] Start/Pause functionality
- [ ] Reset clears history
- [ ] CSV export downloads correctly
- [ ] JSON export structure valid
- [ ] AI chat responds appropriately
- [ ] Tooltips display on hover
- [ ] Responsive design on different screens

## Technology Stack Summary

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 10
- **Charts**: Recharts
- **Tooltips**: React Tooltip
- **Webcam**: react-webcam 7.2
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI
- **Server**: Uvicorn (ASGI)
- **AI Model**: DeepFace
- **Image Processing**: OpenCV
- **LLM**: OpenAI GPT-4 Turbo
- **Environment**: Python-dotenv

### Development Tools
- **Version Control**: Git
- **Package Managers**: npm (frontend), pip (backend)
- **Code Editor**: Any (VS Code recommended)

## API Reference Quick Guide

### Base URL
```
http://localhost:8000
```

### Headers (All Requests)
```
Content-Type: application/json
```

### Emotion Detection
```http
POST /api/emotion
Content-Type: application/x-www-form-urlencoded

image=data:image/jpeg;base64,...
```

### Chat Completion
```http
POST /api/chat
Content-Type: application/json

{
  "message": "string",
  "emotion": "happy|sad|angry|surprise|fear|disgust|neutral"
}
```

---

## Architecture Decisions & Rationale

### Why DeepFace?
- Pre-trained on large emotion datasets
- Supports multiple detection backends
- Easy integration with Python
- Good accuracy for real-time use

### Why React + Vite?
- Fast development with HMR
- Modern build tool (faster than CRA)
- Great developer experience
- Excellent ecosystem

### Why FastAPI?
- Modern Python web framework
- Automatic API documentation
- Type hints and validation
- High performance (async support)

### Why Glassmorphism UI?
- Modern, professional appearance
- Excellent for data dashboards
- Good visual hierarchy
- Trendy in 2024-2025

### Why Client-Side State?
- Simplifies architecture
- No database needed
- Fast user experience
- Easy to implement

---

**This architecture supports the core requirements while remaining extensible for future enhancements.**
