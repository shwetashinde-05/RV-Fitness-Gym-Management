# RV FITNESS – Complete Multi-Portal Gym Management SaaS

Commercial Gym Management System and Public Website built for **RV FITNESS**, located in **Narsobawadi, Maharashtra, India**.

---

## 🌟 Architecture Overview

The system includes **Three Role-Based Portals** and a **Public Website**, powered by a shared Node.js/Express backend and PostgreSQL database.

```
RV FITNESS Full-Stack Application
│
├── 🌐 1. PUBLIC WEBSITE (http://localhost:5173/)
│   ├── /                 -> Home (Hero, metrics, highlights, pricing, trainer spotlight, location)
│   ├── /about            -> Story, mission & local presence in Narsobawadi
│   ├── /facilities       -> Commercial weights, cardio, turf, steam & lockers
│   ├── /plans            -> Pricing tiers & packages overview
│   ├── /trainers-public  -> Certified coaches roster & bios
│   ├── /gallery          -> Visual floor showcase by categories
│   ├── /contact          -> Location, phone, hours, and inquiry form
│   ├── /login            -> Role-based portal sign in with 1-click demo logins
│   └── /register         -> Online member onboarding with immediate portal access
│
├── 🛡️ 2. ADMIN PORTAL (http://localhost:5173/admin/dashboard) [Role: ADMIN]
│   ├── /admin/dashboard           -> Executive dashboard with real KPIs, Recharts & quick actions
│   ├── /admin/members             -> Directory with auto-generated IDs (RVF-0001...), search & drawer
│   ├── /admin/trainers            -> Coach roster & salary configuration
│   ├── /admin/membership-plans    -> Package creation and active toggles
│   ├── /admin/assign-membership   -> Auto duration/end-date & fee computation
│   ├── /admin/payments            -> Ledger & printable official receipt modal
│   ├── /admin/attendance          -> Daily check-in system with duplicate day check
│   ├── /admin/workout-plans       -> Dynamic split routines
│   ├── /admin/diet-plans          -> Nutrition schedules & protein targets
│   ├── /admin/progress            -> Body measurements & weight graph
│   ├── /admin/notifications       -> Broadcasts & renewal alerts
│   ├── /admin/reports             -> Financial reports, ratios & CSV export
│   ├── /admin/users               -> System credentials & role permissions
│   └── /admin/settings            -> Gym identity, timings & Narsobawadi address
│
├── 🏋️ 3. TRAINER PORTAL (http://localhost:5173/trainer/dashboard) [Role: TRAINER]
│   ├── /trainer/dashboard         -> Assigned athletes count, active routines, today's checked-in members
│   ├── /trainer/members           -> Scoped strictly to assigned members; full fitness record drawer
│   ├── /trainer/workouts          -> Assign and edit workout splits for assigned members
│   ├── /trainer/diets             -> Prescribe customized diet and calorie targets
│   ├── /trainer/progress          -> Log body measurements and coach observations
│   ├── /trainer/profile           -> Update coach specialization, bio, phone, and credentials
│   └── /trainer/notices           -> Admin broadcasts and gym notices
│
└── 👤 4. MEMBER PORTAL (http://localhost:5173/member/dashboard) [Role: MEMBER]
    ├── /member/dashboard          -> Active pass card with validity countdown, coach phone & daily split
    ├── /member/membership         -> Plan details, start/end date, and 1-click renewal request
    ├── /member/payments           -> Payment history & printable official receipt modal
    ├── /member/workout            -> Prescribed exercise list with sets, reps, and coach cues
    ├── /member/diet               -> Itemized meal-by-meal schedule & protein metrics
    ├── /member/progress           -> Measurement logs, interactive weight trend graph & self-check-in
    ├── /member/attendance         -> Personal check-in history & total sessions
    └── /member/profile            -> Edit contact phone, emergency contact, and address
```

---

## 🔐 Role-Based Credentials & Permissions

You can test any role directly using the credentials below or via the **1-Click Demo Buttons** on `/login`:

| Portal | Email | Password | Role | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | `admin@rvfitness.in` | `admin123` | `admin` | Full unrestricted access to all modules, financial ledger, user roles, and gym settings. |
| **Trainer 1** | `vikram@rvfitness.in` | `trainer123` | `trainer` (TR-001) | Scoped access strictly to assigned members (Aditya, Rohit, Deepak). Cannot view unassigned members or edit gym settings. |
| **Trainer 2** | `anjali@rvfitness.in` | `trainer123` | `trainer` (TR-002) | Scoped access strictly to assigned members (Pooja, Sneha). |
| **Member 1** | `aditya@rvfitness.in` | `member123` | `member` (RVF-0001) | Access strictly to Aditya's profile, subscription, payment receipts, workouts, and progress. |
| **Member 2** | `pooja@rvfitness.in` | `member123` | `member` (RVF-0002) | Access strictly to Pooja's own data. |

> **Backend Enforcement**: Protected API routes check the user's role and `related_id` on every request. Attempting to access unauthorized or unassigned records returns `HTTP 403 Forbidden`.

---

## 🚀 How to Run

### Backend Server (Port 5000)
```powershell
cd "c:\Users\DELL\Downloads\RV FITNESS\backend"
node server.js
```

### Frontend Client (Port 5173)
```powershell
cd "c:\Users\DELL\Downloads\RV FITNESS\frontend"
npm run dev
```

- **Public Website & Portals**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
