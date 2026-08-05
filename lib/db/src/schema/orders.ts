import {
  pgTable,
  text,
  serial,
  timestamp,
  real,
  integer,
} from "drizzle-orm/pg-core";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().default("guest"),
  status: text("status").notNull().default("pending"),
  paymentMethod: text("payment_method").notNull().default("cod"),
  paymentStatus: text("payment_status").notNull().default("pending"),
  addressId: integer("address_id").notNull(),
  subtotal: real("subtotal").notNull(),
  discount: real("discount").notNull().default(0),
  deliveryCharge: real("delivery_charge").notNull().default(0),
  total: real("total").notNull(),
  estimatedDelivery: text("estimated_delivery"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const orderItemsTable = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
