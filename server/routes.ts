import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertAttendanceSchema, updateAttendanceSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  // WebSocket server for real-time clock
  wss.on("connection", (ws) => {
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(new Date().toISOString());
      }
    }, 1000);

    ws.on("close", () => {
      clearInterval(interval);
    });
  });

  // API Routes
  app.get("/api/users", async (req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });

  app.get("/api/projects", async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.post("/api/attendance/check-in", async (req, res) => {
    const parsed = insertAttendanceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const current = await storage.getCurrentAttendance(parsed.data.userId);
    if (current) {
      return res.status(400).json({ message: "Already checked in" });
    }

    const record = await storage.checkIn(parsed.data.userId, parsed.data.notes);
    res.json(record);
  });

  app.post("/api/attendance/check-out/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const record = await storage.checkOut(userId);
    if (!record) {
      return res.status(400).json({ message: "No active check-in found" });
    }

    res.json(record);
  });

  app.get("/api/attendance/current/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const record = await storage.getCurrentAttendance(userId);
    res.json(record || null);
  });

  app.get("/api/attendance/history/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const history = await storage.getAttendanceHistory(userId);
    res.json(history);
  });

  return httpServer;
}
