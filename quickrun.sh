#!/usr/bin/env bash

echo "============================================"
echo " PhishGuard - Local Setup and Launch"
echo "============================================"
echo

FAILED=0

# ---------- 1. Check Node.js ----------
echo "[1/3] Checking Node.js..."
if ! command -v node &>/dev/null; then
    echo
    echo "  ERROR: Node.js is not installed."
    echo "  Download it from: https://nodejs.org/"
    FAILED=1
fi
[ $FAILED -eq 0 ] && echo "  Found: $(node -v)"

# ---------- 2. Check Python ----------
if [ $FAILED -eq 0 ]; then
    echo
    echo "[2/3] Checking Python..."
    if command -v python3 &>/dev/null; then
        PYTHON=python3; PIP=pip3
    elif command -v python &>/dev/null; then
        PYTHON=python; PIP=pip
    else
        echo "  ERROR: Python is not installed."
        echo "  Download it from: https://www.python.org/"
        FAILED=1
    fi
    [ $FAILED -eq 0 ] && echo "  Found: $($PYTHON --version)"
fi

# ---------- 3. Install deps ----------
if [ $FAILED -eq 0 ]; then
    echo
    echo "[3/3] Installing dependencies..."
    echo

    echo "  Installing Node.js packages..."
    npm install --silent
    echo "  Node.js packages installed."
    echo

    echo "  Installing Python packages..."
    $PIP install flask tensorflow numpy pandas scikit-learn -q || \
        echo "  WARNING: Some Python packages failed. ML service may not work."
    echo "  Python packages installed."
fi

# ---------- Launch ----------
if [ $FAILED -eq 0 ]; then
    echo
    echo "============================================"
    echo " All dependencies ready!"
    echo " Starting PhishGuard..."
    echo " Open http://localhost:5000 in your browser."
    echo " Press Ctrl+C to stop the server."
    echo "============================================"
    echo
    NODE_ENV=development npx tsx server/index.ts
else
    echo
    echo "============================================"
    echo " Setup failed. Read the error above."
    echo "============================================"
    exit 1
fi
