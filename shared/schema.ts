export * from "./models/auth";
import { pgTable, text, serial, integer, boolean, timestamp, jsonb, pgEnum, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===

export const branding = pgTable("branding", {
  id: serial("id").primaryKey(),
  colors: jsonb("colors").$type<{ primary: string; secondary: string; accent: string }>().default({ primary: "#000000", secondary: "#ffffff", accent: "#3b82f6" }),
  logoUrl: text("logo_url"),
  fonts: jsonb("fonts").$type<{ heading: string; body: string }>().default({ heading: "Inter", body: "Inter" }),
  churchName: text("church_name"),
  churchAddress: text("church_address"),
  churchCity: text("church_city"),
  churchState: text("church_state"),
  churchCountry: text("church_country"),
  churchZipCode: text("church_zip_code"),
  churchPhone: text("church_phone"),
  churchEmail: text("church_email"),
  churchLatitude: text("church_latitude"),
  churchLongitude: text("church_longitude"),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url"),
  creatorId: uuid("creator_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventRsvps = pgTable("event_rsvps", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  addedToCalendar: boolean("added_to_calendar").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sermons = pgTable("sermons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  speaker: text("speaker").notNull(),
  date: timestamp("date").notNull(),
  topic: text("topic"),
  videoUrl: text("video_url"),
  videoFilePath: text("video_file_path"),
  audioUrl: text("audio_url"),
  audioFilePath: text("audio_file_path"),
  series: text("series"),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  isUpcoming: boolean("is_upcoming").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const prayerRequests = pgTable("prayer_requests", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  authorName: text("author_name"),
  content: text("content").notNull(),
  isAnonymous: boolean("is_anonymous").default(false),
  isAnswered: boolean("is_answered").default(false),
  answeredAt: timestamp("answered_at"),
  createdAt: timestamp("created_at").defaultNow(),
  prayCount: integer("pray_count").default(0),
});

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  amount: integer("amount").notNull(), // In cents
  currency: text("currency").default("usd"),
  status: text("status").notNull(), // pending, succeeded, failed
  campaignId: integer("campaign_id").references(() => fundraisingCampaigns.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fundraisingCampaigns = pgTable("fundraising_campaigns", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  goalAmount: integer("goal_amount").notNull(), // In cents
  currentAmount: integer("current_amount").default(0), // In cents
  imageUrl: text("image_url"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: uuid("created_by").references(() => users.id),
});

export const dailyDevotionals = pgTable("daily_devotionals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author"),
  bibleVerse: text("bible_verse"),
  theme: text("theme"),
  imageUrl: text("image_url"),
  publishDate: timestamp("publish_date").notNull(),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: uuid("created_by").references(() => users.id),
});

export const bibleReadingPlans = pgTable("bible_reading_plans", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // Days
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: uuid("created_by").references(() => users.id),
});

export const bibleReadingProgress = pgTable("bible_reading_progress", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  planId: integer("plan_id").references(() => bibleReadingPlans.id).notNull(),
  dayNumber: integer("day_number").notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
});

// === RELATIONS ===
export const prayerRequestsRelations = relations(prayerRequests, ({ one }) => ({
  user: one(users, {
    fields: [prayerRequests.userId],
    references: [users.id],
  }),
}));

export const donationsRelations = relations(donations, ({ one }) => ({
  user: one(users, {
    fields: [donations.userId],
    references: [users.id],
  }),
  campaign: one(fundraisingCampaigns, {
    fields: [donations.campaignId],
    references: [fundraisingCampaigns.id],
  }),
}));

export const fundraisingCampaignsRelations = relations(fundraisingCampaigns, ({ one, many }) => ({
  creator: one(users, {
    fields: [fundraisingCampaigns.createdBy],
    references: [users.id],
  }),
  donations: many(donations),
}));

export const dailyDevotionalsRelations = relations(dailyDevotionals, ({ one }) => ({
  creator: one(users, {
    fields: [dailyDevotionals.createdBy],
    references: [users.id],
  }),
}));

export const bibleReadingPlansRelations = relations(bibleReadingPlans, ({ one, many }) => ({
  creator: one(users, {
    fields: [bibleReadingPlans.createdBy],
    references: [users.id],
  }),
  progress: many(bibleReadingProgress),
}));

export const bibleReadingProgressRelations = relations(bibleReadingProgress, ({ one }) => ({
  user: one(users, {
    fields: [bibleReadingProgress.userId],
    references: [users.id],
  }),
  plan: one(bibleReadingPlans, {
    fields: [bibleReadingProgress.planId],
    references: [bibleReadingPlans.id],
  }),
}));

