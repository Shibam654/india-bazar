<div align="center">

# 🪔 India Bazaar (इंडिया बाज़ार)

### *Apna Desi Mega Marketplace — Diwali Mahotsav Edition*

[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.x-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br/>

<img src="./artifacts/shopkart/public/diwali-sale-banner.jpg" alt="India Bazaar Grand Diwali Festival Banner" width="850" style="border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.2);" />

<br/>

**India Bazaar** is a modern, full-featured Indian e-commerce web platform inspired by platforms like Flipkart and Amazon, tailored for the vibrant Indian consumer market. Shoppers can explore festival sales, search and filter authentic regional products, manage wishlists, and checkout with Indian payment methods (COD, UPI, Net Banking, and Cards).

[Explore Features](#-key-features) • [Quick Start](#-quick-start--local-development) • [Project Structure](#-project-structure) • [Contributing Data](#-open-source-dataset-contribution)

</div>

---

## ✨ Key Features

- **🪔 Grand Diwali Mahotsav Theme**: 
  - Festive celebration hero banner, custom golden Diya emblem logo, and festive announcement ticker.
  - Interactive "Diwali Dhamaka Deals" section with instant discount code `DIWALI2026`.
- **🇮🇳 Tailored for Indian Retail**:
  - All prices formatted in Indian Rupees (**₹ INR**).
  - Free delivery threshold above ₹499 (flat ₹40 delivery under ₹499).
  - Cash on Delivery (COD), UPI (GPay, PhonePe, Paytm), and major Indian bank discounts (SBI & HDFC festival credit cards).
- **🛍️ Comprehensive Product Categories**:
  - *Diwali Specials & Pooja Decor* (Pure Brass Akhand Diyas, Organic Rangoli Kits, 24K Gold Idols).
  - *Ethnic Fashion & Handlooms* (Banarasi Zari Silk Sarees, Designer Kurtas).
  - *Gourmet Sweets & Dry Fruits* (Kaju Katli, California Almonds & Pistachio hampers).
  - *Consumer Tech & Appliances* (5G Smartphones, QLED TVs, Smart Ambient Lighting, TWS Earbuds).
- **⚡ High-Performance Tech Stack**:
  - Fast client-side routing via **Wouter**.
  - Intelligent server-state caching and synchronization with **TanStack React Query**.
  - Type-safe contract generation with **Orval** and **Zod** schema validation.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
| :--- | :--- |
| **Monorepo** | pnpm Workspaces, Node.js 24+, TypeScript 5.9 |
| **Frontend** | React 19, Vite 7, Tailwind CSS v4, Lucide Icons, Radix UI primitives |
| **Backend API** | Express 5, Pino Logger, CORS |
| **Database & ORM** | PostgreSQL 16/17, Drizzle ORM, Drizzle-Zod |
| **API Contract & Specs**| OpenAPI 3.0 (`lib/api-spec/openapi.yaml`), Orval codegen |

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
- **Node.js**: v20 or higher (v24 recommended)
- **pnpm**: v9 or higher (`npm install -g pnpm`)
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/sinhatumpa84-rgb/india-bazar.git
cd india-bazar
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Start the Frontend Server
To launch the Vite development server (port `24584`):
```bash
pnpm --filter @workspace/shopkart run dev
```
Open **[http://localhost:24584](http://localhost:24584)** in your web browser.

### 5. Start the API Server (Optional)
```bash
# Set your PostgreSQL connection string
export DATABASE_URL="postgresql://postgres:password@localhost:5432/indiabazaar" # On Linux/macOS
# $env:DATABASE_URL="postgresql://postgres:password@localhost:5432/indiabazaar" # On Windows PowerShell

pnpm --filter @workspace/api-server run dev
```
The API server listens on port `8080` (requests from the frontend to `/api` are automatically proxied).

---

## 📁 Project Structure

```text
india-bazar/
├── artifacts/
│   ├── shopkart/                     # Primary React + Vite Frontend
│   │   ├── public/
│   │   │   ├── india-bazaar-logo.jpg # Brand Diya Emblem Logo
│   │   │   └── diwali-sale-banner.jpg# 16:9 Diwali Celebration Banner
│   │   └── src/
│   │       ├── components/           # UI components, layout, and Navbar
│   │       ├── data/mockProducts.ts  # Curated Diwali & Indian product dataset
│   │       └── pages/                # Home, Search, ProductDetail, Cart, etc.
│   └── api-server/                   # Express 5 REST API Server
├── lib/
│   ├── api-client-react/             # Generated React Query hooks (Orval)
│   ├── api-spec/                     # OpenAPI 3.0 specification (`openapi.yaml`)
│   ├── api-zod/                      # Generated Zod validation schemas
│   └── db/                           # Drizzle ORM schema & database client
├── docs/
│   └── DATASET_CONTRIBUTION_GUIDE.md # Catalog & MRP contribution documentation
├── .github/
│   └── ISSUE_TEMPLATE/               # Open-source issue templates
└── pnpm-workspace.yaml               # Monorepo configuration
```

---

## 🤝 Open-Source Dataset Contribution

We are actively seeking open-source contributions to expand our catalog with accurate product metrics, **Maximum Retail Price (MRP)**, and **Manufacturer / Packer Compliance** under the Indian Legal Metrology Rules.

- 📖 **Contribution Guide**: Read [`docs/DATASET_CONTRIBUTION_GUIDE.md`](./docs/DATASET_CONTRIBUTION_GUIDE.md) for data formatting rules.
- 📋 **Active Tracking Issue**: [Issue #1: Expand Product Catalog & Enforce Comprehensive MRP & Manufacturer Metadata](https://github.com/sinhatumpa84-rgb/india-bazar/issues/new).

To submit new product data:
1. Fork the repo and create a new feature branch (`git checkout -b data/add-handloom-products`).
2. Add product entries in the required JSON format.
3. Submit a Pull Request!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

<div align="center">
  <b>Happy Diwali from India Bazaar! 🪔✨</b>
</div>
