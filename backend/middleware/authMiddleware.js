const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from "Bearer <token>"
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied, No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded; // Attach user info (decoded JWT payload) to request object
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateJWT;
