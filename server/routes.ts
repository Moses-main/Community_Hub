import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./replit_integrations/auth";
import { registerAuthRoutes } from "./replit_integrations/auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Setup Object Storage
  registerObjectStorageRoutes(app);

  // === APP ROUTES ===

  // Branding
  app.get(api.branding.get.path, async (req, res) => {
    const branding = await storage.getBranding();
    if (!branding) return res.status(404).json({ message: "Branding not found" });
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
      const event = await storage.createEvent(input);
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

  // Prayer Requests
  app.get(api.prayer.list.path, async (req, res) => {
    const requests = await storage.getPrayerRequests();
    res.json(requests);
  });

  app.post(api.prayer.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.prayer.create.input.parse(req.body);
      // Inject user ID from auth
      const user = req.user as any;
      const requestWithUser = { ...input, userId: user?.claims?.sub };
      
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
      thumbnailUrl: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=60"
    });
    await storage.createSermon({
      title: "Finding Peace in Chaos",
      speaker: "Pastor Jane Smith",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      description: "How to maintain inner peace when the world is crazy.",
      series: "Peace of Mind",
      thumbnailUrl: "https://images.unsplash.com/photo-1507692049790-de58293a4697?w=800&auto=format&fit=crop&q=60"
    });
  }

  const existingEvents = await storage.getEvents();
  if (existingEvents.length === 0) {
    await storage.createEvent({
      title: "Sunday Service",
      description: "Join us for worship and a message.",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      location: "Main Sanctuary",
      imageUrl: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&auto=format&fit=crop&q=60"
    });
    await storage.createEvent({
      title: "Youth Group Night",
      description: "Fun, games, and fellowship for teens.",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      location: "Youth Hall",
      imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop&q=60"
    });
  }
}
