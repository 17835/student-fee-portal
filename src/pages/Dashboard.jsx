// Import Link so we can move between pages
// without refreshing the entire application.
import { Link } from "react-router-dom";

// Import our custom useFee hook.
// This gives us access to the shared fee information.
import { useFee } from "../context/FeeContext";

function Dashboard() {
  // =========================================
  // PAYMENT DEADLINE
  // =========================================

  // Set the payment deadline.
  const paymentDeadline = new Date("2026-10-15");

  // Get today's date.
  const today = new Date();

  // Calculate the difference between
  // the deadline and today's date.
  const difference =
    paymentDeadline - today;

  // Convert milliseconds into days.
  const daysRemaining = Math.max(
    0,
    Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    )
  );

  // =========================================
  // DETERMINE DEADLINE STATUS
  // =========================================

  let deadlineStatus = "On Track";
  let deadlineClass = "deadline-normal";

  if (daysRemaining === 0) {
    deadlineStatus = "Deadline Reached";
    deadlineClass = "deadline-danger";
  } else if (daysRemaining <= 7) {
    deadlineStatus = "Due Soon";
    deadlineClass = "deadline-warning";
  }

  // =========================================
  // FEE INFORMATION
  // =========================================

  const {
    fees,
    transactions,
    totalFees,
    totalPaid,
    outstanding,
    paymentProgress,
  } = useFee();

  return (
    <div className="dashboard-page">

      {/* =========================================
          PAGE HEADER
          ========================================= */}

      <div className="page-heading">

        <div>
          <h2>
            Good morning, Aisha 👋
          </h2>

          <p>
            Here's an overview of your academic
            finances.
          </p>
        </div>

        <Link
          to="/payments"
          className="primary-button"
        >
          + Make Payment
        </Link>

      </div>


      {/* =========================================
          FINANCIAL SUMMARY CARDS
          ========================================= */}

      <div className="stats-grid">

        {/* TOTAL FEES */}

        <div className="stat-card">

          <div className="stat-card-top">

            <span className="stat-label">
              Total Fees
            </span>

            <span className="stat-icon blue">
              ₦
            </span>

          </div>

          <h3>
            ₦{totalFees.toLocaleString()}
          </h3>

          <p className="stat-description">
            Total fees for 2026/2027
          </p>

        </div>


        {/* TOTAL PAID */}

        <div className="stat-card">

          <div className="stat-card-top">

            <span className="stat-label">
              Total Paid
            </span>

            <span className="stat-icon green">
              ✓
            </span>

          </div>

          <h3>
            ₦{totalPaid.toLocaleString()}
          </h3>

          <p className="stat-description">
            Amount paid so far
          </p>

        </div>


        {/* OUTSTANDING */}

        <div className="stat-card">

          <div className="stat-card-top">

            <span className="stat-label">
              Outstanding
            </span>

            <span className="stat-icon yellow">
              !
            </span>

          </div>

          <h3>
            ₦{outstanding.toLocaleString()}
          </h3>

          <p className="stat-description">
            Remaining balance
          </p>

        </div>


        {/* PAYMENT DEADLINE */}

        <div
          className={`stat-card ${deadlineClass}`}
        >

          <div className="stat-card-top">

            <span className="stat-label">
              Payment Deadline
            </span>

            <span className="stat-icon purple">
              ◷
            </span>

          </div>

          <h3>
            Oct 15
          </h3>

          <p className="stat-description">

            {daysRemaining > 0
              ? `${daysRemaining} days remaining`
              : "Payment deadline reached"}

          </p>

          <span className="deadline-status">
            {deadlineStatus}
          </span>

        </div>

      </div>


      {/* =========================================
          PAYMENT PROGRESS + STUDENT INFORMATION
          ========================================= */}

      <div className="dashboard-two-column">


        {/* PAYMENT PROGRESS */}

        <div className="dashboard-card payment-progress-card">

          <div className="card-header">

            <div>

              <h3>
                Payment Progress
              </h3>

              <p>
                Your overall fee payment status
              </p>

            </div>

          </div>


          {/* Circular progress */}

          <div className="circular-progress-wrapper">

            <div
              className="circular-progress"
              style={{
                "--progress": `${paymentProgress}%`,
              }}
            >

              <div className="circular-progress-inner">

                <strong>
                  {paymentProgress}%
                </strong>

                <span>
                  Paid
                </span>

              </div>

            </div>

          </div>


          {/* Payment amounts */}

          <div className="circular-progress-details">

            <div>

              <span>
                Paid
              </span>

              <strong>
                ₦{totalPaid.toLocaleString()}
              </strong>

            </div>


            <div>

              <span>
                Remaining
              </span>

              <strong>
                ₦{outstanding.toLocaleString()}
              </strong>

            </div>

          </div>

        </div>


        {/* STUDENT INFORMATION */}

        <div className="dashboard-card">

          <div className="card-header">

            <div>

              <h3>
                Student Information
              </h3>

              <p>
                Your academic profile
              </p>

            </div>


            <span className="status-badge">

              {paymentProgress === 100
                ? "Fully Paid"
                : paymentProgress > 0
                ? "Partially Paid"
                : "Not Paid"}

            </span>

          </div>


          <div className="student-info-grid">

            <div>

              <span>
                Name
              </span>

              <strong>
                Aisha Kabiru
              </strong>

            </div>


            <div>

              <span>
                Student ID
              </span>

              <strong>
                SE/2023/17835
              </strong>

            </div>


            <div>

              <span>
                Programme
              </span>

              <strong>
                Software Engineering
              </strong>

            </div>


            <div>

              <span>
                Level
              </span>

              <strong>
                400
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* =========================================
          FEE BREAKDOWN
          ========================================= */}

      <div className="dashboard-card">

        <div className="card-header">

          <div>

            <h3>
              Fee Breakdown
            </h3>

            <p>
              See how much you have paid for each fee.
            </p>

          </div>

          <Link
            to="/fee-breakdown"
            className="text-link"
          >
            View all →
          </Link>

        </div>


        <div className="fee-list">

          {fees.map((fee) => {

            const remaining =
              fee.total - fee.paid;

            const percentage =
              fee.total > 0
                ? Math.round(
                    (fee.paid / fee.total) * 100
                  )
                : 0;

            return (

              <div
                className="fee-row"
                key={fee.id}
              >

                <div className="fee-row-info">

                  <div>

                    <strong>
                      {fee.name}
                    </strong>

                    <span>
                      ₦{fee.paid.toLocaleString()} of{" "}
                      ₦{fee.total.toLocaleString()}
                    </span>

                  </div>

                  <strong>
                    {percentage}%
                  </strong>

                </div>


                <div className="progress-track small">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${percentage}%`,
                    }}
                  ></div>

                </div>


                <div className="fee-row-bottom">

                  <span>
                    Remaining: ₦
                    {remaining.toLocaleString()}
                  </span>


                  {remaining === 0 ? (

                    <span className="paid-label">
                      Fully Paid
                    </span>

                  ) : (

                    <span className="due-label">
                      Payment Due
                    </span>

                  )}

                </div>

              </div>

            );

          })}

        </div>

      </div>


      {/* =========================================
          RECENT TRANSACTIONS
          ========================================= */}

      <div className="dashboard-card">

        <div className="card-header">

          <div>

            <h3>
              Recent Transactions
            </h3>

            <p>
              Your latest fee payments
            </p>

          </div>

          <Link
            to="/receipts"
            className="text-link"
          >
            View all →
          </Link>

        </div>


        <div className="transaction-list">

          {transactions
            .slice(0, 3)
            .map((transaction) => (

              <div
                className="transaction-row"
                key={transaction.id}
              >

                <div className="transaction-icon">
                  ✓
                </div>


                <div className="transaction-info">

                  <strong>
                    {transaction.fee}
                  </strong>

                  <span>
                    {transaction.date}
                  </span>

                </div>


                <div className="transaction-amount">

                  <strong>
                    ₦
                    {transaction.amount.toLocaleString()}
                  </strong>

                  <span>
                    {transaction.reference}
                  </span>

                </div>

              </div>

            ))}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;