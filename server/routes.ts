
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { spawn } from "child_process";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Start Python ML Service
  console.log("Starting Python ML Service...");

  // Build env for the Python subprocess.
  // The Nix-specific LD_LIBRARY_PATH is only added when running on Replit
  // so the service also works on standard local machines (Windows / Mac / Linux).
  const pythonEnv: NodeJS.ProcessEnv = { ...process.env };
  if (process.env.REPL_ID) {
    pythonEnv.LD_LIBRARY_PATH =
      (process.env.LD_LIBRARY_PATH || "") +
      ":/nix/store/xvzz97yk73hw03v5dhhz3j47ggwf1yq1-gcc-13.2.0-lib/lib";
  }

  // On Windows "python3" may not exist; fall back to "python"
  const pythonCmd = process.platform === "win32" ? "python" : "python3";
  const pythonProcess = spawn(pythonCmd, ["ml/app.py"], { env: pythonEnv });

  pythonProcess.stdout.on("data", (data) => {
    console.log(`[ML Service]: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`[ML Service Error]: ${data}`);
  });

  // API Routes
  app.post(api.scans.analyze.path, async (req, res) => {
    try {
      const { content, emailId, subject } = api.scans.analyze.input.parse(req.body);
      
      // Call Python Service
      try {
        const mlResponse = await fetch("http://127.0.0.1:5001/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });

        if (!mlResponse.ok) {
          throw new Error("ML Service failed");
        }

        const result = await mlResponse.json();
        
        // Save to DB
        const scan = await storage.createScan({
          emailId: emailId || null,
          subject: subject || null,
          content,
          prediction: result.prediction,
          confidence: result.confidence,
          probability: result.probability,
          stats: result.stats
        });

        res.json(scan);

      } catch (error) {
        console.error("ML Service Error:", error);
        res.status(500).json({ message: "Failed to analyze email. ML service might be starting up." });
      }

    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.get(api.scans.list.path, async (req, res) => {
    const scans = await storage.getScans();
    res.json(scans);
  });

  return httpServer;
}
