import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import {
  db,
  usersTable,
  cartItemsTable,
  wishlistItemsTable,
  ordersTable,
} from "@workspace/db";
import { UpdateUserProfileBody } from "@workspace/api-zod";

const router: IRouter = Router();
const SESSION_ID = "guest";
const GUEST_USER_ID = 1;

async function ensureGuestUser() {
  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, GUEST_USER_ID));
  if (!existing) {
    await db.insert(usersTable).values({
      name: "Guest User",
      email: "guest@shopkart.in",
      phone: null,
    });
  }
  return existing;
}

router.get("/user/profile", async (_req, res): Promise<void> => {
  await ensureGuestUser();
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, GUEST_USER_ID));

  res.json({
    id: user!.id,
    name: user!.name,
    email: user!.email,
    phone: user!.phone ?? null,
    createdAt: user!.createdAt.toISOString(),
  });
});

router.patch("/user/profile", async (req, res): Promise<void> => {
  await ensureGuestUser();
  const parsed = UpdateUserProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db
    .update(usersTable)
    .set(parsed.data)
    .where(eq(usersTable.id, GUEST_USER_ID))
    .returning();

  res.json({
    id: updated!.id,
    name: updated!.name,
    email: updated!.email,
    phone: updated!.phone ?? null,
    createdAt: updated!.createdAt.toISOString(),
  });
});

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [cartCount, wishlistCount, orderCounts] = await Promise.all([
    db
      .select({ count: sql<number>`sum(${cartItemsTable.quantity})` })
      .from(cartItemsTable)
      .where(eq(cartItemsTable.sessionId, SESSION_ID)),
    db
      .select({ count: sql<number>`count(*)` })
      .from(wishlistItemsTable)
      .where(eq(wishlistItemsTable.sessionId, SESSION_ID)),
    db
      .select({
        total: sql<number>`count(*)`,
        active: sql<number>`count(*) filter (where status not in ('delivered','cancelled'))`,
      })
      .from(ordersTable)
      .where(eq(ordersTable.sessionId, SESSION_ID)),
  ]);

  res.json({
    cartItemCount: Number(cartCount[0]?.count ?? 0),
    wishlistCount: Number(wishlistCount[0]?.count ?? 0),
    activeOrderCount: Number(orderCounts[0]?.active ?? 0),
    totalOrderCount: Number(orderCounts[0]?.total ?? 0),
  });
});

export default router;
