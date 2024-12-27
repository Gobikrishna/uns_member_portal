const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
// (Registration, Login, Forgot Password):

// Check if User Exists by Email or Mobile

exports.checkUserExists = (req, res) => {
  const { email, mobile } = req.body;

  const checkQuery = `SELECT * FROM users WHERE email = ? OR mobile = ?`;
  db.query(checkQuery, [email, mobile], (err, result) => {
    if (err) {
      console.error("Error checking user existence:", err);
      return res.status(500).json({ error: "Server error" });
    }
    if (result.length > 0) {
      return res.status(400).json({
        error: "User already exists with this email or mobile number.",
      });
    }
    res.status(200).json({ message: "User does not exist, safe to proceed." });
  });
};

// User Registration

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, role, mobile, referredBy } =
    req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("referredBy", referredBy);
    // If the role is "Primary", ensure referredBy is null
    const referralId = role === "Primary" ? null : referredBy;
    console.log("referralId==>", referralId + " and role is " + role);
    // Start a transaction to ensure consistency between `users` and `members` tables
    db.beginTransaction(async (transactionError) => {
      if (transactionError) {
        console.error("Error starting transaction:", transactionError);
        return res.status(500).json({ error: "Server error" });
      }

      try {
        // Insert user into the `users` table
        const userQuery = `INSERT INTO users (firstName, lastName, email, password, role, mobile, referredBy) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.query(
          userQuery,
          [
            firstName,
            lastName,
            email,
            hashedPassword,
            role,
            mobile,
            referralId, // Use referralId here instead of referredBy
          ],
          (userErr, userResult) => {
            if (userErr) {
              db.rollback(() => {
                if (userErr.code === "ER_DUP_ENTRY") {
                  return res
                    .status(400)
                    .json({ error: "Email or mobile number already exists." });
                }
                console.error("Error inserting user:", userErr);
                return res.status(500).json({ error: "Server error" });
              });
            } else {
              // Insert member into the `members` table
              const userId = userResult.insertId; // Get the inserted user's ID
              const memberQuery = `INSERT INTO members (userId, firstName, lastName, email, role, referralId) VALUES (?, ?, ?, ?, ?, ?)`;

              db.query(
                memberQuery,
                [
                  userId,
                  firstName,
                  lastName,
                  email,
                  role === "Primary" ? "Secondary" : role, // Default to Secondary if role is Primary
                  referralId, // Use referralId here instead of referredBy
                ],
                (memberErr, memberResult) => {
                  if (memberErr) {
                    db.rollback(() => {
                      console.error("Error inserting member:", memberErr);
                      return res.status(500).json({ error: "Server error" });
                    });
                  } else {
                    // Commit the transaction if both inserts succeed
                    db.commit((commitErr) => {
                      if (commitErr) {
                        console.error(
                          "Error committing transaction:",
                          commitErr
                        );
                        return res.status(500).json({ error: "Server error" });
                      }
                      res.status(201).json({
                        message:
                          "User registered and member record created successfully",
                      });
                    });
                  }
                }
              );
            }
          }
        );
      } catch (error) {
        db.rollback(() => {
          console.error("Error during registration transaction:", error);
          res.status(500).json({ error: "Server error" });
        });
      }
    });
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ error: "Server error" });
  }
};
// User Registration
// exports.registerUser = async (req, res) => {
//   const { firstName, lastName, email, password, role, mobile } = req.body;

//   try {
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert user into the database
//     const userQuery = `INSERT INTO users (firstName, lastName, email, password, role, mobile) VALUES (?, ?, ?, ?, ?, ?)`;

//     db.query(
//       userQuery,
//       [
//         firstName,
//         lastName,
//         email,
//         hashedPassword,
//         role,
//         mobile,
//         referredBy || null,
//       ],
//       (userErr, userResult) => {
//         if (userErr) {
//           if (userErr.code === "ER_DUP_ENTRY") {
//             return res
//               .status(400)
//               .json({ error: "Mobile number already exists." });
//           }
//           console.error("Error inserting user:", userErr);
//           return res.status(500).json({ error: "Server error" });
//         }
//         res.status(201).json({ message: "User registered successfully" });
//       }
//     );
//   } catch (error) {
//     console.error("Error hashing password:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };
// exports.registerUser = async (req, res) => {
//   const { firstName, lastName, email, password, role, mobile } = req.body;

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const query = `INSERT INTO users (firstName, lastName, email, password, role, mobile) VALUES (?, ?, ?, ?, ?, ?)`;

//   db.query(
//     query,
//     [firstName, lastName, email, hashedPassword, role, mobile],
//     (err, result) => {
//       if (err) {
//         console.error("Error inserting user:", err);
//         return res.status(500).json({ error: "Server error" });
//       }
//       res.status(201).json({ message: "User registered successfully" });
//     }
//   );
// };

// User Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Generate a JWT token

  console.log("backend side--->" + email + password);
  const query = "SELECT * FROM users WHERE email = ?";
  console.log("Login query", query);
  db.query(query, [email], async (err, result) => {
    console.log("entered");
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (result.length === 0) {
      return res.status(400).json({ msg: "User not found" });
    }

    const user = result[0];
    console.log(user.password + "===" + password);
    const isMatch = await bcrypt.compare(password, user.password);
    // const isMatch = await bcrypt.compare(password.trim(), user.password.trim());

    // const isMatch = await bcrypt.compare(password, user.password);
    console.log("Passwords match:", isMatch);

    // if (password !== user.password) {
    //   return res.status(400).json({ msg: "Invalid credentials" });
    // }

    // // console.log(isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = { userId: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("mytoken" + token);
    // res.json({ token });
    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  });
};

// Get User Data
exports.getUserData = (req, res) => {
  const id = req.params.userId; // Get user id from the URL parameter

  // Query to get the member's data
  const query = "SELECT * FROM users WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return user data
    res.json(result[0]); // Assuming we want to return the first matching member
  });
};

// Get Member Data
exports.getMemberData = (req, res) => {
  const userId = req.params.userId; // Get userId from the URL parameter
  // const role = req.query.role; // Get role from query parameter
  const role = req.headers.role;
  console.log("user details", req.params);
  console.log("userId", userId + " " + "userRole", role);
  // New query to fetch member data based on referralId
  const query = `
    SELECT * 
    FROM members 
    WHERE referralId = (SELECT id FROM members WHERE userId = ? AND role = ?)
  `;

  // Execute the query with the userId parameter
  db.query(query, [userId, role], (err, result) => {
    if (err) {
      console.error("Error fetching member data:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ msg: "No members found for the given referralId" });
    }

    // Return the member data
    res.json(result); // Return all matching members (not just the first)
  });
};

// Get Referral Members for a Primary Member
exports.getReferralMembers = (req, res) => {
  const userId = req.params.userId; // Get userId from the URL parameter

  // Query to get the referral members (i.e., secondary members) for the primary member
  const query = `
    SELECT 
      m.id AS MemberID,
      u.firstName AS MemberFirstName,
      u.lastName AS MemberLastName,
      u.email AS MemberEmail,
      m.role AS MemberRole
    FROM members m
    JOIN users u ON m.userId = u.id
    WHERE m.referralId = ?;  -- Only get secondary members referred by this user
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching referral members:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ msg: "No referral members found" });
    }

    res.json(result); // Return the list of referral members
  });
};

