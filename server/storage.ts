import { 
  users, branding, events, sermons, prayerRequests, donations,
  type User, type Branding, type Event, type Sermon, type PrayerRequest, type Donation,
  type InsertBranding, type InsertEvent, type InsertSermon, type InsertPrayerRequest, type InsertDonation
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Branding
  getBranding(): Promise<Branding | undefined>;
  updateBranding(branding: InsertBranding): Promise<Branding>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Sermons
  getSermons(): Promise<Sermon[]>;
  getSermon(id: number): Promise<Sermon | undefined>;
  createSermon(sermon: InsertSermon): Promise<Sermon>;

  // Prayer Requests
  getPrayerRequests(): Promise<PrayerRequest[]>;
  createPrayerRequest(request: InsertPrayerRequest): Promise<PrayerRequest>;
  incrementPrayCount(id: number): Promise<PrayerRequest | undefined>;

  // Donations
  createDonation(donation: InsertDonation): Promise<Donation>;
}

export class DatabaseStorage implements IStorage {
  // Branding
  async getBranding(): Promise<Branding | undefined> {
    const [b] = await db.select().from(branding).limit(1);
    return b;
  }

  async updateBranding(insertBranding: InsertBranding): Promise<Branding> {
    const existing = await this.getBranding();
    if (existing) {
      const [updated] = await db
        .update(branding)
        .set(insertBranding)
        .where(eq(branding.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(branding)
        .values(insertBranding)
        .returning();
      return created;
    }
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.date));
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db.insert(events).values(insertEvent).returning();
    return event;
  }

  // Sermons
  async getSermons(): Promise<Sermon[]> {
    return await db.select().from(sermons).orderBy(desc(sermons.date));
  }

  async getSermon(id: number): Promise<Sermon | undefined> {
    const [sermon] = await db.select().from(sermons).where(eq(sermons.id, id));
    return sermon;
  }

  async createSermon(insertSermon: InsertSermon): Promise<Sermon> {
    const [sermon] = await db.insert(sermons).values(insertSermon).returning();
    return sermon;
  }

  // Prayer Requests
  async getPrayerRequests(): Promise<PrayerRequest[]> {
    return await db.select().from(prayerRequests).orderBy(desc(prayerRequests.createdAt));
  }

  async createPrayerRequest(insertRequest: InsertPrayerRequest): Promise<PrayerRequest> {
    const [request] = await db.insert(prayerRequests).values(insertRequest).returning();
    return request;
  }

  async incrementPrayCount(id: number): Promise<PrayerRequest | undefined> {
    const [request] = await db.select().from(prayerRequests).where(eq(prayerRequests.id, id));
    if (!request) return undefined;

    const [updated] = await db
      .update(prayerRequests)
      .set({ prayCount: (request.prayCount || 0) + 1 })
      .where(eq(prayerRequests.id, id))
      .returning();
    return updated;
  }

  // Donations
  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const [donation] = await db.insert(donations).values(insertDonation).returning();
    return donation;
  }
}

export const storage = new DatabaseStorage();
