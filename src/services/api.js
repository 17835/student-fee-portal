// ============================================================
// STUDENT FEE PORTAL
// api.js
// ============================================================

// Axios is used to communicate with JSON Server.
import axios from "axios";

// ============================================================
// AXIOS CONFIGURATION
// ============================================================

const API = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// FEES
// ============================================================

// Get all fees from JSON Server.
export const getFees = async () => {
  const response = await API.get("/fees");
  return response.data;
};

// Update a fee.
export const updateFee = async (id, feeData) => {
  const response = await API.put(`/fees/${id}`, feeData);
  return response.data;
};

// ============================================================
// TRANSACTIONS
// ============================================================

// Get all transactions.
export const getTransactions = async () => {
  const response = await API.get("/transactions");
  return response.data;
};

// Create a new transaction.
export const createTransaction = async (transactionData) => {
  const response = await API.post(
    "/transactions",
    transactionData
  );

  return response.data;
};

// ============================================================
// EXPORT API
// ============================================================

export default API;