// Get Referral Transactions for a User
exports.getReferralTransactions = (req, res) => {
  const userId = req.params.userId; // Get userId from the URL parameter
  console.log(userId);
  // Query to get the referral transactions for the user
  const query = `
    SELECT * FROM transactions WHERE memberId = ?
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching referral transactions:", err);
      return res.status(500).json({ error: "Server error" });
    }

    // Return transactions
    res.json(result); // Return the list of transactions
  });
};

// Forgot Password
exports.forgotPassword = (req, res) => {
  res
    .status(200)
    .json({ msg: "Forgot Password feature is under construction" });
};

// Get Commission Details
exports.getCommissionDetails = (req, res) => {
  const userId = req.params.userId;
  // Commission Query: Automates commission calculations based on your business rules.
  const query = `
    SELECT 
        u1.firstName AS PrimaryMember,
        u2.firstName AS SecondaryMember,
        t.product AS Product,
        t.price AS ProductPrice,
        CASE 
            WHEN u1.role = 'primary' AND u2.role = 'secondary' THEN t.price * 0.10
            WHEN u2.role = 'secondary' AND EXISTS (
                SELECT 1 FROM members m WHERE m.userId = u1.id AND m.id IN (
                    SELECT memberId FROM transactions WHERE memberId = t.memberId
                )
            ) THEN t.price * 0.05
        END AS Commission
    FROM transactions t
    JOIN members m1 ON t.memberId = m1.id
    JOIN members m2 ON m1.referralId = m2.referralId
    JOIN users u1 ON m2.userId = u1.id
    JOIN users u2 ON m1.userId = u2.id
    WHERE u1.id = ?;
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching commission details:", err);
      return res.status(500).json({ error: "Server error" });
    }

    res.json(result);
  });
};
