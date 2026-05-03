@echo off
echo Starting E-Voting System...

echo Starting backend server on port 5000...
start cmd /k "cd backend && npm start"

echo Starting frontend development server...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting in separate windows.
pause
