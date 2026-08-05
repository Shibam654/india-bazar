# ShopKart

A full-featured Indian e-commerce web app inspired by Flipkart and Amazon. Shoppers can browse by category, search and filter products, add to cart, manage a wishlist, checkout with COD/UPI/card/net banking, track orders, and manage saved addresses. Prices in INR (₹), supports free delivery above ₹499, and Cash on Delivery.

## Run & Operate

- `pnpm --filter @workspace/shopkart run dev` — run the frontend (port 24584)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, TailwindCSS, Wouter, TanStack Query
- API: Express 5, Zod validation
- DB: PostgreSQL + Drizzle ORM
- API codegen: Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts
- `lib/db/src/schema/` — Drizzle schema (products, users, cart, orders, reviews)
- `artifacts/api-server/src/routes/` — Express route handlers (products, cart, orders, addresses, reviews, user)
- `artifacts/shopkart/src/` — React frontend
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not hand-edit)
- `lib/api-zod/src/generated/` — generated Zod schemas for server validation (do not hand-edit)

## Architecture decisions

- All sessions run under a hardcoded `"guest"` SESSION_ID — no auth yet. All cart/wishlist/order data is shared under this single session.
- Orval generates both React Query hooks (frontend) and Zod schemas (server) from the same OpenAPI spec. Always run codegen after changing the spec.
- Zod v3 is used (`catalog:`). OpenAPI `type: integer` fields must be written as `type: number` to avoid `zod.int()` generation errors.
- Delivery is free above ₹499, else ₹40 flat. Computed in `artifacts/api-server/src/routes/cart.ts`.
- Product images use external CDN URLs from brand websites. Some may 404 depending on CDN policies.

## Product

- **Home**: Hero banner carousel, category shortcuts, Deals of the Day, Featured Products
- **Browse/Search**: Filter by price, brand, rating, category; sort by price, rating, newest, popular
- **Product Detail**: Image gallery, MRP/discount badge, add to cart/wishlist, seller info, reviews
- **Cart**: Quantity controls, price breakdown (MRP, savings, delivery, total)
- **Checkout**: Address selection, payment method (COD/UPI/card/netbanking), order summary
- **Orders**: Order history with status badges; order detail with delivery tracking timeline
- **Account**: Profile, saved addresses, order stats

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After changing `lib/api-spec/openapi.yaml`, always run `pnpm --filter @workspace/api-spec run codegen` before writing any backend route or frontend code.
- Use `type: number` (not `type: integer`) in the OpenAPI spec — Zod v3 doesn't support `zod.int()`.
- Run `pnpm --filter @workspace/db run push` after modifying any `lib/db/src/schema/` files.
- Cart/wishlist/orders use `sessionId = "guest"` hardcoded — must be replaced when authentication is added.
- Express 5: wildcard routes need `/{*splat}`, not bare `*`. `req.params.id` is `string | string[]`, always parse with `parseInt`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
