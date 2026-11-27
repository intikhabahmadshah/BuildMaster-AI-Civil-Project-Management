@echo off
setlocal enabledelayedexpansion
TITLE BuildMaster AI - 1-Click Launcher (PSEB Civil PM)
COLOR 0B

cd /d "%~dp0"

echo ======================================================================
echo          BUILDMASTER AI - CIVIL PROJECT MANAGEMENT CHATBOT
echo         Pakistan Software Export Board (PSEB) Capstone Project
echo ======================================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in your PATH!
    echo Please install Node.js v18 or higher from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Checking project dependencies...

if not exist "server\node_modules\" (
    echo [INFO] Installing server dependencies...
    cd server
    call npm.cmd install
    cd /d "%~dp0"
)

if not exist "client\node_modules\" (
    echo [INFO] Installing client dependencies...
    cd client
    call npm.cmd install
    cd /d "%~dp0"
)

echo.
echo [2/4] Starting BuildMaster AI Express Backend on Port 5000...
start "BuildMaster AI - Backend (Port 5000)" cmd /k "cd /d \"%~dp0server\" && npm.cmd start"

echo [3/4] Starting BuildMaster AI React Frontend on Port 5173...
start "BuildMaster AI - Frontend (Port 5173)" cmd /k "cd /d \"%~dp0client\" && npm.cmd run dev"

echo.
echo [4/4] Initializing local servers...
ping 127.0.0.1 -n 4 >nul

echo Launching BuildMaster AI in default browser...
start http://localhost:5173

echo.
echo ======================================================================
echo  BuildMaster AI is running successfully!
echo  - Frontend: http://localhost:5173
echo  - Backend:  http://localhost:5000/api/health
echo ======================================================================
echo.
echo [NOTE] Keep the two opened terminal windows running in background.
echo You can close this launcher window now.
pause
