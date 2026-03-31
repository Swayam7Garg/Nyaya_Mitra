# NyayaSaathi - AI-Powered Legal Aid Platform

*Empowering first-generation litigants in India with accessible, bilingual legal rights and document generation.*

**Live Demo:** [https://nyayasaathi.vercel.app](https://nyayasaathi.vercel.app) *(Replace with actual deployed link)*

---

## 1. Project Overview & Identity

**Team Name:** Team Nyaya
**Team Members:** Swayam Garg & Team *(Update as needed)*

### Problem Statement (WD-04 / Web Development Domain)
India has over 45 million pending court cases, and the legal system often feels inaccessible to the common citizen—especially first-generation litigants. The problem is a lack of accessible, plain-language legal information, expensive legal consultations, and complex procedural paperwork. Our platform solves this by providing simplified legal rights natively in Hindi and English, step-by-step procedures, and automatic document generation for common legal situations (like RTIs, Consumer Complaints, and FIRs).

### Methodology / Approach
- **Bilingual First:** We designed the system ground-up using \`i18next\` and Noto Sans Devanagari to cater to the massive Hindi-speaking demographic.
- **Responsible AI (Dual-Display):** To build trust, AI-simplified rights are displayed *side-by-side* with the original verified law text from IndiaCode.
- **Client-Side Generation:** We utilized \`jsPDF\` to generate legal PDFs entirely on the client side, ensuring that sensitive personal data (names, addresses) is not persistently stored on a server unnecessarily.
- **Component-Driven Design:** Built with Next.js 14 App Router and a custom Tailwind token system mapped to a strict design spec (justice blue and saffron orange palette).

---

## 2. Technical Architecture & Documentation

### Architecture Diagram

\`\`\`mermaid
graph TD
    Client[Browser / Mobile Client]
    NextJS[Next.js 14 Frontend - React UI]
    LocalBridge[Frontend API Routes]
    Express[Node.js + Express Backend]
    MongoDB[(MongoDB Atlas)]
    LLM[Google Gemini 1.5 Flash API]

    Client <-->|Bilingual UI & PDF Generation| NextJS
    NextJS <-->|REST| LocalBridge
    LocalBridge <-->|API Calls| Express
    Express <-->|Read Static/Dynamic Data| MongoDB
    Express <-->|Fetch Explanations| LLM
\`\`\`

### User Flow Diagram

\`\`\`mermaid
graph LR
    A[Home Page] --> B{Select Language}
    B -->|Hindi / English| C[Situations Selector]
    C --> D[Select Legal Issue]
    D --> E[Rights Explainer Tab]
    E -->|Dual Display UI| F[Procedure & Checklist]
    F --> G{Action Needed?}
    G -->|Need Lawyer| H[Lawyer Directory]
    G -->|Need Document| I[Document Generator]
    I --> J[Download PDF]
\`\`\`

### Database Schema (Entity-Relationship Diagram)

\`\`\`mermaid
erDiagram
    SITUATION {
        string _id PK
        string slug
        string category
        object title "en, hi"
        object description "en, hi"
        array rights
        array laws
        array checklist
        array steps
        string templateType
    }
    LAWYER {
        string _id PK
        string name
        array specializations
        string state
        string city
        string phone
        string email
        string organization
        array languages
        boolean proBono
        number experience
        string barCouncilId
        number rating
    }

    SITUATION ||--o{ LAWYER : "Addressed by (Specializations match)"
\`\`\`

---

## 3. Setup & Installation Instructions

This project requires **Node.js (v18+)** and **npm** to run locally. It is split into two directories: \`frontend\` and \`backend\`.

### Step 1: Clone the repository
\`\`\`bash
git clone https://github.com/Swayam7Garg/Nyaya-Sathi.git
cd Nyaya-Sathi
\`\`\`

### Step 2: Backend Setup
Open a new terminal window:
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`
*The backend server will start running at \`http://localhost:5000\`.*

### Step 3: Frontend Setup
Open another terminal window:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
*The frontend application will start running at \`http://localhost:3000\`.*

---

## 4. Environment Configuration

### Backend (\`backend/.env\`)
Create an \`.env\` file in the \`backend\` folder with the following keys:
\`\`\`env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/legalaid?retryWrites=true&w=majority
GEMINI_API_KEY=AIzaSy_YOUR_GEMINI_API_KEY_HERE
FRONTEND_URL=http://localhost:3000
\`\`\`

### Frontend (\`frontend/.env.local\`)
Create an \`.env.local\` file in the \`frontend\` folder with the following keys:
\`\`\`env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

---

## 5. Folder Structure

\`\`\`text
Nyaya-Sathi/
├── backend/                  # Express API Server
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── data/             # Seed data (situations, lawyers)
│   │   ├── middleware/       # Error handling
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API Endpoints (AI, Situations, Lawyers)
│   │   └── server.js         # Entry point
│   └── package.json
└── frontend/                 # Next.js 14 Frontend Application
    ├── app/                  # App Router pages (/situations, /generate, etc.)
    ├── components/           # Reusable UI components
    │   ├── generate/         # Document Form and Preview UI
    │   ├── lawyers/          # Lawyer Directory Cards and Filters
    │   ├── layout/           # Navbar, Disclaimer Banner
    │   ├── shared/           # Language Toggle, Stepper, AI Badges
    │   └── situations/       # Explainer UI (Dual Display, Checklist)
    ├── data/                 # Static fallback data files
    ├── lib/                  # Utility functions (jsPDF logic, API wrap)
    ├── locales/              # i18n translation JSON chunks (en/hi)
    ├── types/                # TypeScript interfaces
    ├── next.config.ts
    └── package.json
\`\`\`

---

## 6. Mobile Responsiveness & Accessibility
- **Mobile First Approach**: The application was built targeting a \`375px\` viewport first. Navigation collapses into a responsive bottom/side drawer. The Dual-Display Explainer accurately stacks the Plain Language rights strictly above the Law Text citations on mobile screens for ease of reading.
- **Responsiveness Proof**: CSS media queries scale fonts, flex-directions, and paddings seamlessly across \`768px\` and \`1280px\` breakpoint tiers.
- **Accessibility features**: The app avoids complex JS pop-ups in favor of native HTML semantics and high-contrast texts.

---
*Created for Hackathon 2026. Code is open-source.*
