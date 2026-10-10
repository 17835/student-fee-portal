// Import our custom useFee hook.
// This gives us access to the shared fee information.
import { useFee } from "../context/FeeContext";

function FeeBreakdown() {
  // Get the fees and overall totals from FeeContext.
  const {
    fees,
    totalFees,
    totalPaid,
    outstanding,
  } = useFee();

  return (
    <div className="fee-breakdown-page">

      {/* =========================================
          PAGE HEADER
          ========================================= */}

      <div className="page-heading">
        <div>
          <h2>Fee Breakdown</h2>

          <p>
            View a detailed breakdown of your
            academic fees.
          </p>
        </div>
      </div>

      {/* =========================================
          OVERALL SUMMARY
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
            Total amount required
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

      </div>

      {/* =========================================
          INDIVIDUAL FEE BREAKDOWN
          ========================================= */}

      <div className="dashboard-card">

        <div className="card-header">

          <div>
            <h3>Fee Details</h3>

            <p>
              Detailed information about each
              academic fee.
            </p>
          </div>

        </div>

        <div className="fee-breakdown-list">

          {fees.map((fee) => {

            // Calculate how much is still owed
            // for this particular fee.
            const remaining =
              fee.total - fee.paid;

            // Calculate the percentage that
            // has already been paid.
            const percentage =
              fee.total > 0
                ? Math.round(
                    (fee.paid / fee.total) * 100
                  )
                : 0;

            return (
              <div
                className="fee-breakdown-item"
                key={fee.id}
              >

                {/* =================================
                    FEE NAME AND STATUS
                    ================================= */}

                <div className="fee-breakdown-header">

                  <div>
                    <h4>
                      {fee.name}
                    </h4>

                    <span>
                      {percentage}% paid
                    </span>
                  </div>

                  {/* Show different status depending
                      on whether the fee is fully paid. */}

                  {remaining === 0 ? (
                    <span className="status-badge success">
                      Fully Paid
                    </span>
                  ) : (
                    <span className="status-badge warning">
                      Payment Due
                    </span>
                  )}

                </div>

                {/* =================================
                    PROGRESS BAR
                    ================================= */}

                <div className="progress-track">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${percentage}%`,
                    }}
                  ></div>

                </div>

                {/* =================================
                    AMOUNT INFORMATION
                    ================================= */}

                <div className="fee-amount-grid">

                  <div>
                    <span>
                      Total Fee
                    </span>

                    <strong>
                      ₦
                      {fee.total.toLocaleString()}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Amount Paid
                    </span>

                    <strong className="text-green">
                      ₦
                      {fee.paid.toLocaleString()}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Remaining
                    </span>

                    <strong>
                      ₦
                      {remaining.toLocaleString()}
                    </strong>
                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}

export default FeeBreakdown;