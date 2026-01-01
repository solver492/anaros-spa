import type { Express } from "express";
import { storage } from "./storage";
import {
    insertProductSchema,
    insertCategorySchema,
    insertCustomerSchema,
    insertOrderSchema,
    insertOrderItemSchema
} from "@shared/schema";
import { fromError } from "zod-validation-error";

export function registerShopRoutes(app: Express) {
    // ============================================
    // PRODUCTS ROUTES
    // ============================================

    // Get all products
    app.get("/api/products", async (req, res) => {
        try {
            const products = await storage.getProducts();
            return res.json(products);
        } catch (error) {
            console.error("Error fetching products:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la récupération des produits."
            });
        }
    });

    // Get single product
    app.get("/api/products/:id", async (req, res) => {
        try {
            const product = await storage.getProduct(req.params.id);
            if (!product) {
                return res.status(404).json({ error: "Produit non trouvé" });
            }
            return res.json(product);
        } catch (error) {
            console.error("Error fetching product:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la récupération du produit."
            });
        }
    });

    // Create product
    app.post("/api/products", async (req, res) => {
        try {
            const result = insertProductSchema.safeParse(req.body);

            if (!result.success) {
                const validationError = fromError(result.error);
                return res.status(400).json({
                    error: validationError.toString(),
                    details: result.error.flatten()
                });
            }

            const product = await storage.createProduct(result.data);
            return res.status(201).json(product);
        } catch (error) {
            console.error("Error creating product:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la création du produit."
            });
        }
    });

    // Update product
    app.put("/api/products/:id", async (req, res) => {
        try {
            const product = await storage.updateProduct(req.params.id, req.body);
            if (!product) {
                return res.status(404).json({ error: "Produit non trouvé" });
            }
            return res.json(product);
        } catch (error) {
            console.error("Error updating product:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la mise à jour du produit."
            });
        }
    });

    // Delete product
    app.delete("/api/products/:id", async (req, res) => {
        try {
            const deleted = await storage.deleteProduct(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Produit non trouvé" });
            }
            return res.json({ success: true, message: "Produit supprimé avec succès" });
        } catch (error) {
            console.error("Error deleting product:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la suppression du produit."
            });
        }
    });

    // ============================================
    // CATEGORIES ROUTES
    // ============================================

    // Get all categories
    app.get("/api/categories", async (req, res) => {
        try {
            const categories = await storage.getCategories();
            return res.json(categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la récupération des catégories."
            });
        }
    });

    // Get single category
    app.get("/api/categories/:id", async (req, res) => {
        try {
            const category = await storage.getCategory(req.params.id);
            if (!category) {
                return res.status(404).json({ error: "Catégorie non trouvée" });
            }
            return res.json(category);
        } catch (error) {
            console.error("Error fetching category:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la récupération de la catégorie."
            });
        }
    });

    // Create category
    app.post("/api/categories", async (req, res) => {
        try {
            const result = insertCategorySchema.safeParse(req.body);

            if (!result.success) {
                const validationError = fromError(result.error);
                return res.status(400).json({
                    error: validationError.toString(),
                    details: result.error.flatten()
                });
            }

            const category = await storage.createCategory(result.data);
            return res.status(201).json(category);
        } catch (error) {
            console.error("Error creating category:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la création de la catégorie."
            });
        }
    });

    // Update category
    app.put("/api/categories/:id", async (req, res) => {
        try {
            const category = await storage.updateCategory(req.params.id, req.body);
            if (!category) {
                return res.status(404).json({ error: "Catégorie non trouvée" });
            }
            return res.json(category);
        } catch (error) {
            console.error("Error updating category:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la mise à jour de la catégorie."
            });
        }
    });

    // Delete category
    app.delete("/api/categories/:id", async (req, res) => {
        try {
            const deleted = await storage.deleteCategory(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Catégorie non trouvée" });
            }
            return res.json({ success: true, message: "Catégorie supprimée avec succès" });
        } catch (error) {
            console.error("Error deleting category:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la suppression de la catégorie."
            });
        }
    });

    // ============================================
    // CUSTOMERS ROUTES
    // ============================================

    // Get all customers
    app.get("/api/customers", async (req, res) => {
        try {
            const customers = await storage.getCustomers();
            return res.json(customers);
        } catch (error) {
            console.error("Error fetching customers:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la récupération des clients."
            });
        }
    });

    // Get single customer
    app.get("/api/customers/:id", async (req, res) => {
        try {
            const customer = await storage.getCustomer(req.params.id);
            if (!customer) {
                return res.status(404).json({ error: "Client non trouvé" });
            }
            return res.json(customer);
        } catch (error) {
            console.error("Error fetching customer:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la récupération du client."
            });
        }
    });

    // Create customer
    app.post("/api/customers", async (req, res) => {
        try {
            const result = insertCustomerSchema.safeParse(req.body);

            if (!result.success) {
                const validationError = fromError(result.error);
                return res.status(400).json({
                    error: validationError.toString(),
                    details: result.error.flatten()
                });
            }

            const customer = await storage.createCustomer(result.data);
            return res.status(201).json(customer);
        } catch (error) {
            console.error("Error creating customer:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la création du client."
            });
        }
    });

    // Update customer
    app.put("/api/customers/:id", async (req, res) => {
        try {
            const customer = await storage.updateCustomer(req.params.id, req.body);
            if (!customer) {
                return res.status(404).json({ error: "Client non trouvé" });
            }
            return res.json(customer);
        } catch (error) {
            console.error("Error updating customer:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la mise à jour du client."
            });
        }
    });

    // Delete customer
    app.delete("/api/customers/:id", async (req, res) => {
        try {
            const deleted = await storage.deleteCustomer(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Client non trouvé" });
            }
            return res.json({ success: true, message: "Client supprimé avec succès" });
        } catch (error) {
            console.error("Error deleting customer:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la suppression du client."
            });
        }
    });

    // ============================================
    // ORDERS ROUTES
    // ============================================

    // Get all orders
    app.get("/api/orders", async (req, res) => {
        try {
            const orders = await storage.getOrders();
            return res.json(orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la récupération des commandes."
            });
        }
    });

    // Get single order
    app.get("/api/orders/:id", async (req, res) => {
        try {
            const order = await storage.getOrder(req.params.id);
            if (!order) {
                return res.status(404).json({ error: "Commande non trouvée" });
            }

            // Get order items
            const items = await storage.getOrderItems(req.params.id);

            return res.json({ ...order, items });
        } catch (error) {
            console.error("Error fetching order:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la récupération de la commande."
            });
        }
    });

    // Get orders by customer
    app.get("/api/customers/:customerId/orders", async (req, res) => {
        try {
            const orders = await storage.getOrdersByCustomer(req.params.customerId);
            return res.json(orders);
        } catch (error) {
            console.error("Error fetching customer orders:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la récupération des commandes du client."
            });
        }
    });

    // Create order
    app.post("/api/orders", async (req, res) => {
        try {
            const { items, ...orderData } = req.body;

            const orderResult = insertOrderSchema.safeParse(orderData);

            if (!orderResult.success) {
                const validationError = fromError(orderResult.error);
                return res.status(400).json({
                    error: validationError.toString(),
                    details: orderResult.error.flatten()
                });
            }

            const order = await storage.createOrder(orderResult.data);

            // Create order items if provided
            if (items && Array.isArray(items)) {
                for (const item of items) {
                    await storage.createOrderItem({
                        ...item,
                        orderId: order.id,
                    });
                }
            }

            return res.status(201).json(order);
        } catch (error) {
            console.error("Error creating order:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la création de la commande."
            });
        }
    });

    // Update order
    app.put("/api/orders/:id", async (req, res) => {
        try {
            const order = await storage.updateOrder(req.params.id, req.body);
            if (!order) {
                return res.status(404).json({ error: "Commande non trouvée" });
            }
            return res.json(order);
        } catch (error) {
            console.error("Error updating order:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la mise à jour de la commande."
            });
        }
    });

    // Delete order
    app.delete("/api/orders/:id", async (req, res) => {
        try {
            const deleted = await storage.deleteOrder(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: "Commande non trouvée" });
            }
            return res.json({ success: true, message: "Commande supprimée avec succès" });
        } catch (error) {
            console.error("Error deleting order:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la suppression de la commande."
            });
        }
    });

    // ============================================
    // STATISTICS ROUTES (for dashboard)
    // ============================================

    app.get("/api/shop/stats", async (req, res) => {
        try {
            const products = await storage.getProducts();
            const orders = await storage.getOrders();
            const customers = await storage.getCustomers();

            // Calculate statistics
            const totalProducts = products.length;
            const publishedProducts = products.filter(p => p.published).length;
            const lowStockProducts = products.filter(p => p.stock <= (p.lowStockThreshold || 5)).length;

            const totalOrders = orders.length;
            const pendingOrders = orders.filter(o => o.status === 'pending').length;
            const processingOrders = orders.filter(o => o.status === 'processing').length;
            const completedOrders = orders.filter(o => o.status === 'delivered').length;

            const totalRevenue = orders
                .filter(o => o.paymentStatus === 'paid')
                .reduce((sum, order) => sum + parseFloat(order.total || '0'), 0);

            const totalCustomers = customers.length;

            // Recent orders (last 5)
            const recentOrders = orders.slice(0, 5);

            // Low stock products
            const lowStock = products
                .filter(p => p.stock <= (p.lowStockThreshold || 5))
                .sort((a, b) => a.stock - b.stock)
                .slice(0, 10);

            return res.json({
                products: {
                    total: totalProducts,
                    published: publishedProducts,
                    lowStock: lowStockProducts,
                },
                orders: {
                    total: totalOrders,
                    pending: pendingOrders,
                    processing: processingOrders,
                    completed: completedOrders,
                },
                revenue: {
                    total: totalRevenue.toFixed(2),
                },
                customers: {
                    total: totalCustomers,
                },
                recentOrders,
                lowStockProducts: lowStock,
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
            return res.status(500).json({
                error: "Une erreur est survenue lors de la récupération des statistiques."
            });
        }
    });
}
