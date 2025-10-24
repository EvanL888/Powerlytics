# IoT Smart Meter Fivetran Connector

Custom Fivetran connector for extracting IoT smart meter energy consumption data.

## Overview

This connector extracts data from IoT smart meter APIs and loads it into BigQuery via Fivetran's automated pipelines.

## Features

- ✅ Incremental sync with state management
- ✅ Extracts device metadata and energy readings
- ✅ Handles pagination and rate limiting
- ✅ Error handling and retry logic
- ✅ Validates data against schema

## Schema

### Tables

#### `devices`
- `device_id` (STRING, PRIMARY KEY)
- `name` (STRING)
- `location` (STRING)
- `installation_date` (TIMESTAMP)

#### `readings`
- `device_id` (STRING, PRIMARY KEY)
- `timestamp` (TIMESTAMP, PRIMARY KEY)
- `power_w` (FLOAT) - Power consumption in watts
- `energy_wh` (FLOAT) - Energy consumption in watt-hours
- `voltage` (FLOAT) - Voltage reading
- `temp_c` (FLOAT) - Temperature in Celsius
- `occupancy` (BOOLEAN) - Occupancy status
- `source` (STRING) - Data source identifier

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Test locally:
```bash
python connector.py
```

3. Deploy to Fivetran:
- Package the connector
- Upload to Fivetran
- Configure with your API credentials

## Configuration

Required fields:
- `api_key`: API key for smart meter service
- `api_url`: Base URL for the API (default: http://localhost:5000)

## Testing

Run the connector locally:
```bash
cd fivetran_connector
python connector.py
```

This will:
1. Connect to your local mock API
2. Fetch devices and readings
3. Display sync results

## State Management

The connector maintains state between syncs:
- `last_sync_timestamp`: Timestamp of last successful sync
- `total_devices`: Number of devices synced
- `total_readings`: Number of readings synced

This enables incremental loading - only new data since last sync is extracted.

## Integration with Fivetran

Once deployed to Fivetran:
1. Data is automatically synced on schedule
2. Loaded into your BigQuery dataset
3. Available for Vertex AI model training
4. Powers your real-time dashboard

## API Endpoints Used

- `GET /health` - Connection test
- `GET /devices` - List all devices
- `GET /readings?device_id={id}&start={timestamp}&end={timestamp}` - Get readings

## Next Steps

After setting up this connector:
1. Configure Fivetran to use this connector
2. Set up BigQuery destination
3. Schedule automatic syncs (hourly recommended)
4. Train Vertex AI models on the data
