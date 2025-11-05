import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Detect emotion from base64 image
 * @param {string} imageBase64 - Base64 encoded image
 * @returns {Promise} Emotion detection result
 */
export const detectEmotion = async (imageBase64) => {
  try {
    const formData = new FormData();
    formData.append('image', imageBase64);

    const response = await axios.post(`${API_BASE_URL}/api/emotion`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error detecting emotion:', error);
    return { emotion: 'neutral', confidence: 0.0, error: error.message };
  }
};

/**
 * Send chat message with emotion context
 * @param {string} message - User message
 * @param {string} emotion - Detected emotion
 * @returns {Promise} AI response
 */
export const sendChatMessage = async (message, emotion = 'neutral') => {
  try {
    const response = await api.post('/api/chat', {
      message,
      emotion,
    });

    return response.data;
  } catch (error) {
    console.error('Error sending chat message:', error);
    return {
      response: 'Sorry, I encountered an error. Please try again.',
      error: error.message,
    };
  }
};

export default api;
