@echo off
REM BlackVale Guild Management System - Startup Script

echo.
echo ========================================
echo  BlackVale Guild Management System
echo ========================================
echo.

REM Change to the backend directory
cd /d "%~dp0backend"

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    echo.
)

REM Open a new terminal window for the backend server
echo Starting backend server on port 5000...
start cmd /k "npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Change to the frontend directory
cd /d "%~dp0frontend"

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    echo.
)

REM Open a new terminal window for the frontend server
echo Starting frontend server on port 3000...
start cmd /k "npm start"

echo.
echo ========================================
echo  Servers are starting...
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Close this window when done. The servers will keep running in their own windows.
echo.
pause
