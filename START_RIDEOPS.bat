@echo off
title RideOps Enterprise Mobility - PostgreSQL
color 0A
echo ================================================
echo       RideOps Enterprise Mobility Platform
echo             PostgreSQL Edition
echo ================================================
echo.
echo IMPORTANT: PostgreSQL must be installed and the
necho 'rideops' database must exist before starting.
echo Configure backend\.env with your PostgreSQL password.
echo.
pause

echo Installing backend dependencies...
cd /d "%~dp0backend"
call npm install
if errorlevel 1 (
  echo Backend npm install failed.
  pause
  exit /b 1
)
start "RideOps PostgreSQL API" cmd /k "npm run dev"

echo Installing frontend dependencies...
cd /d "%~dp0frontend"
call npm install
if errorlevel 1 (
  echo Frontend npm install failed.
  pause
  exit /b 1
)
start "RideOps Web" cmd /k "npm run dev -- --host 0.0.0.0"

echo.
echo Frontend: http://localhost:5173
echo API:      http://localhost:5000/api/health
echo Database: PostgreSQL / rideops
echo.
pause
