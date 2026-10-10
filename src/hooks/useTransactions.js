// ============================================================
// STUDENT FEE PORTAL
// useTransactions Hook
// ============================================================
// This custom React Hook manages payment transactions.
//
// It allows the application to:
// - Load transaction history
// - Add new transactions
// - Refresh transaction data
// - Track loading and errors
//
// Data is stored through JSON Server.
// ============================================================

import { useState, useEffect } from "react";

import {
  getTransactions,
  createTransaction,
} from "../services/api";


// ============================================================
// CUSTOM HOOK
// ============================================================

const useTransactions = () => {

  // ----------------------------------------------------------
  // TRANSACTION STATE
  // ----------------------------------------------------------
  const [transactions, setTransactions] = useState([]);


  // ----------------------------------------------------------
  // LOADING STATE
  // ----------------------------------------------------------
  const [loading, setLoading] = useState(true);


  // ----------------------------------------------------------
  // ERROR STATE
  // ----------------------------------------------------------
  const [error, setError] = useState(null);


  // ==========================================================
  // FETCH TRANSACTIONS
  // ==========================================================

  const fetchTransactions = async () => {

    try {

      setLoading(true);

      setError(null);

      // Request transaction history from JSON Server.
      const data = await getTransactions();

      // Store the returned transactions.
      setTransactions(data);

    } catch (err) {

      setError("Unable to load transaction history.");

      console.error(
        "Transaction loading error:",
        err
      );

    } finally {

      setLoading(false);
    }
  };


  // ==========================================================
  // ADD TRANSACTION
  // ==========================================================
  // This function is called after a successful mock payment.

  const addTransaction = async (transaction) => {

    try {

      setError(null);

      // Send the payment to JSON Server.
      const newTransaction =
        await createTransaction(transaction);

      // Add the newly created transaction to the
      // existing React state immediately.
      setTransactions((previousTransactions) => [
        ...previousTransactions,
        newTransaction,
      ]);

      return newTransaction;

    } catch (err) {

      setError("Unable to save the transaction.");

      console.error(
        "Transaction creation error:",
        err
      );

      throw err;
    }
  };


  // ==========================================================
  // INITIAL DATA LOAD
  // ==========================================================

  useEffect(() => {

    fetchTransactions();

  }, []);


  // ==========================================================
  // RETURN VALUES
  // ==========================================================

  return {
    transactions,
    loading,
    error,

    // Used when we want to manually reload transactions.
    refreshTransactions: fetchTransactions,

    // Used after a successful payment.
    addTransaction,
  };
};


// Export the custom hook.
export default useTransactions;