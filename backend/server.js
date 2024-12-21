const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const fileUpload = require("express-fileupload");
const uploadRoutes = require("./routes/uploadRoutes");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming JSON requests

app.use(fileUpload()); // Enable file uploads

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes); // New upload route

// Default PORT
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} run by GK`);
});
