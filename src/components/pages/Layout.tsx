// Layout.tsx
import FeedNavbar from "../Feed/FeedNavbar"
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <FeedNavbar />
      <Outlet />
    </>
  );
}
