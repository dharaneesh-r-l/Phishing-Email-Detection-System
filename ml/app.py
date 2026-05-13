
import os
import pickle
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import re

app = Flask(__name__)

MODEL_PATH = "ml/phishing_model.h5"
TOKENIZER_PATH = "ml/tokenizer.pickle"
MAX_WORDS = 1000
MAX_LEN = 150

# Dummy data for demo training
texts = [
    "Verify your bank account now", "Click here to claim your prize", "Urgent update required",
    "Your account has been compromised", "Login to secure your account", "Free gift card inside",
    "Meeting at 3 PM tomorrow", "Hey, how are you?", "Project deadline extended",
    "Can we reschedule the call?", "See you at the party", "Please review the document",
    "Security alert: unusual activity", "Update your payment details", "Your package is waiting",
    "Let's grab lunch", "Happy birthday!", "Are you coming to the event?",
    "Can you verify this invoice for me?", "Urgent team meeting at 4 PM",
    "Please click here to open the shared document from Bob", "I need you to verify your attendance",
    "We have an urgent deadline to meet", "Please review and verify the calculations"
]
labels = [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0] # 1 = Phishing, 0 = Legitimate

def train_dummy_model():
    print("Training demo model...")
    tokenizer = Tokenizer(num_words=MAX_WORDS, oov_token="<OOV>")
    tokenizer.fit_on_texts(texts)
    
    with open(TOKENIZER_PATH, 'wb') as handle:
        pickle.dump(tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)
        
    sequences = tokenizer.texts_to_sequences(texts)
    padded = pad_sequences(sequences, maxlen=MAX_LEN, padding='post', truncating='post')
    
    model = Sequential([
        Embedding(MAX_WORDS, 16, input_length=MAX_LEN),
        LSTM(32),
        Dense(1, activation='sigmoid')
    ])
    
    model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
    model.fit(np.array(padded), np.array(labels), epochs=20, verbose=0)
    model.save(MODEL_PATH)
    print("Model trained and saved.")

def load_inference_model():
    if not os.path.exists(MODEL_PATH) or not os.path.exists(TOKENIZER_PATH):
        train_dummy_model()
        
    model = load_model(MODEL_PATH)
    with open(TOKENIZER_PATH, 'rb') as handle:
        tokenizer = pickle.load(handle)
    return model, tokenizer

model, tokenizer = load_inference_model()

def analyze_text_stats(text):
    return {
        "wordCount": len(text.split()),
        "charCount": len(text),
        "urlCount": len(re.findall(r'https?://\S+|www\.\S+', text)),
        "specialCharCount": len(re.findall(r'[!@#$%^&*(),.?":{}|<>]', text)),
        "digitCount": len(re.findall(r'\d', text))
    }

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    content = data.get('content', '')
    
    if not content:
        return jsonify({"error": "No content provided"}), 400

    # Preprocess
    seq = tokenizer.texts_to_sequences([content])
    padded = pad_sequences(seq, maxlen=MAX_LEN, padding='post', truncating='post')
    
    # Predict
    raw_prob = float(model.predict(padded)[0][0])
    
    # Calculate stats
    stats = analyze_text_stats(content)
    
    # Enhance demo predictions based on realistic heuristics
    score = 0.0
    text_lower = content.lower()
    
    if stats["urlCount"] > 0: score += 0.4
    if stats["urlCount"] > 1: score += 0.2
    if "urgent" in text_lower or "immediate" in text_lower or "suspend" in text_lower: score += 0.3
    if "verify" in text_lower or "login" in text_lower or "click here" in text_lower: score += 0.3
    if "account" in text_lower or "password" in text_lower or "payment" in text_lower: score += 0.2
    if "hey" in text_lower or "lunch" in text_lower or "meeting" in text_lower: score -= 0.3
    
    if score <= 0.0:
        # For completely clean emails, enforce a low percentage probability
        prob = max(0.01, min(0.15, raw_prob * 0.3))
    else:
        # For emails with varying threats, blend model output with heuristic
        base = (raw_prob * 0.3) + (score * 0.7)
        prob = max(0.05, min(0.99, base + (raw_prob * 0.1)))
        
    prediction = "Phishing" if prob > 0.5 else "Legitimate"
    
    return jsonify({
        "prediction": prediction,
        "probability": round(prob, 4),
        "confidence": round(prob if prob > 0.5 else 1 - prob, 4),
        "stats": stats
    })

if __name__ == '__main__':
    app.run(port=5001)
