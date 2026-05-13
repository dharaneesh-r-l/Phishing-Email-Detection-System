# Running PhishGuard Locally

PhishGuard requires **no database**. Everything runs in memory — just install Node.js and Python, then launch.

---

## Prerequisites

| Tool | Min Version | Download |
|------|-------------|----------|
| Node.js | LTS (18+) | https://nodejs.org/ |
| Python | 3.10+ | https://www.python.org/ |

> **Windows tip:** When installing Python, tick **"Add Python to PATH"** on the first installer screen.

---

## Quick Start

### Windows
Double-click **`quickrun.bat`**

The window stays open so you can see progress and any errors.

### Mac / Linux
```bash
chmod +x quickrun.sh
./quickrun.sh
```

Both scripts will:
1. Verify Node.js and Python are installed
2. Install all Node.js and Python packages
3. Start the app at **http://localhost:5000**

> The Python ML service starts automatically inside the app. On the very first run it trains a small demo model, which can take up to a minute. Wait for it and then use the app normally.

---

## Manual Setup

If you prefer step-by-step control:

```bash
# 1. Install Node packages
npm install

# 2. Install Python packages (Mac/Linux)
pip3 install flask tensorflow numpy pandas scikit-learn

# 2. Install Python packages (Windows)
pip install flask tensorflow numpy pandas scikit-learn

# 3. Start the server (Mac/Linux)
NODE_ENV=development npx tsx server/index.ts

# 3. Start the server (Windows CMD)
set NODE_ENV=development && npx tsx server/index.ts
```

Then open **http://localhost:5000**.

---

## Notes

- **No database needed.** Scan history is stored in memory and cleared when you stop the server.
- **Port conflict?** Set the `PORT` environment variable (e.g. `set PORT=3000` on Windows before starting).
- **ML service slow?** Normal on first run — model training takes ~30–60 seconds.
