import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, reviewsTable } from "@workspace/db";
import { CreateReviewParams, CreateReviewBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/reviews/:productId", async (req, res): Promise<void> => {
  const params = CreateReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }

  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.productId, params.data.productId))
    .orderBy(reviewsTable.createdAt);

  res.json(
    reviews.map((r) => ({
      id: r.id,
      productId: r.productId,
      reviewerName: r.reviewerName,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      isVerifiedPurchase: r.isVerifiedPurchase,
      createdAt: r.createdAt.toISOString(),
    })),
  );
});

router.post("/reviews/:productId", async (req, res): Promise<void> => {
  const params = CreateReviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }

  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [inserted] = await db
    .insert(reviewsTable)
    .values({
      productId: params.data.productId,
      reviewerName: "Guest User",
      rating: parsed.data.rating,
      title: parsed.data.title,
      comment: parsed.data.comment,
      isVerifiedPurchase: false,
    })
    .returning();

  res.status(201).json({
    id: inserted!.id,
    productId: inserted!.productId,
    reviewerName: inserted!.reviewerName,
    rating: inserted!.rating,
    title: inserted!.title,
    comment: inserted!.comment,
    isVerifiedPurchase: inserted!.isVerifiedPurchase,
    createdAt: inserted!.createdAt.toISOString(),
  });
});

export default router;
