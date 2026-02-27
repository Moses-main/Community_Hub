export * from "./models/auth";
import { pgTable, text, serial, integer, boolean, timestamp, jsonb, pgEnum, uuid, date } from "drizzle-orm/pg-core";
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
  location: text("location"),
  city: text("city"),
  state: text("state"),
  country: text("country"),
  targetAgeMin: integer("target_age_min"),
  targetAgeMax: integer("target_age_max"),
  interests: jsonb("interests").default("[]"),
  category: text("category"),
  requireApproval: boolean("require_approval").default(false),
  maxMembers: integer("max_members"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const groupMembers = pgTable("group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => groups.id),
  userId: uuid("user_id").references(() => users.id),
  role: text("role").default("MEMBER"),
  status: text("status").default("ACTIVE"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const groupJoinRequests = pgTable("group_join_requests", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => groups.id),
  userId: uuid("user_id").references(() => users.id),
  message: text("message"),
  status: text("status").default("PENDING"),
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const groupActivityLogs = pgTable("group_activity_logs", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => groups.id),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(),
  details: jsonb("details").default("{}"),
  createdAt: timestamp("created_at").defaultNow(),
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

export const groupJoinRequestsRelations = relations(groupJoinRequests, ({ one }) => ({
  group: one(groups, {
    fields: [groupJoinRequests.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupJoinRequests.userId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [groupJoinRequests.reviewedBy],
    references: [users.id],
  }),
}));

export const groupActivityLogsRelations = relations(groupActivityLogs, ({ one }) => ({
  group: one(groups, {
    fields: [groupActivityLogs.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [groupActivityLogs.userId],
    references: [users.id],
  }),
}));

// === GROUP SCHEMAS ===
export const insertGroupSchema = createInsertSchema(groups).omit({ id: true, createdAt: true, updatedAt: true });
export const insertGroupMemberSchema = createInsertSchema(groupMembers).omit({ id: true, joinedAt: true });
export const insertGroupMessageSchema = createInsertSchema(groupMessages).omit({ id: true, createdAt: true });
export const insertGroupJoinRequestSchema = createInsertSchema(groupJoinRequests).omit({ id: true, createdAt: true });
export const insertGroupActivityLogSchema = createInsertSchema(groupActivityLogs).omit({ id: true, createdAt: true });

// === GROUP TYPES ===
export type Group = typeof groups.$inferSelect;
export type GroupMember = typeof groupMembers.$inferSelect;
export type GroupMessage = typeof groupMessages.$inferSelect;
export type GroupJoinRequest = typeof groupJoinRequests.$inferSelect;
export type GroupActivityLog = typeof groupActivityLogs.$inferSelect;
export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type InsertGroupMember = z.infer<typeof insertGroupMemberSchema>;
export type InsertGroupMessage = z.infer<typeof insertGroupMessageSchema>;
export type InsertGroupJoinRequest = z.infer<typeof insertGroupJoinRequestSchema>;
export type InsertGroupActivityLog = z.infer<typeof insertGroupActivityLogSchema>;

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

// === LIVE STREAMING ===
export const liveStreams = pgTable("live_streams", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  streamUrl: text("stream_url"),
  embedUrl: text("embed_url"),
  youtubeVideoId: text("youtube_video_id"),
  youtubeChannelId: text("youtube_channel_id"),
  youtubeChannelName: text("youtube_channel_name"),
  isLive: boolean("is_live").default(false),
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
  viewerCount: integer("viewer_count").default(0),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const liveStreamRelations = relations(liveStreams, ({ one }) => ({
  creator: one(users, {
    fields: [liveStreams.createdBy],
    references: [users.id],
  }),
}));

export const insertLiveStreamSchema = createInsertSchema(liveStreams).omit({ id: true, createdAt: true, viewerCount: true });
export type LiveStream = typeof liveStreams.$inferSelect;
export type InsertLiveStream = z.infer<typeof insertLiveStreamSchema>;

// === API Keys for External Integrations ===

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  key: text("key").notNull().unique(),
  prefix: text("prefix").notNull(),
  permissions: jsonb("permissions").default("[\"read\"]"),
  rateLimit: integer("rate_limit").default(100), // requests per hour
  lastUsedAt: timestamp("last_used_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const apiKeyRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}));

export const insertApiKeySchema = createInsertSchema(apiKeys).omit({ id: true, createdAt: true, key: true, prefix: true });
export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;

// === Webhooks for External Integrations ===

export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  url: text("url").notNull(),
  events: jsonb("events").notNull(), // event types to trigger webhook
  secret: text("secret"),
  isActive: boolean("is_active").default(true),
  lastTriggeredAt: timestamp("last_triggered_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const webhookRelations = relations(webhooks, ({ one }) => ({
  user: one(users, {
    fields: [webhooks.userId],
    references: [users.id],
  }),
}));

export const insertWebhookSchema = createInsertSchema(webhooks).omit({ id: true, createdAt: true });
export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = z.infer<typeof insertWebhookSchema>;

// === MULTI-LANGUAGE & LOCALIZATION ===

export const supportedLanguages = pgTable("supported_languages", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  nativeName: text("native_name").notNull(),
  isActive: boolean("is_active").default(true),
  isDefault: boolean("is_default").default(false),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const supportedLanguagesRelations = relations(supportedLanguages, ({ one }) => ({
}));

export const insertSupportedLanguageSchema = createInsertSchema(supportedLanguages).omit({ id: true, createdAt: true });
export type SupportedLanguage = typeof supportedLanguages.$inferSelect;
export type InsertSupportedLanguage = z.infer<typeof insertSupportedLanguageSchema>;

// === Volunteer Management ===

export const volunteerSkills = pgTable("volunteer_skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
});

export const volunteerProfiles = pgTable("volunteer_profiles", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull().unique(),
  skills: jsonb("skills").default("[]"),
  availability: jsonb("availability").default("{}"),
  totalHours: integer("total_hours").default(0),
  isActive: boolean("is_active").default(true),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const volunteerOpportunities = pgTable("volunteer_opportunities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  requiredSkills: jsonb("required_skills").default("[]"),
  date: timestamp("date").notNull(),
  duration: integer("duration"), // in minutes
  location: text("location"),
  spotsAvailable: integer("spots_available"),
  spotsFilled: integer("spots_filled").default(0),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const volunteerAssignments = pgTable("volunteer_assignments", {
  id: serial("id").primaryKey(),
  volunteerId: uuid("volunteer_id").references(() => users.id).notNull(),
  opportunityId: integer("opportunity_id").references(() => volunteerOpportunities.id).notNull(),
  status: text("status").default("pending"), // pending, confirmed, completed, cancelled
  checkInAt: timestamp("check_in_at"),
  checkOutAt: timestamp("check_out_at"),
  hoursWorked: integer("hours_worked").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const volunteerBadges = pgTable("volunteer_badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  criteria: text("criteria"), // JSON criteria for earning badge
  createdAt: timestamp("created_at").defaultNow(),
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  badgeId: integer("badge_id").references(() => volunteerBadges.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Relations
export const volunteerProfileRelations = relations(volunteerProfiles, ({ one }) => ({
  user: one(users, {
    fields: [volunteerProfiles.userId],
    references: [users.id],
  }),
}));

export const volunteerOpportunityRelations = relations(volunteerOpportunities, ({ one }) => ({
  creator: one(users, {
    fields: [volunteerOpportunities.createdBy],
    references: [users.id],
  }),
}));

export const volunteerAssignmentRelations = relations(volunteerAssignments, ({ one }) => ({
  volunteer: one(users, {
    fields: [volunteerAssignments.volunteerId],
    references: [users.id],
  }),
  opportunity: one(volunteerOpportunities, {
    fields: [volunteerAssignments.opportunityId],
    references: [volunteerOpportunities.id],
  }),
}));

export const userBadgeRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id],
  }),
  badge: one(volunteerBadges, {
    fields: [userBadges.badgeId],
    references: [volunteerBadges.id],
  }),
}));

// Insert schemas
export const insertVolunteerSkillSchema = createInsertSchema(volunteerSkills).omit({ id: true });
export type VolunteerSkill = typeof volunteerSkills.$inferSelect;
export type InsertVolunteerSkill = z.infer<typeof insertVolunteerSkillSchema>;

export const insertVolunteerProfileSchema = createInsertSchema(volunteerProfiles).omit({ id: true });
export type VolunteerProfile = typeof volunteerProfiles.$inferSelect;
export type InsertVolunteerProfile = z.infer<typeof insertVolunteerProfileSchema>;

export const insertVolunteerOpportunitySchema = createInsertSchema(volunteerOpportunities).omit({ id: true, createdAt: true, spotsFilled: true });
export type VolunteerOpportunity = typeof volunteerOpportunities.$inferSelect;
export type InsertVolunteerOpportunity = z.infer<typeof insertVolunteerOpportunitySchema>;

export const insertVolunteerAssignmentSchema = createInsertSchema(volunteerAssignments).omit({ id: true, createdAt: true });
export type VolunteerAssignment = typeof volunteerAssignments.$inferSelect;
export type InsertVolunteerAssignment = z.infer<typeof insertVolunteerAssignmentSchema>;

export const insertVolunteerBadgeSchema = createInsertSchema(volunteerBadges).omit({ id: true, createdAt: true });
export type VolunteerBadge = typeof volunteerBadges.$inferSelect;
export type InsertVolunteerBadge = z.infer<typeof insertVolunteerBadgeSchema>;

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({ id: true, earnedAt: true });
export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;

// === Privacy & Moderation ===

export const privacySettings = pgTable("privacy_settings", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull().unique(),
  showProfile: boolean("show_profile").default(true),
  showAttendance: boolean("show_attendance").default(true),
  showDonations: boolean("show_donations").default(false),
  showPrayerRequests: boolean("show_prayer_requests").default(true),
  allowMessaging: boolean("allow_messaging").default(true),
  showInDirectory: boolean("show_in_directory").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contentFlags = pgTable("content_flags", {
  id: serial("id").primaryKey(),
  contentType: text("content_type").notNull(), // prayer_request, message, event, comment, etc.
  contentId: integer("content_id").notNull(),
  reporterId: uuid("reporter_id").references(() => users.id),
  reason: text("reason").notNull(), // spam, inappropriate, abusive, harassment, other
  status: text("status").default("pending"), // pending, reviewed, resolved, dismissed
  reviewedBy: uuid("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const abuseReports = pgTable("abuse_reports", {
  id: serial("id").primaryKey(),
  reporterId: uuid("reporter_id").references(() => users.id).notNull(),
  reportedUserId: uuid("reported_user_id").references(() => users.id),
  reportedContentId: integer("reported_content_id"),
  reportedContentType: text("reported_content_type"),
  category: text("category").notNull(), // harassment, bullying, abuse, misconduct, other
  description: text("description").notNull(),
  evidence: jsonb("evidence").default("[]"),
  status: text("status").default("pending"), // pending, investigating, resolved, dismissed
  resolution: text("resolution"),
  resolvedBy: uuid("resolved_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const privacySettingsRelations = relations(privacySettings, ({ one }) => ({
  user: one(users, {
    fields: [privacySettings.userId],
    references: [users.id],
  }),
}));

export const contentFlagRelations = relations(contentFlags, ({ one }) => ({
  reporter: one(users, {
    fields: [contentFlags.reporterId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [contentFlags.reviewedBy],
    references: [users.id],
  }),
}));

export const abuseReportRelations = relations(abuseReports, ({ one }) => ({
  reporter: one(users, {
    fields: [abuseReports.reporterId],
    references: [users.id],
  }),
  reportedUser: one(users, {
    fields: [abuseReports.reportedUserId],
    references: [users.id],
  }),
  resolver: one(users, {
    fields: [abuseReports.resolvedBy],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertPrivacySettingsSchema = createInsertSchema(privacySettings).omit({ id: true, createdAt: true, updatedAt: true });
export type PrivacySettings = typeof privacySettings.$inferSelect;
export type InsertPrivacySettings = z.infer<typeof insertPrivacySettingsSchema>;

export const insertContentFlagSchema = createInsertSchema(contentFlags).omit({ id: true, createdAt: true });
export type ContentFlag = typeof contentFlags.$inferSelect;
export type InsertContentFlag = z.infer<typeof insertContentFlagSchema>;

export const insertAbuseReportSchema = createInsertSchema(abuseReports).omit({ id: true, createdAt: true });
export type AbuseReport = typeof abuseReports.$inferSelect;
export type InsertAbuseReport = z.infer<typeof insertAbuseReportSchema>;

// === Bible Study Tools ===

export const userHighlights = pgTable("user_highlights", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  book: text("book").notNull(),
  chapter: integer("chapter").notNull(),
  verse: integer("verse").notNull(),
  color: text("color").default("#FFEB3B"),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userNotes = pgTable("user_notes", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  book: text("book").notNull(),
  chapter: integer("chapter").notNull(),
  verse: integer("verse").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const verseDiscussions = pgTable("verse_discussions", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  book: text("book").notNull(),
  chapter: integer("chapter").notNull(),
  verse: integer("verse").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const groupAnnotations = pgTable("group_annotations", {
  id: serial("id").primaryKey(),
  groupId: integer("groups").references(() => groups.id).notNull(),
  book: text("book").notNull(),
  chapter: integer("chapter").notNull(),
  verse: integer("verse").notNull(),
  content: text("content").notNull(),
  createdBy: uuid("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const userHighlightRelations = relations(userHighlights, ({ one }) => ({
  user: one(users, {
    fields: [userHighlights.userId],
    references: [users.id],
  }),
}));

export const userNoteRelations = relations(userNotes, ({ one }) => ({
  user: one(users, {
    fields: [userNotes.userId],
    references: [users.id],
  }),
}));

export const verseDiscussionRelations = relations(verseDiscussions, ({ one }) => ({
  user: one(users, {
    fields: [verseDiscussions.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserHighlightSchema = createInsertSchema(userHighlights).omit({ id: true, createdAt: true });
export type UserHighlight = typeof userHighlights.$inferSelect;
export type InsertUserHighlight = z.infer<typeof insertUserHighlightSchema>;

export const insertUserNoteSchema = createInsertSchema(userNotes).omit({ id: true, createdAt: true, updatedAt: true });
export type UserNote = typeof userNotes.$inferSelect;
export type InsertUserNote = z.infer<typeof insertUserNoteSchema>;

export const insertVerseDiscussionSchema = createInsertSchema(verseDiscussions).omit({ id: true, createdAt: true });
export type VerseDiscussion = typeof verseDiscussions.$inferSelect;
export type InsertVerseDiscussion = z.infer<typeof insertVerseDiscussionSchema>;

export const insertGroupAnnotationSchema = createInsertSchema(groupAnnotations).omit({ id: true, createdAt: true });
export type GroupAnnotation = typeof groupAnnotations.$inferSelect;
export type InsertGroupAnnotation = z.infer<typeof insertGroupAnnotationSchema>;

// === DISCIPLESHIP PATHWAYS ===

export const trackCategoryEnum = pgEnum("track_category", ["new_believer", "leadership", "discipleship", "ministry", "theology", "practical", "other"]);

export const discipleshipTracks = pgTable("discipleship_tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: trackCategoryEnum("category").default("other"),
  imageUrl: text("image_url"),
  estimatedWeeks: integer("estimated_weeks"),
  isActive: boolean("is_active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  trackId: integer("track_id").references(() => discipleshipTracks.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  videoUrl: text("video_url"),
  order: integer("order").default(0),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").references(() => lessons.id).notNull(),
  question: text("question").notNull(),
  options: jsonb("options").$type<string[]>().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  explanation: text("explanation"),
  order: integer("order").default(0),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  trackId: integer("track_id").references(() => discipleshipTracks.id).notNull(),
  lessonId: integer("lesson_id").references(() => lessons.id).notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  quizScore: integer("quiz_score"),
  quizAttempts: integer("quiz_attempts").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reflections = pgTable("reflections", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  lessonId: integer("lesson_id").references(() => lessons.id).notNull(),
  content: text("content").notNull(),
  isPrivate: boolean("is_private").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for Discipleship
export const insertDiscipleshipTrackSchema = createInsertSchema(discipleshipTracks).omit({ id: true, createdAt: true, updatedAt: true });
export type DiscipleshipTrack = typeof discipleshipTracks.$inferSelect;
export type InsertDiscipleshipTrack = z.infer<typeof insertDiscipleshipTrackSchema>;

export const insertLessonSchema = createInsertSchema(lessons).omit({ id: true, createdAt: true, updatedAt: true });
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export const insertQuizSchema = createInsertSchema(quizzes).omit({ id: true });
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true, createdAt: true, updatedAt: true });
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export const insertReflectionSchema = createInsertSchema(reflections).omit({ id: true, createdAt: true });
export type Reflection = typeof reflections.$inferSelect;
export type InsertReflection = z.infer<typeof insertReflectionSchema>;

// === Sermon Clips ===

export const clipFormats = ["square", "vertical", "landscape"] as const;
export type ClipFormat = typeof clipFormats[number];

export const sermonClips = pgTable("sermon_clips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  sourceVideoUrl: text("source_video_url"),
  sourceVideoPath: text("source_video_path"),
  clipStartTime: integer("clip_start_time").notNull(),
  clipEndTime: integer("clip_end_time").notNull(),
  format: text("format").notNull().default("landscape"),
  overlayText: text("overlay_text"),
  verseReference: text("verse_reference"),
  outputUrl: text("output_url"),
  outputPath: text("output_path"),
  status: text("status").notNull().default("pending"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSermonClipSchema = createInsertSchema(sermonClips).omit({ id: true, createdAt: true });
export type SermonClip = typeof sermonClips.$inferSelect;
export type InsertSermonClip = z.infer<typeof insertSermonClipSchema>;

// === CHURCH SOCIAL FEED ===

export const postVisibilityEnum = pgEnum('post_visibility', [
  'PUBLIC',
  'MEMBERS_ONLY',
  'PRIVATE'
]);

export const postTypeEnum = pgEnum('post_type', [
  'TEXT',
  'IMAGE',
  'VIDEO',
  'TESTIMONY',
  'PRAYER_REQUEST',
  'ANNOUNCEMENT'
]);

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  content: text("content"),
  type: postTypeEnum("type").default("TEXT"),
  visibility: postVisibilityEnum("visibility").default("MEMBERS_ONLY"),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  verseReference: text("verse_reference"),
  likesCount: integer("likes_count").default(0),
  commentsCount: integer("comments_count").default(0),
  sharesCount: integer("shares_count").default(0),
  isPinned: boolean("is_pinned").default(false),
  isHidden: boolean("is_hidden").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const postLikes = pgTable("post_likes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const postComments = pgTable("post_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  parentId: integer("parent_id"),
  content: text("content").notNull(),
  likesCount: integer("likes_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const commentLikes = pgTable("comment_likes", {
  id: serial("id").primaryKey(),
  commentId: integer("comment_id").references(() => postComments.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const postShares = pgTable("post_shares", {
  id: serial("id").primaryKey(),
  originalPostId: integer("original_post_id").references(() => posts.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  sharedPostId: integer("shared_post_id").references(() => posts.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userConnections = pgTable("user_connections", {
  id: serial("id").primaryKey(),
  followerId: uuid("follower_id").references(() => users.id).notNull(),
  followingId: uuid("following_id").references(() => users.id).notNull(),
  status: text("status").default("ACTIVE"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const hashtags = pgTable("hashtags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  postsCount: integer("posts_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const postHashtags = pgTable("post_hashtags", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => posts.id).notNull(),
  hashtagId: integer("hashtag_id").references(() => hashtags.id).notNull(),
});

// Relations
export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  likes: many(postLikes),
  comments: many(postComments),
  shares: many(postShares),
  hashtags: many(postHashtags),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
}));

export const postCommentsRelations = relations(postComments, ({ one, many }) => ({
  post: one(posts, {
    fields: [postComments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postComments.userId],
    references: [users.id],
  }),
  parent: one(postComments, {
    fields: [postComments.parentId],
    references: [postComments.id],
  }),
  likes: many(commentLikes),
}));

export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  comment: one(postComments, {
    fields: [commentLikes.commentId],
    references: [postComments.id],
  }),
  user: one(users, {
    fields: [commentLikes.userId],
    references: [users.id],
  }),
}));

export const postSharesRelations = relations(postShares, ({ one }) => ({
  originalPost: one(posts, {
    fields: [postShares.originalPostId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postShares.userId],
    references: [users.id],
  }),
  sharedPost: one(posts, {
    fields: [postShares.sharedPostId],
    references: [posts.id],
  }),
}));

export const userConnectionsRelations = relations(userConnections, ({ one }) => ({
  follower: one(users, {
    fields: [userConnections.followerId],
    references: [users.id],
  }),
  following: one(users, {
    fields: [userConnections.followingId],
    references: [users.id],
  }),
}));

export const hashtagsRelations = relations(hashtags, ({ many }) => ({
  posts: many(postHashtags),
}));

export const postHashtagsRelations = relations(postHashtags, ({ one }) => ({
  post: one(posts, {
    fields: [postHashtags.postId],
    references: [posts.id],
  }),
  hashtag: one(hashtags, {
    fields: [postHashtags.hashtagId],
    references: [hashtags.id],
  }),
}));

// Insert schemas
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, createdAt: true, updatedAt: true, likesCount: true, commentsCount: true, sharesCount: true });
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export const insertPostLikeSchema = createInsertSchema(postLikes).omit({ id: true, createdAt: true });
export type PostLike = typeof postLikes.$inferSelect;
export type InsertPostLike = z.infer<typeof insertPostLikeSchema>;

export const insertPostCommentSchema = createInsertSchema(postComments).omit({ id: true, createdAt: true, updatedAt: true, likesCount: true });
export type PostComment = typeof postComments.$inferSelect;
export type InsertPostComment = z.infer<typeof insertPostCommentSchema>;

export const insertCommentLikeSchema = createInsertSchema(commentLikes).omit({ id: true, createdAt: true });
export type CommentLike = typeof commentLikes.$inferSelect;
export type InsertCommentLike = z.infer<typeof insertCommentLikeSchema>;

export const insertPostShareSchema = createInsertSchema(postShares).omit({ id: true, createdAt: true });
export type PostShare = typeof postShares.$inferSelect;
export type InsertPostShare = z.infer<typeof insertPostShareSchema>;

export const insertUserConnectionSchema = createInsertSchema(userConnections).omit({ id: true, createdAt: true });
export type UserConnection = typeof userConnections.$inferSelect;
export type InsertUserConnection = z.infer<typeof insertUserConnectionSchema>;

export const insertHashtagSchema = createInsertSchema(hashtags).omit({ id: true, createdAt: true, postsCount: true });
export type Hashtag = typeof hashtags.$inferSelect;
export type InsertHashtag = z.infer<typeof insertHashtagSchema>;

// === SPIRITUAL HEALTH & ENGAGEMENT ANALYTICS ===

export const userEngagementMetrics = pgTable("user_engagement_metrics", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  date: date("date").notNull().defaultNow(),
  sermonsWatched: integer("sermons_watched").default(0),
  prayersSubmitted: integer("prayers_submitted").default(0),
  eventsAttended: integer("events_attended").default(0),
  devotionalsRead: integer("devotionals_read").default(0),
  groupMessages: integer("group_messages").default(0),
  loginCount: integer("login_count").default(1),
  totalSessionTime: integer("total_session_time").default(0),
});

export const spiritualHealthScores = pgTable("spiritual_health_scores", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  weekStart: date("week_start").notNull(),
  attendanceScore: integer("attendance_score").default(0),
  engagementScore: integer("engagement_score").default(0),
  growthScore: integer("growth_score").default(0),
  overallScore: integer("overall_score").default(0),
  calculatedAt: timestamp("calculated_at").defaultNow(),
});

export const discipleshipAnalytics = pgTable("discipleship_analytics", {
  id: serial("id").primaryKey(),
  trackId: integer("track_id").references(() => discipleshipTracks.id),
  totalEnrolled: integer("total_enrolled").default(0),
  activeLearners: integer("active_learners").default(0),
  completedCount: integer("completed_count").default(0),
  averageCompletionTime: integer("average_completion_time"),
  quizAverageScore: integer("quiz_average_score"),
  weekStart: date("week_start").notNull(),
});

export const groupAnalytics = pgTable("group_analytics", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").references(() => groups.id),
  weekStart: date("week_start").notNull(),
  activeMembers: integer("active_members").default(0),
  messagesCount: integer("messages_count").default(0),
  meetingsHeld: integer("meetings_held").default(0),
  newMembers: integer("new_members").default(0),
});

export const analyticsReports = pgTable("analytics_reports", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  reportType: text("report_type").notNull(),
  filters: jsonb("filters").default("{}"),
  generatedBy: uuid("generated_by").references(() => users.id),
  filePath: text("file_path"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const userEngagementMetricsRelations = relations(userEngagementMetrics, ({ one }) => ({
  user: one(users, {
    fields: [userEngagementMetrics.userId],
    references: [users.id],
  }),
}));

export const spiritualHealthScoresRelations = relations(spiritualHealthScores, ({ one }) => ({
  user: one(users, {
    fields: [spiritualHealthScores.userId],
    references: [users.id],
  }),
}));

export const discipleshipAnalyticsRelations = relations(discipleshipAnalytics, ({ one }) => ({
  track: one(discipleshipTracks, {
    fields: [discipleshipAnalytics.trackId],
    references: [discipleshipTracks.id],
  }),
}));

export const groupAnalyticsRelations = relations(groupAnalytics, ({ one }) => ({
  group: one(groups, {
    fields: [groupAnalytics.groupId],
    references: [groups.id],
  }),
}));

export const analyticsReportsRelations = relations(analyticsReports, ({ one }) => ({
  generator: one(users, {
    fields: [analyticsReports.generatedBy],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserEngagementMetricsSchema = createInsertSchema(userEngagementMetrics).omit({ id: true });
export type UserEngagementMetrics = typeof userEngagementMetrics.$inferSelect;
export type InsertUserEngagementMetrics = z.infer<typeof insertUserEngagementMetricsSchema>;

export const insertSpiritualHealthScoreSchema = createInsertSchema(spiritualHealthScores).omit({ id: true, calculatedAt: true });
export type SpiritualHealthScore = typeof spiritualHealthScores.$inferSelect;
export type InsertSpiritualHealthScore = z.infer<typeof insertSpiritualHealthScoreSchema>;

export const insertDiscipleshipAnalyticsSchema = createInsertSchema(discipleshipAnalytics).omit({ id: true });
export type DiscipleshipAnalytics = typeof discipleshipAnalytics.$inferSelect;
export type InsertDiscipleshipAnalytics = z.infer<typeof insertDiscipleshipAnalyticsSchema>;

export const insertGroupAnalyticsSchema = createInsertSchema(groupAnalytics).omit({ id: true });
export type GroupAnalytics = typeof groupAnalytics.$inferSelect;
export type InsertGroupAnalytics = z.infer<typeof insertGroupAnalyticsSchema>;

export const insertAnalyticsReportSchema = createInsertSchema(analyticsReports).omit({ id: true, createdAt: true });
export type AnalyticsReport = typeof analyticsReports.$inferSelect;
export type InsertAnalyticsReport = z.infer<typeof insertAnalyticsReportSchema>;

// === PASTORAL CARE & COUNSELING SYSTEM ===

export const counselingRequests = pgTable("counseling_requests", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  requestType: text("request_type").notNull(),
  urgency: text("urgency").default("normal"),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").default("pending"),
  assignedTo: uuid("assigned_to").references(() => users.id),
  assignedAt: timestamp("assigned_at"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const counselingNotes = pgTable("counseling_notes", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").references(() => counselingRequests.id).notNull(),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  isInternal: boolean("is_internal").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const counselingFollowups = pgTable("counseling_followups", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").references(() => counselingRequests.id).notNull(),
  scheduledDate: date("scheduled_date").notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pastoralVisits = pgTable("pastoral_visits", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").references(() => counselingRequests.id),
  visitorId: uuid("visitor_id").references(() => users.id).notNull(),
  visitedUserId: uuid("visited_user_id").references(() => users.id),
  visitDate: date("visit_date").notNull(),
  location: text("location"),
  notes: text("notes"),
  followUpNeeded: boolean("follow_up_needed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const counselingRequestRelations = relations(counselingRequests, ({ one, many }) => ({
  user: one(users, {
    fields: [counselingRequests.userId],
    references: [users.id],
  }),
  assignedTo: one(users, {
    fields: [counselingRequests.assignedTo],
    references: [users.id],
  }),
  notes: many(counselingNotes),
  followups: many(counselingFollowups),
  visits: many(pastoralVisits),
}));

export const counselingNoteRelations = relations(counselingNotes, ({ one }) => ({
  request: one(counselingRequests, {
    fields: [counselingNotes.requestId],
    references: [counselingRequests.id],
  }),
  author: one(users, {
    fields: [counselingNotes.authorId],
    references: [users.id],
  }),
}));

export const counselingFollowupRelations = relations(counselingFollowups, ({ one }) => ({
  request: one(counselingRequests, {
    fields: [counselingFollowups.requestId],
    references: [counselingRequests.id],
  }),
}));

export const pastoralVisitRelations = relations(pastoralVisits, ({ one }) => ({
  request: one(counselingRequests, {
    fields: [pastoralVisits.requestId],
    references: [counselingRequests.id],
  }),
  visitor: one(users, {
    fields: [pastoralVisits.visitorId],
    references: [users.id],
  }),
  visitedUser: one(users, {
    fields: [pastoralVisits.visitedUserId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertCounselingRequestSchema = createInsertSchema(counselingRequests).omit({ id: true, createdAt: true, updatedAt: true });
export type CounselingRequest = typeof counselingRequests.$inferSelect;
export type InsertCounselingRequest = z.infer<typeof insertCounselingRequestSchema>;

export const insertCounselingNoteSchema = createInsertSchema(counselingNotes).omit({ id: true, createdAt: true });
export type CounselingNote = typeof counselingNotes.$inferSelect;
export type InsertCounselingNote = z.infer<typeof insertCounselingNoteSchema>;

export const insertCounselingFollowupSchema = createInsertSchema(counselingFollowups).omit({ id: true, createdAt: true });
export type CounselingFollowup = typeof counselingFollowups.$inferSelect;
export type InsertCounselingFollowup = z.infer<typeof insertCounselingFollowupSchema>;

export const insertPastoralVisitSchema = createInsertSchema(pastoralVisits).omit({ id: true, createdAt: true });
export type PastoralVisit = typeof pastoralVisits.$inferSelect;
export type InsertPastoralVisit = z.infer<typeof insertPastoralVisitSchema>;
