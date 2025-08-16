const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = require("express")();
app.use(require("express").json());
app.use(cookieParser()); // Middleware to parse cookies

const authUser = (req, res, next) => {
  const { token } = req.cookies; // Access the token from cookies
  console.log("Token from cookies:", token);
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, "aman@123"); // Verify the token
    req.user = decoded; // Attach user info to request object
    console.log("Decoded token:", decoded);
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authUser; // Export the middleware for use in other files
