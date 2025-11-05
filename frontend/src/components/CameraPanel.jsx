import React, { useRef, useCallback, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { detectEmotion } from '../api';

const emotionEmojis = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  surprise: '😲',
  fear: '😨',
  disgust: '🤢',
  neutral: '😐',
};

const emotionColors = {
  happy: 'from-yellow-400 to-orange-400',
  sad: 'from-blue-400 to-blue-600',
  angry: 'from-red-400 to-red-600',
  surprise: 'from-purple-400 to-pink-400',
  fear: 'from-gray-400 to-gray-600',
  disgust: 'from-green-400 to-green-600',
  neutral: 'from-gray-300 to-gray-400',
};

const CameraPanel = ({ onEmotionDetected }) => {
  const webcamRef = useRef(null);
  const [emotion, setEmotion] = useState('neutral');
  const [confidence, setConfidence] = useState(0);
  const [allEmotions, setAllEmotions] = useState({});
  const [isDetecting, setIsDetecting] = useState(false);

  const captureAndDetect = useCallback(async () => {
    if (webcamRef.current && !isDetecting) {
      setIsDetecting(true);
      const imageSrc = webcamRef.current.getScreenshot();

      if (imageSrc) {
        const result = await detectEmotion(imageSrc);

        if (result && !result.error) {
          setEmotion(result.emotion);
          setConfidence(result.confidence);
          setAllEmotions(result.all_emotions || {});

          // Pass emotion to parent
          if (onEmotionDetected) {
            onEmotionDetected(result.emotion);
          }
        }
      }

      setIsDetecting(false);
    }
  }, [isDetecting, onEmotionDetected]);

  useEffect(() => {
    // Detect emotion every 3 seconds
    const interval = setInterval(() => {
      captureAndDetect();
    }, 3000);

    return () => clearInterval(interval);
  }, [captureAndDetect]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full space-y-4"
    >
      {/* Camera Feed */}
      <div className="glass-strong rounded-3xl overflow-hidden shadow-glow flex-1 relative">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="w-full h-full object-cover"
          mirrored={true}
        />

        {/* Emotion Overlay */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 left-4 glass rounded-2xl px-4 py-2 flex items-center space-x-2"
        >
          <span className="text-4xl">{emotionEmojis[emotion]}</span>
          <div>
            <p className="text-white font-semibold capitalize">{emotion}</p>
            <p className="text-gray-300 text-sm">
              {(confidence * 100).toFixed(0)}% confidence
            </p>
          </div>
        </motion.div>

        {/* Detecting indicator */}
        {isDetecting && (
          <div className="absolute bottom-4 right-4 glass rounded-full px-3 py-1">
            <p className="text-white text-sm animate-pulse">Analyzing...</p>
          </div>
        )}
      </div>

      {/* Emotion Details */}
      <div className="glass-strong rounded-3xl p-6 shadow-glow">
        <h3 className="text-white font-semibold text-lg mb-4">
          Emotion Analysis
        </h3>

        {/* Emotion bars */}
        <div className="space-y-3">
          {Object.entries(allEmotions)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([emo, value]) => (
              <div key={emo}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300 capitalize flex items-center">
                    <span className="mr-2">{emotionEmojis[emo]}</span>
                    {emo}
                  </span>
                  <span className="text-white font-semibold">
                    {(value * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full bg-gradient-to-r ${emotionColors[emo]}`}
                  />
                </div>
              </div>
            ))}
        </div>

        {/* Privacy note */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-gray-400 text-xs text-center">
            🔒 All processing happens locally. No data is stored.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CameraPanel;
