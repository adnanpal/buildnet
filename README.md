# 🚀 BuildNet — The Social Platform for Builders & Developers

BuildNet is a professional-grade social networking and collaboration platform designed specifically for builders, developers, and creators. It allows developers to showcase their projects, connect with peers, exchange feedback, and chat in real-time. 

Built using a modern **React 18** and **TypeScript** frontend with **Tailwind CSS v4** and **Framer Motion**, and backed by a **Strapi v5** headless CMS backend, BuildNet offers a premium user experience featuring seamless Clerk authentication and secure, interactive networking.

---

## 🌟 Key Features

* **🔐 Clerk Authentication & SSO Callback**:
  * Unified signup/login utilizing **Clerk Auth** with OAuth/SSO capabilities.
  * Adaptive routing based on authentication state and profile completion.
* **📋 Multi-Step Profile Onboarding**:
  * Mandatory profile completion checks before accessing the social feed.
  * **Basic Info**: Name, avatar upload, tagline, location, bio, GitHub, and LinkedIn profiles.
  * **Professional Details**: Primary roles, experience level selectors, and organization affiliations.
  * **Technical Skills**: Interactive multi-select tags for languages, frameworks, and tools.
* **📰 Dynamic Project & Feed Main Page**:
  * Browse a feed of creative developer posts and projects.
  * Filter posts using a custom interactive Search Bar.
  * Create rich project posts specifying details, categories, repository links, and live demo URLs.
  * Interact with posts through liking, commenting, and saving projects to your curated list.
* **💬 Connection-Gated Real-Time Chat**:
  * Secure direct messaging interface that is automatically gated by accepted connections.
  * Seamless WebSocket connections using `socket.io-client` for real-time message delivery.
* **🔔 Live Notifications Hub**:
  * Track user activities, project likes, comments, and incoming connection requests.
* **🎨 Premium Interactive Design**:
  * Beautiful glassmorphic UI styled with **Tailwind CSS v4**.
  * Silky-smooth micro-animations powered by **Framer Motion**.
  * Toast alerts using **React Toastify** for instant interactive feedback.

---

## 🛠️ Technology Stack

### Frontend
* **Core**: React 18, TypeScript, Vite
* **Authentication**: Clerk React (`@clerk/clerk-react`)
* **Styling**: Tailwind CSS v4, Headless UI
* **Animations**: Framer Motion
* **Real-time Communication**: Socket.io Client
* **HTTP Client**: Axios
* **Notifications**: React Toastify

### Backend (buildnet-backend)
* **Framework**: Strapi v5 (Headless CMS)
* **Authentication Integration**: Jose (JWT parsing/verification)
* **Database**: PostgreSQL (Production) / SQLite (Local)
* **WebSockets**: Socket.io Server (running as a microservice)

---

## 📁 Frontend Directory Structure

```text
buildnet/
├── public/                 # Static public assets
└── src/
    ├── api/                # Axios instance configuration
    │   └── axios.ts              # Preconfigured baseURL (via environment variables)
    ├── assets/             # Media assets & fallback profile graphics
    ├── components/         # Page components & features
    │   ├── Feed/                 # Social feed feature component tree
    │   │   ├── createPost.tsx        # Post creation drawer with inputs
    │   │   ├── FeedMain.tsx          # Grid feed layout for scrolling posts
    │   │   ├── FeedNavbar.tsx        # Comprehensive application header
    │   │   ├── FeedSidebar.tsx       # Navigation list sidebar
    │   │   ├── MyProjects.tsx        # Owner's published projects panel
    │   │   ├── Notifications.tsx     # Direct notification card overlay
    │   │   ├── PostCard.tsx          # Card with comments, likes, and links
    │   │   ├── SavedProjects.tsx     # Saved bookmarks view
    │   │   ├── SearchBar.tsx         # Search bar text filter
    │   │   ├── Trending.tsx          # Sidebar widgets showing hot topics
    │   │   └── ViewNotifications.tsx # Full page notification viewer
    │   ├── Profile/              # Developer profiles
    │   │   └── ViewProfile.tsx       # Detailed profile viewer for other users
    │   ├── chats/                # Real-time chat workspace
    │   │   ├── Chatpage.tsx          # Fetches accepted connections list
    │   │   └── Chatui.tsx            # Chat UI window with socket listeners
    │   ├── modals/               # Global modals (dialogs, alert modals)
    │   ├── pages/                # High-level layouts and auth templates
    │   │   ├── AuthPages.tsx         # SignIn/SignUp layouts wrapper
    │   │   └── Layout.tsx            # Main layout wrapper containing Navbar
    │   ├── profilesection/       # Multi-step onboarding/settings profile components
    │   │   ├── BasicInfoSection.tsx  # Name, bio, tagline, socials
    │   │   ├── Main.tsx              # Wizard layout containing onboarding sections
    │   │   ├── MultiSelectTags.tsx   # Interactive tags drawer
    │   │   ├── ProfessionalDetail.tsx# Developer roles and company
    │   │   ├── ProfileActions.tsx    # Save/Cancel wizard navigation footer
    │   │   └── TechnicalSkillsSection.tsx # Technical languages selection
    │   ├── Footer.tsx            # Landing page footer
    │   ├── HeroSection.tsx       # Landing page Hero section
    │   ├── Homepage.tsx          # Public-facing home portal before auth
    │   ├── HowItWorkSection.tsx  # Step-by-step description section
    │   └── Navbar.tsx            # Public landing page navigation header
    ├── hooks/              # Custom React Hooks
    │   └── useAppUser.ts         # Wrapper hook for Clerk user state metadata
    ├── styles/             # Application custom CSS files
    ├── App.tsx             # Application routing mapping
    ├── main.tsx            # Mounting entry point
    └── tailwind.css        # Tailwind style directives
```

---

## ⚙️ Installation & Setup

### Prerequisites
* **Node.js** (v18 or higher)
* **MongoDB/PostgreSQL** (configured for Strapi database connections)
* **Clerk Developer Account** (for user management)

### 1. Setup the Environment
Create a `.env` file in the root of the `buildnet` frontend folder:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:1337
VITE_SOCKET_URL=http://localhost:5001
STRAPI_URL=http://localhost:1337
```

### 2. Install Dependencies
Run the installation command in the `buildnet` directory:
```bash
npm install
```

### 3. Run Development Server
Run the local Vite dev server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔗 Backend (Strapi) Integration

The frontend communicates with a Strapi-based backend:
* **Connections Endpoint**: `/api/connection-requests`
  * Connects users to each other after mutual acceptance.
* **Authentication**: Token headers are automatically appended using Clerk JWTs to authorize API operations on Strapi content types.
* **WebSockets**: Leverages `socket.io` to manage active rooms, online list mapping, typing indicators, and message broadcasts.

---

## 📝 License
This project is licensed under the MIT License.
