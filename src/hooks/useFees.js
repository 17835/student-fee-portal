// ============================================================
// STUDENT FEE PORTAL
// useFees Hook
// ============================================================
// This custom React Hook gets fee information from JSON Server
// using the Axios functions we created in api.js.
//
// It allows our components to easily access:
// - Fee data
// - Loading status
// - Error messages
// - A function to refresh the fee data
// ============================================================

import { useState, useEffect } from "react";

// Import the API function that gets our fees.
import { getFees } from "../services/api";


// ============================================================
// CUSTOM HOOK
// ============================================================

const useFees = () => {

  // ----------------------------------------------------------
  // FEES STATE
  // ----------------------------------------------------------
  // Stores the list of fees received from JSON Server.
  const [fees, setFees] = useState([]);


  // ----------------------------------------------------------
  // LOADING STATE
  // ----------------------------------------------------------
  // True while we are waiting for the server to respond.
  const [loading, setLoading] = useState(true);


  // ----------------------------------------------------------
  // ERROR STATE
  // ----------------------------------------------------------
  // Stores an error message if the API request fails.
  const [error, setError] = useState(null);


  // ==========================================================
  // FETCH FEES
  // ==========================================================
  const fetchFees = async () => {

    try {

      // Start loading.
      setLoading(true);

      // Clear any previous error.
      setError(null);

      // Get the fees from JSON Server.
      const data = await getFees();

      // Save the returned data in React state.
      setFees(data);

    } catch (err) {

      // Show a user-friendly error message.
      setError("Unable to load fee information.");

      console.error("Fee loading error:", err);

    } finally {

      // Loading is finished whether the request
      // succeeded or failed.
      setLoading(false);
    }
  };


  // ==========================================================
  // USE EFFECT
  // ==========================================================
  // This runs automatically when the component using
  // this hook is first loaded.
  useEffect(() => {

    fetchFees();

  }, []);


  // ==========================================================
  // RETURN VALUES
  // ==========================================================
  // Components using this hook can now access these values.
  return {
    fees,
    loading,
    error,

    // Allows a component to manually refresh the data.
    refreshFees: fetchFees,
  };
};


// Export the custom hook.
export default useFees;