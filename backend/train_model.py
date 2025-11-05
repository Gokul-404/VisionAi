"""
Custom Lightweight Emotion Recognition Model Training Script

This script trains a fast, efficient CNN model on the FER2013 dataset
for real-time emotion recognition.

Dataset: FER2013 (available on Kaggle)
Download from: https://www.kaggle.com/datasets/msambare/fer2013
"""

import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
import os

# Emotion labels (7 classes)
EMOTIONS = ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise']

def create_lightweight_model(input_shape=(48, 48, 1), num_classes=7):
    """
    Create a lightweight CNN model optimized for speed.

    Architecture:
    - 4 Convolutional blocks (fewer than typical models)
    - Batch normalization for stability
    - Dropout for regularization
    - Global Average Pooling (faster than Flatten)
    - Fewer parameters = faster inference
    """
    model = models.Sequential([
        # Input layer
        layers.Input(shape=input_shape),

        # Block 1
        layers.Conv2D(32, (3, 3), padding='same'),
        layers.BatchNormalization(),
        layers.Activation('relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),

        # Block 2
        layers.Conv2D(64, (3, 3), padding='same'),
        layers.BatchNormalization(),
        layers.Activation('relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),

        # Block 3
        layers.Conv2D(128, (3, 3), padding='same'),
        layers.BatchNormalization(),
        layers.Activation('relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),

        # Block 4
        layers.Conv2D(256, (3, 3), padding='same'),
        layers.BatchNormalization(),
        layers.Activation('relu'),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.25),

        # Classifier
        layers.GlobalAveragePooling2D(),  # Much faster than Flatten + Dense
        layers.Dense(128, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(num_classes, activation='softmax')
    ])

    return model


def train_model(train_dir, val_dir, epochs=50, batch_size=64):
    """
    Train the emotion recognition model.

    Args:
        train_dir: Path to training data directory
        val_dir: Path to validation data directory
        epochs: Number of training epochs
        batch_size: Batch size for training
    """

    # Data augmentation for training (improves generalization)
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        zoom_range=0.2,
        shear_range=0.2,
        fill_mode='nearest'
    )

    # No augmentation for validation
    val_datagen = ImageDataGenerator(rescale=1./255)

    # Load training data
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(48, 48),
        batch_size=batch_size,
        color_mode='grayscale',
        class_mode='categorical',
        shuffle=True
    )

    # Load validation data
    val_generator = val_datagen.flow_from_directory(
        val_dir,
        target_size=(48, 48),
        batch_size=batch_size,
        color_mode='grayscale',
        class_mode='categorical',
        shuffle=False
    )

    # Create model
    print("Creating lightweight CNN model...")
    model = create_lightweight_model()

    # Compile with Adam optimizer
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    # Print model summary
    model.summary()
    print(f"\nTotal parameters: {model.count_params():,}")

    # Callbacks
    callbacks = [
        # Save best model
        ModelCheckpoint(
            'emotion_model_best.h5',
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        ),
        # Early stopping
        EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True,
            verbose=1
        ),
        # Reduce learning rate on plateau
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-7,
            verbose=1
        )
    ]

    # Train model
    print("\nStarting training...")
    history = model.fit(
        train_generator,
        epochs=epochs,
        validation_data=val_generator,
        callbacks=callbacks,
        verbose=1
    )

    # Save final model
    model.save('emotion_model_final.h5')
    print("\nModel saved as 'emotion_model_final.h5'")

    # Evaluate on validation set
    print("\nEvaluating on validation set...")
    val_loss, val_accuracy = model.evaluate(val_generator)
    print(f"Validation Loss: {val_loss:.4f}")
    print(f"Validation Accuracy: {val_accuracy:.4f}")

    return model, history


def convert_to_tflite(model_path='emotion_model_best.h5', output_path='emotion_model.tflite'):
    """
    Convert trained model to TensorFlow Lite for even faster inference.
    TFLite models are 4x smaller and 2-3x faster!
    """
    print(f"\nConverting {model_path} to TensorFlow Lite...")

    # Load model
    model = keras.models.load_model(model_path)

    # Convert to TFLite
    converter = tf.lite.TFLiteConverter.from_keras_model(model)

    # Optimizations for speed
    converter.optimizations = [tf.lite.Optimize.DEFAULT]

    # Convert
    tflite_model = converter.convert()

    # Save
    with open(output_path, 'wb') as f:
        f.write(tflite_model)

    print(f"TFLite model saved as '{output_path}'")
    print(f"Model size: {len(tflite_model) / 1024:.2f} KB")


if __name__ == '__main__':
    """
    Usage:
    1. Download FER2013 dataset from Kaggle
    2. Extract to: data/train/ and data/test/
    3. Structure should be:
       data/
         train/
           angry/
           disgust/
           fear/
           happy/
           neutral/
           sad/
           surprise/
         test/
           angry/
           ...
    4. Run: python train_model.py
    """

    # Configuration
    TRAIN_DIR = 'data/train'
    VAL_DIR = 'data/test'
    EPOCHS = 50
    BATCH_SIZE = 64

    # Check if data exists
    if not os.path.exists(TRAIN_DIR):
        print("ERROR: Training data not found!")
        print(f"Please download FER2013 dataset and extract to: {TRAIN_DIR}")
        print("\nQuick setup:")
        print("1. Go to: https://www.kaggle.com/datasets/msambare/fer2013")
        print("2. Download the dataset")
        print("3. Extract to create this structure:")
        print("   emotionrecognizer/backend/data/train/[emotion folders]")
        print("   emotionrecognizer/backend/data/test/[emotion folders]")
        exit(1)

    # Train model
    print("="*60)
    print("LIGHTWEIGHT EMOTION RECOGNITION MODEL TRAINING")
    print("="*60)
    model, history = train_model(TRAIN_DIR, VAL_DIR, EPOCHS, BATCH_SIZE)

    # Convert to TFLite for maximum speed
    print("\n" + "="*60)
    print("CONVERTING TO TENSORFLOW LITE")
    print("="*60)
    convert_to_tflite()

    print("\n✅ Training complete!")
    print("\nGenerated files:")
    print("  - emotion_model_best.h5 (best model during training)")
    print("  - emotion_model_final.h5 (final model)")
    print("  - emotion_model.tflite (optimized for speed)")
    print("\nUse emotion_model.tflite in production for fastest inference!")
