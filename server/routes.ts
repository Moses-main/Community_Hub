import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage, type ISermonFilter } from "./storage";
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
      phone: user.phone,
      address: user.address,
      houseFellowship: user.houseFellowship,
      parish: user.parish,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      isAdmin: user.email === 'admin@wccrm.com'
    })));
  });

  // Get user details (admin only)
  app.get("/api/admin/users/:id", isAuthenticated, isAdmin, async (req, res) => {
    const userId = req.params.id as string;
    const user = await storage.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
      houseFellowship: user.houseFellowship,
      parish: user.parish,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isAdmin: user.email === 'admin@wccrm.com'
    });
  });

  // Update user role (admin only)
  app.put("/api/admin/users/:id/role", isAuthenticated, isAdmin, async (req, res) => {
    const userId = req.params.id as string;
    const { role } = req.body;
    
    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const validRoles = [
      'USER', 'ADMIN', 'PASTOR', 'PASTORS_WIFE', 'CHILDREN_LEADER',
      'CHOIRMASTER', 'CHORISTER', 'SOUND_EQUIPMENT', 'SECURITY',
      'USHERS_LEADER', 'USHER', 'SUNDAY_SCHOOL_TEACHER', 'CELL_LEADER',
      'PRAYER_TEAM', 'FINANCE_TEAM', 'TECH_TEAM', 'DECOR_TEAM', 'EVANGELISM_TEAM'
    ];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await storage.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await storage.updateUserRole(userId, role);
    res.json({ message: "Role updated successfully" });
  });

  // Update user profile (admin only)
  app.put("/api/admin/users/:id", isAuthenticated, isAdmin, async (req, res) => {
    const userId = req.params.id as string;
    const { firstName, lastName, phone, address, houseFellowship } = req.body;
    
    const user = await storage.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await storage.updateUser(userId, {
      firstName: firstName ?? user.firstName,
      lastName: lastName ?? user.lastName,
      phone: phone ?? user.phone,
      address: address ?? user.address,
      houseFellowship: houseFellowship ?? user.houseFellowship,
    });

    const updatedUser = await storage.getUserById(userId);
    res.json(updatedUser);
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
      const { title, description, date, location, imageUrl } = req.body;
      const input: Partial<{ title: string; description: string; date: Date; location: string; imageUrl?: string }> = {};
      if (title !== undefined) input.title = title;
      if (description !== undefined) input.description = description;
      if (date !== undefined) input.date = new Date(date);
      if (location !== undefined) input.location = location;
      if (imageUrl !== undefined) input.imageUrl = imageUrl;
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
    const { speaker, series, status, search } = req.query;
    const filter: ISermonFilter = {};
    
    if (speaker) filter.speaker = speaker as string;
    if (series) filter.series = series as string;
    if (search) filter.search = search as string;
    if (status === 'upcoming') filter.isUpcoming = true;
    if (status === 'past') filter.isUpcoming = false;
    
    const sermons = await storage.getSermons(filter);
    res.json(sermons);
  });

  app.get(api.sermons.get.path, async (req, res) => {
    const sermon = await storage.getSermon(Number(req.params.id));
    if (!sermon) return res.status(404).json({ message: "Sermon not found" });
    res.json(sermon);
  });

  // Share sermon - returns social media share links
  app.get("/api/sermons/:id/share", async (req, res) => {
    const sermon = await storage.getSermon(Number(req.params.id));
    if (!sermon) return res.status(404).json({ message: "Sermon not found" });
    
    const baseUrl = process.env.BASE_URL || `https://${req.get('host')}`;
    const sermonUrl = `${baseUrl}/sermons/${sermon.id}`;
    const sermonTitle = encodeURIComponent(sermon.title);
    const sermonDescription = sermon.description ? encodeURIComponent(sermon.description.substring(0, 100)) : '';
    
    const shareLinks = {
      x: `https://twitter.com/intent/tweet?text=${sermonTitle}&url=${encodeURIComponent(sermonUrl)}`,
      whatsapp: `https://wa.me/?text=${sermonTitle}%20${encodeURIComponent(sermonUrl)}`,
      email: `mailto:?subject=${sermonTitle}&body=${sermonDescription}%20${encodeURIComponent(sermonUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sermonUrl)}`,
      instagram: `https://www.instagram.com/`,
      tiktok: `https://www.tiktok.com/`,
      copyLink: sermonUrl
    };
    
    res.json(shareLinks);
  });

  // Download sermon audio/video
  app.get("/api/sermons/:id/download", async (req, res) => {
    const sermon = await storage.getSermon(Number(req.params.id));
    if (!sermon) return res.status(404).json({ message: "Sermon not found" });
    
    const { type } = req.query;
    let downloadUrl = null;
    let filename = '';
    
    if (type === 'video' && sermon.videoUrl) {
      downloadUrl = sermon.videoUrl;
      filename = `${sermon.title}-video.mp4`;
    } else if (type === 'audio' && sermon.audioUrl) {
      downloadUrl = sermon.audioUrl;
      filename = `${sermon.title}-audio.mp3`;
    } else if (!type) {
      if (sermon.audioUrl) {
        downloadUrl = sermon.audioUrl;
        filename = `${sermon.title}-audio.mp3`;
      } else if (sermon.videoUrl) {
        downloadUrl = sermon.videoUrl;
        filename = `${sermon.title}-video.mp4`;
      }
    }
    
    if (!downloadUrl) return res.status(404).json({ message: "No download available" });
    
    res.json({ url: downloadUrl, filename, title: sermon.title });
  });

  // Admin only: Create sermon
  app.post(api.sermons.create.path, isAuthenticated, isAdmin, async (req, res) => {
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

  // Update sermon (admin only)
  app.put("/api/sermons/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { title, speaker, date, topic, videoUrl, videoFilePath, audioUrl, audioFilePath, series, description, thumbnailUrl, isUpcoming } = req.body;
      const input: Partial<{ title: string; speaker: string; date: Date; topic?: string; videoUrl?: string; videoFilePath?: string; audioUrl?: string; audioFilePath?: string; series?: string; description?: string; thumbnailUrl?: string; isUpcoming?: boolean }> = {};
      if (title !== undefined) input.title = title;
      if (speaker !== undefined) input.speaker = speaker;
      if (date !== undefined) input.date = new Date(date);
      if (topic !== undefined) input.topic = topic;
      if (videoUrl !== undefined) input.videoUrl = videoUrl;
      if (videoFilePath !== undefined) input.videoFilePath = videoFilePath;
      if (audioUrl !== undefined) input.audioUrl = audioUrl;
      if (audioFilePath !== undefined) input.audioFilePath = audioFilePath;
      if (series !== undefined) input.series = series;
      if (description !== undefined) input.description = description;
      if (thumbnailUrl !== undefined) input.thumbnailUrl = thumbnailUrl;
      if (isUpcoming !== undefined) input.isUpcoming = isUpcoming;
      const sermon = await storage.updateSermon(id, input);
      res.json(sermon);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete sermon (admin only)
  app.delete("/api/sermons/:id", isAuthenticated, isAdmin, async (req, res) => {
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
      topic: "Community",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      isUpcoming: false,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=60",
    });
    await storage.createSermon({
      title: "Finding Peace in Chaos",
      speaker: "Pastor Jane Smith",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      description: "How to maintain inner peace when the world is crazy.",
      series: "Peace of Mind",
      topic: "Peace",
      isUpcoming: false,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1507692049790-de58293a4697?w=800&auto=format&fit=crop&q=60",
    });
    await storage.createSermon({
      title: "Walking in Faith",
      speaker: "Pastor Emmanuel Moses",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      description: "Learning to trust God in every step of our journey.",
      series: "Faith Journey",
      topic: "Faith",
      isUpcoming: true,
      thumbnailUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60",
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
