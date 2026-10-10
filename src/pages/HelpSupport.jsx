import { useState } from "react";

function HelpSupport() {

  // Store the question selected by the student.
  const [openQuestion, setOpenQuestion] = useState(null);


  // Frequently asked questions.
  const faqs = [
    {
      question: "How do I make a payment?",
      answer:
        "Go to the Payments section from the sidebar, enter the amount you want to pay, select your preferred payment method and continue with the payment process.",
    },
    {
      question: "How can I download my receipt?",
      answer:
        "Open the Receipts section from the sidebar. You will see a list of your successful transactions and can download the receipt for each payment.",
    },
    {
      question: "How do I check my outstanding fees?",
      answer:
        "Your outstanding balance is displayed on the Dashboard. You can also open Fee Breakdown to see the outstanding amount for each individual fee.",
    },
    {
      question: "What should I do if my payment is not showing?",
      answer:
        "Allow some time for the transaction to be processed. If the payment still does not appear, contact the school finance office or support team with your transaction reference.",
    },
  ];


  return (
    <div className="dashboard-page">

      {/* Page heading */}
      <div className="page-header">

        <div>
          <h2>Help & Support</h2>

          <p>
            Find answers to common questions about your fees.
          </p>
        </div>

      </div>


      <div className="support-grid">

        {/* ================= FAQ ================= */}

        <section className="dashboard-card">

          <div className="card-header">

            <div>
              <h3>Frequently Asked Questions</h3>

              <p>
                Quick answers to common questions.
              </p>
            </div>

          </div>


          <div className="faq-list">

            {faqs.map((faq, index) => (

              <div
                className="faq-item"
                key={faq.question}
              >

                <button
                  className="faq-question"
                  onClick={() =>
                    setOpenQuestion(
                      openQuestion === index
                        ? null
                        : index
                    )
                  }
                >

                  <span>
                    {faq.question}
                  </span>

                  <span>
                    {openQuestion === index
                      ? "−"
                      : "+"}
                  </span>

                </button>


                {openQuestion === index && (

                  <div className="faq-answer">
                    {faq.answer}
                  </div>

                )}

              </div>

            ))}

          </div>

        </section>


        {/* ================= CONTACT ================= */}

        <section className="dashboard-card contact-card">

          <div className="support-icon">
            ?
          </div>

          <h3>Still need help?</h3>

          <p>
            Contact the student finance support team
            if you have a question that isn't answered
            here.
          </p>


          <div className="contact-option">

            <span>✉</span>

            <div>
              <strong>Email Support</strong>
              <small>
                finance@school.edu
              </small>
            </div>

          </div>


          <div className="contact-option">

            <span>☎</span>

            <div>
              <strong>Finance Office</strong>
              <small>
                Monday – Friday
              </small>
            </div>

          </div>


          <button className="primary-button full-width">
            Contact Support
          </button>

        </section>

      </div>

    </div>
  );
}

export default HelpSupport;