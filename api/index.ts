import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes';
import { log } from '../server/index';

// Create Express app for serverless
const app = express();

// Middleware setup
app.use(express.json({
  verify: (req: any, _res, buf) => {
    req.rawBody = buf;
  },
}));

app.use(express.urlencoded({ extended: false }));

// Add logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (path.startsWith('/api')) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

// Initialize routes
let routesInitialized = false;
const initializeRoutes = async () => {
  if (!routesInitialized) {
    try {
      await registerRoutes(null as any, app);
      routesInitialized = true;
    } catch (error) {
      console.error('Failed to initialize routes:', error);
      throw error;
    }
  }
};

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error('Internal Server Error:', err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(status).json({ message });
});

// Main Vercel handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Initialize routes if not already done
    await initializeRoutes();

    // Handle the request with Express app
    return new Promise((resolve, reject) => {
      app(req as any, res as any, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Something went wrong'
    });
  }
}