export const eventRsvpsRelations = relations(eventRsvps, ({ one }) => ({
  event: one(events, {
    fields: [eventRsvps.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventRsvps.userId],
    references: [users.id],
  }),
}));

// === BASE SCHEMAS ===
export const insertBrandingSchema = createInsertSchema(branding).omit({ id: true });

// Custom event schema that accepts string dates and converts to Date
export const insertEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().datetime(),
  location: z.string().min(1),
  imageUrl: z.string().optional(),
}).transform(data => ({
  ...data,
  date: new Date(data.date),
}));

// Custom sermon schema that accepts string dates and converts to Date
export const insertSermonSchema = z.object({
  title: z.string().min(1),
  speaker: z.string().min(1),
  date: z.string().datetime(),
  topic: z.string().optional(),
  videoUrl: z.string().optional(),
  videoFilePath: z.string().optional(),
  audioUrl: z.string().optional(),
  audioFilePath: z.string().optional(),
  series: z.string().optional(),
  description: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  isUpcoming: z.boolean().optional(),
}).transform(data => ({
  ...data,
  date: new Date(data.date),
}));

export const insertPrayerRequestSchema = createInsertSchema(prayerRequests).omit({ id: true, createdAt: true, prayCount: true });
export const insertDonationSchema = createInsertSchema(donations).omit({ id: true, createdAt: true });
export const insertEventRsvpSchema = createInsertSchema(eventRsvps).omit({ id: true, createdAt: true });
export const insertFundraisingCampaignSchema = createInsertSchema(fundraisingCampaigns).omit({ id: true, createdAt: true, currentAmount: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Branding = typeof branding.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Sermon = typeof sermons.$inferSelect;
export type PrayerRequest = typeof prayerRequests.$inferSelect;
export type Donation = typeof donations.$inferSelect;
export type EventRsvp = typeof eventRsvps.$inferSelect;
export type FundraisingCampaign = typeof fundraisingCampaigns.$inferSelect;
export type DailyDevotional = typeof dailyDevotionals.$inferSelect;
export type BibleReadingPlan = typeof bibleReadingPlans.$inferSelect;
export type BibleReadingProgress = typeof bibleReadingProgress.$inferSelect;

export type InsertBranding = z.infer<typeof insertBrandingSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertSermon = z.infer<typeof insertSermonSchema>;
export type InsertPrayerRequest = z.infer<typeof insertPrayerRequestSchema>;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type InsertEventRsvp = z.infer<typeof insertEventRsvpSchema>;
export type InsertFundraisingCampaign = z.infer<typeof insertFundraisingCampaignSchema>;
export type InsertDailyDevotional = typeof dailyDevotionals.$inferInsert;
export type InsertBibleReadingPlan = typeof bibleReadingPlans.$inferInsert;

// Request types
export type CreateEventRequest = InsertEvent;
export type CreateSermonRequest = InsertSermon;
export type CreatePrayerRequestRequest = InsertPrayerRequest;
export type CreateDonationRequest = InsertDonation;
export type CreateFundraisingCampaignRequest = InsertFundraisingCampaign;

// === ATTENDANCE TABLES ===

export const serviceTypeEnum = pgEnum('service_type', [
  'SUNDAY_SERVICE',
  'MIDWEEK_SERVICE', 
  'SPECIAL_EVENT',
  'ONLINE_LIVE',
  'ONLINE_REPLAY'
]);

export const attendanceTypeEnum = pgEnum('attendance_type', [
  'SELF_CHECKIN',
  'MANUAL',
  'ONLINE_AUTO',
  'QR_CHECKIN'
]);

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  serviceType: serviceTypeEnum("service_type").notNull(),
  serviceId: integer("service_id"),
  serviceName: text("service_name").notNull(),
  serviceDate: timestamp("service_date").notNull(),
  attendanceType: attendanceTypeEnum("attendance_type").notNull(),
  checkInTime: timestamp("check_in_time"),
  watchDuration: integer("watch_duration"),
  isOnline: boolean("is_online").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: uuid("created_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const attendanceLinks = pgTable("attendance_links", {
  id: serial("id").primaryKey(),
  serviceType: serviceTypeEnum("service_type").notNull(),
  serviceId: integer("service_id"),
  serviceName: text("service_name").notNull(),
  serviceDate: timestamp("service_date").notNull(),
  uniqueToken: text("unique_token").notNull().unique(),
  qrCodeUrl: text("qr_code_url"),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: uuid("created_by").references(() => users.id),
});

export const attendanceSettings = pgTable("attendance_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === ATTENDANCE RELATIONS ===
export const attendanceRelations = relations(attendance, ({ one }) => ({
  user: one(users, {
    fields: [attendance.userId],
    references: [users.id],
  }),
  creator: one(users, {
    fields: [attendance.createdBy],
    references: [users.id],
  }),
}));

export const attendanceLinksRelations = relations(attendanceLinks, ({ one }) => ({
  creator: one(users, {
    fields: [attendanceLinks.createdBy],
    references: [users.id],
  }),
}));

// === ATTENDANCE SCHEMAS ===
export const insertAttendanceSchema = createInsertSchema(attendance).omit({ id: true });
export const insertAttendanceLinkSchema = createInsertSchema(attendanceLinks).omit({ id: true });
export const insertAttendanceSettingsSchema = createInsertSchema(attendanceSettings).omit({ id: true });

// === MEMBER MESSAGES ===
export const messageTypeEnum = pgEnum('message_type', [
  'ABSENCE_ALERT',
  'GENERAL',
  'PASTORAL',
  'ANNOUNCEMENT'
]);

export const messagePriorityEnum = pgEnum('message_priority', [
  'high',
  'normal',
  'low'
]);

export const memberMessages = pgTable("member_messages", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  type: messageTypeEnum("type").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  priority: messagePriorityEnum("priority").default("normal"),
  createdBy: uuid("created_by").references(() => users.id),
  replyToId: integer("reply_to_id"),
  senderId: uuid("sender_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const memberMessagesRelations = relations(memberMessages, ({ one }) => ({
  user: one(users, {
    fields: [memberMessages.userId],
    references: [users.id],
  }),
  creator: one(users, {
    fields: [memberMessages.createdBy],
    references: [users.id],
  }),
}));

export const insertMemberMessageSchema = createInsertSchema(memberMessages).omit({ id: true, createdAt: true });

// === ATTENDANCE TYPES ===
export type Attendance = typeof attendance.$inferSelect;
export type AttendanceLink = typeof attendanceLinks.$inferSelect;
export type AttendanceSettings = typeof attendanceSettings.$inferSelect;
export type MemberMessage = typeof memberMessages.$inferSelect;

export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type InsertAttendanceLink = z.infer<typeof insertAttendanceLinkSchema>;
export type InsertAttendanceSettings = z.infer<typeof insertAttendanceSettingsSchema>;
export type InsertMemberMessage = z.infer<typeof insertMemberMessageSchema>;

// Request types
export type CreateAttendanceRequest = InsertAttendance;
export type CreateAttendanceLinkRequest = InsertAttendanceLink;

// === MUSIC LIBRARY ===

export const musicGenres = pgTable("music_genres", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const music = pgTable("music", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  album: text("album"),
  genreId: integer("genre_id").references(() => musicGenres.id),
  duration: integer("duration"), // in seconds
  audioUrl: text("audio_url"),
  audioFilePath: text("audio_file_path"),
  coverImageUrl: text("cover_image_url"),
  lyrics: text("lyrics"),
  isPublished: boolean("is_published").default(false),
  playCount: integer("play_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: uuid("created_by").references(() => users.id),
});

export const musicPlaylists = pgTable("music_playlists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  userId: uuid("user_id").references(() => users.id),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const playlistMusic = pgTable("playlist_music", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id").references(() => musicPlaylists.id).notNull(),
  musicId: integer("music_id").references(() => music.id).notNull(),
  position: integer("position").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});

