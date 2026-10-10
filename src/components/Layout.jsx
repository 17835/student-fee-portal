// ============================================================
// STUDENT FEE PORTAL
// Layout.jsx
// ============================================================

// Import Outlet from React Router.
// Outlet displays whichever page matches the current URL.
import { Outlet } from "react-router-dom";

// Import the Sidebar and Header components.
// Because Layout.jsx is inside the components folder,
// we use "./Sidebar" and "./Header".
import Sidebar from "./Sidebar";
import Header from "./Header";

// Main layout component.
function Layout() {
  return (
    <div className="app-layout">

      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content area */}
      <div className="main-content">

        {/* Top header */}
        <Header />

        {/* Current page appears here */}
        <main className="page-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default Layout;