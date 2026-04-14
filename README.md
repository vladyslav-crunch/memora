# Memora – Spaced Repetition Flashcard Application

**Memora** is a modern educational web application designed to support learning through the **Spaced Repetition System (SRS)**.
By intelligently scheduling reviews based on user performance, it helps students and professionals retain large amounts of information efficiently.

![Memora Home](https://i.ibb.co/23KbKw1p/Memora-dashboard.png)
![Momora Quiz](https://i.ibb.co/DPyJGQPX/Memora-play.png)
---

## 🚀 Features

### 🧠 Smart Learning

* Uses an **SRS algorithm** to automatically adjust review intervals based on mastery level.

### ❓ Multiple Quiz Modes

* **Normal** – Standard term-to-definition review
* **Reversed** – Definition-to-term learning
* **Typing** – Active recall by typing the correct answer

### 📚 Deck Management

* Create, edit, and organize flashcards into custom decks.

### 🌍 Community Sharing

* Access and copy public decks shared by other users into your own library.

### 📈 Progress Tracking

* Visualize your learning journey with weekly reports and performance charts.

### 🔄 Data Portability

* Import and export flashcards in text format with customizable separators.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router)
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** NextAuth.js (Google OAuth + Email/Password)
* **State Management:** TanStack Query
* **Validation:** Zod
* **Styling:** CSS Modules

---

## ⚙️ Installation & Setup

### 1. Prerequisites

* Node.js **v20 or higher**
* PostgreSQL database

### 2. Environment Variables

Create a `.env` file in the root directory and configure the following:

```env
# DATABASE
DATABASE_URL="postgresql://DB_USER:DB_PASSWORD@DB_HOST:DB_PORT/DB_NAME"

# NEXTAUTH CONFIG
AUTH_URL="http://localhost:3000"
AUTH_SECRET="GENERATE_A_RANDOM_SECRET_HERE"

# GOOGLE PROVIDER
AUTH_GOOGLE_ID="YOUR_GOOGLE_OAUTH_CLIENT_ID"
AUTH_GOOGLE_SECRET="YOUR_GOOGLE_OAUTH_CLIENT_SECRET"

# CLOUDINARY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="YOUR_CLOUDINARY_CLOUD_NAME"
NEXT_PUBLIC_CLOUDINARY_API_KEY="YOUR_CLOUDINARY_API_KEY"
CLOUDINARY_API_SECRET="YOUR_CLOUDINARY_API_SECRET"
```

### 3. Getting Started

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## 🧪 Testing

The project uses **Vitest** and **React Testing Library** for unit and integration tests.

```bash
npm run test
```

---

## 📝 Project Structure

```text
/app         # Routing, API handlers, and page layouts
/components  # Reusable UI elements and logic blocks
/hooks       # Custom TanStack Query hooks for data fetching
/lib         # Utility functions and server-side helpers
/prisma      # Database schema and migration files
```

---

## 📄 License / Academic Project

This project was developed as an **engineering thesis** at the **Lublin University of Technology**, Faculty of Electrical Engineering and Computer Science.

* **Author:** Vladyslav Tretiak
* **Supervisor:** dr Beata Pańczyk
* **Location:** Lublin
* **Year:** 2025
