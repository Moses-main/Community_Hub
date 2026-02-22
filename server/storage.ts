import { 
  users, branding, events, sermons, prayerRequests, donations, eventRsvps,
  attendance, attendanceLinks, attendanceSettings, memberMessages, fundraisingCampaigns,
  dailyDevotionals, bibleReadingPlans, bibleReadingProgress,
  music, musicGenres, musicPlaylists, playlistMusic,
  houseCells, houseCellMessages,
  groups, groupMembers, groupMessages,
  auditLogs, permissions,
  liveStreams,
  apiKeys, webhooks,
  volunteerSkills, volunteerProfiles, volunteerOpportunities, volunteerAssignments, volunteerBadges, userBadges,
  type User, type Branding, type Event, type Sermon, type PrayerRequest, type Donation, type EventRsvp, type FundraisingCampaign, type DailyDevotional, type BibleReadingPlan, type BibleReadingProgress,
  type Music, type MusicPlaylist, type MusicGenre,
  type InsertBranding, type InsertEvent, type InsertSermon, type InsertPrayerRequest, type InsertDonation, type InsertEventRsvp, type InsertFundraisingCampaign,
  type Attendance, type AttendanceLink, type AttendanceSettings, type MemberMessage,
  type InsertAttendance, type InsertAttendanceLink, type InsertAttendanceSettings, type InsertMemberMessage,
  type InsertMusic, type InsertMusicPlaylist,
  type HouseCell, type HouseCellMessage, type InsertHouseCell, type InsertHouseCellMessage,
  type Group, type GroupMember, type GroupMessage, type InsertGroup, type InsertGroupMember, type InsertGroupMessage,
  type LiveStream, type InsertLiveStream,
  type ApiKey, type InsertApiKey,
  type Webhook, type InsertWebhook,
  type VolunteerSkill, type InsertVolunteerSkill,
  type VolunteerProfile, type InsertVolunteerProfile,
  type VolunteerOpportunity, type InsertVolunteerOpportunity,
  type VolunteerAssignment, type InsertVolunteerAssignment,
  type VolunteerBadge, type InsertVolunteerBadge,
  type UserBadge, type InsertUserBadge
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, or, and, sql, gte, lte, lt, asc } from "drizzle-orm";

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
  getPrayerRequestById(id: number): Promise<PrayerRequest | undefined>;
  createPrayerRequest(request: InsertPrayerRequest): Promise<PrayerRequest>;
  updatePrayerRequest(id: number, updates: Partial<PrayerRequest>): Promise<PrayerRequest>;
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

  // Dashboard & Reporting Analytics
  getDashboardStats(): Promise<{
    totalMembers: number;
    totalDonations: number;
    totalEvents: number;
    totalSermons: number;
    totalPrayers: number;
    recentDonations: number;
    recentAttendance: number;
  }>;

  getDonationAnalytics(startDate: Date, endDate: Date): Promise<{
    total: number;
    count: number;
    average: number;
    byMonth: { month: string; total: number }[];
    byStatus: { status: string; count: number; total: number }[];
  }>;

  getMemberGrowthAnalytics(startDate: Date, endDate: Date): Promise<{
    total: number;
    newMembers: number;
    byMonth: { month: string; count: number }[];
  }>;

  getEventAnalytics(startDate: Date, endDate: Date): Promise<{
    total: number;
    upcoming: number;
    past: number;
    totalRsvps: number;
    byMonth: { month: string; count: number }[];
  }>;

  getPrayerAnalytics(startDate: Date, endDate: Date): Promise<{
    total: number;
    totalPrayers: number;
    byMonth: { month: string; count: number }[];
  }>;

  // Fundraising Campaigns
  getFundraisingCampaigns(activeOnly?: boolean): Promise<FundraisingCampaign[]>;
  getFundraisingCampaign(id: number): Promise<FundraisingCampaign | undefined>;
  createFundraisingCampaign(campaign: InsertFundraisingCampaign): Promise<FundraisingCampaign>;
  updateFundraisingCampaign(id: number, campaign: Partial<InsertFundraisingCampaign>): Promise<FundraisingCampaign>;
  deleteFundraisingCampaign(id: number): Promise<void>;
  getDonationHistory(userId: string): Promise<Donation[]>;

  // Daily Devotionals
  getDailyDevotionals(publishedOnly?: boolean): Promise<DailyDevotional[]>;
  getDailyDevotional(id: number): Promise<DailyDevotional | undefined>;
  getTodayDevotional(): Promise<DailyDevotional | undefined>;
  createDailyDevotional(devotional: Partial<DailyDevotional>): Promise<DailyDevotional>;
  updateDailyDevotional(id: number, devotional: Partial<DailyDevotional>): Promise<DailyDevotional>;
  deleteDailyDevotional(id: number): Promise<void>;

  // Bible Reading Plans
  getBibleReadingPlans(activeOnly?: boolean): Promise<BibleReadingPlan[]>;
  getBibleReadingPlan(id: number): Promise<BibleReadingPlan | undefined>;
  createBibleReadingPlan(plan: Partial<BibleReadingPlan>): Promise<BibleReadingPlan>;
  updateBibleReadingProgress(userId: string, planId: number, dayNumber: number): Promise<BibleReadingProgress>;
  getUserReadingProgress(userId: string, planId: number): Promise<BibleReadingProgress[]>;

  // Music Library
  getMusic(publishedOnly?: boolean): Promise<Music[]>;
  getMusicById(id: number): Promise<Music | undefined>;
  createMusic(music: InsertMusic): Promise<Music>;
  updateMusic(id: number, music: Partial<Music>): Promise<Music>;
  deleteMusic(id: number): Promise<void>;
  incrementMusicPlayCount(id: number): Promise<Music>;

  // Music Genres
  getMusicGenres(): Promise<MusicGenre[]>;
  createMusicGenre(name: string, description?: string): Promise<MusicGenre>;
  deleteMusicGenre(id: number): Promise<void>;

  // Music Playlists
  getMusicPlaylists(userId?: string): Promise<MusicPlaylist[]>;
  getMusicPlaylistById(id: number): Promise<MusicPlaylist | undefined>;
  createMusicPlaylist(playlist: InsertMusicPlaylist): Promise<MusicPlaylist>;
  updateMusicPlaylist(id: number, playlist: Partial<MusicPlaylist>): Promise<MusicPlaylist>;
  deleteMusicPlaylist(id: number): Promise<void>;
  addMusicToPlaylist(playlistId: number, musicId: number): Promise<void>;
  removeMusicFromPlaylist(playlistId: number, musicId: number): Promise<void>;
  getPlaylistTracks(playlistId: number): Promise<Music[]>;

  // House Cells
  getHouseCells(activeOnly?: boolean): Promise<HouseCell[]>;
  getHouseCellById(id: number): Promise<HouseCell | undefined>;
  createHouseCell(houseCell: InsertHouseCell): Promise<HouseCell>;
  updateHouseCell(id: number, houseCell: Partial<HouseCell>): Promise<HouseCell>;
  deleteHouseCell(id: number): Promise<void>;
  getHouseCellMembers(houseCellId: number): Promise<User[]>;
  assignUserToHouseCell(userId: string, houseCellId: number): Promise<User>;
  removeUserFromHouseCell(userId: string): Promise<User>;

  // House Cell Messages
  getHouseCellMessages(houseCellId: number): Promise<HouseCellMessage[]>;
  createHouseCellMessage(message: InsertHouseCellMessage): Promise<HouseCellMessage>;

  // Groups
  getGroups(): Promise<Group[]>;
  getGroupById(id: number): Promise<Group | undefined>;
  createGroup(group: InsertGroup): Promise<Group>;
  updateGroup(id: number, updates: Partial<Group>): Promise<Group>;
  deleteGroup(id: number): Promise<void>;
  getGroupMembers(groupId: number): Promise<GroupMember[]>;
  addGroupMember(member: InsertGroupMember): Promise<GroupMember>;
  removeGroupMember(groupId: number, userId: string): Promise<void>;
  getGroupMessages(groupId: number): Promise<GroupMessage[]>;
  createGroupMessage(message: InsertGroupMessage): Promise<GroupMessage>;
  getUserGroups(userId: string): Promise<Group[]>;

  // Audit Logs
  createAuditLog(log: { userId?: string; action: string; entityType?: string; entityId?: string; details?: any; ipAddress?: string }): Promise<void>;
  getAuditLogs(limit?: number): Promise<any[]>;

  // Live Streaming
  getLiveStreams(): Promise<LiveStream[]>;
  getLiveStream(id: number): Promise<LiveStream | undefined>;
  getCurrentLiveStream(): Promise<LiveStream | undefined>;
  createLiveStream(stream: InsertLiveStream): Promise<LiveStream>;
  updateLiveStream(id: number, updates: Partial<InsertLiveStream>): Promise<LiveStream>;
  deleteLiveStream(id: number): Promise<void>;
  updateViewerCount(id: number, count: number): Promise<LiveStream>;

  // API Keys
  getApiKeys(userId: string): Promise<ApiKey[]>;
  getApiKey(id: number): Promise<ApiKey | undefined>;
  getApiKeyByKey(key: string): Promise<ApiKey | undefined>;
  createApiKey(apiKey: InsertApiKey & { key: string; prefix: string }): Promise<ApiKey>;
  updateApiKey(id: number, updates: Partial<ApiKey>): Promise<ApiKey>;
  deleteApiKey(id: number): Promise<void>;

  // Webhooks
  getWebhooks(userId: string): Promise<Webhook[]>;
  getWebhook(id: number): Promise<Webhook | undefined>;
  createWebhook(webhook: InsertWebhook): Promise<Webhook>;
  updateWebhook(id: number, updates: Partial<Webhook>): Promise<Webhook>;
  deleteWebhook(id: number): Promise<void>;

  // Volunteer Management
  getVolunteerSkills(): Promise<VolunteerSkill[]>;
  createVolunteerSkill(skill: InsertVolunteerSkill): Promise<VolunteerSkill>;
  getVolunteerProfile(userId: string): Promise<VolunteerProfile | undefined>;
  createVolunteerProfile(profile: InsertVolunteerProfile): Promise<VolunteerProfile>;
  updateVolunteerProfile(userId: string, updates: Partial<VolunteerProfile>): Promise<VolunteerProfile>;
  getVolunteerOpportunities(activeOnly?: boolean): Promise<VolunteerOpportunity[]>;
  getVolunteerOpportunity(id: number): Promise<VolunteerOpportunity | undefined>;
  createVolunteerOpportunity(opportunity: InsertVolunteerOpportunity): Promise<VolunteerOpportunity>;
  updateVolunteerOpportunity(id: number, updates: Partial<VolunteerOpportunity>): Promise<VolunteerOpportunity>;
  deleteVolunteerOpportunity(id: number): Promise<void>;
  getVolunteerAssignments(userId?: string, opportunityId?: number): Promise<VolunteerAssignment[]>;
  createVolunteerAssignment(assignment: InsertVolunteerAssignment): Promise<VolunteerAssignment>;
  updateVolunteerAssignment(id: number, updates: Partial<VolunteerAssignment>): Promise<VolunteerAssignment>;
  getVolunteerBadges(): Promise<VolunteerBadge[]>;
  createVolunteerBadge(badge: InsertVolunteerBadge): Promise<VolunteerBadge>;
  getUserBadges(userId: string): Promise<UserBadge[]>;
  awardBadge(userId: string, badgeId: number): Promise<UserBadge>;
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

  async markUserContacted(id: string): Promise<void> {
    await db
      .update(users)
      .set({ lastContactedAt: new Date() })
      .where(eq(users.id, id));
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

  async getPrayerRequestById(id: number): Promise<PrayerRequest | undefined> {
    const [request] = await db.select().from(prayerRequests).where(eq(prayerRequests.id, id));
    return request;
  }

  async createPrayerRequest(insertRequest: InsertPrayerRequest): Promise<PrayerRequest> {
    const [request] = await db.insert(prayerRequests).values(insertRequest).returning();
    return request;
  }

  async updatePrayerRequest(id: number, updates: Partial<PrayerRequest>): Promise<PrayerRequest> {
    const [updated] = await db
      .update(prayerRequests)
      .set(updates)
      .where(eq(prayerRequests.id, id))
      .returning();
    return updated;
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

  // Absence Detection
  async getAbsentMembers(consecutiveMissed: number = 3): Promise<{
    userId: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    missedCount: number;
    lastAttendance: Date | null;
    lastServiceDate: Date | null;
    lastContactedAt: Date | null;
  }[]> {
    // Get all users who haven't been contacted in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const usersList = await db
      .select()
      .from(users)
      .where(
        or(
          sql`${users.lastContactedAt} IS NULL`,
          lt(users.lastContactedAt, sevenDaysAgo)
        )
      );
    
    // Get all Sunday services in the last 12 weeks (approximately 3 months)
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);
    
    const services = await db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.serviceType, "SUNDAY_SERVICE" as any),
          gte(attendance.serviceDate, twelveWeeksAgo)
        )
      );
    
    // Group attendance by user
    const attendanceByUser = new Map<string, Date[]>();
    for (const record of services) {
      if (record.userId) {
        const existing = attendanceByUser.get(record.userId) || [];
        existing.push(record.serviceDate);
        attendanceByUser.set(record.userId, existing);
      }
    }
    
    // Find users who missed the required number of consecutive services
    const absent: any[] = [];
    
    for (const userRecord of usersList) {
      const userAttendance = attendanceByUser.get(userRecord.id) || [];
      
      if (userAttendance.length === 0) {
        // Never attended - consider as absent
        absent.push({
          userId: userRecord.id,
          email: userRecord.email,
          firstName: userRecord.firstName,
          lastName: userRecord.lastName,
          phone: userRecord.phone,
          missedCount: consecutiveMissed,
          lastAttendance: null,
          lastServiceDate: twelveWeeksAgo,
          lastContactedAt: userRecord.lastContactedAt,
        });
      } else if (userAttendance.length < consecutiveMissed) {
        // Attended but less than required
        const sortedDates = userAttendance.sort((a, b) => b.getTime() - a.getTime());
        const lastAttendance = sortedDates[0];
        
        // Check if they haven't attended recently (within last 4 weeks)
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
        
        if (lastAttendance < fourWeeksAgo) {
          absent.push({
            userId: userRecord.id,
            email: userRecord.email,
            firstName: userRecord.firstName,
            lastName: userRecord.lastName,
            phone: userRecord.phone,
            missedCount: consecutiveMissed - userAttendance.length,
            lastAttendance,
            lastServiceDate: lastAttendance,
            lastContactedAt: userRecord.lastContactedAt,
          });
        }
      }
    }
    
    return absent;
  }

  // Member Messages
  async createMessage(message: InsertMemberMessage): Promise<MemberMessage> {
    const [record] = await db.insert(memberMessages).values(message).returning();
    return record;
  }

  async getUserMessages(userId: string): Promise<MemberMessage[]> {
    return await db
      .select()
      .from(memberMessages)
      .where(eq(memberMessages.userId, userId))
      .orderBy(desc(memberMessages.createdAt));
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    const result = await db
      .select()
      .from(memberMessages)
      .where(and(eq(memberMessages.userId, userId), eq(memberMessages.isRead, false)));
    return result.length;
  }

  async markMessageAsRead(messageId: number): Promise<void> {
    await db
      .update(memberMessages)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(memberMessages.id, messageId));
  }

  async markAllMessagesAsRead(userId: string): Promise<void> {
    await db
      .update(memberMessages)
      .set({ isRead: true, readAt: new Date() })
      .where(and(eq(memberMessages.userId, userId), eq(memberMessages.isRead, false)));
  }

  async deleteOldMessages(daysOld: number = 5): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const result = await db
      .delete(memberMessages)
      .where(and(
        lt(memberMessages.createdAt, cutoffDate),
        eq(memberMessages.isRead, true)
      ));
    
    return result.rowCount || 0;
  }

  async replyToMessage(
    originalMessageId: number,
    userId: string,
    content: string,
    senderId: string
  ): Promise<MemberMessage> {
    const [original] = await db
      .select()
      .from(memberMessages)
      .where(eq(memberMessages.id, originalMessageId));
    
    if (!original) {
      throw new Error("Original message not found");
    }

    const [reply] = await db.insert(memberMessages).values({
      userId: original.userId,
      type: original.type,
      title: `Re: ${original.title}`,
      content,
      priority: original.priority,
      createdBy: senderId,
      replyToId: originalMessageId,
      senderId,
    }).returning();

    return reply;
  }

  async getMessageThread(messageId: number): Promise<MemberMessage[]> {
    const [original] = await db
      .select()
      .from(memberMessages)
      .where(eq(memberMessages.id, messageId));
    
    if (!original) return [];

    const replies = await db
      .select()
      .from(memberMessages)
      .where(eq(memberMessages.replyToId, messageId))
      .orderBy(asc(memberMessages.createdAt));

    return [original, ...replies];
  }

  // Dashboard & Reporting Analytics
  async getDashboardStats(): Promise<{
    totalMembers: number;
    totalDonations: number;
    totalEvents: number;
    totalSermons: number;
    totalPrayers: number;
    recentDonations: number;
    recentAttendance: number;
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [memberCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [donationSum] = await db.select({ total: sql<number>`coalesce(sum(amount), 0)` }).from(donations).where(eq(donations.status, 'succeeded'));
    const [eventCount] = await db.select({ count: sql<number>`count(*)` }).from(events);
    const [sermonCount] = await db.select({ count: sql<number>`count(*)` }).from(sermons);
    const [prayerCount] = await db.select({ count: sql<number>`count(*)` }).from(prayerRequests);
    
    const [recentDonationsResult] = await db
      .select({ total: sql<number>`coalesce(sum(amount), 0)` })
      .from(donations)
      .where(and(eq(donations.status, 'succeeded'), gte(donations.createdAt, thirtyDaysAgo)));
    
    const [recentAttendanceResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(attendance)
      .where(gte(attendance.serviceDate, thirtyDaysAgo));

    return {
      totalMembers: memberCount?.count || 0,
      totalDonations: (donationSum?.total || 0) / 100,
      totalEvents: eventCount?.count || 0,
      totalSermons: sermonCount?.count || 0,
      totalPrayers: prayerCount?.count || 0,
      recentDonations: (recentDonationsResult?.total || 0) / 100,
      recentAttendance: recentAttendanceResult?.count || 0,
    };
  }

  async getDonationAnalytics(startDate: Date, endDate: Date): Promise<{
    total: number;
    count: number;
    average: number;
    byMonth: { month: string; total: number }[];
    byStatus: { status: string; count: number; total: number }[];
  }> {
    const records = await db
      .select()
      .from(donations)
      .where(and(gte(donations.createdAt, startDate), lte(donations.createdAt, endDate)));

    const succeededRecords = records.filter(r => r.status === 'succeeded');
    const total = succeededRecords.reduce((sum, r) => sum + r.amount, 0) / 100;
    const count = succeededRecords.length;
    const average = count > 0 ? total / count : 0;

    const byMonthMap = new Map<string, number>();
    for (const record of succeededRecords) {
      if (!record.createdAt) continue;
      const month = record.createdAt.toISOString().slice(0, 7);
      byMonthMap.set(month, (byMonthMap.get(month) || 0) + record.amount / 100);
    }
    const byMonth = Array.from(byMonthMap.entries())
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const byStatusMap = new Map<string, { count: number; total: number }>();
    for (const record of records) {
      const current = byStatusMap.get(record.status) || { count: 0, total: 0 };
      byStatusMap.set(record.status, {
        count: current.count + 1,
        total: current.total + record.amount / 100,
      });
    }
    const byStatus = Array.from(byStatusMap.entries()).map(([status, data]) => ({
      status,
      ...data,
    }));

    return { total, count, average, byMonth, byStatus };
  }

  async getMemberGrowthAnalytics(startDate: Date, endDate: Date): Promise<{
    total: number;
    newMembers: number;
    byMonth: { month: string; count: number }[];
  }> {
    const [total] = await db.select({ count: sql<number>`count(*)` }).from(users);
    
    const newMembersRecords = await db
      .select()
      .from(users)
      .where(and(gte(users.createdAt, startDate), lte(users.createdAt, endDate)));

    const byMonthMap = new Map<string, number>();
    for (const user of newMembersRecords) {
      const month = user.createdAt.toISOString().slice(0, 7);
      byMonthMap.set(month, (byMonthMap.get(month) || 0) + 1);
    }
    const byMonth = Array.from(byMonthMap.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      total: total?.count || 0,
      newMembers: newMembersRecords.length,
      byMonth,
    };
  }

  async getEventAnalytics(startDate: Date, endDate: Date): Promise<{
    total: number;
    upcoming: number;
    past: number;
    totalRsvps: number;
    byMonth: { month: string; count: number }[];
  }> {
    const now = new Date();
    
    const allEvents = await db.select().from(events);
    const upcoming = allEvents.filter(e => new Date(e.date) > now).length;
    const past = allEvents.filter(e => new Date(e.date) <= now).length;

    const periodEvents = allEvents.filter(e => {
      const date = new Date(e.date);
      return date >= startDate && date <= endDate;
    });

    const byMonthMap = new Map<string, number>();
    for (const event of periodEvents) {
      const month = new Date(event.date).toISOString().slice(0, 7);
      byMonthMap.set(month, (byMonthMap.get(month) || 0) + 1);
    }
    const byMonth = Array.from(byMonthMap.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const rsvps = await db.select().from(eventRsvps);

    return {
      total: allEvents.length,
      upcoming,
      past,
      totalRsvps: rsvps.length,
      byMonth,
    };
  }

  async getPrayerAnalytics(startDate: Date, endDate: Date): Promise<{
    total: number;
    totalPrayers: number;
    byMonth: { month: string; count: number }[];
  }> {
    const records = await db
      .select()
      .from(prayerRequests)
      .where(and(gte(prayerRequests.createdAt, startDate), lte(prayerRequests.createdAt, endDate)));

    const totalPrayers = records.reduce((sum, r) => sum + (r.prayCount || 0), 0);

    const byMonthMap = new Map<string, number>();
    for (const prayer of records) {
      if (!prayer.createdAt) continue;
      const month = prayer.createdAt.toISOString().slice(0, 7);
      byMonthMap.set(month, (byMonthMap.get(month) || 0) + 1);
    }
    const byMonth = Array.from(byMonthMap.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      total: records.length,
      totalPrayers,
      byMonth,
    };
  }

  // Fundraising Campaigns
  async getFundraisingCampaigns(activeOnly: boolean = false): Promise<FundraisingCampaign[]> {
    if (activeOnly) {
      return db.select().from(fundraisingCampaigns).where(eq(fundraisingCampaigns.isActive, true)).orderBy(desc(fundraisingCampaigns.createdAt));
    }
    return db.select().from(fundraisingCampaigns).orderBy(desc(fundraisingCampaigns.createdAt));
  }

  async getFundraisingCampaign(id: number): Promise<FundraisingCampaign | undefined> {
    const [campaign] = await db.select().from(fundraisingCampaigns).where(eq(fundraisingCampaigns.id, id));
    return campaign;
  }

  async createFundraisingCampaign(campaign: InsertFundraisingCampaign): Promise<FundraisingCampaign> {
    const [created] = await db.insert(fundraisingCampaigns).values({
      ...campaign,
      currentAmount: 0,
    }).returning();
    return created;
  }

  async updateFundraisingCampaign(id: number, campaign: Partial<InsertFundraisingCampaign>): Promise<FundraisingCampaign> {
    const [updated] = await db
      .update(fundraisingCampaigns)
      .set(campaign)
      .where(eq(fundraisingCampaigns.id, id))
      .returning();
    return updated;
  }

  async deleteFundraisingCampaign(id: number): Promise<void> {
    await db.delete(fundraisingCampaigns).where(eq(fundraisingCampaigns.id, id));
  }

  async getDonationHistory(userId: string): Promise<Donation[]> {
    return db.select().from(donations).where(eq(donations.userId, userId)).orderBy(desc(donations.createdAt));
  }

  // Daily Devotionals
  async getDailyDevotionals(publishedOnly: boolean = false): Promise<DailyDevotional[]> {
    if (publishedOnly) {
      return db.select().from(dailyDevotionals).where(eq(dailyDevotionals.isPublished, true)).orderBy(desc(dailyDevotionals.publishDate));
    }
    return db.select().from(dailyDevotionals).orderBy(desc(dailyDevotionals.publishDate));
  }

  async getDailyDevotional(id: number): Promise<DailyDevotional | undefined> {
    const [devotional] = await db.select().from(dailyDevotionals).where(eq(dailyDevotionals.id, id));
    return devotional;
  }

  async getTodayDevotional(): Promise<DailyDevotional | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const [devotional] = await db
      .select()
      .from(dailyDevotionals)
      .where(and(
        eq(dailyDevotionals.isPublished, true),
        gte(dailyDevotionals.publishDate, today),
        lt(dailyDevotionals.publishDate, tomorrow)
      ))
      .limit(1);
    
    if (!devotional) {
      const [latest] = await db
        .select()
        .from(dailyDevotionals)
        .where(eq(dailyDevotionals.isPublished, true))
        .orderBy(desc(dailyDevotionals.publishDate))
        .limit(1);
      return latest;
    }
    return devotional;
  }

  async createDailyDevotional(devotional: Partial<DailyDevotional>): Promise<DailyDevotional> {
    const [created] = await db.insert(dailyDevotionals).values(devotional as any).returning();
    return created;
  }

  async updateDailyDevotional(id: number, devotional: Partial<DailyDevotional>): Promise<DailyDevotional> {
    const [updated] = await db
      .update(dailyDevotionals)
      .set(devotional)
      .where(eq(dailyDevotionals.id, id))
      .returning();
    return updated;
  }

  async deleteDailyDevotional(id: number): Promise<void> {
    await db.delete(dailyDevotionals).where(eq(dailyDevotionals.id, id));
  }

  // Bible Reading Plans
  async getBibleReadingPlans(activeOnly: boolean = false): Promise<BibleReadingPlan[]> {
    if (activeOnly) {
      return db.select().from(bibleReadingPlans).where(eq(bibleReadingPlans.isActive, true)).orderBy(desc(bibleReadingPlans.createdAt));
    }
    return db.select().from(bibleReadingPlans).orderBy(desc(bibleReadingPlans.createdAt));
  }

  async getBibleReadingPlan(id: number): Promise<BibleReadingPlan | undefined> {
    const [plan] = await db.select().from(bibleReadingPlans).where(eq(bibleReadingPlans.id, id));
    return plan;
  }

  async createBibleReadingPlan(plan: Partial<BibleReadingPlan>): Promise<BibleReadingPlan> {
    const [created] = await db.insert(bibleReadingPlans).values(plan as any).returning();
    return created;
  }

  async updateBibleReadingProgress(userId: string, planId: number, dayNumber: number): Promise<BibleReadingProgress> {
    const existing = await db
      .select()
      .from(bibleReadingProgress)
      .where(and(
        eq(bibleReadingProgress.userId, userId),
        eq(bibleReadingProgress.planId, planId),
        eq(bibleReadingProgress.dayNumber, dayNumber)
      ));

    if (existing.length > 0) {
      const [updated] = await db
        .update(bibleReadingProgress)
        .set({ completed: true, completedAt: new Date() })
        .where(eq(bibleReadingProgress.id, existing[0].id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(bibleReadingProgress)
      .values({
        userId,
        planId,
        dayNumber,
        completed: true,
        completedAt: new Date(),
      })
      .returning();
    return created;
  }

  async getUserReadingProgress(userId: string, planId: number): Promise<BibleReadingProgress[]> {
    return db
      .select()
      .from(bibleReadingProgress)
      .where(and(
        eq(bibleReadingProgress.userId, userId),
        eq(bibleReadingProgress.planId, planId)
      ))
      .orderBy(asc(bibleReadingProgress.dayNumber));
  }

  // Music Library
  async getMusic(publishedOnly: boolean = false): Promise<Music[]> {
    if (publishedOnly) {
      return db.select().from(music).where(eq(music.isPublished, true)).orderBy(desc(music.playCount), desc(music.createdAt));
    }
    return db.select().from(music).orderBy(desc(music.playCount), desc(music.createdAt));
  }

  async getMusicById(id: number): Promise<Music | undefined> {
    const [track] = await db.select().from(music).where(eq(music.id, id));
    return track;
  }

  async createMusic(musicData: InsertMusic): Promise<Music> {
    const [created] = await db.insert(music).values(musicData as any).returning();
    return created;
  }

  async updateMusic(id: number, updates: Partial<Music>): Promise<Music> {
    const [updated] = await db
      .update(music)
      .set(updates)
      .where(eq(music.id, id))
      .returning();
    return updated;
  }

  async deleteMusic(id: number): Promise<void> {
    await db.delete(music).where(eq(music.id, id));
  }

  async incrementMusicPlayCount(id: number): Promise<Music> {
    await db.execute(sql`UPDATE music SET play_count = play_count + 1 WHERE id = ${id}`);
    const [updated] = await db.select().from(music).where(eq(music.id, id));
    return updated!;
  }

  // Music Genres
  async getMusicGenres(): Promise<MusicGenre[]> {
    return db.select().from(musicGenres).orderBy(musicGenres.name);
  }

  async createMusicGenre(name: string, description?: string): Promise<MusicGenre> {
    const [created] = await db.insert(musicGenres).values({ name, description }).returning();
    return created;
  }

  async deleteMusicGenre(id: number): Promise<void> {
    await db.delete(musicGenres).where(eq(musicGenres.id, id));
  }

  // Music Playlists
  async getMusicPlaylists(userId?: string): Promise<MusicPlaylist[]> {
    if (userId) {
      return db
        .select()
        .from(musicPlaylists)
        .where(or(eq(musicPlaylists.userId, userId), eq(musicPlaylists.isPublic, true)))
        .orderBy(desc(musicPlaylists.updatedAt));
    }
    return db.select().from(musicPlaylists).where(eq(musicPlaylists.isPublic, true)).orderBy(desc(musicPlaylists.updatedAt));
  }

  async getMusicPlaylistById(id: number): Promise<MusicPlaylist | undefined> {
    const [playlist] = await db.select().from(musicPlaylists).where(eq(musicPlaylists.id, id));
    return playlist;
  }

  async createMusicPlaylist(playlist: InsertMusicPlaylist): Promise<MusicPlaylist> {
    const [created] = await db.insert(musicPlaylists).values(playlist as any).returning();
    return created;
  }

  async updateMusicPlaylist(id: number, updates: Partial<MusicPlaylist>): Promise<MusicPlaylist> {
    const [updated] = await db
      .update(musicPlaylists)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(musicPlaylists.id, id))
      .returning();
    return updated;
  }

  async deleteMusicPlaylist(id: number): Promise<void> {
    await db.delete(musicPlaylists).where(eq(musicPlaylists.id, id));
  }

  async addMusicToPlaylist(playlistId: number, musicId: number): Promise<void> {
    const existing = await db
      .select()
      .from(playlistMusic)
      .where(and(
        eq(playlistMusic.playlistId, playlistId),
        eq(playlistMusic.musicId, musicId)
      ));

    if (existing.length > 0) return;

    const maxPosition = await db
      .select({ maxPos: sql<number>`MAX(${playlistMusic.position})` })
      .from(playlistMusic)
      .where(eq(playlistMusic.playlistId, playlistId));

    const position = (maxPosition[0]?.maxPos ?? 0) + 1;

    await db.insert(playlistMusic).values({
      playlistId,
      musicId,
      position,
    });
  }

  async removeMusicFromPlaylist(playlistId: number, musicId: number): Promise<void> {
    await db
      .delete(playlistMusic)
      .where(and(
        eq(playlistMusic.playlistId, playlistId),
        eq(playlistMusic.musicId, musicId)
      ));
  }

  async getPlaylistTracks(playlistId: number): Promise<Music[]> {
    const tracks = await db
      .select()
      .from(playlistMusic)
      .where(eq(playlistMusic.playlistId, playlistId))
      .orderBy(playlistMusic.position);

    const musicTracks: Music[] = [];
    for (const track of tracks) {
      const [musicTrack] = await db.select().from(music).where(eq(music.id, track.musicId));
      if (musicTrack) musicTracks.push(musicTrack);
    }
    return musicTracks;
  }

  // House Cells
  async getHouseCells(activeOnly: boolean = false): Promise<HouseCell[]> {
    if (activeOnly) {
      return db.select().from(houseCells).where(eq(houseCells.isActive, true)).orderBy(houseCells.name);
    }
    return db.select().from(houseCells).orderBy(houseCells.name);
  }

  async getHouseCellById(id: number): Promise<HouseCell | undefined> {
    const [cell] = await db.select().from(houseCells).where(eq(houseCells.id, id));
    return cell;
  }

  async createHouseCell(houseCell: InsertHouseCell): Promise<HouseCell> {
    const [created] = await db.insert(houseCells).values(houseCell as any).returning();
    return created;
  }

  async updateHouseCell(id: number, updates: Partial<HouseCell>): Promise<HouseCell> {
    const [updated] = await db
      .update(houseCells)
      .set(updates)
      .where(eq(houseCells.id, id))
      .returning();
    return updated;
  }

  async deleteHouseCell(id: number): Promise<void> {
    await db.delete(houseCells).where(eq(houseCells.id, id));
  }

  async getHouseCellMembers(houseCellId: number): Promise<User[]> {
    return db.select().from(users).where(eq(users.houseCellId, houseCellId));
  }

  async assignUserToHouseCell(userId: string, houseCellId: number): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ houseCellId, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  async removeUserFromHouseCell(userId: string): Promise<User> {
    const [updated] = await db
      .update(users)
      .set({ houseCellId: null, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updated;
  }

  // House Cell Messages
  async getHouseCellMessages(houseCellId: number): Promise<HouseCellMessage[]> {
    return db
      .select()
      .from(houseCellMessages)
      .where(eq(houseCellMessages.houseCellId, houseCellId))
      .orderBy(houseCellMessages.createdAt);
  }

  async createHouseCellMessage(message: InsertHouseCellMessage): Promise<HouseCellMessage> {
    const [created] = await db.insert(houseCellMessages).values(message as any).returning();
    return created;
  }

  // Groups
  async getGroups(): Promise<Group[]> {
    return db.select().from(groups).orderBy(desc(groups.createdAt));
  }

  async getGroupById(id: number): Promise<Group | undefined> {
    const [group] = await db.select().from(groups).where(eq(groups.id, id));
    return group;
  }

  async createGroup(groupData: InsertGroup): Promise<Group> {
    const [created] = await db.insert(groups).values(groupData as any).returning();
    return created;
  }

  async updateGroup(id: number, updates: Partial<Group>): Promise<Group> {
    const [updated] = await db
      .update(groups)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(groups.id, id))
      .returning();
    return updated;
  }

  async deleteGroup(id: number): Promise<void> {
    await db.delete(groups).where(eq(groups.id, id));
  }

  async getGroupMembers(groupId: number): Promise<GroupMember[]> {
    return db.select().from(groupMembers).where(eq(groupMembers.groupId, groupId));
  }

  async addGroupMember(member: InsertGroupMember): Promise<GroupMember> {
    const [created] = await db.insert(groupMembers).values(member as any).returning();
    return created;
  }

  async removeGroupMember(groupId: number, userId: string): Promise<void> {
    await db.delete(groupMembers).where(and(
      eq(groupMembers.groupId, groupId),
      eq(groupMembers.userId, userId)
    ));
  }

  async getGroupMessages(groupId: number): Promise<GroupMessage[]> {
    return db
      .select()
      .from(groupMessages)
      .where(eq(groupMessages.groupId, groupId))
      .orderBy(groupMessages.createdAt);
  }

  async createGroupMessage(message: InsertGroupMessage): Promise<GroupMessage> {
    const [created] = await db.insert(groupMessages).values(message as any).returning();
    return created;
  }

  async getUserGroups(userId: string): Promise<Group[]> {
    const memberships = await db
      .select()
      .from(groupMembers)
      .where(eq(groupMembers.userId, userId));
    
    const groupIds = memberships.map(m => m.groupId);
    if (groupIds.length === 0) return [];
    
    return db.select().from(groups).where(
      or(...groupIds.map(id => eq(groups.id, id)))
    );
  }

  // Audit Logs
  async createAuditLog(log: { userId?: string; action: string; entityType?: string; entityId?: string; details?: any; ipAddress?: string }): Promise<void> {
    await db.insert(auditLogs).values({
      userId: log.userId || null,
      action: log.action,
      entityType: log.entityType || null,
      entityId: log.entityId || null,
      details: log.details || null,
      ipAddress: log.ipAddress || null,
    });
  }

  async getAuditLogs(limit: number = 100): Promise<any[]> {
    const logs = await db
      .select()
      .from(auditLogs)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);
    
    const userIds = Array.from(new Set(logs.filter(l => l.userId).map(l => l.userId)));
    const usersData = await Promise.all(
      userIds.map(uid => this.getUserById(uid!))
    );
    
    const userMap = new Map(usersData.filter(u => u).map(u => [u!.id, u!]));
    
    return logs.map(log => ({
      ...log,
      user: log.userId ? {
        id: log.userId,
        firstName: userMap.get(log.userId)?.firstName,
        lastName: userMap.get(log.userId)?.lastName,
        email: userMap.get(log.userId)?.email,
      } : null,
    }));
  }

  // Live Streams
  async getLiveStreams(): Promise<LiveStream[]> {
    return db.select().from(liveStreams).orderBy(desc(liveStreams.createdAt));
  }

  async getLiveStream(id: number): Promise<LiveStream | undefined> {
    const [stream] = await db.select().from(liveStreams).where(eq(liveStreams.id, id));
    return stream;
  }

  async getCurrentLiveStream(): Promise<LiveStream | undefined> {
    const [stream] = await db.select().from(liveStreams).where(eq(liveStreams.isLive, true));
    return stream;
  }

  async createLiveStream(stream: InsertLiveStream): Promise<LiveStream> {
    const [created] = await db.insert(liveStreams).values({
      ...stream,
      startedAt: stream.isLive ? new Date() : null,
    }).returning();
    return created;
  }

  async updateLiveStream(id: number, updates: Partial<InsertLiveStream>): Promise<LiveStream> {
    const [updated] = await db
      .update(liveStreams)
      .set({ ...updates, endedAt: updates.isLive === false ? new Date() : undefined })
      .where(eq(liveStreams.id, id))
      .returning();
    return updated;
  }

  async deleteLiveStream(id: number): Promise<void> {
    await db.delete(liveStreams).where(eq(liveStreams.id, id));
  }

  async updateViewerCount(id: number, count: number): Promise<LiveStream> {
    const [updated] = await db
      .update(liveStreams)
      .set({ viewerCount: count })
      .where(eq(liveStreams.id, id))
      .returning();
    return updated;
  }

  // API Keys
  async getApiKeys(userId: string): Promise<ApiKey[]> {
    return db.select().from(apiKeys).where(eq(apiKeys.userId, userId));
  }

  async getApiKey(id: number): Promise<ApiKey | undefined> {
    const [key] = await db.select().from(apiKeys).where(eq(apiKeys.id, id));
    return key;
  }

  async getApiKeyByKey(key: string): Promise<ApiKey | undefined> {
    const [apiKey] = await db.select().from(apiKeys).where(eq(apiKeys.key, key));
    return apiKey;
  }

  async createApiKey(apiKeyData: InsertApiKey & { key: string; prefix: string }): Promise<ApiKey> {
    const [created] = await db.insert(apiKeys).values({
      name: apiKeyData.name,
      userId: apiKeyData.userId,
      key: apiKeyData.key,
      prefix: apiKeyData.prefix,
      permissions: apiKeyData.permissions,
      rateLimit: apiKeyData.rateLimit,
      expiresAt: apiKeyData.expiresAt,
      isActive: apiKeyData.isActive,
    }).returning();
    return created;
  }

  async updateApiKey(id: number, updates: Partial<ApiKey>): Promise<ApiKey> {
    const [updated] = await db
      .update(apiKeys)
      .set(updates)
      .where(eq(apiKeys.id, id))
      .returning();
    return updated;
  }

  async deleteApiKey(id: number): Promise<void> {
    await db.delete(apiKeys).where(eq(apiKeys.id, id));
  }

  // Webhooks
  async getWebhooks(userId: string): Promise<Webhook[]> {
    return db.select().from(webhooks).where(eq(webhooks.userId, userId));
  }

  async getWebhook(id: number): Promise<Webhook | undefined> {
    const [webhook] = await db.select().from(webhooks).where(eq(webhooks.id, id));
    return webhook;
  }

  async createWebhook(webhookData: InsertWebhook): Promise<Webhook> {
    const [created] = await db.insert(webhooks).values(webhookData).returning();
    return created;
  }

  async updateWebhook(id: number, updates: Partial<Webhook>): Promise<Webhook> {
    const [updated] = await db
      .update(webhooks)
      .set(updates)
      .where(eq(webhooks.id, id))
      .returning();
    return updated;
  }

  async deleteWebhook(id: number): Promise<void> {
    await db.delete(webhooks).where(eq(webhooks.id, id));
  }

  // Volunteer Management
  async getVolunteerSkills(): Promise<VolunteerSkill[]> {
    return db.select().from(volunteerSkills);
  }

  async createVolunteerSkill(skill: InsertVolunteerSkill): Promise<VolunteerSkill> {
    const [created] = await db.insert(volunteerSkills).values(skill).returning();
    return created;
  }

  async getVolunteerProfile(userId: string): Promise<VolunteerProfile | undefined> {
    const [profile] = await db.select().from(volunteerProfiles).where(eq(volunteerProfiles.userId, userId));
    return profile;
  }

  async createVolunteerProfile(profile: InsertVolunteerProfile): Promise<VolunteerProfile> {
    const [created] = await db.insert(volunteerProfiles).values(profile).returning();
    return created;
  }

  async updateVolunteerProfile(userId: string, updates: Partial<VolunteerProfile>): Promise<VolunteerProfile> {
    const [updated] = await db
      .update(volunteerProfiles)
      .set(updates)
      .where(eq(volunteerProfiles.userId, userId))
      .returning();
    return updated;
  }

  async getVolunteerOpportunities(activeOnly = true): Promise<VolunteerOpportunity[]> {
    if (activeOnly) {
      return db.select().from(volunteerOpportunities)
        .where(eq(volunteerOpportunities.isActive, true))
        .orderBy(asc(volunteerOpportunities.date));
    }
    return db.select().from(volunteerOpportunities).orderBy(asc(volunteerOpportunities.date));
  }

  async getVolunteerOpportunity(id: number): Promise<VolunteerOpportunity | undefined> {
    const [opportunity] = await db.select().from(volunteerOpportunities).where(eq(volunteerOpportunities.id, id));
    return opportunity;
  }

  async createVolunteerOpportunity(opportunity: InsertVolunteerOpportunity): Promise<VolunteerOpportunity> {
    const [created] = await db.insert(volunteerOpportunities).values(opportunity).returning();
    return created;
  }

  async updateVolunteerOpportunity(id: number, updates: Partial<VolunteerOpportunity>): Promise<VolunteerOpportunity> {
    const [updated] = await db
      .update(volunteerOpportunities)
      .set(updates)
      .where(eq(volunteerOpportunities.id, id))
      .returning();
    return updated;
  }

  async deleteVolunteerOpportunity(id: number): Promise<void> {
    await db.delete(volunteerOpportunities).where(eq(volunteerOpportunities.id, id));
  }

  async getVolunteerAssignments(userId?: string, opportunityId?: number): Promise<VolunteerAssignment[]> {
    if (userId) {
      return db.select().from(volunteerAssignments).where(eq(volunteerAssignments.volunteerId, userId));
    }
    if (opportunityId) {
      return db.select().from(volunteerAssignments).where(eq(volunteerAssignments.opportunityId, opportunityId));
    }
    return db.select().from(volunteerAssignments);
  }

  async createVolunteerAssignment(assignment: InsertVolunteerAssignment): Promise<VolunteerAssignment> {
    const [created] = await db.insert(volunteerAssignments).values(assignment).returning();
    // Update spots filled
    await db.update(volunteerOpportunities)
      .set({ spotsFilled: sql`${volunteerOpportunities.spotsFilled} + 1` })
      .where(eq(volunteerOpportunities.id, assignment.opportunityId));
    return created;
  }

  async updateVolunteerAssignment(id: number, updates: Partial<VolunteerAssignment>): Promise<VolunteerAssignment> {
    const [updated] = await db
      .update(volunteerAssignments)
      .set(updates)
      .where(eq(volunteerAssignments.id, id))
      .returning();
    return updated;
  }

  async getVolunteerBadges(): Promise<VolunteerBadge[]> {
    return db.select().from(volunteerBadges);
  }

  async createVolunteerBadge(badge: InsertVolunteerBadge): Promise<VolunteerBadge> {
    const [created] = await db.insert(volunteerBadges).values(badge).returning();
    return created;
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    return db.select().from(userBadges).where(eq(userBadges.userId, userId));
  }

  async awardBadge(userId: string, badgeId: number): Promise<UserBadge> {
    const [awarded] = await db.insert(userBadges).values({ userId, badgeId }).returning();
    return awarded;
  }
}

export const storage = new DatabaseStorage();
