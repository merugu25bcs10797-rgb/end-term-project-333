# 🎓 SmartStudy AI — AI-Powered Study Companion

> An intelligent, production-grade React application that helps students organize subjects, manage study tasks, track topic progress, and get AI-generated learning aids — all backed by Firebase.

---

## 🧠 Problem Statement

**Who is the user?**
Students (high school, university, competitive exam prep) who struggle to stay organized across multiple subjects and topics.

**What problem are we solving?**
Students have notes scattered across apps, no clear view of what's pending, and no structured way to revise. This leads to missed deadlines, poor exam preparation, and high stress.

**Why does it matter?**
Effective study organization directly impacts academic performance. SmartStudy AI gives students a single, intelligent hub to plan, track, and revise — the way a personal study coach would.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Authentication | Email/password signup & login via Firebase Auth |
| 📊 Dashboard | Live stats: subjects, topics, tasks pending/completed/overdue + upcoming deadlines |
| 📚 Subjects & Topics | Create subjects with color labels; manage topics per subject with a studied/not-studied toggle and progress bar |
| ✅ Study Tasks | Create, edit, complete, and delete tasks with priority levels & deadlines; filter by All / Pending / Completed / Overdue |
| 📅 Revision Planner | Smart aggregation of all unstudied topics and overdue tasks in one revision queue |
| 🤖 AI Study Assistant | Generate topic summaries, flashcards, and practice questions with Ctrl+Enter shortcut and copy-to-clipboard |

---

## ⚛️ React Concepts Demonstrated

| Concept | Where |
|---|---|
| `useState` | All pages — forms, modals, tabs, loading states |
| `useEffect` | `AuthContext`, `StudyContext` — Firebase auth listener & Firestore real-time sync |
| `useCallback` | All 8 CRUD functions in `StudyContext`; event handlers in pages |
| `useMemo` | `StudyContext` stats; task filtering in Tasks; revision list in Revision; recent tasks in Dashboard |
| `useRef` | `AITools` — textarea auto-focus & response scroll-into-view |
| `React.lazy` + `Suspense` | `App.jsx` — all 7 pages are lazy-loaded |
| Context API | `AuthContext` (auth state), `StudyContext` (global data) |
| Controlled Components | All forms (subjects, tasks, login, signup) |
| Lifting State Up | State managed in context, consumed by multiple components |
| Conditional Rendering | Auth guards, empty states, loading spinners, config alerts |
| Lists & Keys | All Firestore collection renders |
| Props & Composition | `StatCard`, `SubjectCard`, `TopicItem`, `ProtectedRoute` |
| React Router | 5 protected routes + 2 public routes |
| Custom Hooks | `src/hooks/useFirestore.js` — reusable Firestore CRUD |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 + Vite 8 |
| Routing | React Router DOM v7 |
| Backend / Auth | Firebase v12 (Auth + Firestore) |
| Animations | Framer Motion |
| Icons | React Icons (Feather) |
| Notifications | React Toastify |
| Styling | Vanilla CSS (custom design system) |
| Code Quality | ESLint |

---

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components (Navbar, StatCard)
├── context/          # Global state (AuthContext, StudyContext)
├── hooks/            # Custom hooks (useFirestore)
├── pages/            # Route pages (Dashboard, Subjects, Tasks, Revision, AITools, Login, Signup)
└── services/         # Firebase initialization & config guard
```

---

## 🚀 Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd web-dev-end-term-project-3
npm install
```

### 2. Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (e.g. `smartstudy-ai`)
3. Enable **Authentication** → Email/Password provider
4. Create a **Firestore Database** (start in test mode)
5. Go to **Project Settings** → **Your apps** → Add Web app
6. Copy the config values

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
```

> **Note:** Never commit your `.env` file. It is listed in `.gitignore`.

### 4. Set Up Firestore Security Rules

In the Firebase Console → Firestore → Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{collection}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
    }
  }
}
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🚀 Deployment (Vercel)

```bash
npm run build
# Deploy dist/ folder to Vercel
```

Set your `VITE_FIREBASE_*` environment variables in the Vercel project dashboard under **Settings → Environment Variables**.

---

## 📊 Firestore Collections

| Collection | Fields |
|---|---|
| `subjects` | `name`, `description`, `color`, `uid`, `createdAt` |
| `topics` | `name`, `subjectId`, `studied`, `uid`, `createdAt` |
| `tasks` | `title`, `subject`, `priority`, `deadline`, `status`, `uid`, `createdAt` |

---

## 👨‍💻 Author

- **Name:** [Your Name]
- **Batch:** 2029
- **Course:** Building Web Applications with React
