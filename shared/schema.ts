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
  userId: uuid("user_id").references(() => users.id), // Link to auth users
  authorName: text("author_name"), // For display if user is not linked or anonymous
  content: text("content").notNull(),
  isAnonymous: boolean("is_anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  prayCount: integer("pray_count").default(0),
});

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  amount: integer("amount").notNull(), // In cents
  currency: text("currency").default("usd"),
  status: text("status").notNull(), // pending, succeeded, failed
  createdAt: timestamp("created_at").defaultNow(),
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

// === EXPLICIT API CONTRACT TYPES ===
export type Branding = typeof branding.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Sermon = typeof sermons.$inferSelect;
export type PrayerRequest = typeof prayerRequests.$inferSelect;
export type Donation = typeof donations.$inferSelect;
export type EventRsvp = typeof eventRsvps.$inferSelect;

export type InsertBranding = z.infer<typeof insertBrandingSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertSermon = z.infer<typeof insertSermonSchema>;
export type InsertPrayerRequest = z.infer<typeof insertPrayerRequestSchema>;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type InsertEventRsvp = z.infer<typeof insertEventRsvpSchema>;

// Request types
export type CreateEventRequest = InsertEvent;
export type CreateSermonRequest = InsertSermon;
export type CreatePrayerRequestRequest = InsertPrayerRequest;
export type CreateDonationRequest = InsertDonation;

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
