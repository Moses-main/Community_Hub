import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isAdmin?: boolean;
  };
}

// JWT secret (in production, use a secure environment variable)
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

// Authentication schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().optional(),
});

// Authentication middleware
const isAuthenticated = async (req: AuthenticatedRequest, res: any, next: any) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = {
      id: user.id,
      email: user.email!,
      firstName: user.firstName || undefined,
      lastName: user.lastName || undefined,
      isAdmin: user.email === 'admin@wccrm.com' // Simple admin check
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin middleware
const isAdmin = async (req: AuthenticatedRequest, res: any, next: any) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  // === AUTHENTICATION ROUTES ===

  // Get current user
  app.get("/api/auth/user", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    res.json(req.user);
  });

  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.email === 'admin@wccrm.com'
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Signup
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, firstName, lastName } = signupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create user
      const user = await storage.createUser({
        email,
        passwordHash,
        firstName,
        lastName: lastName || '',
      });

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(201).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.email === 'admin@wccrm.com'
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.json({ message: "Logged out successfully" });
  });

  // Legacy login redirect (for compatibility)
  app.get("/api/login", (req, res) => {
    res.redirect("/auth/login");
  });

  app.get("/api/logout", (req, res) => {
    res.clearCookie('token');
    res.redirect("/");
  });

  // === ADMIN ROUTES ===

  // Get all users (admin only)
  app.get("/api/admin/users", isAuthenticated, isAdmin, async (req, res) => {
    const users = await storage.getAllUsers();
    res.json(users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      isAdmin: user.email === 'admin@wccrm.com'
    })));
  });

  // Get user details (admin only)
  app.get("/api/admin/users/:id", isAuthenticated, isAdmin, async (req, res) => {
    const user = await storage.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.email === 'admin@wccrm.com'
    });
  });

  // === APP ROUTES ===

  // Branding
  app.get(api.branding.get.path, async (req, res) => {
    const branding = await storage.getBranding();
    if (!branding)
      return res.status(404).json({ message: "Branding not found" });
    res.json(branding);
  });

  app.post(api.branding.update.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.branding.update.input.parse(req.body);
      const updated = await storage.updateBranding(input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Events
  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  app.get(api.events.get.path, async (req, res) => {
    const event = await storage.getEvent(Number(req.params.id));
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  });

  app.post(api.events.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.events.create.input.parse(req.body);
      // Convert date string to Date object
      const eventData = {
        ...input,
        date: new Date(input.date),
      };
      const event = await storage.createEvent(eventData);
      res.status(201).json(event);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.events.rsvp.path, isAuthenticated, async (req, res) => {
    // Mock RSVP for now
    res.json({ message: "RSVP successful" });
  });

  // Update event
  app.put("/api/events/:id", isAuthenticated, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.events.create.input.partial().parse(req.body);
      const event = await storage.updateEvent(id, input);
      res.json(event);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete event
  app.delete("/api/events/:id", isAuthenticated, async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteEvent(id);
      res.json({ message: "Event deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Sermons
  app.get(api.sermons.list.path, async (req, res) => {
    const sermons = await storage.getSermons();
    res.json(sermons);
  });

  app.get(api.sermons.get.path, async (req, res) => {
    const sermon = await storage.getSermon(Number(req.params.id));
    if (!sermon) return res.status(404).json({ message: "Sermon not found" });
    res.json(sermon);
  });

  app.post(api.sermons.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.sermons.create.input.parse(req.body);
      const sermon = await storage.createSermon(input);
      res.status(201).json(sermon);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update sermon
  app.put("/api/sermons/:id", isAuthenticated, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.sermons.create.input.partial().parse(req.body);
      const sermon = await storage.updateSermon(id, input);
      res.json(sermon);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete sermon
  app.delete("/api/sermons/:id", isAuthenticated, async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteSermon(id);
      res.json({ message: "Sermon deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Prayer Requests
  app.get(api.prayer.list.path, async (req, res) => {
    const requests = await storage.getPrayerRequests();
    res.json(requests);
  });

  // Get current user's prayer requests
  app.get("/api/prayer-requests/me", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    const allRequests = await storage.getPrayerRequests();
    const userRequests = allRequests.filter(r => r.userId === req.user?.id);
    res.json(userRequests);
  });

  // Create prayer request - NO auth required (open to all)
  app.post(api.prayer.create.path, async (req, res) => {
    try {
      const input = api.prayer.create.input.parse(req.body);
      // Try to get user ID from auth if available, otherwise allow anonymous
      let userId: string | undefined;
      try {
        const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');
        if (token) {
          const decoded = jwt.verify(token, JWT_SECRET) as any;
          userId = decoded.userId;
        }
      } catch (e) {
        // Not authenticated, that's fine - allow anonymous requests
      }
      
      const requestWithUser = { ...input, userId };
      const request = await storage.createPrayerRequest(requestWithUser);
      res.status(201).json(request);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.prayer.pray.path, async (req, res) => {
    const updated = await storage.incrementPrayCount(Number(req.params.id));
    if (!updated) return res.status(404).json({ message: "Request not found" });
    res.json(updated);
  });

  // Donations
  app.post(api.donations.create.path, async (req, res) => {
    try {
      const input = api.donations.create.input.parse(req.body);
      const donation = await storage.createDonation(input);
      res.status(201).json(donation);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Seed data function
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingSermons = await storage.getSermons();
  if (existingSermons.length === 0) {
    await storage.createSermon({
      title: "The Power of Community",
      speaker: "Pastor John Doe",
      date: new Date(),
      description: "Discover why we need each other to grow in faith.",
      series: "Better Together",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
      thumbnailUrl:
        "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=60",
    });
    await storage.createSermon({
      title: "Finding Peace in Chaos",
      speaker: "Pastor Jane Smith",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      description: "How to maintain inner peace when the world is crazy.",
      series: "Peace of Mind",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1507692049790-de58293a4697?w=800&auto=format&fit=crop&q=60",
    });
  } else {
    for (const sermon of existingSermons) {
      await storage.updateSermon(sermon.id, { date: new Date(Date.now() - (sermon.id - 1) * 7 * 24 * 60 * 60 * 1000) });
    }
  }

  const existingEvents = await storage.getEvents();
  if (existingEvents.length === 0) {
    await storage.createEvent({
      title: "Sunday Service",
      description: "Join us for worship and a message.",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      location: "Main Sanctuary",
      imageUrl:
        "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&auto=format&fit=crop&q=60",
    });
    await storage.createEvent({
      title: "Youth Group Night",
      description: "Fun, games, and fellowship for teens.",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      location: "Youth Hall",
      imageUrl:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=60",
    });
  } else {
    const eventDates = [
      new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ];
    for (let i = 0; i < existingEvents.length; i++) {
      await storage.updateEvent(existingEvents[i].id, { date: eventDates[i] || eventDates[0] });
    }
  }
}
