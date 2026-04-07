# JobLens — AI-Powered Job Application Optimizer

> Upload resume → Paste JD → Get match score + cover letter + recruiter email + interview tips

- Live Demo: https://joblens-liard.vercel.app/ 
- Project Walkthrough (Video): https://your-video-link  


---

## Overview & Features

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

**Resume Parsing** — Upload a PDF resume. The server extracts raw text via `pdf-parse`, sends it to Gemini 2.0 Flash with a structured prompt, and stores the result as a JSON object with skills, projects, experience, education, and achievements. Projects and professional experience are strictly separated in the prompt — the most common failure mode in naive LLM parsers.

**Match Scoring** — Paste any job description. A four-category deterministic algorithm (not AI) computes a score out of 100. The score is mathematically honest — an unrelated JD scores below 30, a well-matched fresher JD scores 80+.

**Application Materials** — When score ≥ 60, the system generates a cover letter that references your actual projects, a recruiter cold email with subject line, a referral message for LinkedIn/WhatsApp alumni outreach, and role-specific interview tips.

**Application Tracker** — Track every job across two tabs: Not Ready and Applied. Log interview rounds with titles and descriptions. Add notes per application.

**Auth & Security** — JWT stored in `httpOnly` cookies. bcrypt at salt rounds 12. helmet headers. Rate limiting. CORS with credentials.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT in httpOnly cookies, bcryptjs |
| AI — Primary | Google Gemini 2.0 Flash (direct HTTPS, no SDK) |
| AI — Fallback | Groq llama-3.3-70b (silent, automatic) |
| File Handling | multer, pdf-parse |
| Security | helmet, express-rate-limit, CORS |
| Deployment | Vercel (frontend), Render (backend) |

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

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Gemini API key — [aistudio.google.com](https://aistudio.google.com)
- Groq API key — [console.groq.com](https://console.groq.com)

### Clone & Run

```bash
git clone https://github.com/NitinKushwahcodes/joblens.git
cd joblens
```

**Backend**
```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev            # runs on http://localhost:5000
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:5000
npm run dev            # runs on http://localhost:5173
```

### Environment Variables

**`backend/.env`**
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/joblens
JWT_SECRET=your_long_random_secret_32_chars_min
NODE_ENV=development
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=AIzaSy...
GROQ_API_KEY=gsk_...
PORT=5000
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:5000
```

---

## API Reference

All protected routes require the JWT cookie (set automatically after login).

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Create account, sets cookie |
| `POST` | `/api/auth/login` | ❌ | Login, sets cookie |
| `POST` | `/api/auth/logout` | ❌ | Clears cookie |
| `GET` | `/api/auth/me` | ✅ | Get current user |

### Resume
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/resume/upload` | ✅ | Upload PDF → AI parse → save |
| `GET` | `/api/resume/active` | ✅ | Get active resume |

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

---

## Deployment

**Backend → Render**
- New Web Service → connect repo → set Root Directory to `backend`
- Build: `npm install` · Start: `node server.js`
- Add all env variables from `backend/.env`, set `NODE_ENV=production`

**Frontend → Vercel**
- New Project → connect repo → set Root Directory to `frontend`
- Framework: Vite · Add `VITE_API_URL=<your-render-url>`

After both are deployed, update `CLIENT_URL` in Render env to your Vercel URL and redeploy backend.

---

## Author

**Nitin Kushwah** · [linkedin.com/in/nitin-kushwah-iitg](https://www.linkedin.com/in/nitin-kushwah-iitg)

---

*MIT License*
