@echo off
TITLE BuildMaster AI - Install All Dependencies
COLOR 0A

cd /d "%~dp0"

echo ======================================================================
echo    Installing Dependencies for Backend and Frontend (PSEB Civil PM)
echo ======================================================================
echo.

echo [1/2] Installing Server dependencies...
cd /d "%~dp0server"
call npm.cmd install

echo.
echo [2/2] Installing Client dependencies (React, Three.js, GSAP, Tailwind)...
cd /d "%~dp0client"
call npm.cmd install

cd /d "%~dp0"

echo.
echo ======================================================================
echo  Dependencies installed successfully!
echo  You can now run "run_app.bat" to start the application.
echo ======================================================================
pause
