import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">

        <div className="logo-icon">
          S
        </div>

        <div>
          <h2>SAFSIMS</h2>
          <span>Student Fee Portal</span>
        </div>

      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">

        <div className="nav-section-title">
          MAIN MENU
        </div>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">⌂</span>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/payments"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">₦</span>
          <span>Payments</span>
        </NavLink>

        <NavLink
          to="/fee-breakdown"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">▤</span>
          <span>Fee Breakdown</span>
        </NavLink>

        <NavLink
          to="/receipts"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">▧</span>
          <span>Receipts</span>
        </NavLink>

        <div className="nav-section-title second-section">
          SUPPORT
        </div>

        <NavLink
          to="/help-support"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">?</span>
          <span>Help & Support</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon">⚙</span>
          <span>Settings</span>
        </NavLink>

      </nav>

      {/* Sidebar user */}
      <div className="sidebar-bottom">

        <div className="sidebar-user">

          <div className="user-avatar">
            AK
          </div>

          <div className="user-details">
            <strong>Aisha Kabiru</strong>
            <span>Software Engineering</span>
          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;