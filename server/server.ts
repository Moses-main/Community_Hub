import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { createServer, type Server as HttpServer } from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { storage } from './storage';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from './config';
import { api as authRouter } from './routes/auth';


// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        isAdmin?: boolean;
      };
    }
  }
}

// JWT secret (in production, use a secure environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Authentication schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

// Authentication middleware
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await storage.getUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Admin middleware
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Create and configure the Express app
export const createApp = (): { app: Express; httpServer: HttpServer } => {
  const app = express();
  const httpServer = createServer(app);
// allowed origins
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'https://wccrm-lagos.vercel.app',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true); // allow mobile apps / curl
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Manual CORS headers for all requests
  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  //   res.header('Access-Control-Allow-Credentials', 'true');
    
  //   if (req.method === 'OPTIONS') {
  //     return res.status(200).end();
  //   }
  //   next();
  // });

  // Configure CORS with specific options
  const corsOptions = {
    origin:
      process.env.NODE_ENV === 'production'
        ? true
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'https://wccrm-lagos.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  };

  // Apply CORS with the specified options
  app.use(cors(corsOptions));
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    const { method, path } = req;

    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${method} ${path} - ${res.statusCode} (${duration}ms)`);
    });

    next();
  });

  // API Routes
  app.use('/api/auth', authRouter);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  });

  // 404 handler - must be at the end
  app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
  });
  

  return { app, httpServer };
};

// Start the server
export const startServer = async (): Promise<HttpServer> => {
  const { httpServer } = createApp();
  const PORT = config.port;

  return new Promise((resolve) => {
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      resolve(httpServer);
    });
  });
};

// Start the server if this file is run directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}