// === MUSIC RELATIONS ===
export const musicRelations = relations(music, ({ one }) => ({
  genre: one(musicGenres, {
    fields: [music.genreId],
    references: [musicGenres.id],
  }),
  creator: one(users, {
    fields: [music.createdBy],
    references: [users.id],
  }),
}));

export const musicPlaylistsRelations = relations(musicPlaylists, ({ one, many }) => ({
  user: one(users, {
    fields: [musicPlaylists.userId],
    references: [users.id],
  }),
  tracks: many(playlistMusic),
}));

export const playlistMusicRelations = relations(playlistMusic, ({ one }) => ({
  playlist: one(musicPlaylists, {
    fields: [playlistMusic.playlistId],
    references: [musicPlaylists.id],
  }),
  music: one(music, {
    fields: [playlistMusic.musicId],
    references: [music.id],
  }),
}));

// === MUSIC SCHEMAS ===
export const insertMusicSchema = createInsertSchema(music).omit({ id: true, playCount: true, createdAt: true });
export const insertMusicPlaylistSchema = createInsertSchema(musicPlaylists).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPlaylistMusicSchema = createInsertSchema(playlistMusic).omit({ id: true, addedAt: true });

// === MUSIC TYPES ===
export type Music = typeof music.$inferSelect;
export type MusicPlaylist = typeof musicPlaylists.$inferSelect;
export type PlaylistMusic = typeof playlistMusic.$inferSelect;
export type MusicGenre = typeof musicGenres.$inferSelect;

