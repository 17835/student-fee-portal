
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFee } from "../context/FeeContext";

function Payments() {
  const { fees, outstanding, makePayment } = useFee();
  const navigate = useNavigate();

  const [selectedFeeId, setSelectedFeeId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Card");
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedFee = fees.find(
    (fee) => String(fee.id) === String(selectedFeeId)
  );

  const selectedFeeRemaining = selectedFee
    ? Math.max(0, Number(selectedFee.total) - Number(selectedFee.paid))
    : 0;

  const handleFeeChange = (event) => {
    setSelectedFeeId(event.target.value);
    setAmount("");
    setError("");
  };

  const handleContinue = () => {
    setError("");

    if (!selectedFee) {
      setError("Please select what you want to pay for.");
      return;
    }

    const numericAmount = Number(amount);

    if (!amount.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Please enter a valid payment amount.");
      return;
    }

    if (numericAmount > selectedFeeRemaining) {
      setError(
        `You cannot pay more than ₦${selectedFeeRemaining.toLocaleString()} for ${selectedFee.name}.`
      );
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmPayment = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    setError("");

    try {
      const result = await makePayment({
        feeId: selectedFeeId,
        amount: Number(amount),
        method,
      });

      if (!result || !result.success) {
        setError(result?.message || "Payment could not be completed. Please try again.");
        setShowConfirmation(false);
        return;
      }

      setPaymentResult(result.transaction);
      setShowConfirmation(false);
      setSelectedFeeId("");
      setAmount("");
    } catch (err) {
      setError("An error occurred while processing your payment. Please try again.");
      setShowConfirmation(false);
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentResult) {
    return (
      <div className="payments-page">
        <div className="payment-success-card">
          <div className="success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <p>Your payment has been recorded successfully.</p>

          <div className="confirmation-details">
            <div>
              <span>Fee</span>
              <strong>{paymentResult.fee}</strong>
            </div>
            <div>
              <span>Amount Paid</span>
              <strong>
                ₦{Number(paymentResult.amount).toLocaleString()}
              </strong>
            </div>
            <div>
              <span>Payment Method</span>
              <strong>{paymentResult.method}</strong>
            </div>
            <div>
              <span>Transaction Reference</span>
              <strong>{paymentResult.reference}</strong>
            </div>
          </div>

          <div className="success-actions">
            <button
              className="primary-button"
              onClick={() => navigate("/receipts")}
            >
              View Receipt
            </button>

            <button
              className="secondary-button"
              onClick={() => setPaymentResult(null)}
            >
              Make Another Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payments-page">
      <div className="page-heading">
        <div>
          <h2>Make a Payment</h2>
          <p>Select a fee and make your payment securely.</p>
        </div>

        <Link to="/receipts" className="secondary-button">
          View Receipts
        </Link>
      </div>

      <div className="payment-layout">
        <div className="dashboard-card payment-form-card">
          <div className="card-header">
            <div>
              <h3>Payment Details</h3>
              <p>Choose what you would like to pay for.</p>
            </div>
          </div>

          {error && (
            <div className="payment-error" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="fee">What would you like to pay for?</label>

            <select
              id="fee"
              name="fee"
              value={selectedFeeId}
              onChange={handleFeeChange}
            >
              <option value="">Select a fee</option>

              {fees
                .filter((fee) => Number(fee.total) - Number(fee.paid) > 0)
                .map((fee) => {
                  const remaining =
                    Number(fee.total) - Number(fee.paid);

                  return (
                    <option key={fee.id} value={fee.id}>
                      {fee.name} — ₦{remaining.toLocaleString()} remaining
                    </option>
                  );
                })}
            </select>
          </div>

          {selectedFee && (
            <div className="selected-fee-box">
              <div>
                <span>Selected Fee</span>
                <strong>{selectedFee.name}</strong>
              </div>

              <div>
                <span>Total Fee</span>
                <strong>
                  ₦{Number(selectedFee.total).toLocaleString()}
                </strong>
              </div>

              <div>
                <span>Already Paid</span>
                <strong>
                  ₦{Number(selectedFee.paid).toLocaleString()}
                </strong>
              </div>

              <div>
                <span>Remaining</span>
                <strong>₦{selectedFeeRemaining.toLocaleString()}</strong>
              </div>
            </div>
          )}

          {/* Editable amount field */}
          <div className="form-group">
            <label htmlFor="amount">Amount to Pay</label>

            <div className="amount-input-wrapper">
              <span aria-hidden="true">₦</span>

              <input
                id="amount"
                name="amount"
                type="number"
                min="1"
                max={selectedFee ? selectedFeeRemaining : undefined}
                step="any"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  setError("");
                }}
                placeholder="Enter amount"
                disabled={!selectedFee}
                autoComplete="off"
                style={{
                  pointerEvents: "auto",
                  userSelect: "text",
                  cursor: selectedFee ? "text" : "not-allowed",
                  position: "relative",
                  zIndex: 1,
                  width: "100%",
                }}
              />
            </div>

            {selectedFee ? (
              <small>
                Maximum payment: ₦
                {selectedFeeRemaining.toLocaleString()}
              </small>
            ) : (
              <small>Select a fee above to enter an amount.</small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="method">Payment Method</label>

            <select
              id="method"
              name="method"
              value={method}
              onChange={(event) => setMethod(event.target.value)}
            >
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="USSD">USSD</option>
            </select>
          </div>

          <button
            type="button"
            className="primary-button payment-submit"
            onClick={handleContinue}
          >
            Continue to Payment
          </button>
        </div>

        <div className="dashboard-card payment-summary">
          <h3>Account Summary</h3>

          <div className="summary-row">
            <span>Total Fees</span>
            <strong>
              ₦
              {fees
                .reduce((sum, fee) => sum + Number(fee.total), 0)
                .toLocaleString()}
            </strong>
          </div>

          <div className="summary-row">
            <span>Total Paid</span>
            <strong className="text-green">
              ₦
              {fees
                .reduce((sum, fee) => sum + Number(fee.paid), 0)
                .toLocaleString()}
            </strong>
          </div>

          <div className="summary-divider" />

          <div className="summary-row outstanding-row">
            <span>Outstanding</span>
            <strong>₦{Number(outstanding).toLocaleString()}</strong>
          </div>

          <div className="secure-payment-box">
            <span className="secure-icon">🔒</span>
            <div>
              <strong>Secure Payment</strong>
              <p>Your payment information is protected.</p>
            </div>
          </div>
        </div>
      </div>

      {showConfirmation && selectedFee && (
        <div className="payment-confirmation-overlay">
          <div
            className="payment-confirmation-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-confirm-title"
          >
            <div className="confirmation-icon">!</div>

            <h3 id="payment-confirm-title">Confirm Your Payment</h3>
            <p>Please review your payment details before continuing.</p>

            <div className="confirmation-details">
              <div>
                <span>Fee</span>
                <strong>{selectedFee.name}</strong>
              </div>

              <div>
                <span>Amount</span>
                <strong>₦{Number(amount).toLocaleString()}</strong>
              </div>

              <div>
                <span>Payment Method</span>
                <strong>{method}</strong>
              </div>
            </div>

            <div className="confirmation-actions">
              <button
                type="button"
                className="secondary-button"
                disabled={isProcessing}
                onClick={() => setShowConfirmation(false)}
              >
                Go Back
              </button>

              <button
                type="button"
                className="primary-button"
                disabled={isProcessing}
                onClick={handleConfirmPayment}
              >
                {isProcessing ? "Processing..." : "Confirm Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;