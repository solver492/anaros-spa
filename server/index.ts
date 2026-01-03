import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  const method = req.method;

  log(`Incoming request: ${method} ${path}`);

  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    let logLine = `${method} ${path} ${res.statusCode} in ${duration}ms`;

    if (path.startsWith("/api") && capturedJsonResponse) {
      logLine += ` :: ${JSON.stringify(capturedJsonResponse).substring(0, 200)}${JSON.stringify(capturedJsonResponse).length > 200 ? "..." : ""}`;
    }

    log(logLine);
  });

  next();
});

function printRoutes(app: express.Express) {
  log("Listing registered routes:");
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      // routes registered directly on the app
      log(`${Object.keys(middleware.route.methods).join(",").toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === "router") {
      // router middleware
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          log(`${Object.keys(handler.route.methods).join(",").toUpperCase()} ${handler.route.path}`);
        }
      });
    }
  });
}

(async () => {
  try {
    log(`Starting server in ${process.env.NODE_ENV || 'development'} mode...`);

    if (!process.env.DATABASE_URL) {
      log("CRITICAL ERROR: DATABASE_URL is not defined!", "error");
    } else {
      log("DATABASE_URL detected.");
    }

    await registerRoutes(httpServer, app);
    printRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    if (process.env.NODE_ENV === "production") {
      log("Serving static files from dist/public...");
      serveStatic(app);
    } else {
      log("Setting up Vite development server...");
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }

    const port = parseInt(process.env.PORT || "5000", 10);
    const host = "0.0.0.0"; // Always bind to 0.0.0.0 in all environments for maximum compatibility

    httpServer.listen(
      {
        port,
        host,
      },
      () => {
        log(`Server successfully listening on http://localhost:${port}`);
      },
    );
  } catch (error) {
    log(`FATAL STARTUP ERROR: ${error instanceof Error ? error.message : String(error)}`, "error");
    process.exit(1);
  }
})();
