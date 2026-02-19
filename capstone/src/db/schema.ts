import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { time } from "node:console";

export const userRoleEnum = pgEnum("user_role", ["admin", "doctor", "nurse"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull(),
  orgId: varchar("org_id", { length: 255 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true })
    .notNull()
    .$defaultFn(() => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  revokedAt: timestamp("revoked_at", { withTimezone: true }),
  ip: text("ip"),
});

export const reportsData = pgTable("reports_data", {
  id: serial("id").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  addedAt: timestamp("added_at",{ withTimezone: true }).notNull().defaultNow(),
  removedAt: timestamp("removed_at", { withTimezone: true }),
  parsedText: text("parsed_text").notNull(),
  pagesNum: integer("pages_num").notNull(),
  isAnonymized: boolean("is_anonymized").notNull().$defaultFn(()=>false),
});

export type Newuser = typeof users.$inferInsert;
export type newSession = typeof sessions.$inferInsert;
export type newReport = typeof reportsData.$inferInsert;
