import { 
  users, branding, events, sermons, prayerRequests, donations, eventRsvps,
  attendance, attendanceLinks, attendanceSettings, memberMessages, fundraisingCampaigns,
  dailyDevotionals, bibleReadingPlans, bibleReadingProgress,
  music, musicGenres, musicPlaylists, playlistMusic,
  houseCells, houseCellMessages,
  groups, groupMembers, groupMessages, groupJoinRequests, groupActivityLogs,
  auditLogs, permissions,
  liveStreams,
  apiKeys, webhooks,
  volunteerSkills, volunteerProfiles, volunteerOpportunities, volunteerAssignments, volunteerBadges, userBadges,
  privacySettings, contentFlags, abuseReports,
  userHighlights, userNotes, verseDiscussions, groupAnnotations,
  discipleshipTracks, lessons, quizzes, userProgress, reflections,
  sermonClips,
  supportedLanguages,
  posts, postLikes, postComments, commentLikes, postShares, userConnections, hashtags, postHashtags,
  userEngagementMetrics, spiritualHealthScores, discipleshipAnalytics, groupAnalytics, analyticsReports,
  counselingRequests, counselingNotes, counselingFollowups, pastoralVisits,
  sermonEmbeddings, sermonViews, userSermonPreferences, sermonRecommendations,
  type User, type Branding, type Event, type Sermon, type PrayerRequest, type Donation, type EventRsvp, type FundraisingCampaign, type DailyDevotional, type BibleReadingPlan, type BibleReadingProgress,
  type Music, type MusicPlaylist, type MusicGenre,
  type InsertBranding, type InsertEvent, type InsertSermon, type InsertPrayerRequest, type InsertDonation, type InsertEventRsvp, type InsertFundraisingCampaign,
  type Attendance, type AttendanceLink, type AttendanceSettings, type MemberMessage,
  type InsertAttendance, type InsertAttendanceLink, type InsertAttendanceSettings, type InsertMemberMessage,
  type InsertMusic, type InsertMusicPlaylist,
  type HouseCell, type HouseCellMessage, type InsertHouseCell, type InsertHouseCellMessage,
  type Group, type GroupMember, type GroupMessage, type GroupJoinRequest, type GroupActivityLog, type InsertGroup, type InsertGroupMember, type InsertGroupMessage, type InsertGroupJoinRequest, type InsertGroupActivityLog,
  type LiveStream, type InsertLiveStream,
  type ApiKey, type InsertApiKey,
  type Webhook, type InsertWebhook,
  type VolunteerSkill, type InsertVolunteerSkill,
  type VolunteerProfile, type InsertVolunteerProfile,
  type VolunteerOpportunity, type InsertVolunteerOpportunity,
  type VolunteerAssignment, type InsertVolunteerAssignment,
  type VolunteerBadge, type InsertVolunteerBadge,
  type UserBadge, type InsertUserBadge,
  type PrivacySettings, type InsertPrivacySettings,
  type ContentFlag, type InsertContentFlag,
  type AbuseReport, type InsertAbuseReport,
  type UserHighlight, type InsertUserHighlight,
  type UserNote, type InsertUserNote,
  type VerseDiscussion, type InsertVerseDiscussion,
  type GroupAnnotation, type InsertGroupAnnotation,
  type DiscipleshipTrack, type InsertDiscipleshipTrack,
  type Lesson, type InsertLesson,
  type Quiz, type InsertQuiz,
  type UserProgress, type InsertUserProgress,
  type Reflection, type InsertReflection,
  type SermonClip, type InsertSermonClip,
  type SupportedLanguage, type InsertSupportedLanguage,
  type Post, type InsertPost,
  type PostLike, type InsertPostLike,
  type PostComment, type InsertPostComment,
  type CommentLike, type InsertCommentLike,
  type PostShare, type InsertPostShare,
  type UserConnection, type InsertUserConnection,
  type Hashtag, type InsertHashtag,
  type UserEngagementMetrics, type InsertUserEngagementMetrics,
  type SpiritualHealthScore, type InsertSpiritualHealthScore,
  type DiscipleshipAnalytics, type InsertDiscipleshipAnalytics,
  type GroupAnalytics, type InsertGroupAnalytics,
  type AnalyticsReport, type InsertAnalyticsReport,
  type CounselingRequest, type InsertCounselingRequest,
  type CounselingNote, type InsertCounselingNote,
  type CounselingFollowup, type InsertCounselingFollowup,
  type PastoralVisit, type InsertPastoralVisit,
  type SermonEmbedding, type InsertSermonEmbedding,
  type SermonView, type InsertSermonView,
  type UserSermonPreference, type InsertUserSermonPreference,
  type SermonRecommendation, type InsertSermonRecommendation
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
  getGroupMember(groupId: number, userId: string): Promise<GroupMember | undefined>;
  addGroupMember(member: InsertGroupMember): Promise<GroupMember>;
  removeGroupMember(groupId: number, userId: string): Promise<void>;
  getGroupMessages(groupId: number): Promise<GroupMessage[]>;
  createGroupMessage(message: InsertGroupMessage): Promise<GroupMessage>;
  getUserGroups(userId: string): Promise<Group[]>;
  suggestGroups(userId: string, userInterests?: string[], userCity?: string, userState?: string): Promise<Group[]>;
  getGroupJoinRequests(groupId: number): Promise<GroupJoinRequest[]>;
  getUserJoinRequest(groupId: number, userId: string): Promise<GroupJoinRequest | undefined>;
  createGroupJoinRequest(request: InsertGroupJoinRequest): Promise<GroupJoinRequest>;
  updateGroupJoinRequest(id: number, status: string, reviewedBy: string): Promise<GroupJoinRequest>;
  getGroupActivityLogs(groupId: number, limit?: number): Promise<GroupActivityLog[]>;
  createGroupActivityLog(log: InsertGroupActivityLog): Promise<GroupActivityLog>;

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

  // Privacy & Moderation
  getPrivacySettings(userId: string): Promise<PrivacySettings | undefined>;
  createOrUpdatePrivacySettings(settings: InsertPrivacySettings): Promise<PrivacySettings>;
  getContentFlags(contentType?: string, status?: string): Promise<ContentFlag[]>;
  createContentFlag(flag: InsertContentFlag): Promise<ContentFlag>;
  updateContentFlag(id: number, updates: Partial<ContentFlag>): Promise<ContentFlag>;
  getAbuseReports(status?: string): Promise<AbuseReport[]>;
  createAbuseReport(report: InsertAbuseReport): Promise<AbuseReport>;
  updateAbuseReport(id: number, updates: Partial<AbuseReport>): Promise<AbuseReport>;

  // Bible Study
  getUserHighlights(userId: string): Promise<UserHighlight[]>;
  createUserHighlight(highlight: InsertUserHighlight): Promise<UserHighlight>;
  deleteUserHighlight(id: number): Promise<void>;
  getUserNotes(userId: string): Promise<UserNote[]>;
  createUserNote(note: InsertUserNote): Promise<UserNote>;
  updateUserNote(id: number, updates: Partial<UserNote>): Promise<UserNote>;
  deleteUserNote(id: number): Promise<void>;
  getVerseDiscussions(book: string, chapter: number, verse: number): Promise<VerseDiscussion[]>;
  createVerseDiscussion(discussion: InsertVerseDiscussion): Promise<VerseDiscussion>;

  // Discipleship Pathways
  getDiscipleshipTracks(): Promise<DiscipleshipTrack[]>;
  getDiscipleshipTrack(id: number): Promise<DiscipleshipTrack | undefined>;
  createDiscipleshipTrack(track: InsertDiscipleshipTrack): Promise<DiscipleshipTrack>;
  updateDiscipleshipTrack(id: number, updates: Partial<DiscipleshipTrack>): Promise<DiscipleshipTrack>;
  deleteDiscipleshipTrack(id: number): Promise<void>;
  getLessonsByTrack(trackId: number): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: number, updates: Partial<Lesson>): Promise<Lesson>;
  deleteLesson(id: number): Promise<void>;
  getQuizzesByLesson(lessonId: number): Promise<Quiz[]>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  deleteQuiz(id: number): Promise<void>;
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserTrackProgress(userId: string, trackId: number): Promise<UserProgress[]>;
  upsertUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getReflections(userId: string, lessonId?: number): Promise<Reflection[]>;
  createReflection(reflection: InsertReflection): Promise<Reflection>;
  deleteReflection(id: number): Promise<void>;

  // Sermon Clips
  getSermonClips(): Promise<SermonClip[]>;
  getSermonClip(id: number): Promise<SermonClip | undefined>;
  createSermonClip(clip: InsertSermonClip): Promise<SermonClip>;
  updateSermonClip(id: number, updates: Partial<SermonClip>): Promise<SermonClip>;
  deleteSermonClip(id: number): Promise<void>;
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

  async getGroupMember(groupId: number, userId: string): Promise<GroupMember | undefined> {
    const [member] = await db.select().from(groupMembers).where(and(
      eq(groupMembers.groupId, groupId),
      eq(groupMembers.userId, userId)
    ));
    return member;
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

  // Privacy & Moderation
  async getPrivacySettings(userId: string): Promise<PrivacySettings | undefined> {
    const [settings] = await db.select().from(privacySettings).where(eq(privacySettings.userId, userId));
    return settings;
  }

  async createOrUpdatePrivacySettings(settings: InsertPrivacySettings): Promise<PrivacySettings> {
    const existing = await this.getPrivacySettings(settings.userId);
    if (existing) {
      const [updated] = await db
        .update(privacySettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(privacySettings.userId, settings.userId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(privacySettings).values(settings).returning();
    return created;
  }

  async getContentFlags(contentType?: string, status?: string): Promise<ContentFlag[]> {
    let query = db.select().from(contentFlags);
    // Note: In a real implementation, you'd want to add where clauses here
    return query;
  }

  async createContentFlag(flag: InsertContentFlag): Promise<ContentFlag> {
    const [created] = await db.insert(contentFlags).values(flag).returning();
    return created;
  }

  async updateContentFlag(id: number, updates: Partial<ContentFlag>): Promise<ContentFlag> {
    const [updated] = await db
      .update(contentFlags)
      .set(updates)
      .where(eq(contentFlags.id, id))
      .returning();
    return updated;
  }

  async getAbuseReports(status?: string): Promise<AbuseReport[]> {
    return db.select().from(abuseReports);
  }

  async createAbuseReport(report: InsertAbuseReport): Promise<AbuseReport> {
    const [created] = await db.insert(abuseReports).values(report).returning();
    return created;
  }

  async updateAbuseReport(id: number, updates: Partial<AbuseReport>): Promise<AbuseReport> {
    const [updated] = await db
      .update(abuseReports)
      .set(updates)
      .where(eq(abuseReports.id, id))
      .returning();
    return updated;
  }

  // Bible Study
  async getUserHighlights(userId: string): Promise<UserHighlight[]> {
    return db.select().from(userHighlights).where(eq(userHighlights.userId, userId));
  }

  async createUserHighlight(highlight: InsertUserHighlight): Promise<UserHighlight> {
    const [created] = await db.insert(userHighlights).values(highlight).returning();
    return created;
  }

  async deleteUserHighlight(id: number): Promise<void> {
    await db.delete(userHighlights).where(eq(userHighlights.id, id));
  }

  async getUserNotes(userId: string): Promise<UserNote[]> {
    return db.select().from(userNotes).where(eq(userNotes.userId, userId));
  }

  async createUserNote(note: InsertUserNote): Promise<UserNote> {
    const [created] = await db.insert(userNotes).values(note).returning();
    return created;
  }

  async updateUserNote(id: number, updates: Partial<UserNote>): Promise<UserNote> {
    const [updated] = await db
      .update(userNotes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userNotes.id, id))
      .returning();
    return updated;
  }

  async deleteUserNote(id: number): Promise<void> {
    await db.delete(userNotes).where(eq(userNotes.id, id));
  }

  async getVerseDiscussions(book: string, chapter: number, verse: number): Promise<VerseDiscussion[]> {
    return db.select().from(verseDiscussions)
      .where(and(
        eq(verseDiscussions.book, book),
        eq(verseDiscussions.chapter, chapter),
        eq(verseDiscussions.verse, verse)
      ));
  }

  async createVerseDiscussion(discussion: InsertVerseDiscussion): Promise<VerseDiscussion> {
    const [created] = await db.insert(verseDiscussions).values(discussion).returning();
    return created;
  }

  // Discipleship Pathways
  async getDiscipleshipTracks(): Promise<DiscipleshipTrack[]> {
    return db.select().from(discipleshipTracks).where(eq(discipleshipTracks.isActive, true)).orderBy(asc(discipleshipTracks.order));
  }

  async getDiscipleshipTrack(id: number): Promise<DiscipleshipTrack | undefined> {
    const [track] = await db.select().from(discipleshipTracks).where(eq(discipleshipTracks.id, id));
    return track;
  }

  async createDiscipleshipTrack(track: InsertDiscipleshipTrack): Promise<DiscipleshipTrack> {
    const [created] = await db.insert(discipleshipTracks).values(track).returning();
    return created;
  }

  async updateDiscipleshipTrack(id: number, updates: Partial<DiscipleshipTrack>): Promise<DiscipleshipTrack> {
    const [updated] = await db
      .update(discipleshipTracks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(discipleshipTracks.id, id))
      .returning();
    return updated;
  }

  async deleteDiscipleshipTrack(id: number): Promise<void> {
    await db.delete(discipleshipTracks).where(eq(discipleshipTracks.id, id));
  }

  async getLessonsByTrack(trackId: number): Promise<Lesson[]> {
    return db.select().from(lessons).where(eq(lessons.trackId, trackId)).orderBy(asc(lessons.order));
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [created] = await db.insert(lessons).values(lesson).returning();
    return created;
  }

  async updateLesson(id: number, updates: Partial<Lesson>): Promise<Lesson> {
    const [updated] = await db
      .update(lessons)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(lessons.id, id))
      .returning();
    return updated;
  }

  async deleteLesson(id: number): Promise<void> {
    await db.delete(lessons).where(eq(lessons.id, id));
  }

  async getQuizzesByLesson(lessonId: number): Promise<Quiz[]> {
    return db.select().from(quizzes).where(eq(quizzes.lessonId, lessonId)).orderBy(asc(quizzes.order));
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const [created] = await db.insert(quizzes).values({ ...quiz, options: quiz.options as any }).returning();
    return created;
  }

  async deleteQuiz(id: number): Promise<void> {
    await db.delete(quizzes).where(eq(quizzes.id, id));
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async getUserTrackProgress(userId: string, trackId: number): Promise<UserProgress[]> {
    return db.select().from(userProgress).where(and(
      eq(userProgress.userId, userId),
      eq(userProgress.trackId, trackId)
    ));
  }

  async upsertUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const existing = await db.select().from(userProgress).where(and(
      eq(userProgress.userId, progress.userId),
      eq(userProgress.trackId, progress.trackId),
      eq(userProgress.lessonId, progress.lessonId)
    ));

    if (existing.length > 0) {
      const [updated] = await db
        .update(userProgress)
        .set({ ...progress, updatedAt: new Date() })
        .where(eq(userProgress.id, existing[0].id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(userProgress).values(progress).returning();
      return created;
    }
  }

  async getReflections(userId: string, lessonId?: number): Promise<Reflection[]> {
    if (lessonId) {
      return db.select().from(reflections).where(and(
        eq(reflections.userId, userId),
        eq(reflections.lessonId, lessonId)
      ));
    }
    return db.select().from(reflections).where(eq(reflections.userId, userId));
  }

  async createReflection(reflection: InsertReflection): Promise<Reflection> {
    const [created] = await db.insert(reflections).values(reflection).returning();
    return created;
  }

  async deleteReflection(id: number): Promise<void> {
    await db.delete(reflections).where(eq(reflections.id, id));
  }

  // Sermon Clips
  async getSermonClips(): Promise<SermonClip[]> {
    return db.select().from(sermonClips).orderBy(desc(sermonClips.createdAt));
  }

  async getSermonClip(id: number): Promise<SermonClip | undefined> {
    const [clip] = await db.select().from(sermonClips).where(eq(sermonClips.id, id));
    return clip;
  }

  async createSermonClip(clip: InsertSermonClip): Promise<SermonClip> {
    const [created] = await db.insert(sermonClips).values(clip).returning();
    return created;
  }

  async updateSermonClip(id: number, updates: Partial<SermonClip>): Promise<SermonClip> {
    const [updated] = await db
      .update(sermonClips)
      .set(updates)
      .where(eq(sermonClips.id, id))
      .returning();
    return updated;
  }

  async deleteSermonClip(id: number): Promise<void> {
    await db.delete(sermonClips).where(eq(sermonClips.id, id));
  }

  // Supported Languages (Multi-Language & Localization)
  async getSupportedLanguages(): Promise<SupportedLanguage[]> {
    return db.select().from(supportedLanguages).where(eq(supportedLanguages.isActive, true)).orderBy(supportedLanguages.order);
  }

  async getSupportedLanguage(id: number): Promise<SupportedLanguage | undefined> {
    const [lang] = await db.select().from(supportedLanguages).where(eq(supportedLanguages.id, id));
    return lang;
  }

  async getDefaultLanguage(): Promise<SupportedLanguage | undefined> {
    const [lang] = await db.select().from(supportedLanguages).where(eq(supportedLanguages.isDefault, true));
    return lang;
  }

  async createSupportedLanguage(lang: InsertSupportedLanguage): Promise<SupportedLanguage> {
    const [created] = await db.insert(supportedLanguages).values(lang).returning();
    return created;
  }

  async updateSupportedLanguage(id: number, updates: Partial<SupportedLanguage>): Promise<SupportedLanguage> {
    const [updated] = await db
      .update(supportedLanguages)
      .set(updates)
      .where(eq(supportedLanguages.id, id))
      .returning();
    return updated;
  }

  async deleteSupportedLanguage(id: number): Promise<void> {
    await db.delete(supportedLanguages).where(eq(supportedLanguages.id, id));
  }

  // Group Annotations (Bible Study Tools)
  async getGroupAnnotations(groupId: number): Promise<GroupAnnotation[]> {
    return db.select().from(groupAnnotations).where(eq(groupAnnotations.groupId, groupId)).orderBy(desc(groupAnnotations.createdAt));
  }

  async createGroupAnnotation(annotation: InsertGroupAnnotation): Promise<GroupAnnotation> {
    const [created] = await db.insert(groupAnnotations).values(annotation).returning();
    return created;
  }

  async deleteGroupAnnotation(id: number): Promise<void> {
    await db.delete(groupAnnotations).where(eq(groupAnnotations.id, id));
  }

  // Daily Verse Notifications
  async getDailyVerseNotifications(userId: string): Promise<any[]> {
    const notifications = await db.select().from(memberMessages)
      .where(and(
        eq(memberMessages.userId, userId),
        eq(memberMessages.type, "DAILY_VERSE" as any)
      ))
      .orderBy(desc(memberMessages.createdAt));
    return notifications;
  }

  async createDailyVerseNotification(data: { userId: string; title: string; content: string; verse: string }) {
    const [notification] = await db.insert(memberMessages).values({
      userId: data.userId,
      type: "DAILY_VERSE" as any,
      title: data.title,
      content: data.content,
      priority: "low" as any,
      createdBy: data.userId,
    }).returning();
    return notification;
  }

  // Group Join Requests
  async getGroupJoinRequests(groupId: number): Promise<GroupJoinRequest[]> {
    return db.select().from(groupJoinRequests)
      .where(and(eq(groupJoinRequests.groupId, groupId), eq(groupJoinRequests.status, "PENDING")))
      .orderBy(desc(groupJoinRequests.createdAt));
  }

  async getUserJoinRequest(groupId: number, userId: string): Promise<GroupJoinRequest | undefined> {
    const [request] = await db.select().from(groupJoinRequests)
      .where(and(eq(groupJoinRequests.groupId, groupId), eq(groupJoinRequests.userId, userId)));
    return request;
  }

  async createGroupJoinRequest(request: InsertGroupJoinRequest): Promise<GroupJoinRequest> {
    const [created] = await db.insert(groupJoinRequests).values(request).returning();
    return created;
  }

  async updateGroupJoinRequest(id: number, status: string, reviewedBy: string): Promise<GroupJoinRequest> {
    const [updated] = await db.update(groupJoinRequests)
      .set({ status, reviewedBy, reviewedAt: new Date() })
      .where(eq(groupJoinRequests.id, id))
      .returning();
    return updated;
  }

  // Group Activity Logs
  async getGroupActivityLogs(groupId: number, limit = 50): Promise<GroupActivityLog[]> {
    return db.select().from(groupActivityLogs)
      .where(eq(groupActivityLogs.groupId, groupId))
      .orderBy(desc(groupActivityLogs.createdAt))
      .limit(limit);
  }

  async createGroupActivityLog(log: InsertGroupActivityLog): Promise<GroupActivityLog> {
    const [created] = await db.insert(groupActivityLogs).values(log).returning();
    return created;
  }

  // Smart Group Matching
  async suggestGroups(userId: string, userInterests: string[] = [], userCity: string = "", userState: string = ""): Promise<Group[]> {
    const user = await this.getUserById(userId);
    if (!user) return [];

    const userBirthYear = user.birthday ? new Date(user.birthday).getFullYear() : null;
    const currentYear = new Date().getFullYear();
    const userAge = userBirthYear ? currentYear - userBirthYear : null;

    const allGroups = await db.select().from(groups).where(eq(groups.isPrivate, false));

    const scoredGroups = allGroups.map(group => {
      let score = 0;

      if (group.city && userCity && group.city.toLowerCase() === userCity.toLowerCase()) {
        score += 30;
      }
      if (group.state && userState && group.state.toLowerCase() === userState.toLowerCase()) {
        score += 20;
      }

      if (group.targetAgeMin && group.targetAgeMax && userAge) {
        if (userAge >= group.targetAgeMin && userAge <= group.targetAgeMax) {
          score += 25;
        }
      }

      if (group.interests && Array.isArray(group.interests) && userInterests.length > 0) {
        const matchingInterests = group.interests.filter((i: string) => 
          userInterests.some(ui => ui.toLowerCase() === i.toLowerCase())
        );
        score += matchingInterests.length * 15;
      }

      return { group, score };
    });

    return scoredGroups
      .filter(g => g.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(g => g.group);
  }

  // Social Feed - Posts
  async getPosts(limit = 50, offset = 0, userId?: string, visibility?: string): Promise<Post[]> {
    let query = db.select().from(posts)
      .where(eq(posts.isHidden, false))
      .orderBy(desc(posts.isPinned), desc(posts.createdAt))
      .limit(limit)
      .offset(offset);
    
    return await query;
  }

  async getPostById(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [created] = await db.insert(posts).values(post).returning();
    
    if (post.content) {
      const hashtagMatches = post.content.match(/#[\w-]+/g);
      if (hashtagMatches) {
        for (const tag of [...new Set(hashtagMatches)]) {
          const tagName = tag.slice(1).toLowerCase();
          const [hashtag] = await db.select().from(hashtags).where(eq(hashtags.name, tagName));
          if (hashtag) {
            await db.update(hashtags).set({ postsCount: hashtag.postsCount + 1 }).where(eq(hashtags.id, hashtag.id));
          } else {
            await db.insert(hashtags).values({ name: tagName, postsCount: 1 });
          }
        }
      }
    }
    
    return created;
  }

  async updatePost(id: number, updates: Partial<Post>): Promise<Post> {
    const [updated] = await db.update(posts).set({ ...updates, updatedAt: new Date() }).where(eq(posts.id, id)).returning();
    return updated;
  }

  async deletePost(id: number): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  async togglePinPost(id: number): Promise<Post> {
    const post = await this.getPostById(id);
    if (!post) throw new Error("Post not found");
    return await this.updatePost(id, { isPinned: !post.isPinned });
  }

  // Social Feed - Likes
  async likePost(postId: number, userId: string): Promise<PostLike> {
    const existing = await db.select().from(postLikes).where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
    if (existing.length > 0) {
      await db.delete(postLikes).where(eq(postLikes.id, existing[0].id));
      await db.update(posts).set({ likesCount: sql`${posts.likesCount} - 1` }).where(eq(posts.id, postId));
      return existing[0];
    }
    
    const [like] = await db.insert(postLikes).values({ postId, userId }).returning();
    await db.update(posts).set({ likesCount: sql`${posts.likesCount} + 1` }).where(eq(posts.id, postId));
    return like;
  }

  async getPostLikes(postId: number): Promise<PostLike[]> {
    return await db.select().from(postLikes).where(eq(postLikes.postId, postId));
  }

  async hasUserLikedPost(postId: number, userId: string): Promise<boolean> {
    const likes = await db.select().from(postLikes).where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
    return likes.length > 0;
  }

  // Social Feed - Comments
  async getPostComments(postId: number): Promise<PostComment[]> {
    return await db.select().from(postComments).where(eq(postComments.postId, postId)).orderBy(asc(postComments.createdAt));
  }

  async createPostComment(comment: InsertPostComment): Promise<PostComment> {
    const [created] = await db.insert(postComments).values(comment).returning();
    await db.update(posts).set({ commentsCount: sql`${posts.commentsCount} + 1` }).where(eq(posts.id, comment.postId));
    return created;
  }

  async updatePostComment(id: number, updates: Partial<PostComment>): Promise<PostComment> {
    const [updated] = await db.update(postComments).set({ ...updates, updatedAt: new Date() }).where(eq(postComments.id, id)).returning();
    return updated;
  }

  async deletePostComment(id: number): Promise<void> {
    const comment = await db.select().from(postComments).where(eq(postComments.id, id));
    if (comment.length > 0) {
      await db.delete(postComments).where(eq(postComments.id, id));
      await db.update(posts).set({ commentsCount: sql`${posts.commentsCount} - 1` }).where(eq(posts.id, comment[0].postId));
    }
  }

  async likeComment(commentId: number, userId: string): Promise<CommentLike> {
    const existing = await db.select().from(commentLikes).where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId)));
    if (existing.length > 0) {
      await db.delete(commentLikes).where(eq(commentLikes.id, existing[0].id));
      await db.update(postComments).set({ likesCount: sql`${postComments.likesCount} - 1` }).where(eq(postComments.id, commentId));
      return existing[0];
    }
    
    const [like] = await db.insert(commentLikes).values({ commentId, userId }).returning();
    await db.update(postComments).set({ likesCount: sql`${postComments.likesCount} + 1` }).where(eq(postComments.id, commentId));
    return like;
  }

  // Social Feed - Shares
  async sharePost(originalPostId: number, userId: string, content?: string): Promise<PostShare> {
    const sharedPost = await this.createPost({
      userId,
      content: content || "",
      type: "TEXT",
      visibility: "MEMBERS_ONLY"
    });
    
    const [share] = await db.insert(postShares).values({
      originalPostId,
      userId,
      sharedPostId: sharedPost.id
    }).returning();
    
    await db.update(posts).set({ sharesCount: sql`${posts.sharesCount} + 1` }).where(eq(posts.id, originalPostId));
    return share;
  }

  // User Connections
  async followUser(followerId: string, followingId: string): Promise<UserConnection> {
    const existing = await db.select().from(userConnections).where(
      and(eq(userConnections.followerId, followerId), eq(userConnections.followingId, followingId))
    );
    if (existing.length > 0) {
      return existing[0];
    }
    
    const [connection] = await db.insert(userConnections).values({ followerId, followingId }).returning();
    return connection;
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    await db.delete(userConnections).where(
      and(eq(userConnections.followerId, followerId), eq(userConnections.followingId, followingId))
    );
  }

  async getUserFollowers(userId: string): Promise<UserConnection[]> {
    return await db.select().from(userConnections).where(eq(userConnections.followingId, userId));
  }

  async getUserFollowing(userId: string): Promise<UserConnection[]> {
    return await db.select().from(userConnections).where(eq(userConnections.followerId, userId));
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const connections = await db.select().from(userConnections).where(
      and(eq(userConnections.followerId, followerId), eq(userConnections.followingId, followingId))
    );
    return connections.length > 0;
  }

  // Hashtags
  async getTrendingHashtags(limit = 10): Promise<Hashtag[]> {
    return await db.select().from(hashtags).orderBy(desc(hashtags.postsCount)).limit(limit);
  }

  async getPostsByHashtag(hashtag: string, limit = 50, offset = 0): Promise<Post[]> {
    const hashtagRecord = await db.select().from(hashtags).where(eq(hashtags.name, hashtag.toLowerCase()));
    if (hashtagRecord.length === 0) return [];
    
    const hashtagPosts = await db.select().from(postHashtags).where(eq(postHashtags.hashtagId, hashtagRecord[0].id));
    const postIds = hashtagPosts.map(p => p.postId);
    
    if (postIds.length === 0) return [];
    
    return await db.select().from(posts)
      .where(and(eq(posts.isHidden, false), sql`${posts.id} IN (${postIds})`))
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);
  }

  // Feed - Get personalized feed for user
  async getFeedForUser(userId: string, limit = 50, offset = 0): Promise<Post[]> {
    const following = await this.getUserFollowing(userId);
    const followingIds = following.map(f => f.followingId);
    followingIds.push(userId);
    
    return await db.select().from(posts)
      .where(and(
        eq(posts.isHidden, false),
        sql`${posts.userId} IN (${followingIds})`
      ))
      .orderBy(desc(posts.isPinned), desc(posts.createdAt))
      .limit(limit)
      .offset(offset);
  }

  // === SPIRITUAL HEALTH & ENGAGEMENT ANALYTICS ===

  // User Engagement Metrics
  async getUserEngagementMetrics(userId: string, startDate?: Date, endDate?: Date): Promise<UserEngagementMetrics[]> {
    let conditions: any[] = [eq(userEngagementMetrics.userId, userId)];
    if (startDate) {
      conditions.push(gte(userEngagementMetrics.date, startDate.toISOString().split('T')[0]));
    }
    if (endDate) {
      conditions.push(lte(userEngagementMetrics.date, endDate.toISOString().split('T')[0]));
    }
    return db.select().from(userEngagementMetrics)
      .where(and(...conditions))
      .orderBy(desc(userEngagementMetrics.date));
  }

  async getAllEngagementMetrics(startDate?: Date, endDate?: Date): Promise<UserEngagementMetrics[]> {
    let conditions: any[] = [];
    if (startDate) {
      conditions.push(gte(userEngagementMetrics.date, startDate.toISOString().split('T')[0]));
    }
    if (endDate) {
      conditions.push(lte(userEngagementMetrics.date, endDate.toISOString().split('T')[0]));
    }
    return db.select().from(userEngagementMetrics)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(userEngagementMetrics.date));
  }

  async upsertUserEngagementMetrics(metrics: InsertUserEngagementMetrics): Promise<UserEngagementMetrics> {
    const existingDate = metrics.date || new Date().toISOString().split('T')[0];
    const [existing] = await db.select().from(userEngagementMetrics).where(
      and(eq(userEngagementMetrics.userId, metrics.userId), eq(userEngagementMetrics.date, existingDate))
    );
    
    if (existing) {
      const [updated] = await db
        .update(userEngagementMetrics)
        .set({
          sermonsWatched: (existing.sermonsWatched || 0) + (metrics.sermonsWatched || 0),
          prayersSubmitted: (existing.prayersSubmitted || 0) + (metrics.prayersSubmitted || 0),
          eventsAttended: (existing.eventsAttended || 0) + (metrics.eventsAttended || 0),
          devotionalsRead: (existing.devotionalsRead || 0) + (metrics.devotionalsRead || 0),
          groupMessages: (existing.groupMessages || 0) + (metrics.groupMessages || 0),
          loginCount: (existing.loginCount || 0) + (metrics.loginCount || 0),
          totalSessionTime: (existing.totalSessionTime || 0) + (metrics.totalSessionTime || 0),
        })
        .where(eq(userEngagementMetrics.id, existing.id))
        .returning();
      return updated;
    }
    
    const [created] = await db.insert(userEngagementMetrics).values(metrics).returning();
    return created;
  }

  // Spiritual Health Scores
  async getSpiritualHealthScores(userId: string): Promise<SpiritualHealthScore[]> {
    return db.select().from(spiritualHealthScores)
      .where(eq(spiritualHealthScores.userId, userId))
      .orderBy(desc(spiritualHealthScores.weekStart));
  }

  async calculateSpiritualHealthScore(userId: string, weekStart: Date): Promise<SpiritualHealthScore> {
    // Get engagement data for the week
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const weekEndStr = weekEnd.toISOString().split('T')[0];
    
    const metrics = await this.getUserEngagementMetrics(userId, weekStart, weekEnd);
    
    // Calculate scores (simplified algorithm)
    const totalMetrics = metrics.reduce((acc, m) => ({
      sermons: acc.sermons + (m.sermonsWatched || 0),
      prayers: acc.prayers + (m.prayersSubmitted || 0),
      events: acc.events + (m.eventsAttended || 0),
      devotionals: acc.devotionals + (m.devotionalsRead || 0),
      messages: acc.messages + (m.groupMessages || 0),
    }), { sermons: 0, prayers: 0, events: 0, devotionals: 0, messages: 0 });
    
    // Attendance score (based on events)
    const attendanceScore = Math.min(100, totalMetrics.events * 25);
    // Engagement score (based on interactions)
    const engagementScore = Math.min(100, Math.round((totalMetrics.sermons * 10 + totalMetrics.prayers * 5 + totalMetrics.devotionals * 8 + totalMetrics.messages * 2) / 2));
    // Growth score (based on consistency)
    const growthScore = Math.min(100, Math.round((metrics.length / 7) * 100));
    // Overall score
    const overallScore = Math.round((attendanceScore + engagementScore + growthScore) / 3);
    
    const [score] = await db
      .insert(spiritualHealthScores)
      .values({
        userId,
        weekStart: weekStartStr,
        attendanceScore,
        engagementScore,
        growthScore,
        overallScore,
      })
      .onConflictDoUpdate({
        target: [spiritualHealthScores.userId, spiritualHealthScores.weekStart],
        set: { attendanceScore, engagementScore, growthScore, overallScore, calculatedAt: new Date() },
      })
      .returning();
    
    return score;
  }

  // Discipleship Analytics
  async getDiscipleshipAnalytics(trackId?: number, weeks = 4): Promise<DiscipleshipAnalytics[]> {
    if (trackId) {
      return db.select().from(discipleshipAnalytics)
        .where(eq(discipleshipAnalytics.trackId, trackId))
        .orderBy(desc(discipleshipAnalytics.weekStart))
        .limit(weeks);
    }
    return db.select().from(discipleshipAnalytics)
      .orderBy(desc(discipleshipAnalytics.weekStart))
      .limit(weeks * 10);
  }

  async calculateDiscipleshipAnalytics(trackId: number, weekStart: Date): Promise<DiscipleshipAnalytics> {
    const track = await this.getDiscipleshipTrack(trackId);
    if (!track) throw new Error("Track not found");
    
    // Get all users enrolled in this track
    const allProgress = await db.select().from(userProgress).where(eq(userProgress.trackId, trackId));
    
    const activeLearners = allProgress.filter(p => !p.completed).length;
    const completedCount = allProgress.filter(p => p.completed).length;
    
    // Get quiz scores
    const quizzesForTrack = await db.select().from(quizzes).where(eq(quizzes.lessonId, trackId));
    const quizIds = quizzesForTrack.map(q => q.id);
    
    let quizScores: number[] = [];
    if (quizIds.length > 0) {
      const progressWithQuizzes = allProgress.filter(p => p.quizScore !== null);
      quizScores = progressWithQuizzes.map(p => p.quizScore!);
    }
    
    const quizAverageScore = quizScores.length > 0 
      ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
      : null;
    
    const [analytics] = await db
      .insert(discipleshipAnalytics)
      .values({
        trackId,
        weekStart: weekStart.toISOString().split('T')[0],
        totalEnrolled: allProgress.length,
        activeLearners,
        completedCount,
        quizAverageScore,
      })
      .onConflictDoUpdate({
        target: [discipleshipAnalytics.trackId, discipleshipAnalytics.weekStart],
        set: { totalEnrolled: allProgress.length, activeLearners, completedCount, quizAverageScore },
      })
      .returning();
    
    return analytics;
  }

  // Group Analytics
  async getGroupAnalytics(groupId?: number, weeks = 4): Promise<GroupAnalytics[]> {
    if (groupId) {
      return db.select().from(groupAnalytics)
        .where(eq(groupAnalytics.groupId, groupId))
        .orderBy(desc(groupAnalytics.weekStart))
        .limit(weeks);
    }
    return db.select().from(groupAnalytics)
      .orderBy(desc(groupAnalytics.weekStart))
      .limit(weeks * 10);
  }

  async calculateGroupAnalytics(groupId: number, weekStart: Date): Promise<GroupAnalytics> {
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    const members = await this.getGroupMembers(groupId);
    const messages = await this.getGroupMessages(groupId);
    const weekMessages = messages.filter(m => {
      const msgDate = new Date(m.createdAt || '');
      return msgDate >= weekStart && msgDate < weekEnd;
    });
    
    const activeMembers = members.filter(m => {
      const memberMessages = weekMessages.filter(msg => msg.userId === m.userId);
      return memberMessages.length > 0;
    }).length;
    
    const [analytics] = await db
      .insert(groupAnalytics)
      .values({
        groupId,
        weekStart: weekStartStr,
        activeMembers,
        messagesCount: weekMessages.length,
      })
      .onConflictDoUpdate({
        target: [groupAnalytics.groupId, groupAnalytics.weekStart],
        set: { activeMembers, messagesCount: weekMessages.length },
      })
      .returning();
    
    return analytics;
  }

  // Analytics Reports
  async getAnalyticsReports(reportType?: string): Promise<AnalyticsReport[]> {
    if (reportType) {
      return db.select().from(analyticsReports)
        .where(eq(analyticsReports.reportType, reportType))
        .orderBy(desc(analyticsReports.createdAt));
    }
    return db.select().from(analyticsReports).orderBy(desc(analyticsReports.createdAt));
  }

  async createAnalyticsReport(report: InsertAnalyticsReport): Promise<AnalyticsReport> {
    const [created] = await db.insert(analyticsReports).values(report).returning();
    return created;
  }

  async deleteAnalyticsReport(id: number): Promise<void> {
    await db.delete(analyticsReports).where(eq(analyticsReports.id, id));
  }

  // Dashboard Analytics Summary
  async getEngagementSummary(startDate: Date, endDate: Date): Promise<{
    totalSermonsWatched: number;
    totalPrayersSubmitted: number;
    totalEventsAttended: number;
    totalDevotionalsRead: number;
    uniqueActiveUsers: number;
  }> {
    const metrics = await this.getAllEngagementMetrics(startDate, endDate);
    
    return {
      totalSermonsWatched: metrics.reduce((sum, m) => sum + (m.sermonsWatched || 0), 0),
      totalPrayersSubmitted: metrics.reduce((sum, m) => sum + (m.prayersSubmitted || 0), 0),
      totalEventsAttended: metrics.reduce((sum, m) => sum + (m.eventsAttended || 0), 0),
      totalDevotionalsRead: metrics.reduce((sum, m) => sum + (m.devotionalsRead || 0), 0),
      uniqueActiveUsers: new Set(metrics.map(m => m.userId)).size,
    };
  }

  // Get spiritual health trends for all users
  async getSpiritualHealthTrends(weeks = 4): Promise<{
    weekStart: string;
    averageScore: number;
    improving: number;
    declining: number;
  }[]> {
    const scores = await db.select().from(spiritualHealthScores)
      .orderBy(desc(spiritualHealthScores.weekStart))
      .limit(weeks);
    
    const byWeek: Record<string, SpiritualHealthScore[]> = {};
    scores.forEach(s => {
      const weekKey = String(s.weekStart);
      if (!byWeek[weekKey]) byWeek[weekKey] = [];
      byWeek[weekKey].push(s);
    });
    
    return Object.entries(byWeek).map(([week, weekScores]) => {
      const averageScore = Math.round(weekScores.reduce((sum, s) => sum + (s.overallScore || 0), 0) / weekScores.length);
      
      // Calculate trend
      const previousWeekDate = new Date(week);
      previousWeekDate.setDate(previousWeekDate.getDate() - 7);
      const prevWeekStr = previousWeekDate.toISOString().split('T')[0];
      const prevScores = scores.filter(s => String(s.weekStart) === prevWeekStr);
      
      let improving = 0, declining = 0;
      if (prevScores.length > 0) {
        weekScores.forEach(s => {
          const prev = prevScores.find(p => p.userId === s.userId);
          if (prev) {
            if ((s.overallScore || 0) > (prev.overallScore || 0)) improving++;
            else if ((s.overallScore || 0) < (prev.overallScore || 0)) declining++;
          }
        });
      }
      
      return { weekStart: week, averageScore, improving, declining };
    });
  }

  // === PASTORAL CARE & COUNSELING SYSTEM ===

  // Counseling Requests
  async getCounselingRequests(filters?: { status?: string; assignedTo?: string; userId?: string }): Promise<CounselingRequest[]> {
    let conditions = [];
    if (filters?.status) conditions.push(eq(counselingRequests.status, filters.status));
    if (filters?.assignedTo) conditions.push(eq(counselingRequests.assignedTo, filters.assignedTo));
    if (filters?.userId) conditions.push(eq(counselingRequests.userId, filters.userId));
    
    return db.select().from(counselingRequests)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(counselingRequests.createdAt));
  }

  async getCounselingRequest(id: number): Promise<CounselingRequest | undefined> {
    const [request] = await db.select().from(counselingRequests).where(eq(counselingRequests.id, id));
    return request;
  }

  async createCounselingRequest(request: InsertCounselingRequest): Promise<CounselingRequest> {
    const [created] = await db.insert(counselingRequests).values(request).returning();
    return created;
  }

  async updateCounselingRequest(id: number, updates: Partial<CounselingRequest>): Promise<CounselingRequest> {
    const [updated] = await db
      .update(counselingRequests)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(counselingRequests.id, id))
      .returning();
    return updated;
  }

  async assignCounselingRequest(id: number, assignedTo: string): Promise<CounselingRequest> {
    return this.updateCounselingRequest(id, {
      assignedTo,
      assignedAt: new Date(),
      status: 'assigned'
    });
  }

  async completeCounselingRequest(id: number): Promise<CounselingRequest> {
    return this.updateCounselingRequest(id, {
      status: 'completed',
      completedAt: new Date()
    });
  }

  // Counseling Notes
  async getCounselingNotes(requestId: number): Promise<CounselingNote[]> {
    return db.select().from(counselingNotes)
      .where(eq(counselingNotes.requestId, requestId))
      .orderBy(desc(counselingNotes.createdAt));
  }

  async createCounselingNote(note: InsertCounselingNote): Promise<CounselingNote> {
    const [created] = await db.insert(counselingNotes).values(note).returning();
    return created;
  }

  // Counseling Follow-ups
  async getCounselingFollowups(requestId: number): Promise<CounselingFollowup[]> {
    return db.select().from(counselingFollowups)
      .where(eq(counselingFollowups.requestId, requestId))
      .orderBy(asc(counselingFollowups.scheduledDate));
  }

  async getPendingFollowups(): Promise<CounselingFollowup[]> {
    return db.select().from(counselingFollowups)
      .where(eq(counselingFollowups.completed, false))
      .orderBy(asc(counselingFollowups.scheduledDate));
  }

  async createCounselingFollowup(followup: InsertCounselingFollowup): Promise<CounselingFollowup> {
    const [created] = await db.insert(counselingFollowups).values(followup).returning();
    return created;
  }

  async completeCounselingFollowup(id: number, notes?: string): Promise<CounselingFollowup> {
    const [updated] = await db
      .update(counselingFollowups)
      .set({ completed: true, completedAt: new Date(), notes })
      .where(eq(counselingFollowups.id, id))
      .returning();
    return updated;
  }

  // Pastoral Visits
  async getPastoralVisits(filters?: { visitorId?: string; visitedUserId?: string }): Promise<PastoralVisit[]> {
    let conditions = [];
    if (filters?.visitorId) conditions.push(eq(pastoralVisits.visitorId, filters.visitorId));
    if (filters?.visitedUserId) conditions.push(eq(pastoralVisits.visitedUserId, filters.visitedUserId));
    
    return db.select().from(pastoralVisits)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(pastoralVisits.visitDate));
  }

  async createPastoralVisit(visit: InsertPastoralVisit): Promise<PastoralVisit> {
    const [created] = await db.insert(pastoralVisits).values(visit).returning();
    return created;
  }

  // Get pastoral statistics
  async getPastoralStats(): Promise<{
    totalRequests: number;
    pendingRequests: number;
    inProgressRequests: number;
    completedRequests: number;
    pendingFollowups: number;
    visitsThisMonth: number;
  }> {
    const allRequests = await db.select().from(counselingRequests);
    const pendingFollowups = await this.getPendingFollowups();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const visitsThisMonth = await db.select().from(pastoralVisits)
      .where(gte(pastoralVisits.visitDate, startOfMonth.toISOString().split('T')[0]));

    return {
      totalRequests: allRequests.length,
      pendingRequests: allRequests.filter(r => r.status === 'pending').length,
      inProgressRequests: allRequests.filter(r => r.status === 'assigned' || r.status === 'in_progress').length,
      completedRequests: allRequests.filter(r => r.status === 'completed').length,
      pendingFollowups: pendingFollowups.length,
      visitsThisMonth: visitsThisMonth.length,
    };
  }

  // === AI SERMON SEARCH & SMART RECOMMENDATIONS ===

  // Sermon Views (tracking)
  async recordSermonView(sermonId: number, userId: string, watchDuration: number = 0, completed: boolean = false): Promise<SermonView> {
    const [view] = await db.insert(sermonViews).values({
      sermonId,
      userId,
      watchDuration,
      completed,
    }).returning();
    return view;
  }

  async updateSermonView(id: number, updates: Partial<SermonView>): Promise<SermonView> {
    const [updated] = await db
      .update(sermonViews)
      .set(updates)
      .where(eq(sermonViews.id, id))
      .returning();
    return updated;
  }

  async getUserSermonViews(userId: string, limit = 20): Promise<SermonView[]> {
    return db.select().from(sermonViews)
      .where(eq(sermonViews.userId, userId))
      .orderBy(desc(sermonViews.viewedAt))
      .limit(limit);
  }

  async getPopularSermons(limit = 10): Promise<any[]> {
    const views = await db.select().from(sermonViews);
    const sermonCounts = views.reduce((acc, v) => {
      acc[v.sermonId] = (acc[v.sermonId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const sortedSermons = Object.entries(sermonCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([sermonId]) => Number(sermonId));
    
    if (sortedSermons.length === 0) return [];
    
    return sortedSermons.map(id => this.getSermon(id)).filter(Boolean);
  }

  // User Sermon Preferences
  async getUserSermonPreferences(userId: string): Promise<UserSermonPreference | undefined> {
    const [pref] = await db.select().from(userSermonPreferences).where(eq(userSermonPreferences.userId, userId));
    return pref;
  }

  async updateUserSermonPreferences(userId: string, updates: { favoriteSpeakers?: string[]; favoriteTopics?: string[]; favoriteSeries?: string[] }): Promise<UserSermonPreference> {
    const existing = await this.getUserSermonPreferences(userId);
    
    if (existing) {
      const [updated] = await db
        .update(userSermonPreferences)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(userSermonPreferences.userId, userId))
        .returning();
      return updated;
    }
    
    const [created] = await db
      .insert(userSermonPreferences)
      .values({ userId, ...updates })
      .returning();
    return created;
  }

  // Smart Recommendations
  async getSermonRecommendations(userId: string, limit = 10): Promise<Sermon[]> {
    // Check cache first
    const [cached] = await db.select().from(sermonRecommendations)
      .where(eq(sermonRecommendations.userId, userId));
    
    if (cached && cached.recommendedSermons && cached.recommendedSermons.length > 0) {
      const recSermons = await Promise.all(
        cached.recommendedSermons.map(id => this.getSermon(id))
      );
      return recSermons.filter(Boolean) as Sermon[];
    }
    
    // Generate recommendations based on preferences and views
    const prefs = await this.getUserSermonPreferences(userId);
    const views = await this.getUserSermonViews(userId);
    
    // Get viewed sermon IDs
    const viewedIds = new Set(views.map(v => v.sermonId));
    
    // Get all sermons
    const allSermons = await this.getSermons();
    
    // Score sermons based on user preferences
    const scored = allSermons
      .filter(s => !viewedIds.has(s.id))
      .map(sermon => {
        let score = 0;
        
        // Boost by preferences
        if (prefs?.favoriteSpeakers?.includes(sermon.speaker)) score += 5;
        if (prefs?.favoriteSeries === sermon.series) score += 3;
        if (prefs?.favoriteTopics?.some(t => sermon.topic?.toLowerCase().includes(t.toLowerCase()))) score += 4;
        
        // Boost by popularity
        const viewCount = views.filter(v => v.sermonId === sermon.id).length;
        score += viewCount;
        
        // Boost recent sermons
        const daysSince = Math.floor((Date.now() - new Date(sermon.date).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSince < 30) score += 2;
        if (daysSince < 7) score += 3;
        
        return { sermon, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ sermon }) => sermon);
    
    // Cache recommendations
    if (scored.length > 0) {
      await db.insert(sermonRecommendations).values({
        userId,
        recommendedSermons: scored.map(s => s.id),
        basedOn: prefs ? 'preferences' : 'popularity',
      }).onConflictDoUpdate({
        target: sermonRecommendations.userId,
        set: { recommendedSermons: scored.map(s => s.id), basedOn: prefs ? 'preferences' : 'popularity', createdAt: new Date() },
      });
    }
    
    return scored;
  }

  // AI Search (keyword-based for now)
  async searchSermons(query: string, limit = 20): Promise<Sermon[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    const allSermons = await this.getSermons();
    
    return allSermons.filter(s => 
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.speaker.toLowerCase().includes(query.toLowerCase()) ||
      s.topic?.toLowerCase().includes(query.toLowerCase()) ||
      s.description?.toLowerCase().includes(query.toLowerCase()) ||
      s.series?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);
  }

  // Generate sermon summary (placeholder for AI)
  async generateSermonSummary(sermonId: number): Promise<string> {
    const sermon = await this.getSermon(sermonId);
    if (!sermon) return '';
    
    // In production, this would call an AI service
    // For now, return a basic summary
    return `A sermon titled "${sermon.title}" by ${sermon.speaker} on ${new Date(sermon.date).toLocaleDateString()}. ${sermon.topic ? `Topic: ${sermon.topic}.` : ''} ${sermon.description?.substring(0, 200) || ''}`;
  }

  // Get related sermons
  async getRelatedSermons(sermonId: number, limit = 5): Promise<Sermon[]> {
    const sermon = await this.getSermon(sermonId);
    if (!sermon) return [];
    
    const allSermons = await this.getSermons();
    
    return allSermons
      .filter(s => s.id !== sermonId)
      .map(s => {
        let score = 0;
        if (s.speaker === sermon.speaker) score += 5;
        if (s.series === sermon.series) score += 4;
        if (s.topic === sermon.topic) score += 3;
        
        // Add to results with score
        return { sermon: s, score };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ sermon }) => sermon);
  }
}

export const storage = new DatabaseStorage();
