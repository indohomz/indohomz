@echo off
echo Starting Retail Analytics Platform...

REM Start Backend
cd backend
start cmd /k "python -m uvicorn main:app --reload --host localhost --port 8000"

REM Wait a moment
timeout /t 5

REM Start Frontend
cd ../frontend
start cmd /k "npm run dev"

echo Services are starting up...
echo Backend will be available at: http://localhost:8000
echo Frontend will be available at: http://localhost:5173
echo API Documentation: http://localhost:8000/docs