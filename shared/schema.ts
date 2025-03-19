import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  tag: text("tag").notNull(),
  description: text("description").notNull(),
});

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  checkIn: timestamp("check_in").notNull(),
  checkOut: timestamp("check_out"),
  notes: text("notes"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  avatar: true,
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects);

export const insertAttendanceSchema = createInsertSchema(attendance).pick({
  userId: true,
  checkIn: true,
  notes: true,
});

export const updateAttendanceSchema = createInsertSchema(attendance).pick({
  checkOut: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Attendance = typeof attendance.$inferSelect;
