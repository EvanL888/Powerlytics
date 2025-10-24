# 🔋 EcoGridIQ

AI-Powered Energy Management Platform

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

## Next Steps

1. Set up Google Cloud Project (for full backend)
2. Create BigQuery dataset
3. Deploy to Cloud Run
4. Record demo video

See documentation for detailed setup instructions.
