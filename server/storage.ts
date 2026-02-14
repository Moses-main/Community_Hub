import { 
  users, branding, events, sermons, prayerRequests, donations, eventRsvps,
  attendance, attendanceLinks, attendanceSettings,
  type User, type Branding, type Event, type Sermon, type PrayerRequest, type Donation, type EventRsvp,
  type InsertBranding, type InsertEvent, type InsertSermon, type InsertPrayerRequest, type InsertDonation, type InsertEventRsvp,
  type Attendance, type AttendanceLink, type AttendanceSettings,
  type InsertAttendance, type InsertAttendanceLink, type InsertAttendanceSettings
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, or, and, sql, gte, lte } from "drizzle-orm";

export interface ISermonFilter {
  speaker?: string;
  series?: string;
  isUpcoming?: boolean;
  search?: string;
}

export interface IStorage {
  // Users
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: { email: string; passwordHash: string; firstName: string; lastName: string; phone?: string; address?: string; houseFellowship?: string }): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  updateUserRole(id: string, role: string): Promise<User>;
  getAllUsers(): Promise<User[]>;
  searchUsers(query: string): Promise<User[]>;
  updateUserHouseCell(id: string, houseCellLocation: string): Promise<User>;
  verifyUser(id: string): Promise<User>;

  // Branding
  getBranding(): Promise<Branding | undefined>;
  updateBranding(branding: InsertBranding): Promise<Branding>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: number): Promise<void>;
  
  // Sermons
  getSermons(filter?: ISermonFilter): Promise<Sermon[]>;
  getSermon(id: number): Promise<Sermon | undefined>;
  createSermon(sermon: InsertSermon): Promise<Sermon>;
  updateSermon(id: number, sermon: Partial<InsertSermon>): Promise<Sermon>;
  deleteSermon(id: number): Promise<void>;

  // Prayer Requests
  getPrayerRequests(): Promise<PrayerRequest[]>;
  createPrayerRequest(request: InsertPrayerRequest): Promise<PrayerRequest>;
  incrementPrayCount(id: number): Promise<PrayerRequest | undefined>;
  deletePrayerRequest(id: number): Promise<void>;

  // Donations
  createDonation(donation: InsertDonation): Promise<Donation>;
  getDonations(): Promise<Donation[]>;

  // Event RSVPs
  rsvpToEvent(eventId: number, userId: string): Promise<EventRsvp>;
  removeRsvp(eventId: number, userId: string): Promise<void>;
  getUserRsvps(userId: string): Promise<EventRsvp[]>;
  getEventRsvps(eventId: number): Promise<EventRsvp[]>;
  markAddedToCalendar(eventId: number, userId: string): Promise<EventRsvp>;

  // Attendance
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  getAttendanceByUser(userId: string): Promise<Attendance[]>;
  getAttendanceByService(serviceType: string, serviceDate: Date): Promise<Attendance[]>;
  getAttendanceById(id: number): Promise<Attendance | undefined>;
  updateAttendance(id: number, updates: Partial<InsertAttendance>): Promise<Attendance>;
  deleteAttendance(id: number): Promise<void>;
  getUserAttendanceForService(userId: string, serviceType: string, serviceDate: Date): Promise<Attendance | undefined>;
  
  // Attendance Links
  createAttendanceLink(link: InsertAttendanceLink): Promise<AttendanceLink>;
  getAttendanceLinkByToken(token: string): Promise<AttendanceLink | undefined>;
  getAttendanceLinksByService(serviceType: string, serviceId?: number): Promise<AttendanceLink[]>;
  deactivateAttendanceLink(id: number): Promise<void>;
  
  // Attendance Settings
  getAttendanceSetting(key: string): Promise<string | undefined>;
  updateAttendanceSetting(key: string, value: string): Promise<void>;
  
  // Attendance Analytics
  getAttendanceStats(startDate: Date, endDate: Date, serviceType?: string): Promise<{
    total: number;
    online: number;
    offline: number;
    byService: { serviceType: string; count: number }[];
  }>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: { email: string; passwordHash: string; firstName: string; lastName: string; phone?: string; address?: string; houseFellowship?: string }): Promise<User> {
    const [user] = await db.insert(users).values({
      email: userData.email,
      passwordHash: userData.passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      address: userData.address,
      houseFellowship: userData.houseFellowship,
    }).returning();
    return user;
  }


  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.verificationToken, token));
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role: role as any, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async searchUsers(query: string): Promise<User[]> {
    const searchPattern = `%${query}%`;
    return await db.select().from(users).where(
      or(
        like(users.firstName, searchPattern),
        like(users.lastName, searchPattern),
        like(users.email, searchPattern),
        like(users.phone, searchPattern),
        like(users.houseFellowship, searchPattern),
        like(users.houseCellLocation, searchPattern),
        like(users.parish, searchPattern)
      )
    ).orderBy(desc(users.createdAt));
  }

  async updateUserHouseCell(id: string, houseCellLocation: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ houseCellLocation, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async verifyUser(id: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isVerified: true, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

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

  async updateEvent(id: number, update: Partial<InsertEvent>): Promise<Event> {
    const [event] = await db
      .update(events)
      .set(update)
      .where(eq(events.id, id))
      .returning();
    return event;
  }

  async deleteEvent(id: number): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  // Sermons
  async getSermons(filter?: ISermonFilter): Promise<Sermon[]> {
    if (filter) {
      const conditions = [];
      if (filter.speaker) {
        conditions.push(like(sermons.speaker, `%${filter.speaker}%`));
      }
      if (filter.series) {
        conditions.push(like(sermons.series, `%${filter.series}%`));
      }
      if (filter.isUpcoming !== undefined) {
        conditions.push(eq(sermons.isUpcoming, filter.isUpcoming));
      }
      if (filter.search) {
        const searchTerm = `%${filter.search}%`;
        conditions.push(or(
          like(sermons.title, searchTerm),
          like(sermons.speaker, searchTerm)
        ));
      }
      
      if (conditions.length > 0) {
        return await db.select().from(sermons).where(and(...conditions)).orderBy(desc(sermons.date));
      }
    }
    
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

  async updateSermon(id: number, update: Partial<InsertSermon>): Promise<Sermon> {
    const [sermon] = await db
      .update(sermons)
      .set(update)
      .where(eq(sermons.id, id))
      .returning();
    return sermon;
  }

  async deleteSermon(id: number): Promise<void> {
    await db.delete(sermons).where(eq(sermons.id, id));
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

  async deletePrayerRequest(id: number): Promise<void> {
    await db.delete(prayerRequests).where(eq(prayerRequests.id, id));
  }

  // Donations
  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const [donation] = await db.insert(donations).values(insertDonation).returning();
    return donation;
  }

  async getDonations(): Promise<Donation[]> {
    return await db.select().from(donations).orderBy(desc(donations.createdAt));
  }

  // Event RSVPs
  async rsvpToEvent(eventId: number, userId: string): Promise<EventRsvp> {
    const existing = await db.select().from(eventRsvps).where(
      and(eq(eventRsvps.eventId, eventId), eq(eventRsvps.userId, userId))
    );
    if (existing.length > 0) {
      return existing[0];
    }
    const [rsvp] = await db.insert(eventRsvps).values({ eventId, userId }).returning();
    return rsvp;
  }

  async removeRsvp(eventId: number, userId: string): Promise<void> {
    await db.delete(eventRsvps).where(
      and(eq(eventRsvps.eventId, eventId), eq(eventRsvps.userId, userId))
    );
  }

  async getUserRsvps(userId: string): Promise<EventRsvp[]> {
    return await db.select().from(eventRsvps).where(eq(eventRsvps.userId, userId));
  }

  async getEventRsvps(eventId: number): Promise<EventRsvp[]> {
    return await db.select().from(eventRsvps).where(eq(eventRsvps.eventId, eventId));
  }

  async markAddedToCalendar(eventId: number, userId: string): Promise<EventRsvp> {
    const [rsvp] = await db
      .update(eventRsvps)
      .set({ addedToCalendar: true })
      .where(and(eq(eventRsvps.eventId, eventId), eq(eventRsvps.userId, userId)))
      .returning();
    return rsvp;
  }

  // Attendance
  async createAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const [record] = await db.insert(attendance).values(insertAttendance).returning();
    return record;
  }

  async getAttendanceByUser(userId: string): Promise<Attendance[]> {
    return await db.select().from(attendance).where(eq(attendance.userId, userId)).orderBy(desc(attendance.serviceDate));
  }

  async getAttendanceByService(serviceType: string, serviceDate: Date): Promise<Attendance[]> {
    const startOfDay = new Date(serviceDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(serviceDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await db.select().from(attendance).where(
      and(
        eq(attendance.serviceType, serviceType as any),
        gte(attendance.serviceDate, startOfDay),
        lte(attendance.serviceDate, endOfDay)
      )
    );
  }

  async getAttendanceById(id: number): Promise<Attendance | undefined> {
    const [record] = await db.select().from(attendance).where(eq(attendance.id, id));
    return record;
  }

  async updateAttendance(id: number, updates: Partial<InsertAttendance>): Promise<Attendance> {
    const [record] = await db
      .update(attendance)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(attendance.id, id))
      .returning();
    return record;
  }

  async deleteAttendance(id: number): Promise<void> {
    await db.delete(attendance).where(eq(attendance.id, id));
  }

  async getUserAttendanceForService(userId: string, serviceType: string, serviceDate: Date): Promise<Attendance | undefined> {
    const startOfDay = new Date(serviceDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(serviceDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const [record] = await db.select().from(attendance).where(
      and(
        eq(attendance.userId, userId),
        eq(attendance.serviceType, serviceType as any),
        gte(attendance.serviceDate, startOfDay),
        lte(attendance.serviceDate, endOfDay)
      )
    );
    return record;
  }

  // Attendance Links
  async createAttendanceLink(link: InsertAttendanceLink): Promise<AttendanceLink> {
    const [record] = await db.insert(attendanceLinks).values(link).returning();
    return record;
  }

  async getAttendanceLinkByToken(token: string): Promise<AttendanceLink | undefined> {
    const [record] = await db.select().from(attendanceLinks).where(eq(attendanceLinks.uniqueToken, token));
    return record;
  }

  async getAttendanceLinksByService(serviceType: string, serviceId?: number): Promise<AttendanceLink[]> {
    if (serviceId) {
      return await db.select().from(attendanceLinks).where(
        and(eq(attendanceLinks.serviceType, serviceType as any), eq(attendanceLinks.serviceId, serviceId))
      );
    }
    return await db.select().from(attendanceLinks).where(eq(attendanceLinks.serviceType, serviceType as any));
  }

  async deactivateAttendanceLink(id: number): Promise<void> {
    await db.update(attendanceLinks).set({ isActive: false }).where(eq(attendanceLinks.id, id));
  }

  // Attendance Settings
  async getAttendanceSetting(key: string): Promise<string | undefined> {
    const [setting] = await db.select().from(attendanceSettings).where(eq(attendanceSettings.key, key));
    return setting?.value;
  }

  async updateAttendanceSetting(key: string, value: string): Promise<void> {
    await db.insert(attendanceSettings).values({ key, value }).onConflictDoUpdate({
      target: attendanceSettings.key,
      set: { value, updatedAt: new Date() }
    });
  }

  // Attendance Analytics
  async getAttendanceStats(startDate: Date, endDate: Date, serviceType?: string): Promise<{
    total: number;
    online: number;
    offline: number;
    byService: { serviceType: string; count: number }[];
  }> {
    const conditions = [
      gte(attendance.serviceDate, startDate),
      lte(attendance.serviceDate, endDate)
    ];
    
    if (serviceType) {
      conditions.push(eq(attendance.serviceType, serviceType as any));
    }

    const records = await db.select().from(attendance).where(and(...conditions));
    
    const total = records.length;
    const online = records.filter(r => r.isOnline).length;
    const offline = total - online;

    const byServiceMap = new Map<string, number>();
    for (const record of records) {
      const current = byServiceMap.get(record.serviceType) || 0;
      byServiceMap.set(record.serviceType, current + 1);
    }
    
    const byService = Array.from(byServiceMap.entries()).map(([serviceType, count]) => ({
      serviceType,
      count
    }));

    return { total, online, offline, byService };
  }
}

export const storage = new DatabaseStorage();
