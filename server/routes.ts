import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";
import { registerShopRoutes } from "./shop-routes";
import { registerCmsRoutes } from "./cms-routes";
import { setupAuth } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Register shop routes
  registerShopRoutes(app);

  // Register CMS routes (News & Gallery)
  console.log("Registering CMS routes...");
  registerCmsRoutes(app);

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const result = insertContactSchema.safeParse(req.body);

      if (!result.success) {
        const validationError = fromError(result.error);
        return res.status(400).json({
          error: validationError.toString(),
          details: result.error.flatten()
        });
      }

      const submission = await storage.createContactSubmission(result.data);

      return res.status(201).json({
        success: true,
        message: "Votre message a été envoyé avec succès. Nous vous contacterons bientôt.",
        id: submission.id
      });
    } catch (error) {
      console.error("Error creating contact submission:", error);
      return res.status(500).json({
        error: "Une erreur est survenue. Veuillez réessayer plus tard."
      });
    }
  });

  // Get all contact submissions (for admin purposes)
  app.get("/api/contact", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const submissions = await storage.getContactSubmissions();
      return res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      return res.status(500).json({
        error: "Une erreur est survenue lors de la récupération des messages."
      });
    }
  });

  // Settings API
  app.get("/api/settings/:key", async (req, res) => {
    try {
      const setting = await storage.getSetting(req.params.key);
      return res.json(setting || { key: req.params.key, value: null });
    } catch (error) {
      console.error(`Error fetching setting ${req.params.key}:`, error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const { key, value } = req.body;
      if (!key || value === undefined) {
        return res.status(400).json({ error: "Key and value are required" });
      }
      const setting = await storage.setSetting(key, String(value));
      return res.json(setting);
    } catch (error) {
      console.error("Error updating setting:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
