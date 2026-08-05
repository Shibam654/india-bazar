import { Router, type IRouter } from "express";
import { eq, and, sql } from "drizzle-orm";
import {
  db,
  ordersTable,
  orderItemsTable,
  productsTable,
  addressesTable,
  cartItemsTable,
} from "@workspace/db";
import {
  PlaceOrderBody,
  GetOrderParams,
  CancelOrderParams,
} from "@workspace/api-zod";

const router: IRouter = Router();
const SESSION_ID = "guest";
const FREE_DELIVERY_THRESHOLD = 499;
const DELIVERY_CHARGE = 40;

function buildProduct(p: typeof productsTable.$inferSelect) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    mrp: p.mrp,
    discount: p.discount,
    category: p.category,
    subcategory: p.subcategory ?? null,
    brand: p.brand,
    images: p.images,
    rating: p.rating,
    reviewCount: p.reviewCount,
    stock: p.stock,
    seller: p.seller,
    isFeatured: p.isFeatured,
    createdAt: p.createdAt.toISOString(),
  };
}

function buildAddress(a: typeof addressesTable.$inferSelect) {
  return {
    id: a.id,
    fullName: a.fullName,
    phone: a.phone,
    addressLine1: a.addressLine1,
    addressLine2: a.addressLine2 ?? null,
    city: a.city,
    state: a.state,
    pincode: a.pincode,
    isDefault: a.isDefault,
    addressType: a.addressType as "home" | "work" | "other",
  };
}

async function buildOrder(order: typeof ordersTable.$inferSelect) {
  const items = await db
    .select()
    .from(orderItemsTable)
    .where(eq(orderItemsTable.orderId, order.id));

  const productIds = items.map((i) => i.productId);
  let products: (typeof productsTable.$inferSelect)[] = [];
  if (productIds.length > 0) {
    products = await db
      .select()
      .from(productsTable)
      .where(
        sql`${productsTable.id} = ANY(${sql.raw(`ARRAY[${productIds.join(",")}]::int[]`)})`,
      );
  }
  const productMap = new Map(products.map((p) => [p.id, p]));

  const [address] = await db
    .select()
    .from(addressesTable)
    .where(eq(addressesTable.id, order.addressId));

  return {
    id: order.id,
    status: order.status as "pending" | "confirmed" | "shipped" | "out_for_delivery" | "delivered" | "cancelled",
    paymentMethod: order.paymentMethod as "cod" | "upi" | "card" | "netbanking",
    paymentStatus: order.paymentStatus as "pending" | "paid" | "failed" | "refunded",
    items: items.map((item) => {
      const product = productMap.get(item.productId);
      return {
        id: item.id,
        productId: item.productId,
        product: product ? buildProduct(product) : null,
        quantity: item.quantity,
        price: item.price,
      };
    }),
    address: address ? buildAddress(address) : null,
    subtotal: order.subtotal,
    discount: order.discount,
    deliveryCharge: order.deliveryCharge,
    total: order.total,
    estimatedDelivery: order.estimatedDelivery ?? null,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

router.get("/orders", async (_req, res): Promise<void> => {
  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.sessionId, SESSION_ID))
    .orderBy(sql`${ordersTable.createdAt} desc`);

  const built = await Promise.all(orders.map(buildOrder));
  res.json(built);
});

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = PlaceOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { addressId, paymentMethod, cartItemIds } = parsed.data;

  // Validate address
  const [address] = await db
    .select()
    .from(addressesTable)
    .where(eq(addressesTable.id, addressId));
  if (!address) {
    res.status(404).json({ error: "Address not found" });
    return;
  }

  // Get cart items
  const cartItems = await db
    .select()
    .from(cartItemsTable)
    .where(
      sql`${cartItemsTable.id} = ANY(${sql.raw(`ARRAY[${cartItemIds.join(",")}]::int[]`)})`,
    );

  if (cartItems.length === 0) {
    res.status(400).json({ error: "No cart items selected" });
    return;
  }

  const productIds = cartItems.map((i) => i.productId);
  const products = await db
    .select()
    .from(productsTable)
    .where(
      sql`${productsTable.id} = ANY(${sql.raw(`ARRAY[${productIds.join(",")}]::int[]`)})`,
    );
  const productMap = new Map(products.map((p) => [p.id, p]));

  const subtotal = cartItems.reduce((sum, item) => {
    const p = productMap.get(item.productId);
    return sum + (p ? p.mrp * item.quantity : 0);
  }, 0);

  const totalPrice = cartItems.reduce((sum, item) => {
    const p = productMap.get(item.productId);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);

  const discount = subtotal - totalPrice;
  const deliveryCharge = totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const total = totalPrice + deliveryCharge;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const estimatedDelivery = deliveryDate.toISOString().split("T")[0];

  const [order] = await db
    .insert(ordersTable)
    .values({
      sessionId: SESSION_ID,
      status: "confirmed",
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      addressId,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      deliveryCharge,
      total: Math.round(total * 100) / 100,
      estimatedDelivery,
    })
    .returning();

  // Insert order items
  await db.insert(orderItemsTable).values(
    cartItems.map((item) => ({
      orderId: order!.id,
      productId: item.productId,
      quantity: item.quantity,
      price: productMap.get(item.productId)?.price ?? 0,
    })),
  );

  // Remove ordered items from cart
  if (cartItemIds.length > 0) {
    await db
      .delete(cartItemsTable)
      .where(
        sql`${cartItemsTable.id} = ANY(${sql.raw(`ARRAY[${cartItemIds.join(",")}]::int[]`)})`,
      );
  }

  const built = await buildOrder(order!);
  res.status(201).json(built);
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid order id" });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(
      and(
        eq(ordersTable.id, params.data.id),
        eq(ordersTable.sessionId, SESSION_ID),
      ),
    );

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(await buildOrder(order));
});

router.post("/orders/:id/cancel", async (req, res): Promise<void> => {
  const params = CancelOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid order id" });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(
      and(
        eq(ordersTable.id, params.data.id),
        eq(ordersTable.sessionId, SESSION_ID),
      ),
    );

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  if (order.status === "delivered" || order.status === "cancelled") {
    res.status(400).json({ error: `Cannot cancel an order that is ${order.status}` });
    return;
  }

  const [updated] = await db
    .update(ordersTable)
    .set({
      status: "cancelled",
      paymentStatus: order.paymentMethod === "cod" ? "pending" : "refunded",
    })
    .where(eq(ordersTable.id, order.id))
    .returning();

  res.json(await buildOrder(updated!));
});

export default router;
