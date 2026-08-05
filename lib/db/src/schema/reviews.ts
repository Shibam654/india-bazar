import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const reviewsTable = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  reviewerName: text("reviewer_name").notNull(),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  comment: text("comment").notNull(),
  isVerifiedPurchase: boolean("is_verified_purchase").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
