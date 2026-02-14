import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/Homepage";
import Main from "./components/profilesection/Main";
import ViewProfile from "./components/Profile/ViewProfile";
import AuthPages from "./components/pages/AuthPages";
import FeedMain from "./components/Feed/FeedMain";
import CreatePost from "./components/Feed/createPost";
import MyProjects from "./components/Feed/MyProjects";
import Layout from "./components/pages/Layout";
import Trending from "./components/Feed/Trending";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import useAppUser from "./hooks/useAppUser";
import "./styles/app.css";
import SavedProjects from "./components/Feed/SavedProjects";
import ViewNotifications from "./components/Feed/ViewNotifications";
import "react-toastify/dist/ReactToastify.css";
import { Bounce, ToastContainer } from "react-toastify";

function App() {

  const { isLoaded, user } = useAppUser();

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
      <Routes>
        {/* =====================================================
            SSO CALLBACK ROUTE (Always available)
        ===================================================== */}
        <Route
          path="/sso-callback"
          element={<AuthenticateWithRedirectCallback />}
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
              <Route path="/saved-projects" element={<SavedProjects />} />
              <Route path="/notifications" element={<ViewNotifications />} />
              <Route path="/user/:clerkId" element={<ViewProfile />} />
            </Route>

            {/* Routes WITHOUT Layout (Navbar) */}
            <Route path="/profile" element={<Main />} />
            <Route path="/create" element={<CreatePost />} />

            {/* Catch all - redirect to feed */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={1300}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}

export default App;