import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/Homepage";
import { useUser } from "@clerk/clerk-react";
import Main from "./components/profilesection/Main";
import AuthPages from "./components/pages/AuthPages";
import FeedMain from "./components/Feed/FeedMain";
import CreatePost from "./components/Feed/createPost";
import { useEffect } from "react";
import MyProjects from "./components/Feed/MyProjects";
import api from "./api/axios";
import Layout from "./components/pages/Layout";
import Trending from "./components/Feed/Trending";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

function App() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const syncUserToStrapi = async () => {
      try {
        // 1️⃣ Check if app-user already exists
        const findRes = await api.get(
          `/api/app-users?filters[clerkUserId][$eq]=${user.id}`
        );

        if (findRes.data.data.length > 0) {
          const existingUser = findRes.data.data[0];
          localStorage.setItem("appUserId", existingUser.id);
          console.log("✅ app-user already exists");
          return;
        }

        // 2️⃣ Create app-user if not found
        console.log("⏳ Creating app-user in Strapi...", {
          clerkUserId: user.id,
          email: user.emailAddresses[0].emailAddress,
          name: user.fullName,
        });

        const createRes = await api.post(
          "/api/app-users",
          {
            data: {
              clerkUserId: user.id,
              email: user.emailAddresses[0].emailAddress,
              name: user.fullName,
            },
          }
        );

        localStorage.setItem("appUserId", createRes.data.data.id);
        console.log("✅ app-user created:", createRes.data);

        if (!user.unsafeMetadata?.profileCompleted) {
          await user.update({
            unsafeMetadata: {
              profileCompleted: false,
            },
          });
        }

        // 3️⃣ NEW: If user doesn't have profileCompleted metadata, redirect to profile
        if (!user.unsafeMetadata?.profileCompleted) {
          console.log("⏳ New user detected, redirecting to profile completion...");
          // Don't navigate here, let the routing logic handle it
        }

      } catch (err) {
        console.error("❌ Error syncing app-user:", err);
      }
    };

    syncUserToStrapi();
  }, [user, isLoaded]);

  // ⏳ Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isProfileComplete = Boolean(user?.unsafeMetadata?.profileCompleted);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50">
      {/* 🎨 Global Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
        }
        
        .animate-on-scroll.visible {
          animation: slide-up 0.6s ease-out forwards;
        }
        
        .floating {
          animation: float 6s ease-in-out infinite;
        }
        
        .text-rotate-enter {
          animation: slide-up 0.5s ease-out;
        }
        
        .hero-bg-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>

      <Routes>
        {/* =====================================================
            SSO CALLBACK ROUTE (Always available)
        ===================================================== */}
        <Route
          path="/sso-callback"
          element={<AuthenticateWithRedirectCallback/>}
        />

        {/* =====================================================
            CASE 1: USER NOT LOGGED IN → PUBLIC ROUTES
        ===================================================== */}
        {!user && (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-in" element={<AuthPages />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}

        {/* =====================================================
            CASE 2: USER LOGGED IN BUT PROFILE INCOMPLETE
        ===================================================== */}
        {user && !isProfileComplete && (
          <>
            <Route path="/" element={<Navigate to="/profile" replace />} />
            <Route path="/profile" element={<Main />} />
            <Route path="*" element={<Navigate to="/profile" replace />} />
          </>
        )}

        {/* =====================================================
            CASE 3: USER LOGGED IN + PROFILE COMPLETE
        ===================================================== */}
        {user && isProfileComplete && (
          <>
            {/* Routes WITH Layout (Navbar) */}
            <Route element={<Layout />}>
              <Route path="/" element={<FeedMain />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/my-projects" element={<MyProjects />} />
            </Route>

            {/* Routes WITHOUT Layout (Navbar) */}
            <Route path="/profile" element={<Main />} />
            <Route path="/create" element={<CreatePost />} />

            {/* Catch all - redirect to feed */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;