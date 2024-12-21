const express = require("express");
const router = express.Router();
const db = require("../config/db");
const csvParser = require("csv-parser");
const fs = require("fs");
const path = require("path");

// Function to handle CSV upload and database insertion
function handleCsvUpload(req, res, tableName, columnMapping) {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file = req.files.file;
  const uploadPath = path.join(__dirname, "../uploads", file.name);

  // Save file temporarily
  file.mv(uploadPath, (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.status(500).json({ error: "File upload failed" });
    }

    const results = [];

    // Parse CSV file
    fs.createReadStream(uploadPath)
      .pipe(csvParser())
      .on("data", (data) => {
        results.push(data);
      })
      .on("end", () => {
        // Insert the data into the database
        const insertQuery = `
          INSERT INTO ${tableName} (${columnMapping.columns.join(", ")})
          VALUES ?
          ON DUPLICATE KEY UPDATE ${columnMapping.updateColumns.join(", ")}
        `;

        const values = results.map((row) =>
          columnMapping.columns.map((col) => row[col])
        );

        db.query(insertQuery, [values], (err) => {
          if (err) {
            console.error(`Error inserting data into ${tableName}:`, err);
            return res.status(500).json({ error: "Data insertion failed" });
          }

          // Remove temporary file
          fs.unlinkSync(uploadPath);

          res.status(200).json({
            message: `File uploaded and data inserted into ${tableName}`,
          });
        });
      });
  });
}

// Route for uploading data to 'users' table
router.post("/csv/users", (req, res) => {
  const columnMapping = {
    columns: [
      "id",
      "firstName",
      "lastName",
      "email",
      "password",
      "role",
      "createdAt",
    ],
    updateColumns: [
      "firstName = VALUES(firstName)",
      "lastName = VALUES(lastName)",
      "password = VALUES(password)",
      "role = VALUES(role)",
      "createdAt = VALUES(createdAt)",
    ],
  };

  handleCsvUpload(req, res, "users", columnMapping);
});

// Route for uploading data to 'members' table
router.post("/csv/members", (req, res) => {
  const columnMapping = {
    columns: [
      "userId",
      "firstName",
      "lastName",
      "email",
      "referralId",
      "commission",
    ],
    updateColumns: [
      "firstName = VALUES(firstName)",
      "lastName = VALUES(lastName)",
      "email = VALUES(email)",
      "referralId = VALUES(referralId)",
      "commission = VALUES(commission)",
    ],
  };

  handleCsvUpload(req, res, "members", columnMapping);
});

module.exports = router;
