# 🇮🇳 India Bazaar — Product Dataset & Manufacturer Contribution Guide

Welcome to the open-source data contribution initiative for **India Bazaar**! 

To support our marketplace growth, productivity metrics, and legal compliance (Legal Metrology Packaged Commodities Rules), we are expanding our catalog with comprehensive product entries.

---

## 📦 Required Product Fields

When contributing product datasets, each item should contain the following attributes:

| Field | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `name` | String | Clear title with key specifications | `"Shubh Labh Brass Akhand Diya (Pack of 4)"` |
| `brand` | String | Authentic brand or artisan guild | `"PujaVeda"` |
| `category` | String | Target category slug | `"home"`, `"fashion"`, `"electronics"`, `"sweets"` |
| `mrp` | Number | Maximum Retail Price in INR (₹) | `1999` |
| `price` | Number | Actual selling price in INR (₹) | `699` |
| `discount` | Number | Calculated percentage discount (%) | `65` |
| `manufacturerName` | String | Registered manufacturing unit | `"Shree Brass Metal Crafts Pvt. Ltd."` |
| `manufacturerAddress` | String | Full factory / workshop address | `"Moradabad, Uttar Pradesh - 244001, India"` |
| `countryOfOrigin` | String | Country of origin | `"India"` |
| `netQuantity` | String | Unit volume, weight, or count | `"4 Units (250g each)"` |
| `stock` | Number | Available initial inventory units | `50` |
| `gstSlab` | Number | GST percentage slab (0, 5, 12, 18, 28) | `12` |
| `images` | Array | High-quality image URLs | `["https://..."]` |

---

## 💻 Sample JSON Format

```json
{
  "name": "Royal Banarasi Silk Zari Woven Saree (Festive Crimson & Gold)",
  "brand": "Viraat Weaves",
  "category": "fashion",
  "subcategory": "Women Ethnic",
  "description": "Authentic Varanasi woven rich Banarasi silk saree with intricate golden zari motifs and unstitched blouse piece.",
  "mrp": 6999,
  "price": 2499,
  "discount": 64,
  "manufacturerName": "Viraat Handlooms Cooperative Society",
  "manufacturerAddress": "Ghat Road, Varanasi, Uttar Pradesh - 221001",
  "countryOfOrigin": "India",
  "netQuantity": "1 Saree with Blouse Piece (5.5m + 0.8m)",
  "stock": 35,
  "seller": "India Bazaar Heritage",
  "rating": 4.8,
  "images": [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
  ]
}
```

---

## 🛠️ How to Submit Your Contribution
1. **Fork** the repository: `https://github.com/sinhatumpa84-rgb/india-bazar`
2. **Branch**: `git checkout -b data/expand-catalog-categoryName`
3. Add your verified JSON dataset under `scripts/seed/data/<category>.json`
4. Test locally using `pnpm --filter @workspace/shopkart run dev`
5. Open a **Pull Request** referencing our open-source issue!
