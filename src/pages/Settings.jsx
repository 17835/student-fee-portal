import { useState } from "react";

function Settings() {

  // Store whether email notifications are enabled.
  const [emailNotifications, setEmailNotifications] =
    useState(true);


  // Store whether payment reminders are enabled.
  const [paymentReminders, setPaymentReminders] =
    useState(true);


  // Handle saving the settings.
  const saveSettings = () => {

    alert("Your settings have been saved successfully.");

  };


  return (
    <div className="dashboard-page">

      {/* Page heading */}
      <div className="page-header">

        <div>
          <h2>Settings</h2>

          <p>
            Manage your student portal preferences.
          </p>
        </div>

      </div>


      {/* ================= PROFILE ================= */}

      <section className="dashboard-card settings-card">

        <div className="card-header">

          <div>
            <h3>Profile Information</h3>

            <p>
              Your basic student information.
            </p>
          </div>

        </div>


        <div className="settings-form">

          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              value="Aisha Kabiru"
              readOnly
            />

          </div>


          <div className="form-group">

            <label>
              Matric Number
            </label>

            <input
              type="text"
              value="SE/2023/17835"
              readOnly
            />

          </div>


          <div className="form-group">

            <label>
              Programme
            </label>

            <input
              type="text"
              value="Software Engineering"
              readOnly
            />

          </div>


          <div className="form-group">

            <label>
              Level
            </label>

            <input
              type="text"
              value="400"
              readOnly
            />

          </div>

        </div>

      </section>


      {/* ================= NOTIFICATIONS ================= */}

      <section className="dashboard-card settings-card">

        <div className="card-header">

          <div>
            <h3>Notifications</h3>

            <p>
              Choose which notifications you receive.
            </p>
          </div>

        </div>


        {/* Email notifications */}
        <div className="setting-row">

          <div>
            <strong>Email Notifications</strong>

            <span>
              Receive important updates by email.
            </span>
          </div>

          <button
            className={
              emailNotifications
                ? "toggle-switch active"
                : "toggle-switch"
            }
            onClick={() =>
              setEmailNotifications(
                !emailNotifications
              )
            }
          >

            <span></span>

          </button>

        </div>


        {/* Payment reminders */}
        <div className="setting-row">

          <div>
            <strong>Payment Reminders</strong>

            <span>
              Receive reminders about upcoming deadlines.
            </span>
          </div>

          <button
            className={
              paymentReminders
                ? "toggle-switch active"
                : "toggle-switch"
            }
            onClick={() =>
              setPaymentReminders(
                !paymentReminders
              )
            }
          >

            <span></span>

          </button>

        </div>


        <button
          className="primary-button"
          onClick={saveSettings}
        >
          Save Changes
        </button>

      </section>

    </div>
  );
}

export default Settings;