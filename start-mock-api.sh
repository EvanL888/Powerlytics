#!/bin/bash
cd mock_api
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi
echo "🚀 Starting Mock API on http://localhost:5000"
python app.py