export type InsertMusic = z.infer<typeof insertMusicSchema>;
export type InsertMusicPlaylist = z.infer<typeof insertMusicPlaylistSchema>;
export type InsertPlaylistMusic = z.infer<typeof insertPlaylistMusicSchema>;

// === HOUSE CELL COMMUNITY ===

export const houseCells = pgTable("house_cells", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  leaderId: uuid("leader_id").references(() => users.id),
  leaderName: text("leader_name"),
  leaderPhone: text("leader_phone"),
  address: text("address").notNull(),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  meetingDay: text("meeting_day"),
  meetingTime: text("meeting_time"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: uuid("created_by").references(() => users.id),
});

export const houseCellMessages = pgTable("house_cell_messages", {
  id: serial("id").primaryKey(),
  houseCellId: integer("house_cell_id").notNull().references(() => houseCells.id),
  userId: uuid("user_id").references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === HOUSE CELL RELATIONS ===
export const houseCellsRelations = relations(houseCells, ({ one, many }) => ({
  leader: one(users, {
    fields: [houseCells.leaderId],
    references: [users.id],
  }),
  creator: one(users, {
    fields: [houseCells.createdBy],
    references: [users.id],
  }),
  messages: many(houseCellMessages),
}));

export const houseCellMessagesRelations = relations(houseCellMessages, ({ one }) => ({
  houseCell: one(houseCells, {
    fields: [houseCellMessages.houseCellId],
    references: [houseCells.id],
  }),
  user: one(users, {
    fields: [houseCellMessages.userId],
    references: [users.id],
  }),
}));

// === HOUSE CELL SCHEMAS ===
export const insertHouseCellSchema = createInsertSchema(houseCells).omit({ id: true, createdAt: true });
export const insertHouseCellMessageSchema = createInsertSchema(houseCellMessages).omit({ id: true, createdAt: true });

// === HOUSE CELL TYPES ===
export type HouseCell = typeof houseCells.$inferSelect;
export type HouseCellMessage = typeof houseCellMessages.$inferSelect;
export type InsertHouseCell = z.infer<typeof insertHouseCellSchema>;
export type InsertHouseCellMessage = z.infer<typeof insertHouseCellMessageSchema>;

// === GROUP SPACE ===

export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  coverImageUrl: text("cover_image_url"),
  createdBy: uuid("created_by").references(() => users.id),
  isPrivate: boolean("is_private").default(false),
  allowMemberInvite: boolean("allow_member_invite").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const groupMembers = pgTable("group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => groups.id),
  userId: uuid("user_id").references(() => users.id),
  role: text("role").default("MEMBER"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const groupMessages = pgTable("group_messages", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => groups.id),
  userId: uuid("user_id").references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === GROUP RELATIONS ===
export const groupsRelations = relations(groups, ({ one, many }) => ({
  creator: one(users, {
    fields: [groups.createdBy],
    references: [users.id],
  }),
  members: many(groupMembers),
  messages: many(groupMessages),
}));

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
}));

export const groupMessagesRelations = relations(groupMessages, ({ one }) => ({
  group: one(groups, {
    fields: [groupMessages.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupMessages.userId],
    references: [users.id],
  }),
}));

// === GROUP SCHEMAS ===
export const insertGroupSchema = createInsertSchema(groups).omit({ id: true, createdAt: true, updatedAt: true });
export const insertGroupMemberSchema = createInsertSchema(groupMembers).omit({ id: true, joinedAt: true });
export const insertGroupMessageSchema = createInsertSchema(groupMessages).omit({ id: true, createdAt: true });

// === GROUP TYPES ===
export type Group = typeof groups.$inferSelect;
export type GroupMember = typeof groupMembers.$inferSelect;
export type GroupMessage = typeof groupMessages.$inferSelect;
export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type InsertGroupMember = z.infer<typeof insertGroupMemberSchema>;
export type InsertGroupMessage = z.infer<typeof insertGroupMessageSchema>;

// === AUDIT LOGS ===
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === PERMISSIONS ===
export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rolePermissions = pgTable("role_permissions", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  permissionId: integer("permission_id").references(() => permissions.id),
});

// === AUDIT LOG RELATIONS ===
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

// === SCHEMAS ===
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });

// === TYPES ===
export type AuditLog = typeof auditLogs.$inferSelect;
export type Permission = typeof permissions.$inferSelect;
export type RolePermission = typeof rolePermissions.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
