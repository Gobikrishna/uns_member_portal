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

  // Validate input
  if (!firstName || !lastName || !email || !mobile || !role) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // Check if password is provided for specific roles
  if (
    (!password || password.trim() === "") &&
    (role === "primary" || role === "secondary" || role === "direct referral")
  ) {
    return res.status(400).json({ error: "Password is required." });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Function to handle user insertion
    const insertUser = () => {
      // If the role is "Primary", ensure referredBy is null
      const referralId = role === "primary" ? null : referredBy;

      db.beginTransaction((transactionError) => {
        if (transactionError) {
          console.error("Error starting transaction:", transactionError);
          return res.status(500).json({ error: "Server error" });
        }

        try {
          // Insert user into the users table
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
              referralId,
            ],
            (userErr, userResult) => {
              if (userErr) {
                db.rollback(() => {
                  if (userErr.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                      error: "Email or mobile number already exists.",
                    });
                  }
                  console.error("Error inserting user:", userErr);
                  return res.status(500).json({ error: "Server error" });
                });
              } else {
                // Insert member into the members table
                const userId = userResult.insertId; // Get the inserted user's ID
                const memberQuery = `INSERT INTO members (userId, firstName, lastName, email, role, mobile, referralId) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                db.query(
                  memberQuery,
                  [
                    userId,
                    firstName,
                    lastName,
                    email,
                    role === "Primary" ? "Secondary" : role,
                    mobile,
                    referralId,
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
                          return res
                            .status(500)
                            .json({ error: "Server error" });
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
    };

    // Check if the role is "direct referral" and validate the count
    if (role === "direct referral") {
      const countQuery = `SELECT COUNT(*) AS directReferralCount FROM users WHERE referredBy = ? AND role = 'direct referral'`;
      db.query(countQuery, [referredBy], (countErr, countResult) => {
        if (countErr) {
          console.error("Error checking direct referral count:", countErr);
          return res.status(500).json({ error: "Server error" });
        }

        const directReferralCount = countResult[0].directReferralCount;
        if (directReferralCount >= 10) {
          return res.status(400).json({
            error: "Cannot register more than 10 direct referral members.",
          });
        }

        // Proceed with user registration if the count is less than 10
        insertUser();
      });
    } else {
      // If the role is not "direct referral," proceed with user registration
      insertUser();
    }
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Generate a JWT token

  console.log("backend side--->" + email + password);
  const query = "SELECT * FROM users WHERE email = ?";
  // console.log("Login query", query);
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

// Get User Details
exports.getUserDetails = (req, res) => {
  const id = req.params.userId; // Get user ID from the URL parameter

  // Query to get only the user_details column
  const query = "SELECT user_details FROM users WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching user details:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Handle user_details
    const userDetailsRaw = result[0].user_details;

    try {
      // Parse only if it's a string
      const userDetails =
        typeof userDetailsRaw === "string"
          ? JSON.parse(userDetailsRaw)
          : userDetailsRaw;
      res.json({ user_details: userDetails });
    } catch (err) {
      console.error("Invalid JSON in user_details:", userDetailsRaw);
      res.status(500).json({ error: "Invalid JSON in user_details" });
    }
  });
};

// Update User Details
exports.updateUserDetails = (req, res) => {
  const userId = req.params.userId; // Get the user id from URL parameter
  const userDetails = req.body.user_details; // Get the user details from request body

  console.log("userDetails", userDetails);
  if (!userDetails || typeof userDetails !== "object") {
    return res.status(400).json({ error: "Invalid user details format" });
  }

  // Query to update the user_details JSON column
  const query = `
    UPDATE users 
    SET user_details = ? 
    WHERE id = ?
  `;

  db.query(query, [JSON.stringify(userDetails), userId], (err, result) => {
    if (err) {
      console.error("Error updating user details:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User details updated successfully" });
  });
};

// Change Passwored Settings
exports.changePassword = async (req, res) => {
  const userId = req.params.userId; // Retrieve the user ID from the URL parameter
  console.log("settings", userId);
  const { oldPassword, newPassword } = req.body; // Extract old and new passwords from the request body

  try {
    // Fetch the user from the database using the provided user ID
    const query = "SELECT * FROM users WHERE id = ?";
    db.query(query, [userId], async (err, result) => {
      if (err) {
        console.error("Database error:", err); // Log database errors for debugging
        return res.status(500).json({ error: "Server error" }); // Return a 500 response for server errors
      }

      if (result.length === 0) {
        // If no user is found, respond with a 404 error
        return res.status(404).json({ error: "User not found" });
      }

      const user = result[0];
      const isMatch = await bcrypt.compare(oldPassword, user.password); // Compare the old password with the stored hash

      if (!isMatch) {
        // If the old password doesn't match, return a 400 error
        return res.status(400).json({ error: "Old password is incorrect" });
      }

      // Hash the new password with a salt factor of 10
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password in the database
      const updateQuery = "UPDATE users SET password = ? WHERE id = ?";
      db.query(updateQuery, [hashedPassword, userId], (updateErr) => {
        if (updateErr) {
          console.error("Error updating password:", updateErr); // Log errors during the update process
          return res.status(500).json({ error: "Server error" }); // Respond with a 500 error for update failures
        }

        // Respond with success when the password is successfully updated
        res.status(200).json({ message: "Password updated successfully" });
      });
    });
  } catch (error) {
    console.error("Error processing password change:", error); // Catch and log unexpected errors
    res.status(500).json({ error: "Server error" }); // Respond with a 500 error for unexpected failures
  }
};

// Admin - Get all the primary User Data
exports.getPrimaryUserData = (req, res) => {
  const id = req.params.userId; // Get user id from the URL parameter

  // Query to get the member's data
  const query = "SELECT * FROM users WHERE role = 'primary'";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (result.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return user data
    res.json({ users: result }); // Assuming we want to return the first matching member
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
    SELECT * FROM transactions WHERE referredBy = ?
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

// //  view details for a particular primary member Filter by a Specific Primary Member
// exports.getPrimaryMemberTotalCommissions = (req, res) => {
//   const userId = req.params.userId; // Get userId from the URL parameter
//   console.log(userId);
//   // Commission Query: Automates commission calculations based on your business rules.
//   const query = `
//   SELECT
//     CONCAT(m.firstName, ' ', m.lastName) AS PrimaryMember,
//     SUM(t.referralIncome) AS TotalPrimaryCommission,
//     COUNT(t.id) AS TotalTransactions
// FROM
//     transactions t
// JOIN
//     members m ON m.id = t.memberId
// WHERE
//     t.referralPerson IN (
//         SELECT CONCAT(firstName, ' ', lastName)
//         FROM members
//         WHERE referralId = ?  -- Replace '2' with the primary member's ID
//     )
//     OR t.referralPerson = (
//         SELECT CONCAT(firstName, ' ', lastName)
//         FROM members
//         WHERE id = ?  -- Replace '2' with the primary member's ID
//     )
// GROUP BY
//     PrimaryMember;

//   `;

//   db.query(query, [userId], (err, result) => {
//     if (err) {
//       console.error("Error fetching commission details:", err);
//       return res.status(500).json({ error: "Server error" });
//     }

//     res.json(result);
//   });
// };

// // Get Commission Details
// exports.getCommissionDetails = (req, res) => {
//   const userId = req.params.userId;
//   // Commission Query: Automates commission calculations based on your business rules.
//   const query = `
//     SELECT
//         u1.firstName AS PrimaryMember,
//         u2.firstName AS SecondaryMember,
//         t.product AS Product,
//         t.price AS ProductPrice,
//         CASE
//             WHEN u1.role = 'primary' AND u2.role = 'secondary' THEN t.price * 0.10
//             WHEN u2.role = 'secondary' AND EXISTS (
//                 SELECT 1 FROM members m WHERE m.userId = u1.id AND m.id IN (
//                     SELECT memberId FROM transactions WHERE memberId = t.memberId
//                 )
//             ) THEN t.price * 0.05
//         END AS Commission
//     FROM transactions t
//     JOIN members m1 ON t.memberId = m1.id
//     JOIN members m2 ON m1.referralId = m2.referralId
//     JOIN users u1 ON m2.userId = u1.id
//     JOIN users u2 ON m1.userId = u2.id
//     WHERE u1.id = ?;
//   `;

//   db.query(query, [userId], (err, result) => {
//     if (err) {
//       console.error("Error fetching commission details:", err);
//       return res.status(500).json({ error: "Server error" });
//     }

//     res.json(result);
//   });
// };

// Insert Hierarchical Commission with Product Name
exports.insertHierarchicalCommission = async (req, res) => {
  let userId, amount, productName;

  if (req.body.transactionFormState) {
    ({ userId, amount, productName } = req.body.transactionFormState);
  } else if (req.body.formState) {
    ({ userId, amount, productName } = req.body.formState);
  } else {
    return res.status(400).json({
      message: "Both transactionFormState and formState are missing.",
    });
  }

  console.log("insertHierarchicalCommission Entered!", req.body);
  console.log("userId", userId, "amount", amount, "productName", productName);

  try {
    // Step 1: Get the direct referrer and their role
    const [directReferrerResult] = await db
      .promise()
      .query("SELECT referredBy, role FROM users WHERE id = ?", [userId]);
    const directReferrerId = directReferrerResult[0]?.referredBy;
    const userRole = directReferrerResult[0]?.role;

    if (!directReferrerId) {
      return res.status(400).json({ error: "Direct referrer not found" });
    }

    // Step 2: Check the role of the direct referrer
    const [directReferrerRoleResult] = await db
      .promise()
      .query("SELECT role FROM users WHERE id = ?", [directReferrerId]);
    const directReferrerRole = directReferrerRoleResult[0]?.role;

    if (
      userRole === "indirect referral" &&
      directReferrerRole === "secondary"
    ) {
      // Case 1: Indirect referral referred by secondary
      // Secondary gets 10%, Primary gets no commission
      const secondaryCommission = amount * 0.1;
      await db.promise().query(
        `INSERT INTO transactions 
        (userId, referredBy, productName, amount, commissionEarned, commissionTo, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [
          userId,
          directReferrerId,
          productName,
          amount,
          secondaryCommission,
          directReferrerId,
        ]
      );

      // End process here since the primary gets no commission
      return res
        .status(201)
        .json({ message: "Commission added for secondary only." });
    }

    // Step 3: Handle other roles and commissions
    if (
      userRole === "indirect referral" &&
      directReferrerRole === "direct referral"
    ) {
      // Case 2: Indirect referral referred by direct referral
      // Direct referral gets 10%, Primary gets 5%
      const directCommission = amount * 0.1;
      await db.promise().query(
        `INSERT INTO transactions 
        (userId, referredBy, productName, amount, commissionEarned, commissionTo, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [
          userId,
          directReferrerId,
          productName,
          amount,
          directCommission,
          directReferrerId,
        ]
      );

      const [primaryReferrerResult] = await db
        .promise()
        .query("SELECT referredBy FROM users WHERE id = ?", [directReferrerId]);
      const primaryReferrerId = primaryReferrerResult[0]?.referredBy;

      if (primaryReferrerId) {
        const primaryCommission = amount * 0.05;
        await db.promise().query(
          `INSERT INTO transactions 
          (userId, referredBy, productName, amount, commissionEarned, commissionTo, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          [
            userId,
            primaryReferrerId,
            productName,
            amount,
            primaryCommission,
            primaryReferrerId,
          ]
        );
      }
    } else if (userRole === "direct referral") {
      // Case 3: Direct referral purchase
      // Primary gets 10%
      const [primaryReferrerResult] = await db
        .promise()
        .query("SELECT referredBy FROM users WHERE id = ?", [userId]);
      const primaryReferrerId = primaryReferrerResult[0]?.referredBy;

      if (primaryReferrerId) {
        const primaryCommission = amount * 0.1;
        await db.promise().query(
          `INSERT INTO transactions 
          (userId, referredBy, productName, amount, commissionEarned, commissionTo, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          [
            userId,
            primaryReferrerId,
            productName,
            amount,
            primaryCommission,
            primaryReferrerId,
          ]
        );
      }
    } else if (userRole === "secondary") {
      // Case 4: Secondary purchase
      // Primary gets 10%
      const [primaryReferrerResult] = await db
        .promise()
        .query("SELECT referredBy FROM users WHERE id = ?", [userId]);
      const primaryReferrerId = primaryReferrerResult[0]?.referredBy;

      if (primaryReferrerId) {
        const primaryCommission = amount * 0.1;
        await db.promise().query(
          `INSERT INTO transactions 
          (userId, referredBy, productName, amount, commissionEarned, commissionTo, createdAt) 
           VALUES (?, ?, ?, ?, ?, ?, NOW())`,
          [
            userId,
            primaryReferrerId,
            productName,
            amount,
            primaryCommission,
            primaryReferrerId,
          ]
        );
      }
    }

    // Return success response
    res.status(201).json({ message: "Commission details added successfully" });
  } catch (err) {
    console.error("Error inserting hierarchical commission:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get Referral Transaction Details for a Specific User
exports.getReferralTransactionDetails = async (req, res) => {
  const { userId } = req.params; // Get userId from request params

  try {
    // Query to get all transactions related to the user
    const [transactions] = await db.promise().query(
      `
      SELECT * 
      FROM transactions 
      WHERE userId = ? OR referredBy = ?
      ORDER BY createdAt DESC
      `,
      [userId, userId]
    );

    if (transactions.length === 0) {
      return res
        .status(404)
        .json({ message: "No transactions found for this user." });
    }

    res.status(200).json({
      message: "Transactions retrieved successfully.",
      transactions,
    });
  } catch (err) {
    console.error("Error fetching referral transactions:", err);
    res.status(500).json({ error: "Server error." });
  }
};
