@echo off
TITLE BuildMaster AI - Frontend Client (Vite + ThreeJS + GSAP)
COLOR 0B

cd /d "%~dp0client"

echo ======================================================================
echo    Starting BuildMaster AI Frontend (Port 5173)
echo ======================================================================
echo.

npm.cmd run dev
pause
