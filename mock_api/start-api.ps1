# Start Mock API Server
Write-Host "🚀 Starting Mock API on http://localhost:5000" -ForegroundColor Green

# Ensure we're in the right directory
Set-Location $PSScriptRoot

# Activate virtual environment and start Flask
& ".\venv\Scripts\python.exe" ".\app.py"
