import axios from "axios";

// Create an Axios instance with common settings
const apiClient = axios.create({
  baseURL: "http://localhost:5001/api",
  timeout: 10000, // optional timeout
});

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Replace with your token storage logic
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Define API call functions
export const fetchUserData = (userId) => apiClient.get(`/auth/user/${userId}`);

export const fetchMembers = (userId, role) =>
  apiClient.get(`/auth/members/${userId}`, {
    headers: { Role: role },
  });

export const fetchTransactions = (userId) =>
  apiClient.get(`/auth/transactions/${userId}`);

export const fetchReferralMembers = (userId) =>
  apiClient.get(`/auth/referral-members/${userId}`);

export const fetchReferralTransactions = (userId) =>
  apiClient.get(`/auth/referral-transactions/${userId}`);

export const fetchCommissionDetails = (userId) =>
  apiClient.get(`/auth/commission-details/${userId}`);
