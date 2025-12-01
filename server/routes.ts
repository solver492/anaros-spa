import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
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
      const submissions = await storage.getContactSubmissions();
      return res.json(submissions);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      return res.status(500).json({ 
        error: "Une erreur est survenue lors de la récupération des messages." 
      });
    }
  });

  return httpServer;
}
