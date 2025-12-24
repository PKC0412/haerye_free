@echo off
setlocal

REM Change to project directory
cd /d "H:\PKC-Korean-Learning"

REM Set server port
set PORT=8000

REM Start HTTP server in new console window (logs + errors visible there)
start "PKC Korean Learning Server" cmd /k python -m http.server %PORT%

REM Brief delay to allow server to start
timeout /t 2 >nul

REM Open default web browser to the local server
start "" "http://localhost:%PORT%/"

endlocal
exit /b
