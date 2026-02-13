import { Router } from "express";
import { storage } from "../storage";
import { insertPrayerRequestSchema } from "@shared/schema";
import { isAuthenticated } from "../server"; // if you want auth protection

export const prayerRouter = Router();

/**
 * GET all prayer requests
 */
prayerRouter.get("/", async (_req, res) => {
  try {
    const prayers = await storage.getPrayerRequests();
    res.json(prayers);
  } catch (error) {
    console.error("Error fetching prayer requests:", error);
    res.status(500).json({ message: "Failed to fetch prayer requests" });
  }
});

/**
 * CREATE prayer request
 */
prayerRouter.post("/", isAuthenticated, async (req, res) => {
  try {
    // Validate using your drizzle-zod schema
    const validated = insertPrayerRequestSchema.parse({
        ...req.body,
        userId: req.user?.id,
      });
    const prayer = await storage.createPrayerRequest(validated);

    res.status(201).json(prayer);
  } catch (error) {
    console.error("Error creating prayer request:", error);
    res.status(400).json({ message: "Invalid prayer request data" });
  }
});

/**
 * PRAY for a request (increment counter)
 */
prayerRouter.post("/:id/pray", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid prayer ID" });
    }

    const updated = await storage.incrementPrayCount(id);

    if (!updated) {
      return res.status(404).json({ message: "Prayer request not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error incrementing prayer count:", error);
    res.status(500).json({ message: "Failed to pray for request" });
  }
});
