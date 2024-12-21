const express = require("express");
const router = express.Router();
const {
  checkUserExists,
  registerUser,
  loginUser,
  forgotPassword,
  getMemberData,
  getReferralTransactions,
  getReferralMembers,
  getCommissionDetails,
} = require("../controllers/authController");
// const membersController = require("../controllers/membersController");
// const transactionsController = require("../controllers/transactionsController");

// Route to check if a user exists by email or mobile
router.post("/check-user", checkUserExists);

// Route to register a new user
router.post("/register", registerUser);

// Route to log in a user
router.post("/login", loginUser);

// Route to handle forgot password requests
router.post("/forgot-password", forgotPassword);

// Route to get member data by user ID
router.get("/members/:userId", getMemberData);

// Route to get referral transactions by user ID
router.get("/transactions/:userId", getReferralTransactions);

// // Route to get member hierarchy by user ID
// router.get("/member-hierarchy/:userId", getReferralMembers);

// Route to get referral members by user ID (updated endpoint)
// router.get("/referral-members/:userId", getReferralMembers);

// Route to get commission details by user ID
router.get("/commission-details/:userId", getCommissionDetails);

module.exports = router;
