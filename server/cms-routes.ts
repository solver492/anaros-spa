import type { Express } from "express";
import { storage } from "./storage";
import { insertNewsSchema, insertGallerySchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

console.log("Loading cms-routes.ts...");

export function registerCmsRoutes(app: Express) {
    console.log("Inside registerCmsRoutes...");
    // ============================================
    // NEWS ROUTES
    // ============================================

    app.get("/api/news", async (req, res) => {
        try {
            console.log("GET /api/news requested");
            const news = await storage.getNews();
            return res.json(news);
        } catch (error) {
            console.error("Error fetching news:", error);
            return res.status(500).json({ error: "Erreur lors de la récupération des actualités." });
        }
    });

    app.post("/api/news", async (req, res) => {
        try {
            console.log("POST /api/news requested", req.body);
            if (!req.isAuthenticated()) {
                console.warn("POST /api/news - Unauthenticated");
                return res.status(401).json({ error: "Non autorisé" });
            }
            const result = insertNewsSchema.safeParse(req.body);
            if (!result.success) {
                console.warn("POST /api/news - Validation failed", result.error);
                return res.status(400).json({ error: fromError(result.error).toString() });
            }
            const article = await storage.createNews(result.data);
            console.log("POST /api/news - Success", article);
            return res.status(201).json(article);
        } catch (error) {
            console.error("Error creating news:", error);
            return res.status(500).json({ error: "Erreur lors de la création de l'article." });
        }
    });

    app.put("/api/news/:id", async (req, res) => {
        try {
            if (!req.isAuthenticated()) return res.status(401).json({ error: "Non autorisé" });
            const article = await storage.updateNews(req.params.id, req.body);
            if (!article) return res.status(404).json({ error: "Article non trouvé" });
            return res.json(article);
        } catch (error) {
            console.error("Error updating news:", error);
            return res.status(500).json({ error: "Erreur lors de la mise à jour de l'article." });
        }
    });

    app.delete("/api/news/:id", async (req, res) => {
        try {
            if (!req.isAuthenticated()) return res.status(401).json({ error: "Non autorisé" });
            const deleted = await storage.deleteNews(req.params.id);
            if (!deleted) return res.status(404).json({ error: "Article non trouvé" });
            return res.json({ success: true });
        } catch (error) {
            console.error("Error deleting news:", error);
            return res.status(500).json({ error: "Erreur lors de la suppression de l'article." });
        }
    });

    // ============================================
    // GALLERY ROUTES
    // ============================================

    app.get("/api/gallery", async (req, res) => {
        try {
            console.log("GET /api/gallery requested");
            const gallery = await storage.getGallery();
            return res.json(gallery);
        } catch (error) {
            console.error("Error fetching gallery:", error);
            return res.status(500).json({ error: "Erreur lors de la récupération de la galerie." });
        }
    });

    app.post("/api/gallery", async (req, res) => {
        try {
            console.log("POST /api/gallery requested", req.body);
            if (!req.isAuthenticated()) {
                console.warn("POST /api/gallery - Unauthenticated");
                return res.status(401).json({ error: "Non autorisé" });
            }
            const result = insertGallerySchema.safeParse(req.body);
            if (!result.success) {
                console.warn("POST /api/gallery - Validation failed", result.error);
                return res.status(400).json({ error: fromError(result.error).toString() });
            }
            const item = await storage.createGalleryItem(result.data);
            console.log("POST /api/gallery - Success", item);
            return res.status(201).json(item);
        } catch (error) {
            console.error("Error creating gallery item:", error);
            return res.status(500).json({ error: "Erreur lors de la création de l'élément de galerie." });
        }
    });

    app.put("/api/gallery/:id", async (req, res) => {
        try {
            if (!req.isAuthenticated()) return res.status(401).json({ error: "Non autorisé" });
            const item = await storage.updateGalleryItem(req.params.id, req.body);
            if (!item) return res.status(404).json({ error: "Élément non trouvé" });
            return res.json(item);
        } catch (error) {
            console.error("Error updating gallery item:", error);
            return res.status(500).json({ error: "Erreur lors de la mise à jour de l'élément." });
        }
    });

    app.delete("/api/gallery/:id", async (req, res) => {
        try {
            if (!req.isAuthenticated()) return res.status(401).json({ error: "Non autorisé" });
            const deleted = await storage.deleteGalleryItem(req.params.id);
            if (!deleted) return res.status(404).json({ error: "Élément non trouvé" });
            return res.json({ success: true });
        } catch (error) {
            console.error("Error deleting gallery item:", error);
            return res.status(500).json({ error: "Erreur lors de la suppression de l'élément." });
        }
    });
}
