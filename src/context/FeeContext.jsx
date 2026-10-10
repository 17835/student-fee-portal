
// ============================================================
// STUDENT FEE PORTAL
// FeeContext.jsx
// ============================================================

// React imports.
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// API functions.
import {
  getFees,
  getTransactions,
  createTransaction,
  updateFee,
} from "../services/api";

// ============================================================
// CREATE CONTEXT
// ============================================================

const FeeContext = createContext();

// ============================================================
// FALLBACK DATA
// All fees start unpaid.
// ============================================================

const initialFees = [
  {
    id: 1,
    name: "Tuition Fee",
    total: 250000,
    paid: 0,
    deadline: "2026-10-15",
    status: "unpaid",
  },
  {
    id: 2,
    name: "Accommodation Fee",
    total: 120000,
    paid: 0,
    deadline: "2026-10-30",
    status: "unpaid",
  },
  {
    id: 3,
    name: "Technology Fee",
    total: 50000,
    paid: 0,
    deadline: "2026-11-05",
    status: "unpaid",
  },
  {
    id: 4,
    name: "Library Fee",
    total: 20000,
    paid: 0,
    deadline: "2026-11-10",
    status: "unpaid",
  },
];

const initialTransactions = [];

// ============================================================
// FEE PROVIDER
// ============================================================

