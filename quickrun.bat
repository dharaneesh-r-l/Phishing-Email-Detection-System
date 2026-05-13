@echo off
setlocal EnableDelayedExpansion
set FAILED=0
title PhishGuard

echo ============================================
echo  PhishGuard - Local Setup and Launch
echo ============================================
echo.

REM ---------- 1. Check Node.js ----------
echo [1/3] Checking Node.js...
node -v >nul 2>&1
if !errorlevel! neq 0 (
    echo.
    echo   ERROR: Node.js is not installed.
    echo   Download it from: https://nodejs.org/
    echo   Install it, then double-click this file again.
    set FAILED=1
    goto :done
)
for /f "tokens=*" %%v in ('node -v') do echo   Found: %%v

REM ---------- 2. Check Python ----------
echo.
echo [2/3] Checking Python...
python --version >nul 2>&1
if !errorlevel! neq 0 (
    echo.
    echo   ERROR: Python is not installed or not on PATH.
    echo   Download it from: https://www.python.org/
    echo   IMPORTANT: During install tick "Add Python to PATH"
    set FAILED=1
    goto :done
)
for /f "tokens=*" %%v in ('python --version 2^>^&1') do echo   Found: %%v

REM ---------- 3. Install deps ----------
echo.
echo [3/3] Installing dependencies...
echo.

echo   Installing Node.js packages (this may take a minute)...
call npm install --silent
if !errorlevel! neq 0 (
    echo   ERROR: npm install failed. See output above.
    set FAILED=1
    goto :done
)
echo   Node.js packages installed.
echo.

echo   Installing Python packages (this may take a few minutes)...
pip install flask tensorflow numpy pandas scikit-learn -q
if !errorlevel! neq 0 (
    echo   WARNING: Some Python packages failed. The ML service may not work.
)
echo   Python packages installed.

REM ---------- Launch ----------
echo.
echo ============================================
echo  All dependencies ready!
echo  Starting PhishGuard...
echo  Open http://localhost:5000 in your browser.
echo  Press Ctrl+C to stop the server.
echo ============================================
echo.

set NODE_ENV=development
npx tsx server/index.ts
if !errorlevel! neq 0 (
    echo.
    echo   ERROR: Server exited with an error.
    echo   Make sure Node.js packages are installed and try again.
    set FAILED=1
)

:done
echo.
if !FAILED! equ 1 (
    echo ============================================
    echo  Setup failed. Read the error above.
    echo ============================================
) else (
    echo Server stopped.
)
echo.
echo Press any key to close this window...
pause >nul
endlocal
