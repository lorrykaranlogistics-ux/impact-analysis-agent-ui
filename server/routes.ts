import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // The actual backend is at http://localhost:8000
  // We provide a health check for this development server gateway
  app.get("/health", (req, res) => {
    res.json({ status: "UP", service: "dev-ui-gateway" });
  });

  return httpServer;
}