export function FeeProvider({ children }) {

  // ----------------------------------------------------------
  // FEES
  // ----------------------------------------------------------

  const [fees, setFees] = useState(initialFees);

  // ----------------------------------------------------------
  // TRANSACTIONS
  // ----------------------------------------------------------

  const [transactions, setTransactions] = useState(
    initialTransactions
  );

  // ----------------------------------------------------------
  // LOADING
  // ----------------------------------------------------------

  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------------
  // ERROR
  // ----------------------------------------------------------

  const [error, setError] = useState(null);

  // ==========================================================
  // LOAD FEES
  // ==========================================================

  const loadFees = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getFees();

      // Convert database "amount" into the
      // "total" property used by the React app.
      const formattedFees = data.map((fee) => ({
        ...fee,
        total: Number(fee.amount ?? fee.total ?? 0),
        paid: Number(fee.paid ?? 0),
      }));

      setFees(formattedFees);
    } catch (err) {
      console.error(
        "Unable to load fees from JSON Server:",
        err
      );

      setError(
        "Unable to connect to the fee server. Showing saved fee information."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // LOAD TRANSACTIONS
  // Use the API as the source of truth.
  // Do not restore old LocalStorage transactions.
  // ==========================================================

  const loadTransactions = async () => {
    try {
      const data = await getTransactions();

      const freshTransactions = Array.isArray(data)
        ? data
        : [];

      setTransactions(freshTransactions);

      localStorage.setItem(
        "studentFeeTransactions",
        JSON.stringify(freshTransactions)
      );
    } catch (err) {
      console.error(
        "Unable to load transactions from JSON Server:",
        err
      );

      setTransactions([]);

      localStorage.setItem(
        "studentFeeTransactions",
        JSON.stringify([])
      );
    }
  };

  // ==========================================================
  // LOAD DATA WHEN APP STARTS
  // ==========================================================

  useEffect(() => {
    loadFees();
    loadTransactions();
  }, []);

  // ==========================================================
  // TOTAL FEES
  // ==========================================================

  const totalFees = fees.reduce(
    (sum, fee) => sum + Number(fee.total || 0),
    0
  );

  // ==========================================================
  // TOTAL PAID
  // ==========================================================

  const totalPaid = fees.reduce(
    (sum, fee) => sum + Number(fee.paid || 0),
    0
  );

  // ==========================================================
  // OUTSTANDING
  // ==========================================================

  const outstanding = Math.max(
    totalFees - totalPaid,
    0
  );

  // ==========================================================
  // PAYMENT PROGRESS
  // ==========================================================

  const paymentProgress =
    totalFees > 0
      ? Math.round((totalPaid / totalFees) * 100)
      : 0;

  // ==========================================================
  // MAKE PAYMENT
  // ==========================================================

  const makePayment = async ({
    feeId,
    amount,
    method,
  }) => {
    const numericAmount = Number(amount);

    // --------------------------------------------------------
    // FIND SELECTED FEE
    // --------------------------------------------------------

    const selectedFee = fees.find(
      (fee) => String(fee.id) === String(feeId)
    );

    // --------------------------------------------------------
    // VALIDATE FEE
    // --------------------------------------------------------

    if (!selectedFee) {
      return {
        success: false,
        message: "Please select a fee.",
      };
    }

    // --------------------------------------------------------
    // VALIDATE AMOUNT
    // --------------------------------------------------------

    if (!numericAmount || numericAmount <= 0) {
      return {
        success: false,
        message: "Please enter a valid payment amount.",
      };
    }

    // --------------------------------------------------------
    // CALCULATE REMAINING BALANCE
    // --------------------------------------------------------

    const remaining =
      Number(selectedFee.total) -
      Number(selectedFee.paid);

    // --------------------------------------------------------
    // PREVENT OVERPAYMENT
    // --------------------------------------------------------

    if (numericAmount > remaining) {
      return {
        success: false,
        message:
          `Amount cannot be more than ₦${remaining.toLocaleString()}.`,
      };
    }

    // ========================================================
    // DATE
    // ========================================================

    const now = new Date();

    const date = now.toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );

    // ========================================================
    // TRANSACTION REFERENCE
    // ========================================================

    const reference =
      `TXN-${now.getFullYear()}-${Date.now()
        .toString()
        .slice(-6)}`;

    // ========================================================
    // NEW TRANSACTION
    // ========================================================

    const newTransaction = {
      id: Date.now(),
      fee: selectedFee.name,
      amount: numericAmount,
      date,
      reference,
      method: method || "Card",
      status: "Successful",
    };

    // ========================================================
    // SAVE TRANSACTION
    // ========================================================

    let savedTransaction = newTransaction;

    try {
      const response =
        await createTransaction(newTransaction);

      // Use the API response when available.
      savedTransaction = response || newTransaction;
    } catch (err) {
      console.error(
        "Unable to save transaction to JSON Server:",
        err
      );

      // Keep the existing local fallback behavior.
      savedTransaction = newTransaction;
    }

    // ========================================================
    // UPDATE FEE
    // ========================================================

    const newPaidAmount =
      Number(selectedFee.paid) + numericAmount;

    const updatedFee = {
      ...selectedFee,

      // Keep total for the React application.
      total: Number(selectedFee.total),

      // Keep amount for JSON Server.
      amount: Number(selectedFee.total),

      paid: newPaidAmount,
    };

    // ========================================================
    // UPDATE STATUS
    // ========================================================

    if (newPaidAmount >= Number(selectedFee.total)) {
      updatedFee.status = "paid";
    } else if (newPaidAmount > 0) {
      updatedFee.status = "partially-paid";
    } else {
      updatedFee.status = "unpaid";
    }

    // ========================================================
    // SAVE UPDATED FEE TO JSON SERVER
    // ========================================================

    try {
      await updateFee(
        selectedFee.id,
        {
          id: updatedFee.id,
          name: updatedFee.name,
          amount: updatedFee.amount,
          paid: updatedFee.paid,
          deadline: updatedFee.deadline,
          status: updatedFee.status,
        }
      );
    } catch (err) {
      console.error(
        "Unable to update fee on JSON Server:",
        err
      );
    }

    // ========================================================
    // UPDATE REACT FEE STATE
    // ========================================================

    setFees((currentFees) =>
      currentFees.map((fee) =>
        String(fee.id) === String(selectedFee.id)
          ? updatedFee
          : fee
      )
    );

    // ========================================================
    // UPDATE TRANSACTIONS
    // ========================================================

    setTransactions((currentTransactions) => {
      const updatedTransactions = [
        savedTransaction,
        ...currentTransactions,
      ];

      localStorage.setItem(
        "studentFeeTransactions",
        JSON.stringify(updatedTransactions)
      );

      return updatedTransactions;
    });

    // ========================================================
    // RETURN SUCCESS
    // ========================================================

    return {
      success: true,
      transaction: savedTransaction,
    };
  };

  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (
    <FeeContext.Provider
      value={{
        fees,
        transactions,
        totalFees,
        totalPaid,
        outstanding,
        paymentProgress,
        makePayment,
        loading,
        error,
        refreshFees: loadFees,
        refreshTransactions: loadTransactions,
      }}
    >
      {children}
    </FeeContext.Provider>
  );
}

// ============================================================
// useFee HOOK
// ============================================================

export function useFee() {
  const context = useContext(FeeContext);

  if (!context) {
    throw new Error(
      "useFee must be used inside FeeProvider"
    );
  }

  return context;
}

