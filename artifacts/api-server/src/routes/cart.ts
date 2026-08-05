import { Router, type IRouter } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, cartItemsTable, productsTable, wishlistItemsTable } from "@workspace/db";
import {
  AddToCartBody,
  UpdateCartItemBody,
  UpdateCartItemParams,
  RemoveFromCartParams,
  AddToWishlistBody,
  RemoveFromWishlistParams,
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

// ─── CART ───────────────────────────────────────────────────────────────────

router.get("/cart", async (_req, res): Promise<void> => {
  const items = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.sessionId, SESSION_ID));

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

  const cartItems = items
    .map((item) => {
      const product = productMap.get(item.productId);
      if (!product) return null;
      return {
        id: item.id,
        productId: item.productId,
        product: buildProduct(product),
        quantity: item.quantity,
      };
    })
    .filter(Boolean);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item!.product.mrp * item!.quantity),
    0,
  );
  const total_price = cartItems.reduce(
    (sum, item) => sum + (item!.product.price * item!.quantity),
    0,
  );
  const discount = subtotal - total_price;
  const deliveryCharge = total_price >= FREE_DELIVERY_THRESHOLD || total_price === 0 ? 0 : DELIVERY_CHARGE;
  const total = total_price + deliveryCharge;
  const itemCount = cartItems.reduce((sum, item) => sum + item!.quantity, 0);

  res.json({
    items: cartItems,
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    deliveryCharge,
    total: Math.round(total * 100) / 100,
    itemCount,
  });
});

router.post("/cart", async (req, res): Promise<void> => {
  const parsed = AddToCartBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { productId, quantity } = parsed.data;

  // Check if already in cart
  const [existing] = await db
    .select()
    .from(cartItemsTable)
    .where(
      and(
        eq(cartItemsTable.sessionId, SESSION_ID),
        eq(cartItemsTable.productId, productId),
      ),
    );

  let cartItem;
  if (existing) {
    const [updated] = await db
      .update(cartItemsTable)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItemsTable.id, existing.id))
      .returning();
    cartItem = updated;
  } else {
    const [inserted] = await db
      .insert(cartItemsTable)
      .values({ sessionId: SESSION_ID, productId, quantity })
      .returning();
    cartItem = inserted;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, productId));

  res.status(201).json({
    id: cartItem!.id,
    productId: cartItem!.productId,
    product: buildProduct(product!),
    quantity: cartItem!.quantity,
  });
});

router.patch("/cart/:id", async (req, res): Promise<void> => {
  const params = UpdateCartItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid cart item id" });
    return;
  }
  const parsed = UpdateCartItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db
    .update(cartItemsTable)
    .set({ quantity: parsed.data.quantity })
    .where(
      and(
        eq(cartItemsTable.id, params.data.id),
        eq(cartItemsTable.sessionId, SESSION_ID),
      ),
    )
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Cart item not found" });
    return;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, updated.productId));

  res.json({
    id: updated.id,
    productId: updated.productId,
    product: buildProduct(product!),
    quantity: updated.quantity,
  });
});

router.delete("/cart/clear", async (_req, res): Promise<void> => {
  await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, SESSION_ID));
  res.sendStatus(204);
});

router.delete("/cart/:id", async (req, res): Promise<void> => {
  const params = RemoveFromCartParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid cart item id" });
    return;
  }

  await db
    .delete(cartItemsTable)
    .where(
      and(
        eq(cartItemsTable.id, params.data.id),
        eq(cartItemsTable.sessionId, SESSION_ID),
      ),
    );

  res.sendStatus(204);
});

// ─── WISHLIST ────────────────────────────────────────────────────────────────

router.get("/wishlist", async (_req, res): Promise<void> => {
  const items = await db
    .select()
    .from(wishlistItemsTable)
    .where(eq(wishlistItemsTable.sessionId, SESSION_ID));

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

  res.json(
    items
      .map((item) => {
        const product = productMap.get(item.productId);
        if (!product) return null;
        return {
          id: item.id,
          productId: item.productId,
          product: buildProduct(product),
          addedAt: item.addedAt.toISOString(),
        };
      })
      .filter(Boolean),
  );
});

router.post("/wishlist", async (req, res): Promise<void> => {
  const parsed = AddToWishlistBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { productId } = parsed.data;

  const [existing] = await db
    .select()
    .from(wishlistItemsTable)
    .where(
      and(
        eq(wishlistItemsTable.sessionId, SESSION_ID),
        eq(wishlistItemsTable.productId, productId),
      ),
    );

  if (existing) {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, productId));
    res.status(201).json({
      id: existing.id,
      productId: existing.productId,
      product: buildProduct(product!),
      addedAt: existing.addedAt.toISOString(),
    });
    return;
  }

  const [inserted] = await db
    .insert(wishlistItemsTable)
    .values({ sessionId: SESSION_ID, productId })
    .returning();

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, productId));

  res.status(201).json({
    id: inserted!.id,
    productId: inserted!.productId,
    product: buildProduct(product!),
    addedAt: inserted!.addedAt.toISOString(),
  });
});

router.delete("/wishlist/:productId", async (req, res): Promise<void> => {
  const params = RemoveFromWishlistParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }

  await db
    .delete(wishlistItemsTable)
    .where(
      and(
        eq(wishlistItemsTable.sessionId, SESSION_ID),
        eq(wishlistItemsTable.productId, params.data.productId),
      ),
    );

  res.sendStatus(204);
});

export default router;
