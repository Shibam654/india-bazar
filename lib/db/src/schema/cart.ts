import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";

export const cartItemsTable = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().default("guest"),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const wishlistItemsTable = pgTable("wishlist_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().default("guest"),
  productId: integer("product_id").notNull(),
  addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
});
