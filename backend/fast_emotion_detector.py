"""
Fast Emotion Recognition using Custom Trained Model

This module provides lightning-fast emotion detection using a lightweight
custom-trained CNN model instead of DeepFace.

Performance: ~50-200ms per detection (10x faster than DeepFace!)
"""

import cv2
import numpy as np
import tensorflow as tf
from tensorflow import keras

class FastEmotionDetector:
    """
    Lightweight emotion detector optimized for real-time performance.
    """

    EMOTIONS = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']

    def __init__(self, model_path='emotion_model_best.h5', use_tflite=False):
        """
        Initialize the emotion detector.

        Args:
            model_path: Path to trained model (.h5 or .tflite)
            use_tflite: If True, use TFLite model (2-3x faster!)
        """
        self.use_tflite = use_tflite

        if use_tflite:
            # Load TFLite model (fastest option)
            self.interpreter = tf.lite.Interpreter(model_path=model_path.replace('.h5', '.tflite'))
            self.interpreter.allocate_tensors()
            self.input_details = self.interpreter.get_input_details()
            self.output_details = self.interpreter.get_output_details()
            print("✅ Loaded TFLite model (optimized for speed)")
        else:
            # Load Keras model
            self.model = keras.models.load_model(model_path)
            print("✅ Loaded Keras model")

        # Load OpenCV face detector (Haar Cascade - very fast!)
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )

    def detect_faces(self, img):
        """
        Detect faces in image using Haar Cascade (faster than MTCNN).

        Args:
            img: BGR image from OpenCV

        Returns:
            List of face bounding boxes [(x, y, w, h), ...]
        """
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Detect faces
        faces = self.face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(48, 48),
            flags=cv2.CASCADE_SCALE_IMAGE
        )

        return faces

    def preprocess_face(self, img, face_coords):
        """
        Extract and preprocess face region for model input.

        Args:
            img: BGR image
            face_coords: (x, y, w, h) face coordinates

        Returns:
            Preprocessed face image (48x48 grayscale, normalized)
        """
        x, y, w, h = face_coords

        # Extract face region with some padding
        padding = int(0.1 * w)
        x1 = max(0, x - padding)
        y1 = max(0, y - padding)
        x2 = min(img.shape[1], x + w + padding)
        y2 = min(img.shape[0], y + h + padding)

        face = img[y1:y2, x1:x2]

        # Convert to grayscale
        if len(face.shape) == 3:
            face = cv2.cvtColor(face, cv2.COLOR_BGR2GRAY)

        # Resize to 48x48 (model input size)
        face = cv2.resize(face, (48, 48))

        # Normalize to [0, 1]
        face = face.astype('float32') / 255.0

        # Add channel dimension
        face = np.expand_dims(face, axis=-1)

        # Add batch dimension
        face = np.expand_dims(face, axis=0)

        return face

    def predict_emotion_tflite(self, face_img):
        """
        Predict emotion using TFLite model (fastest).

        Args:
            face_img: Preprocessed face image

        Returns:
            emotion_probs: Array of emotion probabilities
        """
        # Set input tensor
        self.interpreter.set_tensor(self.input_details[0]['index'], face_img)

        # Run inference
        self.interpreter.invoke()

        # Get output
        emotion_probs = self.interpreter.get_tensor(self.output_details[0]['index'])[0]

        return emotion_probs

    def predict_emotion_keras(self, face_img):
        """
        Predict emotion using Keras model.

        Args:
            face_img: Preprocessed face image

        Returns:
            emotion_probs: Array of emotion probabilities
        """
        emotion_probs = self.model.predict(face_img, verbose=0)[0]
        return emotion_probs

    def analyze(self, img):
        """
        Detect face and predict emotion.

        Args:
            img: BGR image from OpenCV

        Returns:
            dict with emotion results, matching DeepFace format:
            {
                'emotion': 'happy',
                'confidence': 0.89,
                'all_emotions': {'happy': 0.89, 'sad': 0.02, ...}
            }
        """
        # Detect faces
        faces = self.detect_faces(img)

        if len(faces) == 0:
            # No face detected, return neutral
            return {
                'emotion': 'neutral',
                'confidence': 0.0,
                'all_emotions': {emotion: 0.0 for emotion in self.EMOTIONS}
            }

        # Use first detected face
        face_coords = faces[0]

        # Preprocess face
        face_img = self.preprocess_face(img, face_coords)

        # Predict emotion
        if self.use_tflite:
            emotion_probs = self.predict_emotion_tflite(face_img)
        else:
            emotion_probs = self.predict_emotion_keras(face_img)

        # Get dominant emotion
        emotion_idx = np.argmax(emotion_probs)
        dominant_emotion = self.EMOTIONS[emotion_idx]
        confidence = float(emotion_probs[emotion_idx])

        # Create emotion dictionary
        all_emotions = {
            emotion: float(prob)
            for emotion, prob in zip(self.EMOTIONS, emotion_probs)
        }

        return {
            'emotion': dominant_emotion,
            'confidence': confidence,
            'all_emotions': all_emotions
        }


