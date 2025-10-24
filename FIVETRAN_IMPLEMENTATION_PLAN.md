# Fivetran Challenge Implementation Plan

## Current Status: ❌ NOT Meeting Requirements

Your project currently has a nice frontend but is missing the core Fivetran Challenge components.

## Required Components:

### 1. ✅ Custom Fivetran Connector (MISSING - CRITICAL)
**What you need:**
- Build a custom connector using Fivetran Connector SDK
- Connect to IoT smart meter APIs or simulate IoT devices
- Extract energy consumption data (readings, device info, timestamps)

**Implementation Steps:**
```bash
# Install Fivetran SDK
pip install fivetran-connector-sdk

# Create connector structure
/fivetran_connector/
  - connector.py          # Main connector logic
  - configuration.json    # Connector configuration
  - schema.py            # Data schema definitions
  - test.py              # Unit tests
```

**Connector Should:**
- Extract data from smart meter APIs or IoT data sources
- Transform readings into structured format
- Handle incremental updates (delta loads)
- Support pagination for large datasets
- Include error handling and retry logic

### 2. ✅ BigQuery Data Pipeline (MISSING - CRITICAL)
**What you need:**
- Set up BigQuery dataset and tables
- Configure Fivetran to load data into BigQuery
- Implement proper data modeling (fact/dimension tables)

**Implementation Steps:**
```sql
-- Create dataset
CREATE SCHEMA IF NOT EXISTS energy_analytics;

-- Raw readings table (from Fivetran)
CREATE TABLE energy_analytics.iot_readings (
  device_id STRING,
  timestamp TIMESTAMP,
  power_w FLOAT64,
  energy_wh FLOAT64,
  voltage FLOAT64,
  temp_c FLOAT64,
  occupancy BOOLEAN,
  _fivetran_synced TIMESTAMP
);

-- Aggregated hourly data
CREATE TABLE energy_analytics.hourly_consumption AS
SELECT 
  device_id,
  TIMESTAMP_TRUNC(timestamp, HOUR) as hour,
  AVG(power_w) as avg_power_w,
  SUM(energy_wh) as total_energy_wh,
  MAX(temp_c) as max_temp_c
FROM energy_analytics.iot_readings
GROUP BY device_id, hour;

-- Features for ML
CREATE TABLE energy_analytics.ml_features AS
SELECT 
  device_id,
  TIMESTAMP_TRUNC(timestamp, HOUR) as hour,
  EXTRACT(HOUR FROM timestamp) as hour_of_day,
  EXTRACT(DAYOFWEEK FROM timestamp) as day_of_week,
  AVG(power_w) as avg_power,
  LAG(AVG(power_w), 1) OVER (PARTITION BY device_id ORDER BY TIMESTAMP_TRUNC(timestamp, HOUR)) as prev_hour_power,
  AVG(temp_c) as avg_temp
FROM energy_analytics.iot_readings
GROUP BY device_id, hour, hour_of_day, day_of_week;
```

### 3. ✅ Vertex AI Integration (MISSING - CRITICAL)
**What you need:**
- Train forecasting model in Vertex AI
- Deploy model for real-time predictions
- Implement anomaly detection using AutoML or custom model

**Implementation Steps:**

#### a) Forecasting Model
```python
# scripts/train_forecast_model.py
from google.cloud import aiplatform
from google.cloud import bigquery

# Initialize
aiplatform.init(project='your-project-id', location='us-central1')

# Create AutoML forecasting model
dataset = aiplatform.TimeSeriesDataset.create(
    display_name='energy-forecast-dataset',
    bq_source='bq://your-project.energy_analytics.ml_features'
)

job = aiplatform.AutoMLForecastingTrainingJob(
    display_name='energy-consumption-forecast',
    optimization_objective='minimize-rmse',
    column_specs={
        'timestamp': 'time',
        'avg_power': 'target',
        'hour_of_day': 'feature',
        'day_of_week': 'feature',
        'avg_temp': 'feature'
    }
)

model = job.run(
    dataset=dataset,
    target_column='avg_power',
    time_column='timestamp',
    time_series_identifier_column='device_id',
    forecast_horizon=24,
    training_fraction_split=0.8
)
```

#### b) Anomaly Detection
```python
# Use Vertex AI AutoML Tables for anomaly detection
from google.cloud import aiplatform

# Train anomaly detection model
anomaly_dataset = aiplatform.TabularDataset.create(
    display_name='anomaly-detection-dataset',
    bq_source='bq://your-project.energy_analytics.ml_features'
)

training_job = aiplatform.AutoMLTabularTrainingJob(
    display_name='energy-anomaly-detection',
    optimization_prediction_type='classification'
)

model = training_job.run(
    dataset=anomaly_dataset,
    target_column='is_anomaly',
    training_fraction_split=0.8
)
```

### 4. ✅ RAG-Powered Chatbot (PARTIALLY IMPLEMENTED)
**What you need:**
- Connect chatbot to BigQuery data
- Use Vertex AI GenAI API for natural language responses
- Implement RAG (Retrieval Augmented Generation)

