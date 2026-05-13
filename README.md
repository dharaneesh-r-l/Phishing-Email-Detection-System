# AI Phishing Email Detector

An AI-powered phishing email detection web application that analyzes email content and predicts whether the email is legitimate or phishing using Machine Learning and Natural Language Processing.

---

## Features

- Detects phishing emails using Machine Learning
- Real-time email analysis
- Frontend and backend integration
- Responsive user interface
- TensorFlow/Keras model integration
- REST API communication
- Secure and scalable project structure

---

## Tech Stack

### Frontend
- React
- TypeScript
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- TypeScript

### Machine Learning
- Python
- TensorFlow / Keras
- NLP Processing

### Database & Tools
- PostgreSQL
- Drizzle ORM
- Git & GitHub

---

## Project Structure

```bash
phishing-email-main/
│
├── client/                # Frontend source code
├── server/                # Backend server files
├── shared/                # Shared schema and routes
├── ml/                    # Machine Learning model
│   ├── app.py
│   ├── phishing_model.h5
│   └── tokenizer.pickle
├── scripts/
├── package.json
├── drizzle.config.ts
└── README.md
```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/AI-Phishing-Email-Detector.git
cd AI-Phishing-Email-Detector
```

---

### 2. Install Node.js Dependencies

```bash
npm install
```

---

### 3. Install Python Dependencies

Move to ML folder:

```bash
cd ml
```

Install dependencies:

```bash
pip install flask tensorflow numpy pandas scikit-learn
```

---

### 4. Run Machine Learning Server

```bash
python app.py
```

---

### 5. Run Frontend & Backend

Open another terminal:

```bash
npm run dev
```

---

## How It Works

1. User enters email content.
2. Frontend sends request to backend.
3. Backend communicates with ML model.
4. ML model predicts phishing or legitimate email.
5. Result is displayed instantly.

---

## Future Improvements

- URL threat analysis
- Attachment scanning
- User authentication
- Dashboard analytics
- Cloud deployment
- Advanced NLP models

---

## Screenshots

Add screenshots after deployment.

```<img width="1455" height="918" alt="Screenshot 2026-02-26 002913" src="https://github.com/user-attachments/assets/244042f5-a0e4-41ef-b628-cc13d1d83e79" />

<img width="1239" height="903" alt="Screenshot 2026-02-26 003155" src="https://github.com/user-attachments/assets/8427304e-192b-46e2-9732-23ca0916d8ca" />


```

---

## Author

**Dharaneesh**

- Full Stack Developer
- Python & AI Enthusiast
- Interested in Cybersecurity and Machine Learning

---

## License

This project is developed for educational and learning purposes.

