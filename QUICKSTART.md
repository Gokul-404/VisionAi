# Quick Start Guide

Follow these steps to get the Emotion-Aware AI Assistant running in minutes!

## Step 1: Install Backend Dependencies

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

## Step 2: Set Up OpenAI API Key

1. Create a `.env` file in the `backend` directory
2. Add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

## Step 3: Install Frontend Dependencies

Open a **new terminal** and run:

```bash
cd frontend
npm install
```

## Step 4: Start the Backend

In the first terminal (backend directory):

```bash
uvicorn main:app --reload
```

Wait until you see: `Uvicorn running on http://127.0.0.1:8000`

## Step 5: Start the Frontend

In the second terminal (frontend directory):

```bash
npm run dev
```

The app should open automatically at `http://localhost:3000`

## Step 6: Allow Webcam Access

When prompted by your browser, click "Allow" to grant webcam access.

## You're Ready!

Start chatting with your emotion-aware AI assistant!

---

## Troubleshooting

**Backend won't start?**
- Make sure port 8000 is not in use
- Check that your OpenAI API key is valid

**Frontend can't connect?**
- Verify backend is running on port 8000
- Check browser console for errors

**Webcam not detected?**
- Allow permissions in browser settings
- Ensure no other app is using the camera

**Emotion detection not working?**
- Ensure good lighting
- Wait a few seconds for model to load
- Position face clearly in frame
