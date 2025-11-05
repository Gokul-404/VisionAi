import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ChatPanel from './components/ChatPanel';
import CameraPanel from './components/CameraPanel';
import EmotionChart from './components/EmotionChart';
import ControlPanel from './components/ControlPanel';
import VideoUpload from './components/VideoUpload';

function App() {
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [inputMode, setInputMode] = useState('webcam'); // 'webcam' or 'video'
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleEmotionDetected = (emotion) => {
    setCurrentEmotion(emotion);
  };

  const handleEmotionHistory = (data) => {
    setEmotionHistory((prev) => [...prev, data]);
  };

  const handleToggleAnalysis = () => {
    setIsAnalyzing((prev) => !prev);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all emotion history?')) {
      setEmotionHistory([]);
      setCurrentEmotion('neutral');
    }
  };

  const handleExportCSV = () => {
    if (emotionHistory.length === 0) return;

    const headers = ['Timestamp', 'Time', 'Dominant Emotion', 'Confidence', 'Happy', 'Sad', 'Angry', 'Surprise', 'Fear', 'Disgust', 'Neutral'];
    const rows = emotionHistory.map((entry) => [
      entry.timestamp,
      new Date(entry.timestamp).toLocaleString(),
      entry.emotion,
      (entry.confidence * 100).toFixed(2) + '%',
      (entry.emotions.happy * 100).toFixed(2) + '%',
      (entry.emotions.sad * 100).toFixed(2) + '%',
      (entry.emotions.angry * 100).toFixed(2) + '%',
      (entry.emotions.surprise * 100).toFixed(2) + '%',
      (entry.emotions.fear * 100).toFixed(2) + '%',
      (entry.emotions.disgust * 100).toFixed(2) + '%',
      (entry.emotions.neutral * 100).toFixed(2) + '%',
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emotion-analysis-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (emotionHistory.length === 0) return;

    const jsonData = {
      exportDate: new Date().toISOString(),
      totalRecords: emotionHistory.length,
      duration: emotionHistory.length > 0 ? emotionHistory[emotionHistory.length - 1].timestamp - emotionHistory[0].timestamp : 0,
      data: emotionHistory.map((entry) => ({
        timestamp: entry.timestamp,
        time: new Date(entry.timestamp).toISOString(),
        dominantEmotion: entry.emotion,
        confidence: entry.confidence,
        allEmotions: entry.emotions,
      })),
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emotion-analysis-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleVideoSelect = (file) => {
    setSelectedVideo(file);
    // Video analysis logic would go here
    alert('Video analysis feature coming soon! For now, use webcam mode.');
  };

  const handleModeChange = (mode) => {
    setInputMode(mode);
    if (mode === 'webcam') {
      setSelectedVideo(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] via-[#2a2a3e] to-[#3e3e55] font-poppins">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Vision AI - Behaviour Analysis
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Real-time facial expression detection and emotion analytics
          </p>
        </motion.header>

        {/* Main panels - 3 column grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
          {/* Left Column - Chat */}
          <div className="h-full lg:col-span-1">
            <ChatPanel currentEmotion={currentEmotion} />
          </div>

          {/* Middle Column - Camera & Controls */}
          <div className="h-full lg:col-span-1 flex flex-col gap-4 overflow-y-auto">
            <VideoUpload
              onVideoSelect={handleVideoSelect}
              onModeChange={handleModeChange}
              currentMode={inputMode}
            />
            {inputMode === 'webcam' && (
              <CameraPanel
                onEmotionDetected={handleEmotionDetected}
                onEmotionHistory={handleEmotionHistory}
                isAnalyzing={isAnalyzing}
              />
            )}
            <ControlPanel
              isAnalyzing={isAnalyzing}
              onToggleAnalysis={handleToggleAnalysis}
              onReset={handleReset}
              onExportCSV={handleExportCSV}
              onExportJSON={handleExportJSON}
              emotionCount={emotionHistory.length}
            />
          </div>

          {/* Right Column - Analytics */}
          <div className="h-full lg:col-span-1 overflow-y-auto">
            <EmotionChart emotionHistory={emotionHistory} />
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-gray-500 text-sm">
            Built with React, FastAPI, and Emotion Recognition AI
          </p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
