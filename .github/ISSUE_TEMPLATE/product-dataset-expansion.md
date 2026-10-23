---
name: "📦 Feature / Call for Data: Expand Product Catalog & Manufacturer/MRP Metadata"
about: "Proposal and tracking issue to enrich our product database with MRP, manufacturers, specifications, and productivity metrics."
title: "[Open-Source Task]: Expand Product Dataset & Enforce Comprehensive MRP / Manufacturer Specs"
labels: ["enhancement", "help wanted", "good first issue", "data", "open-source"]
assignees: []
---

## 📌 Problem Overview & Motivation
Currently, **India Bazaar** operates with a limited initial seed dataset. To build a robust e-commerce platform and maintain high commercial productivity, we need to significantly expand our product database and enforce mandatory Indian retail and manufacturing attributes.

In real-world retail compliance (such as the *Legal Metrology (Packaged Commodities) Rules, 2011* in India), e-commerce platforms must display accurate manufacturer info, MRP, packaging data, and productivity/spec metrics.

---

## 🎯 Key Gaps Identified
1. **Low Volume of Products**: We currently have a limited sample catalog across key categories (Pooja/Festival Goods, Handloom & Fashion, Electronics, Gourmet Sweets, Home Appliances).
2. **Missing MRP & Pricing Economics**: Need systematic distinction between:
   - **MRP (Maximum Retail Price)**
   - **Listing / Selling Price**
   - **Discount Percentage (%)**
   - **GST Slab Rate (0%, 5%, 12%, 18%, 28%)**
3. **Missing Manufacturer & Origin Attributes**:
   - Manufacturer Name & Registered Address
   - Country of Origin (e.g., India)
   - Packer / Importer Details
   - Manufacturing Date & Shelf Life / Expiry (for food/ayurvedic goods)
4. **Productivity & Technical Specifications**:
   - Model Numbers & EAN / Barcode identifiers
   - Dimensions, Net Weight, and Net Quantity (e.g., grams, ml, piece count)
   - Warranty & Service Provider Information

---

## 📋 Action Plan & Open-Source Tasks

- [ ] **Task 1: Schema Migration (`lib/db/src/schema/products.ts`)**
  - Add `manufacturerName`, `manufacturerAddress`, `countryOfOrigin`, `gstRate`, `netQuantity`, `dimensions`, and `barcode` fields.
- [ ] **Task 2: Curate Open Seed Datasets (`scripts/seed/`)**
  - Provide modular JSON / CSV datasets for:
    - 🪔 Traditional Arts, Crafts & Pooja Essentials
    - 👗 Indian Ethnic Wear & Handloom Textiles
    - 🍬 Sweets, Dry Fruits & Gourmet Hampers
    - 📱 Consumer Electronics & Home Appliances
- [ ] **Task 3: Seed Script Automation**
  - Implement an idempotent database seed script (`pnpm run seed`) capable of seeding 500+ realistic Indian market items.
- [ ] **Task 4: Frontend Spec Display (`ProductDetail.tsx`)**
  - Render a dedicated "Manufacturing & Compliance Details" tab on the product detail page.

---

## 🤝 How Open-Source Contributors Can Help
- Fork the repository: `https://github.com/sinhatumpa84-rgb/india-bazar`
- Check `docs/DATASET_CONTRIBUTION_GUIDE.md` for the product schema and sample JSON format.
- Submit PRs adding verified product entries or scraper scripts for open Indian commerce data.
