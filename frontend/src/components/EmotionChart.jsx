import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const emotionColors = {
  happy: '#FBBF24',
  sad: '#3B82F6',
  angry: '#EF4444',
  surprise: '#A855F7',
  fear: '#6B7280',
  disgust: '#10B981',
  neutral: '#9CA3AF',
};

const EmotionChart = ({ emotionHistory }) => {
  // Format data for the chart
  const chartData = emotionHistory.map((entry, index) => ({
    time: index,
    timeLabel: new Date(entry.timestamp).toLocaleTimeString(),
    happy: (entry.emotions.happy || 0) * 100,
    sad: (entry.emotions.sad || 0) * 100,
    angry: (entry.emotions.angry || 0) * 100,
    surprise: (entry.emotions.surprise || 0) * 100,
    fear: (entry.emotions.fear || 0) * 100,
    disgust: (entry.emotions.disgust || 0) * 100,
    neutral: (entry.emotions.neutral || 0) * 100,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-strong rounded-lg p-3 shadow-lg">
          <p className="text-white text-sm font-semibold mb-2">
            {payload[0]?.payload?.timeLabel}
          </p>
          {payload
            .sort((a, b) => b.value - a.value)
            .slice(0, 3)
            .map((entry) => (
              <p key={entry.name} className="text-xs" style={{ color: entry.color }}>
                {entry.name}: {entry.value.toFixed(1)}%
              </p>
            ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-strong rounded-3xl p-6 shadow-glow"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg">
          Emotion Timeline
        </h3>
        <div className="text-gray-400 text-sm">
          {emotionHistory.length} data points
        </div>
      </div>

      {emotionHistory.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
            <XAxis
              dataKey="time"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              label={{ value: 'Confidence %', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ color: '#fff' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="happy"
              stroke={emotionColors.happy}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="sad"
              stroke={emotionColors.sad}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="angry"
              stroke={emotionColors.angry}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="surprise"
              stroke={emotionColors.surprise}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[300px]">
          <p className="text-gray-400 text-sm">
            Emotion data will appear here as analysis runs...
          </p>
        </div>
      )}

      {/* Legend with current stats */}
      {emotionHistory.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(emotionColors).slice(0, 4).map(([emotion, color]) => {
              const avgValue = chartData.reduce((acc, curr) => acc + curr[emotion], 0) / chartData.length;
              return (
                <div key={emotion} className="text-center">
                  <div className="text-xs text-gray-400 capitalize mb-1">{emotion}</div>
                  <div className="text-lg font-semibold" style={{ color }}>
                    {avgValue.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-500">avg</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EmotionChart;
