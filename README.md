# PrivacyShield AI

An Intelligent Privacy-Aware Learning and Awareness Platform built with React, Vite, and Tailwind CSS.

## Features

- **Frontend Only**: No backend, no database required. Uses `localStorage` and local JSON files.
- **AI Integration**: Communicates directly with Google Gemini 1.5 Flash API from the client side.
- **Privacy Risk Analyzer**: Uses pure JavaScript TF-IDF and Cosine Similarity to detect PII in text, backed by AI explanations.
- **Compliance Checker**: Analyzes privacy policies for GDPR and CCPA compliance.
- **Interactive Quizzes**: Test knowledge on data privacy, ethical AI, and GDPR.
- **Gamification**: Earn badges and track progress on the Dashboard.

## Setup Instructions

1. **Install Node.js**: Ensure you have Node.js installed on your machine.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configuration**:
   - Create a `.env` file based on `.env.example` or just edit the `.env` file:
     ```
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
     ```
   - Alternatively, you can add your API key directly in the app via the **Profile & Settings** page.
4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
5. **Build for Production**:
   ```bash
   npm run build
   ```

## Tech Stack

- React.js (Vite)
- Tailwind CSS
- Framer Motion
- React Router DOM
- Recharts
- jsPDF & html2canvas
- @google/generative-ai
