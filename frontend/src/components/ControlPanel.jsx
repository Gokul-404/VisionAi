import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from 'react-tooltip';

const ControlPanel = ({
  isAnalyzing,
  onToggleAnalysis,
  onReset,
  onExportCSV,
  onExportJSON,
  emotionCount
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-strong rounded-3xl p-6 shadow-glow"
    >
      <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
        Analysis Controls
        <span
          data-tooltip-id="control-tooltip"
          data-tooltip-content="Control emotion detection and export your data"
          className="ml-2 text-gray-400 text-sm cursor-help"
        >
          ⓘ
        </span>
      </h3>

      {/* Main Controls */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Start/Pause Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleAnalysis}
          className={`${
            isAnalyzing
              ? 'bg-gradient-to-r from-orange-500 to-red-600'
              : 'bg-gradient-to-r from-green-500 to-emerald-600'
          } text-white px-4 py-3 rounded-xl font-semibold shadow-glow transition-all flex items-center justify-center space-x-2`}
          data-tooltip-id="control-tooltip"
          data-tooltip-content={isAnalyzing ? "Pause emotion detection" : "Start emotion detection"}
        >
          <span className="text-xl">{isAnalyzing ? '⏸' : '▶'}</span>
          <span>{isAnalyzing ? 'Pause' : 'Start'}</span>
        </motion.button>

        {/* Reset Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="glass text-white px-4 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-center space-x-2"
          data-tooltip-id="control-tooltip"
          data-tooltip-content="Clear all emotion history and restart"
        >
          <span className="text-xl">🔄</span>
          <span>Reset</span>
        </motion.button>
      </div>

      {/* Export Controls */}
      <div className="mb-4">
        <div className="text-gray-300 text-sm mb-2 flex items-center">
          Export Data
          <span className="ml-2 text-gray-500 text-xs">({emotionCount} records)</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onExportCSV}
            disabled={emotionCount === 0}
            className="glass text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            data-tooltip-id="control-tooltip"
            data-tooltip-content="Download emotion data as CSV file"
          >
            <span>📊</span>
            <span>CSV</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onExportJSON}
            disabled={emotionCount === 0}
            className="glass text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            data-tooltip-id="control-tooltip"
            data-tooltip-content="Download emotion data as JSON file"
          >
            <span>📄</span>
            <span>JSON</span>
          </motion.button>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm">Status:</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-white text-sm font-medium">
              {isAnalyzing ? 'Analyzing' : 'Paused'}
            </span>
          </div>
        </div>
      </div>

      {/* Tooltip component */}
      <Tooltip
        id="control-tooltip"
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

export default ControlPanel;
