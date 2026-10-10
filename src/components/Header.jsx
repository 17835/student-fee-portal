import { useState } from "react";

function Header() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((current) => !current);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <header className="topbar">

      <div className="topbar-left">
        <h1>Student Fee Portal</h1>
        <p>Manage your school fees and payments</p>
      </div>

      <div className="topbar-right">

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title="Toggle theme"
          type="button"
        >
          {darkMode ? "☀" : "☾"}
        </button>

        <button
          className="notification-button"
          title="Notifications"
          type="button"
        >
          🔔
          <span className="notification-dot"></span>
        </button>

        <div className="topbar-profile">

          <div className="profile-avatar">
            AK
          </div>

          <div className="profile-info">
            <strong>Aisha Kabiru</strong>
            <span>Student</span>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;