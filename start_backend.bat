@echo off
TITLE BuildMaster AI - Backend Server (Port 5000)
COLOR 0E

cd /d "%~dp0server"

echo ======================================================================
echo    Starting BuildMaster AI Backend Server (Express + Gemini + Mongo)
echo ======================================================================
echo.

npm.cmd start
pause
