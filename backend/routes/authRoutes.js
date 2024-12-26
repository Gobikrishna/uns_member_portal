const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/authMiddleware"); // Import the JWT authentication middleware "../middleware/authenticateJWT"
const {
  checkUserExists,
  registerUser,
  loginUser,
  forgotPassword,
  getUserData,
  getMemberData,
  getReferralTransactions,
  getReferralMembers,
  getCommissionDetails,
} = require("../controllers/authController");

// Route to check if a user exists by email or mobile
router.post("/check-user", checkUserExists);

// Route to register a new user
router.post("/register", registerUser);

// Route to log in a user
router.post("/login", loginUser);

// Route to handle forgot password requests
router.post("/forgot-password", forgotPassword);

// Route to get member data by user ID (Protected route)
router.get("/user/:userId", authenticateJWT, getUserData);

// Route to get member data by user ID (Protected route)
router.get("/members/:userId", authenticateJWT, getMemberData);

// Route to get referral transactions by user ID (Protected route)
router.get("/transactions/:userId", authenticateJWT, getReferralTransactions);

// Route to get referral members by user ID (Protected route)
router.get("/referral-members/:userId", authenticateJWT, getReferralMembers);

// Route to get commission details by user ID (Protected route)
router.get(
  "/commission-details/:userId",
  authenticateJWT,
  getCommissionDetails
);

module.exports = router;
