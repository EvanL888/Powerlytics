# Start Flask API in background job and test connector
Write-Host "Starting Flask API..." -ForegroundColor Green

# Start Flask in a background job
$job = Start-Job -ScriptBlock {
    Set-Location "c:\Users\liuev\ecogrid-setup\ecogrid-iq\mock_api"
    & "C:/Users/liuev/AppData/Local/Programs/Python/Python313/python.exe" app.py
}

# Wait for Flask to start
Write-Host "Waiting for API to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if Flask is running
$flaskRunning = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
if ($flaskRunning) {
    Write-Host "Flask API is running on port 5000" -ForegroundColor Green
} else {
    Write-Host "Flask API failed to start" -ForegroundColor Red
    Stop-Job $job
    Remove-Job $job
    exit 1
}

# Test the connector
Write-Host ""
Write-Host "Running connector test..." -ForegroundColor Green
& "C:/Users/liuev/AppData/Local/Programs/Python/Python313/python.exe" "c:\Users\liuev\ecogrid-setup\ecogrid-iq\fivetran_connector\test_connector.py"

# Keep Flask running
Write-Host ""
Write-Host "Press any key to stop Flask API..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Cleanup
Stop-Job $job
Remove-Job $job
