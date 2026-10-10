
import { useEffect, useState } from "react";
import API from "../services/api";
import { useFee } from "../context/FeeContext";

const fallbackStudent = {
  name: "Aisha Kabiru",
  matricNumber: "SE/2023/17835",
  department: "Software Engineering",
  level: "400 Level",
  session: "2025/2026",
};

const formatAmount = (amount) =>
  `₦${Number(amount || 0).toLocaleString("en-NG")}`;

const escapeHTML = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(date);
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

function Receipts() {
  const { transactions = [], loading } = useFee();

  const [student, setStudent] = useState(fallbackStudent);
  const [studentLoading, setStudentLoading] = useState(true);

  // Load student details from db.json through JSON Server.
  useEffect(() => {
    let active = true;

    const loadStudent = async () => {
      try {
        const response = await API.get("/student");

        if (active && response.data) {
          setStudent({
            ...fallbackStudent,
            ...response.data,
          });
        }
      } catch (error) {
        console.error("Unable to load student details:", error);
      } finally {
        if (active) {
          setStudentLoading(false);
        }
      }
    };

    loadStudent();

    return () => {
      active = false;
    };
  }, []);

  // Open a properly formatted receipt for printing or PDF saving.
  const downloadReceipt = (transaction) => {
    const receiptWindow = window.open("", "_blank");

    if (!receiptWindow) {
      alert(
        "Please allow pop-ups for this website to print your receipt."
      );
      return;
    }

    const receiptNumber =
      transaction.reference || `RCPT-${transaction.id}`;

    const studentName = escapeHTML(student.name);
    const matricNumber = escapeHTML(student.matricNumber);
    const department = escapeHTML(student.department);
    const level = escapeHTML(student.level);
    const session = escapeHTML(student.session);

    const feeName = escapeHTML(transaction.fee);
    const reference = escapeHTML(receiptNumber);
    const date = escapeHTML(formatDate(transaction.date));
    const method = escapeHTML(transaction.method || "Not specified");
    const status = escapeHTML(transaction.status || "Pending");
    const amount = formatAmount(transaction.amount);

    const receiptHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Payment Receipt - ${reference}</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 35px;
            background: #f4f5f0;
            color: #222820;
            font-family: Arial, Helvetica, sans-serif;
          }

          .receipt {
            width: 100%;
            max-width: 760px;
            margin: 0 auto;
            background: white;
            border: 1px solid #dfe4db;
            border-radius: 12px;
            overflow: hidden;
          }

          .header {
            padding: 32px;
            background: #263b29;
            color: white;
            text-align: center;
          }

          .logo {
            width: 58px;
            height: 58px;
            margin: 0 auto 14px;
            border: 2px solid #dfe7d6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 21px;
            font-weight: bold;
          }

          .header h1 {
            margin: 0 0 8px;
            font-size: 23px;
            letter-spacing: 1px;
          }

          .header p {
            margin: 0;
            color: #e0e8dc;
            font-size: 12px;
          }

          .receipt-label {
            padding: 20px 30px;
            border-bottom: 1px solid #e5e8e2;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
          }

          .receipt-label h2 {
            margin: 0 0 6px;
            font-size: 20px;
          }

          .receipt-label p {
            margin: 0;
            color: #697367;
            font-size: 12px;
          }

          .status {
            display: inline-block;
            padding: 8px 12px;
            border-radius: 20px;
            background: #e8f5e9;
            color: #246334;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
          }

          .amount-box {
            margin: 24px 30px;
            padding: 24px;
            background: #f3f6ef;
            border: 1px solid #e0e7da;
            border-radius: 9px;
            text-align: center;
          }

          .amount-box p {
            margin: 0 0 10px;
            color: #63705e;
            font-size: 12px;
          }

          .amount {
            color: #263b29;
            font-size: 34px;
            font-weight: bold;
          }

          .section {
            padding: 10px 30px 20px;
          }

          .section h3 {
            margin: 10px 0 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e6ebe2;
            color: #263b29;
            font-size: 13px;
            letter-spacing: 0.8px;
            text-transform: uppercase;
          }

          .details {
            width: 100%;
            border-collapse: collapse;
          }

          .details td {
            padding: 11px 0;
            border-bottom: 1px solid #edf0eb;
            font-size: 12px;
            line-height: 1.5;
            overflow-wrap: anywhere;
          }

          .details td:first-child {
            width: 43%;
            color: #697367;
          }

          .details td:last-child {
            color: #222820;
            font-weight: 600;
            text-align: right;
          }

          .footer {
            padding: 22px 30px;
            background: #f7f8f5;
            border-top: 1px solid #e5e8e2;
            color: #697367;
            text-align: center;
            font-size: 11px;
            line-height: 1.8;
          }

          .footer strong {
            color: #263b29;
          }

          @media print {
            @page {
              size: A4;
              margin: 12mm;
            }

            body {
              padding: 0;
              background: white;
            }

            .receipt {
              max-width: none;
              border-radius: 0;
              border: 1px solid #dfe4db;
            }

            .header {
              background: #263b29 !important;
              color: white !important;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }

            .amount-box {
              background: #f3f6ef !important;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }

            .status {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }

            .footer {
              background: #f7f8f5 !important;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        </style>
      </head>

      <body>
        <main class="receipt">
          <header class="header">
            <div class="logo">U</div>
            <h1>STUDENT FEE PORTAL</h1>
            <p>OFFICIAL STUDENT PAYMENT RECEIPT</p>
          </header>

          <div class="receipt-label">
            <div>
              <h2>Payment Receipt</h2>
              <p>Receipt No: ${reference}</p>
            </div>

            <span class="status">${status}</span>
          </div>

          <div class="amount-box">
            <p>AMOUNT PAID</p>
            <div class="amount">${amount}</div>
          </div>

          <section class="section">
            <h3>Student Information</h3>

            <table class="details">
              <tr>
                <td>Full Name</td>
                <td>${studentName}</td>
              </tr>
              <tr>
                <td>Matriculation Number</td>
                <td>${matricNumber}</td>
              </tr>
              <tr>
                <td>Department</td>
                <td>${department}</td>
              </tr>
              <tr>
                <td>Academic Level</td>
                <td>${level}</td>
              </tr>
              <tr>
                <td>Academic Session</td>
                <td>${session}</td>
              </tr>
            </table>
          </section>

          <section class="section">
            <h3>Payment Information</h3>

            <table class="details">
              <tr>
                <td>Fee Description</td>
                <td>${feeName}</td>
              </tr>
              <tr>
                <td>Transaction Reference</td>
                <td>${reference}</td>
              </tr>
              <tr>
                <td>Payment Date</td>
                <td>${date}</td>
              </tr>
              <tr>
                <td>Payment Method</td>
                <td>${method}</td>
              </tr>
              <tr>
                <td>Payment Status</td>
                <td>${status}</td>
              </tr>
            </table>
          </section>

          <footer class="footer">
            <strong>Student Fee Portal</strong><br />
            This receipt records the payment details shown above.<br />
            Please retain a copy for your personal records.
          </footer>
        </main>

        <script>
          window.onload = function () {
            setTimeout(function () {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    receiptWindow.document.open();
    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();
  };

  return (
    <div className="receipts-page">
      <style>{`
        .receipts-page {
          padding: 28px;
          color: var(--text-primary, #1f2937);
        }

        .receipts-heading {
          margin-bottom: 24px;
        }

        .receipts-heading h1 {
          margin: 0 0 8px;
          font-size: 27px;
          font-weight: 700;
        }

        .receipts-heading p {
          margin: 0;
          color: var(--text-secondary, #6b7280);
          font-size: 14px;
        }

        .receipt-summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 25px;
        }

        .receipt-stat {
          padding: 20px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 14px;
          background: var(--card-bg, #ffffff);
        }

        .receipt-stat span {
          display: block;
          margin-bottom: 10px;
          color: var(--text-secondary, #6b7280);
          font-size: 13px;
        }

        .receipt-stat strong {
          font-size: 21px;
          color: var(--text-primary, #263b29);
          overflow-wrap: anywhere;
        }

        .receipt-list {
          display: grid;
          gap: 16px;
        }

        .receipt-card {
          padding: 22px;
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 14px;
          background: var(--card-bg, #ffffff);
        }

        .receipt-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .receipt-card h3 {
          margin: 0 0 8px;
          font-size: 17px;
        }

        .receipt-card p {
          margin: 5px 0;
          color: var(--text-secondary, #6b7280);
          font-size: 13px;
          overflow-wrap: anywhere;
        }

        .receipt-card-amount {
          margin: 17px 0;
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary, #263b29);
        }

        .receipt-status {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 20px;
          background: #e8f5e9;
          color: #246334;
          font-size: 11px;
          font-weight: 700;
        }

        .receipt-status.pending {
          background: #fff3cd;
          color: #856404;
        }

        .receipt-button {
          border: 0;
          border-radius: 8px;
          padding: 11px 16px;
          background: #263b29;
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .receipt-button:hover {
          background: #4c5d45;
        }

        .receipt-empty {
          padding: 40px 20px;
          text-align: center;
          border: 1px dashed var(--border-color, #d1d5db);
          border-radius: 14px;
          background: var(--card-bg, #ffffff);
        }

        .receipt-empty h3 {
          margin: 0 0 10px;
        }

        .receipt-empty p {
          color: var(--text-secondary, #6b7280);
          font-size: 14px;
        }

        @media (max-width: 700px) {
          .receipts-page {
            padding: 16px;
          }

          .receipt-summary {
            grid-template-columns: 1fr;
          }

          .receipt-card-top {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="receipts-heading">
        <h1>Payment Receipts</h1>
        <p>
          View your payment history and print official-style receipts.
        </p>
      </div>

      <div className="receipt-summary">
        <div className="receipt-stat">
          <span>Student Name</span>
          <strong>
            {studentLoading ? "Loading..." : student.name}
          </strong>
        </div>

        <div className="receipt-stat">
          <span>Matriculation Number</span>
          <strong>
            {studentLoading ? "Loading..." : student.matricNumber}
          </strong>
        </div>

        <div className="receipt-stat">
          <span>Successful Payments</span>
          <strong>
            {
              transactions.filter(
                (transaction) =>
                  String(transaction.status).toLowerCase() ===
                  "successful"
              ).length
            }
          </strong>
        </div>
      </div>

      <div className="receipt-list">
        {loading && transactions.length === 0 ? (
          <div className="receipt-empty">
            <h3>Loading payment history...</h3>
            <p>Please wait while your transactions are retrieved.</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="receipt-empty">
            <h3>No payment receipts yet</h3>
            <p>
              Your receipts will appear here after you make a payment.
            </p>
          </div>
        ) : (
          transactions.map((transaction, index) => {
            const successful =
              String(transaction.status).toLowerCase() ===
              "successful";

            return (
              <article
                className="receipt-card"
                key={transaction.id ?? transaction.reference ?? index}
              >
                <div className="receipt-card-top">
                  <div>
                    <h3>{transaction.fee || "Student Fee Payment"}</h3>

                    <p>
                      Reference:{" "}
                      {transaction.reference || "Not available"}
                    </p>

                    <p>
                      Date: {formatDate(transaction.date)}
                    </p>

                    <p>
                      Method: {transaction.method || "Not specified"}
                    </p>
                  </div>

                  <span
                    className={`receipt-status ${
                      successful ? "" : "pending"
                    }`}
                  >
                    {transaction.status || "Pending"}
                  </span>
                </div>

                <div className="receipt-card-amount">
                  {formatAmount(transaction.amount)}
                </div>

                <button
                  className="receipt-button"
                  type="button"
                  onClick={() => downloadReceipt(transaction)}
                >
                  Print / Save as PDF
                </button>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Receipts;