@echo off
cd /d "%~dp0"
cls
echo ========================================
echo   PrintCore Backend Server
echo ========================================
echo.
echo Starting NestJS server...
echo.
echo Server will run on: http://localhost:3001
echo Swagger docs: http://localhost:3001/api/docs
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.
npm run start:dev
pause