# Singleton instance for reuse
_detector_instance = None

def get_detector(model_path='emotion_model_best.h5', use_tflite=True):
    """
    Get or create FastEmotionDetector instance (singleton pattern).

    Args:
        model_path: Path to model file
        use_tflite: Whether to use TFLite (recommended for speed)

    Returns:
        FastEmotionDetector instance
    """
    global _detector_instance

    if _detector_instance is None:
        _detector_instance = FastEmotionDetector(model_path, use_tflite)

    return _detector_instance


# Example usage and benchmarking
if __name__ == '__main__':
    import time

    print("="*60)
    print("FAST EMOTION DETECTOR - BENCHMARK")
    print("="*60)

    # Test with sample image
    # Replace with actual image path
    test_image_path = 'test_face.jpg'

    if not os.path.exists(test_image_path):
        print("\n⚠️  No test image found. Creating sample...")
        # Create blank test image
        img = np.zeros((480, 640, 3), dtype=np.uint8)
        cv2.rectangle(img, (200, 100), (440, 380), (255, 255, 255), -1)
    else:
        img = cv2.imread(test_image_path)

    # Test TFLite model
    print("\n1. Testing TFLite model (fastest)...")
    try:
        detector_tflite = FastEmotionDetector(use_tflite=True)

        # Warmup
        _ = detector_tflite.analyze(img)

        # Benchmark
        times = []
        for _ in range(10):
            start = time.time()
            result = detector_tflite.analyze(img)
            times.append((time.time() - start) * 1000)

        avg_time = np.mean(times)
        print(f"   Average inference time: {avg_time:.1f}ms")
        print(f"   Detected emotion: {result['emotion']} ({result['confidence']:.2%})")
    except Exception as e:
        print(f"   ⚠️  TFLite model not available: {e}")

    # Test Keras model
    print("\n2. Testing Keras model...")
    try:
        detector_keras = FastEmotionDetector(use_tflite=False)

        # Warmup
        _ = detector_keras.analyze(img)

        # Benchmark
        times = []
        for _ in range(10):
            start = time.time()
            result = detector_keras.analyze(img)
            times.append((time.time() - start) * 1000)

        avg_time = np.mean(times)
        print(f"   Average inference time: {avg_time:.1f}ms")
        print(f"   Detected emotion: {result['emotion']} ({result['confidence']:.2%})")
    except Exception as e:
        print(f"   ⚠️  Keras model not available: {e}")

    print("\n" + "="*60)
    print("✅ Benchmark complete!")
    print("\nExpected performance:")
    print("  - TFLite: 50-150ms per frame")
    print("  - Keras: 100-250ms per frame")
    print("  - DeepFace: 800-1500ms per frame")
    print("\n💡 Recommendation: Use TFLite for production (3-10x faster!)")
