# Start backend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\.venv-py311\Scripts\activate; python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

# Wait a moment for backend to initialize
Start-Sleep -Seconds 2

# Start frontend server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Development servers started!" -ForegroundColor Green
Write-Host "Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan