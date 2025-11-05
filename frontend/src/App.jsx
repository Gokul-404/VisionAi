import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ChatPanel from './components/ChatPanel';
import CameraPanel from './components/CameraPanel';

function App() {
  const [currentEmotion, setCurrentEmotion] = useState('neutral');

  const handleEmotionDetected = (emotion) => {
    setCurrentEmotion(emotion);
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
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-2 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Emotion-Aware AI Assistant
          </h1>
          <p className="text-gray-400 text-lg">
            An intelligent chatbot that adapts to your emotions in real-time
          </p>
        </motion.header>

        {/* Main panels */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
          {/* Chat Panel */}
          <div className="h-full">
            <ChatPanel currentEmotion={currentEmotion} />
          </div>

          {/* Camera Panel */}
          <div className="h-full">
            <CameraPanel onEmotionDetected={handleEmotionDetected} />
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
