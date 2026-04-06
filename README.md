<div align="center">

<img src="https://img.shields.io/badge/JobLens-AI%20Job%20Optimizer-4f46e5?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyek0xMSAxN0g5VjdoMnYxMHptNCAwaC0yVjdoMnYxMHoiLz48L3N2Zz4=" alt="JobLens">

# JobLens

### AI-Powered Job Application Optimizer

**Upload resume → Paste JD → Get match score + cover letter + recruiter email + interview tips**

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Coming_Soon-gray?style=for-the-badge)](https://joblens.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Node.js_+_Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://joblens-backend.onrender.com)
[![Frontend](https://img.shields.io/badge/Frontend-React_+_Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://joblens.vercel.app)
[![AI](https://img.shields.io/badge/AI-Gemini_2.0_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](#)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](#)

<br/>

> 🔗 **Live Demo:** _[Add your Vercel URL here after deployment]_
>
> Built by **[Nitin Kushwah](https://www.linkedin.com/in/nitin-kushwah-iitg)** · IIT Guwahati · BS (Hons) Data Science & AI

</div>

---

## 📌 Table of Contents

- [What is JobLens?](#-what-is-joblens)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [System Architecture](#-system-architecture)
- [Scoring Algorithm](#-scoring-algorithm)
- [Security Implementation](#-security-implementation)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Author](#-author)

---

## 🎯 What is JobLens?

Most job seekers apply blindly — sending the same resume everywhere without knowing if they're even qualified. **JobLens fixes this.**

You upload your resume once. Then for every job you're interested in, you paste the job description — and JobLens tells you:

- ✅ **Your match score** (0–100, mathematically calculated — not AI guesswork)
- ✅ **Which skills you have** that the JD wants
- ✅ **Which skills are missing** and how to fix your resume
- ✅ **A specific cover letter** (not a generic template — actually mentions your projects)
- ✅ **A cold email to the recruiter** with subject line, ready to send
- ✅ **A referral message** for LinkedIn/WhatsApp to send to college seniors
- ✅ **Interview tips** specific to that role at that company
- ✅ **Application tracker** with interview round logging

Built for **freshers and students** targeting their first internship or job. Every feature solves a real pain point in the application process.

---

## ✨ Features

### 🤖 AI Resume Parsing
Upload your PDF resume and AI extracts structured data — summary, skills, projects (strictly separate from experience), education, and achievements. No manual entry needed.

### 📊 Smart Match Scoring
A 4-category algorithm (not AI-generated) scores your resume against any job description:
- **Skills** — 50 points
- **Experience / Projects** — 30 points (fresher-aware)
- **Education tier** — 10 points
- **Domain keywords** — 10 points

Honest scoring: a random JD scores < 25. A well-matched fresher JD can score 90+.

### 📝 AI-Generated Application Materials
When score ≥ 60, get:
- **Cover letter** — 3 paragraphs, mentions your actual projects
- **Recruiter cold email** — subject line + body, max 150 words
- **Referral message** — casual WhatsApp/LinkedIn tone for alumni

### 🎯 Interview Preparation
- Role-specific interview tips (not generic advice)
- What topics to prepare based on the actual JD
- Tailored resume summary for each application

### 📋 Application Tracker
- Two-tab view: **Not Ready** vs **Applied**
- Log interview rounds (OA, Technical, HR) with descriptions and dates
- Notes for each application
- Move jobs between tabs as your status changes

### 🌙 Dark / Light Mode
Full dark mode support with persistent preference via localStorage.

### 🔒 Production-Grade Security
httpOnly JWT cookies, bcrypt password hashing, helmet headers, CORS, rate limiting.

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | Server framework — non-blocking I/O, fast API responses |
| **MongoDB + Mongoose** | NoSQL database — nested analysis data fits document model perfectly |
| **JWT in httpOnly Cookies** | Auth — more secure than localStorage, blocks XSS token theft |
| **bcryptjs (12 rounds)** | Password hashing — salt rounds 12 = ~300ms, brute force resistant |
| **Gemini 2.0 Flash** | Primary AI — fastest Gemini model, structured JSON output |
| **Groq llama-3.3-70b** | Silent AI fallback — if Gemini fails, Groq handles it transparently |
| **multer + pdf-parse** | PDF upload handling + text extraction on server |
| **helmet** | Sets 14 HTTP security headers automatically |
| **express-rate-limit** | 100 req/15 min per IP — protects AI API quota |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18 + Vite** | UI framework — instant HMR, fast builds |
| **React Router v6** | Client-side routing with nested protected routes |
| **Tailwind CSS** | Utility-first styling with `darkMode: 'class'` |
| **Axios (withCredentials)** | HTTP client — sends cookies automatically, no token handling in JS |
| **Recharts** | Dashboard bar chart — jobs by status |
| **Context API** | Global state for auth and dark mode |

### Fonts
- **DM Sans** — body text
- **JetBrains Mono** — scores and numbers

---

## 📁 Project Structure

```
joblens/
│
├── backend/                        # Express API
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js       # register, login, logout, getMe
│   │   ├── resumeController.js     # PDF upload → AI parse → save
│   │   ├── jobController.js        # create job + trigger analysis, CRUD
│   │   └── analysisController.js   # dashboard stats aggregation
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT cookie validation
│   │   └── uploadMiddleware.js     # multer: PDF only, 5MB max
│   ├── models/
│   │   ├── User.js                 # name, email, bcrypt password
│   │   ├── Resume.js               # parsed resume with projects/experience
│   │   └── Job.js                  # job + full analysis + rounds + notes
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── resumeRoutes.js
│   │   ├── jobRoutes.js
│   │   └── analysisRoutes.js
│   ├── services/
│   │   ├── aiService.js            # Gemini primary + Groq fallback
│   │   └── scoringService.js       # 4-category scoring algorithm
│   ├── uploads/                    # uploaded PDFs (gitignored)
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js                   # app entry: helmet, cors, rate-limit, routes
│
├── frontend/                       # React + Vite app
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js            # base axios instance with withCredentials
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # global user state + login/register/logout
│   │   │   └── ThemeContext.jsx    # dark/light toggle + localStorage persistence
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx     # collapsible sidebar with nav + dark toggle
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── ui/
│   │   │       ├── ScoreCircle.jsx # SVG circular progress indicator
│   │   │       ├── ScoreBadge.jsx  # inline score badge (color-coded)
│   │   │       ├── StatusBadge.jsx # applied / not_ready badge
│   │   │       └── CopyButton.jsx  # copy to clipboard with confirmation
│   │   ├── pages/
│   │   │   ├── Landing.jsx         # public landing with features + footer
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx        # with live password strength indicator
│   │   │   ├── Dashboard.jsx       # stats cards + bar chart + recent jobs
│   │   │   ├── Resume.jsx          # drag & drop upload + parsed resume display
│   │   │   ├── Jobs.jsx            # two-tab job list
│   │   │   ├── AddJob.jsx          # job form with AI analysis loading state
│   │   │   └── JobDetail.jsx       # full detail: 5 tabs + rounds + notes
│   │   ├── App.jsx                 # router setup
│   │   ├── main.jsx
│   │   └── index.css               # Tailwind directives + Google Fonts
│   ├── .env.example
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
└── README.md                       # this file
```

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER (React + Vite)                   │
│           Axios withCredentials → httpOnly cookies          │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              EXPRESS SERVER (Node.js · port 5000)           │
│                                                             │
│  helmet → cors → rate-limit → cookie-parser                 │
│                                                             │
│  /api/auth     → authController     → User (MongoDB)        │
│  /api/resume   → resumeController   → Resume (MongoDB)      │
│                    └── pdf-parse                            │
│                    └── aiService.parseResume()              │
│  /api/jobs     → jobController      → Job (MongoDB)         │
│                    └── aiService.analyzeJob()               │
│                    └── scoringService.calculateScore()      │
│  /api/analysis → analysisController → Job aggregation       │
└──────────────────┬──────────────────────────────────────────┘
                   │
          ┌────────┴────────┐
          ▼                 ▼
   Gemini 2.0 Flash    Groq llama-3.3-70b
   (primary)           (silent fallback)
          │
          ▼
   MongoDB Atlas
```

### Request Flow — POST /api/jobs (most complex)

```
1. User submits: company, role, jobDescription
2. Validate fields → find user's active Resume from MongoDB
3. aiService.analyzeJob(resumeText, jd, role, company)
      → Gemini 2.0 Flash (or Groq fallback)
      → Returns: matchedSkills, missingSkills, coverLetter,
                 recruiterEmail, referralMessage, interviewTips...
4. scoringService.calculateScore(matchedSkills, allJDSkills, isFresher, education...)
      → Returns: matchScore (0-100)
5. status = matchScore >= 60 ? 'applied' : 'not_ready'
6. Save Job document to MongoDB
7. Return full job object → React redirects to /dashboard/jobs/:id
```

---

## 📐 Scoring Algorithm

Total: **100 points** across 4 categories. Computed in code — not by AI.

```
┌─────────────────────────────────────────────────────────────┐
│  SKILLS (50 pts)                                            │
│  match ratio = matchedSkills / totalJDSkills                │
│  ≥ 50%  match  → 50 pts                                    │
│  25–49% match  → proportional 25–50 pts                    │
│  0–24%  match  → proportional 0–25 pts                     │
├─────────────────────────────────────────────────────────────┤
│  EXPERIENCE / PROJECTS (30 pts)  ← fresher-aware           │
│  JD has "fresher/intern/0-1 year/student" keywords?         │
│    YES → projects carry full 30 pts, no penalty             │
│    NO  → has experience → 30 pts                            │
│          no experience  → 10 pts (projects only)            │
├─────────────────────────────────────────────────────────────┤
│  EDUCATION (10 pts)                                         │
│  IIT / NIT / BITS / IISc / IIIT-H → 10 pts                 │
│  Other college                     → 5 pts                  │
│  Not detected                      → 3 pts                  │
├─────────────────────────────────────────────────────────────┤
│  DOMAIN KEYWORDS (10 pts)                                   │
│  REST API, Git, Agile, Docker, Microservices...             │
│  3+ matches → 10 pts  │  1-2 → 5 pts  │  0 → 0 pts         │
└─────────────────────────────────────────────────────────────┘
FINAL = sum clamped to 100
```

**Example — IIT fresher applying to Meesho SDE Intern:**
| Category | Calculation | Points |
|---|---|---|
| Skills | 4/6 JD skills matched = 67% | 50 |
| Experience | JD has "intern" keyword → fresher-friendly | 30 |
| Education | IIT Guwahati → Tier 1 | 10 |
| Keywords | REST API + Git matched | 10 |
| **Total** | | **100** |

---

## 🔒 Security Implementation

### JWT in httpOnly Cookies

```javascript
// Set on login/register
res.cookie('token', jwt, {
  httpOnly: true,      // JS cannot read — blocks XSS token theft
  secure: true,        // HTTPS only in production
  sameSite: 'strict',  // blocks CSRF attacks
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
})

// Read in authMiddleware — NOT Authorization header
const token = req.cookies?.token
```

**Why cookies > localStorage:**
- `localStorage` is accessible via JavaScript → any XSS vulnerability can steal your token
- `httpOnly` cookies are completely invisible to JavaScript — even malicious scripts can't read them
- `sameSite: strict` prevents the cookie from being sent on cross-site requests (CSRF protection)
- Frontend has zero token handling — `axios withCredentials: true` handles everything automatically

### Other Layers
| Layer | Implementation |
|---|---|
| **Password hashing** | bcryptjs, salt rounds 12 (~300ms per hash) |
| **HTTP headers** | helmet — sets X-Frame-Options, CSP, XSS-Protection, HSTS, etc. |
| **Rate limiting** | 100 requests / 15 min per IP via express-rate-limit |
| **File validation** | multer: PDF MIME type only, 5MB max, user-id-based filenames |
| **CORS** | Specific origin only (CLIENT_URL), credentials: true |
| **Field projection** | Password field `select: false` — never returned in queries |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Gemini API key — [aistudio.google.com](https://aistudio.google.com)
- Groq API key — [console.groq.com](https://console.groq.com) (free)

### Clone the repo

```bash
git clone https://github.com/NitinKushwahcodes/joblens.git
cd joblens
```

### Run the Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
# Server starts at http://localhost:5000
```

### Run the Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm run dev
# App opens at http://localhost:5173
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/joblens

# JWT secret — make this long and random (32+ chars)
JWT_SECRET=your_long_random_secret_key_here

# Set to 'production' on Render
NODE_ENV=development

# Your React app URL (Vercel URL in production)
CLIENT_URL=http://localhost:5173

# AI Keys
GEMINI_API_KEY=AIzaSy...
GROQ_API_KEY=gsk_...

PORT=5000
```

### Frontend (`frontend/.env`)

```env
# Your Express server URL (Render URL in production)
VITE_API_URL=http://localhost:5000
```

---

## 📡 API Reference

Base URL: `http://localhost:5000` (dev) / `https://joblens-backend.onrender.com` (prod)

All protected routes require the JWT cookie (set automatically after login).

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Create account, sets cookie |
| `POST` | `/api/auth/login` | ❌ | Login, sets cookie |
| `POST` | `/api/auth/logout` | ❌ | Clears cookie |
| `GET` | `/api/auth/me` | ✅ | Get current user info |

### Resume

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/resume/upload` | ✅ | Upload PDF → AI parse → save |
| `GET` | `/api/resume/active` | ✅ | Get current active resume |

### Jobs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/jobs` | ✅ | Add job + run AI analysis |
| `GET` | `/api/jobs` | ✅ | Get all jobs (`?status=applied\|not_ready`) |
| `GET` | `/api/jobs/:id` | ✅ | Get single job with full analysis |
| `PATCH` | `/api/jobs/:id/move` | ✅ | Move not_ready → applied |
| `PATCH` | `/api/jobs/:id/rounds` | ✅ | Add interview round |
| `PATCH` | `/api/jobs/:id/notes` | ✅ | Update notes |
| `DELETE` | `/api/jobs/:id` | ✅ | Hard delete job |

### Analysis

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/analysis/stats` | ✅ | Dashboard stats (total, applied, notReady, avgScore) |

### Example: Add a Job

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  --cookie "token=your_jwt_here" \
  -d '{
    "company": "Meesho",
    "role": "SDE Intern",
    "jobDescription": "Looking for a fresher SDE intern with Node.js, React, MongoDB skills...",
    "notes": "Referred by IIT alumni"
  }'
```

**Response:**
```json
{
  "job": {
    "_id": "...",
    "company": "Meesho",
    "role": "SDE Intern",
    "status": "applied",
    "analysis": {
      "matchScore": 84,
      "matchedSkills": ["node.js", "react", "mongodb"],
      "missingSkills": ["redis"],
      "coverLetter": "...",
      "recruiterEmail": "...",
      "referralMessage": "...",
      "interviewTips": ["..."]
    }
  }
}
```

---

## ☁️ Deployment

### Backend → [Render](https://render.com)

1. Push `backend/` folder to GitHub
2. Render → New Web Service → connect repo
3. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add all environment variables from `backend/.env`
5. Set `NODE_ENV=production` and `CLIENT_URL=<your-vercel-url>`

> **Note:** Render free tier has ~30 second cold start on first request.

### Frontend → [Vercel](https://vercel.com)

1. Push `frontend/` folder to GitHub
2. Vercel → New Project → import repo
3. Framework: **Vite** (auto-detected)
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL
5. Deploy

### Post-Deploy Checklist

```
□ Register + login works on live URL
□ httpOnly cookie set in production (check DevTools → Application → Cookies)
□ Resume PDF upload and AI parsing works
□ Add job → analysis + score returned correctly
□ Dark mode toggle persists on refresh
□ Update CLIENT_URL on Render to your Vercel URL
```

---

## 📸 Screenshots

> _Screenshots will be added after deployment_

| Page | Description |
|---|---|
| Landing | Hero section with features and CTA |
| Dashboard | Stats cards, bar chart, recent jobs |
| Resume | Parsed resume with skills, projects, achievements |
| Job Detail (Not Ready) | Match score, missing skills, improvement tips |
| Job Detail (Applied) | 5 tabs: Analysis, Cover Letter, Recruiter Email, Referral, Rounds |

---

## 🗺 Roadmap

- [ ] Redis job queue for async AI processing
- [ ] Resume versioning — compare match scores across resume versions
- [ ] Email notifications for application follow-ups
- [ ] Browser extension to auto-extract JD from LinkedIn/Naukri
- [ ] Analytics dashboard — skill gap analysis over time
- [ ] AI interview simulator with role-specific questions

---

## 👤 Author

**Nitin Kushwah**

- 🎓 BS (Hons) Data Science & AI — IIT Guwahati (2023–2027)
- 💼 LinkedIn: [linkedin.com/in/nitin-kushwah-iitg](https://www.linkedin.com/in/nitin-kushwah-iitg)
- 📧 Email: [nitin.kushwah.cs@gmail.com](mailto:nitin.kushwah.cs@gmail.com)
- 💻 GitHub: [github.com/NitinKushwahcodes](https://github.com/NitinKushwahcodes)
- 🏆 LeetCode 1580 · Codeforces 1208 · CodeChef 1495

---

## 📄 License

MIT License — use, modify, distribute freely with attribution.

---

<div align="center">

**Built with focus, not just code.**

⭐ Star this repo if you found it useful

</div>
