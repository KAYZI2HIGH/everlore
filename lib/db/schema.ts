import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  uuid,
  integer,
  jsonb,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

// Course content (title, price, curriculum, media) lives in Sanity.
// Postgres holds everything that belongs to a person or a transaction.
// `courseId` columns store the Sanity document `_id`.

export const roleEnum = pgEnum("role", ["student", "admin"]);
export const enrollmentSourceEnum = pgEnum("enrollment_source", [
  "purchase",
  "free",
  "admin",
  "migrated",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "success",
  "failed",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  image: text("image"),
  bio: text("bio"),
  phone: text("phone"),
  passwordHash: text("password_hash"),
  googleId: text("google_id"),
  role: roleEnum("role").notNull().default("student"),
  sanityId: text("sanity_id").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    reference: text("reference").notNull().unique(),
    // Amounts are stored in the smallest currency unit (kobo for NGN).
    amount: integer("amount").notNull(),
    currency: text("currency").notNull().default("NGN"),
    status: paymentStatusEnum("status").notNull().default("pending"),
    courseIds: jsonb("course_ids").$type<string[]>().notNull(),
    providerResponse: jsonb("provider_response"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    paidAt: timestamp("paid_at", { withTimezone: true }),
  },
  (t) => [index("payments_user_idx").on(t.userId)],
);

export const enrollments = pgTable(
  "enrollments",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: text("course_id").notNull(),
    source: enrollmentSourceEnum("source").notNull(),
    paymentId: uuid("payment_id").references(() => payments.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.courseId] }),
    index("enrollments_course_idx").on(t.courseId),
  ],
);

export const cartItems = pgTable(
  "cart_items",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: text("course_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.courseId] })],
);

export const wishlistItems = pgTable(
  "wishlist_items",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    courseId: text("course_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.courseId] })],
);

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  interest: text("interest"),
  message: text("message").notNull(),
  handledAt: timestamp("handled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type Payment = typeof payments.$inferSelect;
