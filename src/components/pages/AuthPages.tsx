import { useState } from "react";
import LoginPage from "./Login";
import SignupPage from "./SignUpPage";
import { useSearchParams } from "react-router-dom";
export default function AuthPages() {

   const [searchParams] = useSearchParams();
   const mode = searchParams.get("mode"); // 'signup' if ?mode=signup
   const [currentPage, setCurrentPage] = useState(mode === 'signup' ? 'signup' : 'login');

  return (
    <div>
      {currentPage === 'login' ? (
        <LoginPage onSwitchToSignup={() => setCurrentPage('signup')} />
      ) : (
        <SignupPage onSwitchToLogin={() => setCurrentPage('login')} />
      )}
    </div>
  );
}