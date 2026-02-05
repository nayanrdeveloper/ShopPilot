# Prisma Cheat Sheet 🛠️

Here is how and when to use the most common Prisma commands.

## 1. Development (Daily Use)
### 🟢 `npx prisma migrate dev`
**Use when:**
- You have modified `schema.prisma` (e.g., added a model or field).
- You want to apply changes to your local database.

**What it does:**
- Creates a new SQL migration file.
- Updates the database structure.
- **Automatically runs** `prisma generate` to update TypeScript types.

---

### 🟡 `npx prisma generate`
**Use when:**
- TypeScript is giving errors (e.g., `Property 'storeId' does not exist`).
- You pulled code from Git (someone else changed the schema).
- You just ran `npm install`.

**What it does:**
- Reads your `schema.prisma`.
- Updates the `node_modules` (Prisma Client) so your code editor knows about new fields.
- **Does NOT** touch the database.

---

### 🔵 `npx prisma studio`
**Use when:**
- You want to view, edit, or delete data manually.

**What it does:**
- Opens a GUI in your browser (`http://localhost:5555`).
- Like "phpMyAdmin" or "TablePlus" but for Prisma.

---

## 2. Prototyping (Skip Migrations)
### 🟠 `npx prisma db push`
**Use when:**
- You are experimenting and don't want to create 10 migration files.
- You don't care if you lose data (destructive changes).

**What it does:**
- Forces the database to match your schema schema.
- **Warning:** Do not use this if you want to keep a history of changes.

---

## 3. Production (Deployment)
### 🔴 `npx prisma migrate deploy`
**Use when:**
- You are deploying your app to a real server (AWS, Vercel, Render).

**What it does:**
- Applies existing migrations to the production DB.
- Does **not** ask for confirmation or create new files.
