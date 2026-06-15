// Layout.tsx
import FeedNavbar from "../Feed/FeedNavbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
 
  return (
    <div className="flex flex-col h-screen overflow-hidden">
    
      <FeedNavbar />

     
      <main className="flex-1 min-h-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}