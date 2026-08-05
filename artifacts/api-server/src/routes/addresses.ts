import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, addressesTable } from "@workspace/db";
import {
  CreateAddressBody,
  UpdateAddressBody,
  UpdateAddressParams,
  DeleteAddressParams,
} from "@workspace/api-zod";

const router: IRouter = Router();
const SESSION_ID = "guest";

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

router.get("/addresses", async (_req, res): Promise<void> => {
  const addresses = await db
    .select()
    .from(addressesTable)
    .where(eq(addressesTable.userId, SESSION_ID));
  res.json(addresses.map(buildAddress));
});

router.post("/addresses", async (req, res): Promise<void> => {
  const parsed = CreateAddressBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.isDefault) {
    await db
      .update(addressesTable)
      .set({ isDefault: false })
      .where(eq(addressesTable.userId, SESSION_ID));
  }

  const [inserted] = await db
    .insert(addressesTable)
    .values({ ...parsed.data, userId: SESSION_ID })
    .returning();

  res.status(201).json(buildAddress(inserted!));
});

router.put("/addresses/:id", async (req, res): Promise<void> => {
  const params = UpdateAddressParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid address id" });
    return;
  }

  const parsed = UpdateAddressBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.isDefault) {
    await db
      .update(addressesTable)
      .set({ isDefault: false })
      .where(eq(addressesTable.userId, SESSION_ID));
  }

  const [updated] = await db
    .update(addressesTable)
    .set(parsed.data)
    .where(
      and(
        eq(addressesTable.id, params.data.id),
        eq(addressesTable.userId, SESSION_ID),
      ),
    )
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Address not found" });
    return;
  }

  res.json(buildAddress(updated));
});

router.delete("/addresses/:id", async (req, res): Promise<void> => {
  const params = DeleteAddressParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid address id" });
    return;
  }

  await db
    .delete(addressesTable)
    .where(
      and(
        eq(addressesTable.id, params.data.id),
        eq(addressesTable.userId, SESSION_ID),
      ),
    );

  res.sendStatus(204);
});

export default router;
