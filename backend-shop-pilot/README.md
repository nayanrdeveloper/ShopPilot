# Shop Pilot - Backend 🚀

A robust, multi-tenant E-commerce backend built with **Node.js**, **GraphQL**, and **AI features**.

## 🛠️ Tech Stack & Packages

| Package | Purpose |
| :--- | :--- |
| **Node.js + Express** | Core Server Framework |
| **Apollo Server v4** | GraphQL Server Implementation |
| **Prisma ORM** | Database Interaction (SQLite) |
| **TypeScript** | Type Safety & Developer Experience |
| **Google Generative AI** | AI Product Descriptions & Analytics |
| **Dotenv** | Environment Variable Management |

### Key Dependencies
- `@apollo/server`
- `@prisma/client`
- `@google/generative-ai`
- `graphql`
- `express`

---

## 📂 Project Structure

```bash
backend-shop-pilot/
├── prisma/
│   ├── schema.prisma       # Database Models (Store, Product, Order)
│   └── dev.db             # Local SQLite Database
├── src/
│   ├── prisma/
│   │   └── client.ts      # Shared Prisma Client Instance
│   ├── resolvers/         # GraphQL Resolvers (Controllers)
│   │   ├── product.resolver.ts
│   │   ├── store.resolver.ts
│   │   └── ai.resolver.ts
│   ├── schema/
│   │   └── typeDefs.ts    # GraphQL Schema Definitions
│   ├── services/          # Business Logic Layer (Clean Code)
│   │   ├── product.service.ts
│   │   ├── store.service.ts
│   │   ├── analytics.service.ts
│   │   └── ai.service.ts
│   └── index.ts           # Server Entry Point
├── package.json
├── rs_cheat_sheet.MD      # Reference for Prisma Commands
└── .env
```

---

## 🚀 Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    Create a `.env` file:
    ```env
    DATABASE_URL="file:./dev.db"
    GEMINI_API_KEY="your-google-gemini-key"
    ```

3.  **Run Database Migrations**
    ```bash
    npx prisma migrate dev
    ```

4.  **Start Server**
    ```bash
    npm run dev
    ```
    > Server runs at `http://localhost:4000/graphql`

---

## 📚 API Reference (GraphQL)

### 1. Store Module (Multi-Tenant)

#### **Create a Store**
**Mutation:**
```graphql
mutation {
  createStore(name: "My Tech Shop", slug: "tech-shop") {
    id
    name
    slug
  }
}
```

#### **Fetch Store & Products**
**Query:**
```graphql
query {
  store(slug: "tech-shop") {
    name
    products {
      name
      price
    }
  }
}
```

---

### 2. Product Module

#### **Create Product**
**Mutation:**
```graphql
mutation {
  createProduct(
    name: "Wireless Mouse",
    price: 25.99,
    sku: "WM-001",
    storeId: "STORE_UUID_HERE",
    stock: 50
  ) {
    id
    name
  }
}
```

#### **Fetch Products**
**Query:**
```graphql
query {
  products(take: 5) {
    name
    price
    storeId
  }
}
```

---

### 3. Order System

#### **Create Order**
**Mutation:**
```graphql
mutation {
  createOrder(
    storeId: "STORE_UUID_HERE", 
    items: [
      { productId: "PRODUCT_UUID_HERE", quantity: 2 }
    ]
  ) {
    id
    total
    status
  }
}
```

---

### 4. AI Features 🤖

#### **Generate Product Description**
Uses Gemini AI to write a marketing description.
**Mutation:**
```graphql
mutation {
  generateDescription(name: "ErgoChair", category: "Furniture")
}
```
**Response:**
```json
{
  "data": {
    "generateDescription": "Experience ultimate comfort with the ErgoChair..."
  }
}
```

#### **Generate Sales Summary**
Analyzes sales data and provides actionable insights.
**Mutation:**
```graphql
mutation {
  generateSalesSummary(storeId: "STORE_UUID_HERE")
}
```
**Response:**
```json
{
  "data": {
    "generateSalesSummary": "- Revenue Insight: Strong sales in Electronics...\n- Inventory: Restock Mouse immediately."
  }
}
```
