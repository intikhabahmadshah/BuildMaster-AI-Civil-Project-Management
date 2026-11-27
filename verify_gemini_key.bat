@echo off
TITLE BuildMaster AI - Verify Google Gemini API Key
COLOR 0A

cd /d "%~dp0"

echo ======================================================================
echo    Testing Google Gemini API Key & Model Accessibility
echo ======================================================================
echo.

node verify_key.js

echo.
pause
