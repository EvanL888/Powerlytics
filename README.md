# 🔋 Powerlytics

AI-Powered Energy Management Platform

What it does
Powerlytics is an AI-powered energy optimization platform that collects real-time smart meter data, automates ingestion via Fivetran, and stores it in BigQuery for large-scale analytics. From there, Vertex AI models forecast demand spikes, detect anomalies, and suggest efficiency improvements.

Users access an interactive Next.js dashboard that visualizes usage patterns and includes a conversational AI assistant (powered by Gemini) that can answer questions like:

“Why did my usage spike yesterday?” “How can I reduce peak-time consumption?”

How we built it
- Data Ingestion: Smart meter data streams through a custom Fivetran connector built with the Connector SDK.
- Data Warehouse: Data lands in Google BigQuery, where it’s transformed into analytics-ready tables.
- Machine Learning: Vertex AI trains models for consumption prediction and anomaly detection.
- Backend: A FastAPI service handles API requests, runs Vertex predictions, and queries BigQuery.
- Frontend: Built with Next.js, featuring charts (Recharts.js) and a chat UI integrated with Gemini APIs for natural-language analysis.
- Deployment: Containerized with Docker, hosted on Cloud Run, fully integrated with Google Cloud IAM and logging.

## Features

✅ Real-time energy monitoring  
✅ AI-powered forecasting  
✅ Anomaly detection  
✅ Conversational AI assistant  
✅ Cost optimization recommendations  

## Tech Stack

- Frontend: Next.js, React, Tailwind CSS, Recharts
- Backend: FastAPI, Python
- Data: BigQuery, Vertex AI
- Cloud: Google Cloud Platform

## Quick Start

### 1. Install Dependencies

```bash
# Mock API
cd mock_api
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### 2. Run Services

**Terminal 1 - Mock API:**
```bash
cd mock_api
source venv/bin/activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 3. Open Browser

Visit `http://localhost:3000`

## Project Structure

```
ecogrid-iq/
├── mock_api/          # Flask API generating mock IoT data
├── backend/           # FastAPI backend (optional, requires GCP)
├── frontend/          # Next.js dashboard
├── infrastructure/    # SQL and deployment configs
└── scripts/          # Data ingestion scripts
```