**Implementation Steps:**
```python
# backend/rag_chatbot.py
from google.cloud import aiplatform
from vertexai.preview.language_models import ChatModel, TextEmbeddingModel
from google.cloud import bigquery

class EnergyRAGChatbot:
    def __init__(self):
        self.chat_model = ChatModel.from_pretrained("chat-bison@002")
        self.bq_client = bigquery.Client()
        
    def get_context_from_bigquery(self, question):
        """Query BigQuery for relevant data based on user question"""
        # Extract intent (usage, cost, forecast, etc.)
        if "usage" in question.lower():
            query = """
            SELECT device_id, hour, avg_power, total_energy_wh
            FROM `energy_analytics.hourly_consumption`
            WHERE DATE(hour) = CURRENT_DATE()
            ORDER BY hour DESC
            LIMIT 24
            """
        elif "forecast" in question.lower():
            query = """
            SELECT * FROM ML.PREDICT(
                MODEL `energy_analytics.forecast_model`,
                (SELECT * FROM `energy_analytics.ml_features` 
                 WHERE timestamp >= CURRENT_TIMESTAMP())
            )
            """
        
        results = self.bq_client.query(query).to_dataframe()
        return results.to_string()
    
    def answer_question(self, question):
        """Use RAG to answer user questions"""
        # Get relevant data context
        context = self.get_context_from_bigquery(question)
        
        # Create prompt with context
        prompt = f"""
        You are an energy management AI assistant. Use the following data to answer the user's question:
        
        Data Context:
        {context}
        
        User Question: {question}
        
        Provide a helpful, specific answer with numbers and actionable recommendations.
        """
        
        # Get AI response
        response = self.chat_model.predict(prompt, max_output_tokens=256)
        return response.text
```

### 5. ✅ FastAPI Backend (EXISTS BUT NOT CONNECTED)
**What you need:**
- Connect FastAPI to BigQuery
- Add endpoints for Vertex AI predictions
- Implement RAG chatbot endpoint

**Update backend/main.py:**
```python
from fastapi import FastAPI, HTTPException
from google.cloud import bigquery
from google.cloud import aiplatform
from backend.rag_chatbot import EnergyRAGChatbot

app = FastAPI()
bq_client = bigquery.Client()
chatbot = EnergyRAGChatbot()

@app.get("/api/realtime-data")
async def get_realtime_data():
    """Get latest data from BigQuery"""
    query = """
    SELECT device_id, timestamp, power_w, energy_wh
    FROM `energy_analytics.iot_readings`
    WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 HOUR)
    ORDER BY timestamp DESC
    """
    results = bq_client.query(query).to_dataframe()
    return results.to_dict('records')

@app.get("/api/forecast")
async def get_forecast():
    """Get AI forecast from Vertex AI"""
    query = """
    SELECT * FROM ML.PREDICT(
        MODEL `energy_analytics.forecast_model`,
        (SELECT * FROM `energy_analytics.ml_features` 
         WHERE timestamp >= CURRENT_TIMESTAMP()
         LIMIT 24)
    )
    """
    results = bq_client.query(query).to_dataframe()
    return results.to_dict('records')

@app.post("/api/chat")
async def chat(message: str):
    """RAG-powered chatbot endpoint"""
    response = chatbot.answer_question(message)
    return {"response": response}

@app.get("/api/anomalies")
async def get_anomalies():
    """Get anomaly predictions from Vertex AI"""
    query = """
    SELECT * FROM ML.PREDICT(
        MODEL `energy_analytics.anomaly_model`,
        (SELECT * FROM `energy_analytics.ml_features` 
         WHERE DATE(hour) = CURRENT_DATE())
    )
    WHERE predicted_is_anomaly = TRUE
    """
    results = bq_client.query(query).to_dataframe()
    return results.to_dict('records')
```

## Implementation Priority:

### Phase 1: Core Requirements (Week 1)
1. ✅ Build Fivetran Custom Connector
2. ✅ Set up BigQuery dataset and tables
3. ✅ Configure Fivetran pipeline
4. ✅ Verify data flowing to BigQuery

### Phase 2: AI Integration (Week 2)
1. ✅ Train Vertex AI forecasting model
2. ✅ Train anomaly detection model
3. ✅ Deploy models for inference
4. ✅ Create BigQuery ML queries

### Phase 3: Backend Integration (Week 3)
1. ✅ Update FastAPI with BigQuery connections
2. ✅ Implement RAG chatbot with Vertex AI
3. ✅ Add real-time prediction endpoints
4. ✅ Test end-to-end pipeline

### Phase 4: Frontend Updates (Week 4)
1. ✅ Connect frontend to real BigQuery data
2. ✅ Display actual Vertex AI predictions
3. ✅ Integrate RAG chatbot
4. ✅ Polish UI and add error handling

## Key Files to Create:

```
/fivetran_connector/
  - connector.py              # Custom Fivetran connector
  - configuration.json        # Connector config
  - schema.py                # Data schema

/scripts/
  - setup_bigquery.py        # Initialize BigQuery
  - train_models.py          # Train Vertex AI models
  - data_ingestion.py        # Scheduled data loads

/backend/
  - main.py                  # FastAPI with BigQuery + Vertex AI
  - rag_chatbot.py          # RAG implementation
  - models.py               # Pydantic models

/infrastructure/
  - bigquery_setup.sql       # ✅ Already exists, needs updating
  - fivetran_config.yaml     # Fivetran connector config
  - vertex_ai_setup.py       # Vertex AI initialization
```

## Required Google Cloud Services:

1. **BigQuery** - Data warehouse
2. **Vertex AI** - ML models and GenAI
3. **Cloud Storage** - Connector staging
4. **Cloud Functions/Run** - Backend hosting
5. **Fivetran** - Data integration platform

## Judging Criteria Alignment:

✅ **Technical Creativity** - Custom IoT connector + AI forecasting
✅ **Data Integration** - Fivetran SDK + BigQuery pipeline
✅ **AI Innovation** - Vertex AI forecasting + RAG chatbot
✅ **Real-world Impact** - Energy optimization and cost savings
✅ **Modern AI/Data** - LLMs (chat), RAG, forecasting, anomaly detection

## Next Steps:

1. Set up Google Cloud project
2. Enable required APIs (BigQuery, Vertex AI, Cloud Storage)
3. Install Fivetran Connector SDK
4. Start with Phase 1: Build the connector

Would you like me to help you implement any of these components?
