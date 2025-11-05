# Vision AI - Behaviour Analysis: User Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Features Overview](#features-overview)
4. [Step-by-Step Usage](#step-by-step-usage)
5. [Understanding the Interface](#understanding-the-interface)
6. [Exporting Data](#exporting-data)
7. [Tips for Best Results](#tips-for-best-results)
8. [Troubleshooting](#troubleshooting)

## Introduction

Welcome to Vision AI - Behaviour Analysis! This application uses advanced computer vision and artificial intelligence to detect and analyze facial expressions in real-time, providing detailed emotion analytics and adaptive AI responses.

### What Can You Do?

- **Real-time Emotion Detection**: Analyze facial expressions from your webcam
- **Interactive Analytics**: View emotion trends over time with beautiful charts
- **Smart AI Companion**: Chat with an AI that adapts to your emotional state
- **Data Export**: Export your emotion data for further analysis
- **Privacy-First**: All emotion processing happens locally on your machine

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- Webcam access
- Internet connection (for AI chat features)

### First Launch

1. **Start the Application**: Open your browser to `http://localhost:3000`
2. **Grant Webcam Permission**: Click "Allow" when prompted for webcam access
3. **Wait for Initialization**: The emotion detection model will load (2-3 seconds)
4. **You're Ready!**: The app will start analyzing your emotions automatically

## Features Overview

### 1. Emotion-Aware Chat (Left Panel)
- Chat with an AI assistant that adapts its responses based on your current emotion
- The AI adjusts its tone, complexity, and empathy level
- Each message shows which emotion you were feeling

### 2. Camera & Controls (Middle Panel)

#### Input Source Selector
- **Webcam Mode**: Live real-time emotion detection
- **Upload Mode**: Analyze pre-recorded videos (coming soon)

#### Live Camera Feed
- Shows your webcam feed with real-time emotion overlay
- Displays current emotion, confidence level, and emoji
- Updates every 3 seconds

#### Emotion Analysis Panel
- Shows detailed breakdown of all 7 emotions
- Visual bars represent confidence levels
- Top 5 emotions displayed in real-time

#### Control Panel
- **Start/Pause**: Control emotion detection
- **Reset**: Clear all emotion history
- **Export CSV**: Download data as spreadsheet
- **Export JSON**: Download data as structured JSON
- **Status Indicator**: Shows if analysis is active

### 3. Emotion Timeline (Right Panel)
- Interactive line chart showing emotion trends over time
- Hover over points to see detailed breakdown
- Average emotion statistics
- Color-coded by emotion type

## Step-by-Step Usage

### Basic Workflow

1. **Position Yourself**
   - Sit in front of your webcam
   - Ensure good lighting (face clearly visible)
   - Look at the camera naturally

2. **Start Detection**
   - Emotion detection starts automatically
   - Green "Analyzing" status indicates active detection
   - Emotion updates every 3 seconds

3. **View Results**
   - Current emotion shown in camera overlay
   - Detailed breakdown in Analysis panel
   - Timeline chart updates automatically

4. **Chat with AI**
   - Type your message in the chat panel
   - AI responds based on your current emotion
   - Each exchange is emotionally contextualized

5. **Export Data**
   - Click "CSV" or "JSON" in Control Panel
   - File downloads automatically
   - Includes all emotion history with timestamps

### Advanced Usage

#### Pausing Analysis
- Click "Pause" button to stop detection
- Useful when stepping away from camera
- Resume anytime by clicking "Start"

#### Resetting Session
- Click "Reset" to clear all history
- Confirms before deleting data
- Starts fresh analysis session

#### Analyzing Trends
- Watch the timeline chart for patterns
- Identify emotional changes over time
- Use average statistics for overall analysis

## Understanding the Interface

### Emotion Types

The system detects 7 distinct emotions:

1. **Happy** 😊 - Yellow/Orange
   - Smiling, positive expressions
   - AI responds with enthusiasm

2. **Sad** 😢 - Blue
   - Frowning, downcast expressions
   - AI responds with empathy

3. **Angry** 😠 - Red
   - Furrowed brows, tense expressions
   - AI responds with patience

4. **Surprise** 😲 - Purple/Pink
   - Wide eyes, open mouth
   - AI responds with engagement

5. **Fear** 😨 - Gray
   - Worried, anxious expressions
   - AI responds with reassurance

6. **Disgust** 🤢 - Green
   - Nose wrinkled, disapproval
   - AI responds neutrally

7. **Neutral** 😐 - Gray
   - Relaxed, baseline expression
   - AI responds professionally

### Confidence Scores

- **0-30%**: Low confidence (may be inaccurate)
- **30-60%**: Moderate confidence
- **60-100%**: High confidence (most reliable)

### Visual Indicators

- **Pulsing Green Dot**: Analysis active
- **Gray Dot**: Analysis paused
- **"Analyzing..." Badge**: Currently processing
- **Chart Line**: Historical emotion data

## Exporting Data

### CSV Format
Perfect for spreadsheets and data analysis tools.

**Columns:**
- Timestamp (Unix timestamp)
- Time (Human-readable)
- Dominant Emotion
- Confidence
- Individual emotion percentages (Happy, Sad, Angry, etc.)

**Use Cases:**
- Import into Excel/Google Sheets
- Statistical analysis
- Creating custom visualizations

### JSON Format
Ideal for developers and programmatic analysis.

**Structure:**
```json
{
  "exportDate": "2025-11-05T...",
  "totalRecords": 150,
  "duration": 450000,
  "data": [
    {
      "timestamp": 1699200000000,
      "time": "2025-11-05T12:00:00Z",
      "dominantEmotion": "happy",
      "confidence": 0.89,
      "allEmotions": {
        "happy": 0.89,
        "neutral": 0.06,
        ...
      }
    }
  ]
}
```

**Use Cases:**
- Custom data processing
- Machine learning datasets
- Integration with other tools

## Tips for Best Results

### Lighting
- ✅ Bright, even lighting from front
- ✅ Natural daylight or good room lighting
- ❌ Avoid backlighting (window behind you)
- ❌ Avoid harsh shadows on face

### Camera Position
- ✅ Camera at eye level
- ✅ Face fully visible
- ✅ 1-2 feet from camera
- ❌ Avoid extreme angles
- ❌ Don't cover parts of face

### Environment
- ✅ Stable, non-moving background
- ✅ Quiet space for focused analysis
- ❌ Avoid busy backgrounds
- ❌ Multiple faces in frame may affect accuracy

### For Accurate Detection
- Make natural expressions
- Allow 3 seconds per detection cycle
- Stay relatively still during capture
- Ensure glasses/accessories don't obscure face

## Troubleshooting

### Webcam Not Working

**Problem**: No video feed appears

**Solutions:**
1. Check browser permissions (click lock icon in address bar)
2. Close other apps using webcam
3. Refresh the page
4. Try a different browser

### Low Accuracy

**Problem**: Emotions detected don't match your expression

**Solutions:**
1. Improve lighting conditions
2. Position face clearly in frame
3. Make more pronounced expressions
4. Wait for confidence score above 60%

### Chart Not Updating

**Problem**: Timeline chart shows no data

**Solutions:**
1. Ensure analysis is running (green status)
2. Wait for at least one detection cycle (3 seconds)
3. Check that camera feed is active

### AI Chat Not Responding

**Problem**: Messages don't get replies

**Solutions:**
1. Check internet connection
2. Verify backend server is running (port 8000)
3. Check browser console for errors
4. Ensure OpenAI API key is configured

### Export Not Working

**Problem**: CSV/JSON files don't download

**Solutions:**
1. Ensure you have emotion data recorded
2. Check browser download settings
3. Allow popups/downloads from localhost
4. Try different browser

### Performance Issues

**Problem**: App is slow or laggy

**Solutions:**
1. Close unnecessary browser tabs
2. Ensure good CPU/GPU availability
3. Reduce detection frequency (modify code)
4. Use lighter AI model (modify backend)

## Privacy & Security

### What's Collected
- Facial emotion data (processed locally)
- Chat messages (sent to OpenAI API)
- Timestamps and statistics

### What's NOT Stored
- ✅ Webcam images are NOT saved
- ✅ Face photos are NOT stored
- ✅ Data is NOT uploaded anywhere
- ✅ All processing is local (except AI chat)

### Your Data
- Emotion history stored in browser memory only
- Cleared on page refresh (unless exported)
- Export files saved to your downloads folder
- You have full control over your data

## Getting Help

### Resources
- **README.md**: Installation and setup instructions
- **PROJECT_SUMMARY.md**: Technical overview
- **API Documentation**: Backend endpoint details

### Common Questions

**Q: How accurate is the emotion detection?**
A: Accuracy varies (60-95%) based on lighting, expression clarity, and individual facial features. Higher confidence scores indicate better accuracy.

**Q: Can I use this offline?**
A: Emotion detection works offline. AI chat requires internet connection.

**Q: Does this work on mobile?**
A: Currently optimized for desktop. Mobile support coming soon.

**Q: Can I analyze multiple people?**
A: Currently single-person detection. Multi-face support planned.

**Q: How much data is generated?**
A: Each detection is ~200 bytes. 1 hour ≈ 1.5 MB of data.

---

**Enjoy exploring your emotions with Vision AI!** 🎭✨

For technical support or feature requests, please refer to the project documentation.
