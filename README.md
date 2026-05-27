#  🎟️ Eventsphere

A Premium modern event management and ticketing platform built for seamless event discovery, booking, attendee management, and organizer operations.

EventSphere provides a complete ecosystem for:
- Event organizers to create and manage events
- Attendees to discover, register, and access tickets
- Real-time ticket tracking and QR-based check-ins
- Premium startup-style dashboard experience

---

# 🚀 Features

## 👤 Attendee Features
- Browse and discover events
- Search and filter events
- View detailed event pages
- Ticket booking flow
- QR ticket generation
- Wishlist events
- Personalized dashboard
- Booking history
- Responsive mobile experience

---

## 🛠 Organizer Features
- Create and manage events
- Ticket tier management
- Attendee management
- Real-time registrations
- QR-based check-in system
- Revenue analytics
- Dashboard insights
- Event status management

---

# ✨ UI/UX Highlights

- Premium SaaS-inspired design
- Dark futuristic theme
- Glassmorphism UI
- Smooth Framer Motion animations
- Fully responsive layouts
- Modern dashboard experience
- Startup-style user interface

Inspired by:
- Linear
- Stripe
- Framer
- Notion

---

# 🧰 Tech Stack

## Frontend
- Next.js 15
- TypeScript
- TailwindCSS
- Framer Motion
- shadcn/ui

## Backend
- Next.js API Routes
- Supabase

## Database
- PostgreSQL (Supabase)

## Authentication
- Supabase Auth

## Charts & Visuals
- Recharts

## QR System
- react-qr-code

---

# 📂 Project Structure

```bash
eventsphere/
│
├── app/
│   ├── dashboard/
│   ├── events/
│   ├── event/[id]/
│   ├── login/
│   └── signup/
│
├── components/
├── lib/
├── hooks/
├── data/
├── public/
└── styles/
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/eventsphere.git
cd eventsphere
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Run Development Server

```bash
npm run dev
```

Open:
```bash
http://localhost:3000
```

---

# 🔑 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

---

# 🗄️ Database Setup

Create these tables in Supabase:

## Users
- id
- name
- email
- role

## Events
- id
- title
- description
- venue
- category
- banner
- date

## Tickets
- id
- eventId
- type
- price
- quantity

## Bookings
- id
- userId
- eventId
- ticketId
- checkedIn

## Wishlist
- id
- userId
- eventId

---

# 📸 Core Modules

## 🎫 Event Marketplace
Users can:
- browse events
- search by category
- filter events
- explore trending events

---

## 🎟 Ticket Booking
Attendees can:
- choose ticket tiers
- confirm bookings
- receive QR tickets

---

## 📊 Organizer Dashboard
Organizers can:
- create events
- manage attendees
- monitor ticket sales
- track analytics

---

## ✅ Check-In System
QR/manual verification system for:
- attendee validation
- event entry management

---

# 📱 Responsive Design

Optimized for:
- Desktop
- Tablets
- Mobile devices

---

# 🚀 Deployment

Deploy easily using:

- Vercel
- Supabase

---

# 🧠 Future Improvements

- AI-based event recommendations
- Real payment integration
- Event networking
- Notification system
- Calendar sync
- Multi-organizer support

---

# 👨‍💻 Team Workflow

Recommended Git workflow:

```bash
git checkout -b frontend-attendee
git checkout -b organizer-dashboard
git checkout -b backend-api
```

Small meaningful commits are preferred.

Example:
```bash
git commit -m "added event card component"
git commit -m "implemented booking flow"
git commit -m "connected dashboard to backend"
```

---

# 📌 Project Goal

EventSphere aims to provide a modern startup-grade event ecosystem that combines:
- premium user experience
- event discovery
- ticket management
- organizer operations
- scalable dashboard workflows

---

# 📄 License

MIT License

---

# ❤️ Built For

DevFusion Hackathon 2.0
