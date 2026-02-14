import { pgTable, text, boolean, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'MEMBER', 
  'USER',
  'ADMIN',
  'PASTOR',
  'PASTORS_WIFE',
  'CHILDREN_LEADER',
  'CHOIRMASTER',
  'CHORISTER',
  'SOUND_EQUIPMENT',
  'SECURITY',
  'USHERS_LEADER',
  'USHER',
  'SUNDAY_SCHOOL_TEACHER',
  'CELL_LEADER',
  'PRAYER_TEAM',
  'FINANCE_TEAM',
  'TECH_TEAM',
  'DECOR_TEAM',
  'EVANGELISM_TEAM',
]);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phone: text('phone'),
  address: text('address'),
  houseFellowship: text('house_fellowship'),
  houseCellLocation: text('house_cell_location'),
  parish: text('parish'),
  isAdmin: boolean('is_admin').default(false).notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  verificationToken: text('verification_token'),
  verificationTokenExpires: timestamp('verification_token_expires'),
  resetPasswordToken: text('reset_password_token'),
  resetPasswordExpires: timestamp('reset_password_expires'),
  role: userRoleEnum('role').default('MEMBER').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
