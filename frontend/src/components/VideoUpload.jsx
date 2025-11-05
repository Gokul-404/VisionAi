import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';

const VideoUpload = ({ onVideoSelect, onModeChange, currentMode }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      onVideoSelect(file);
    } else {
      alert('Please select a valid video file');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      onVideoSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-strong rounded-3xl p-6 shadow-glow"
    >
      <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
        Input Source
        <span
          data-tooltip-id="video-tooltip"
          data-tooltip-content="Choose between live webcam or upload a video file"
          className="ml-2 text-gray-400 text-sm cursor-help"
        >
          ⓘ
        </span>
      </h3>

      {/* Mode Toggle */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onModeChange('webcam')}
          className={`${
            currentMode === 'webcam'
              ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
              : 'glass text-gray-300'
          } px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2`}
        >
          <span className="text-xl">📹</span>
          <span>Webcam</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onModeChange('video')}
          className={`${
            currentMode === 'video'
              ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
              : 'glass text-gray-300'
          } px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2`}
        >
          <span className="text-xl">🎥</span>
          <span>Upload</span>
        </motion.button>
      </div>

      {/* Video Upload Area */}
      {currentMode === 'video' && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/30 rounded-2xl p-8 cursor-pointer hover:border-purple-500 transition-all"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {selectedFile ? (
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <p className="text-white font-medium mb-1">{selectedFile.name}</p>
              <p className="text-gray-400 text-sm mb-3">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <p className="text-purple-400 text-xs">Click to change file</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-3">📁</div>
              <p className="text-white font-medium mb-1">Drop video here</p>
              <p className="text-gray-400 text-sm">or click to browse</p>
              <p className="text-gray-500 text-xs mt-2">Supports MP4, AVI, MOV, WebM</p>
            </div>
          )}
        </div>
      )}

      <Tooltip
        id="video-tooltip"
        place="top"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '12px',
          zIndex: 1000
        }}
      />
    </motion.div>
  );
};

export default VideoUpload;
