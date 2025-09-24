import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes (only authenticated users can access)
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers (Authorization: Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token and attach to req
    req.user = await User.findById(decoded.userId).select("-password");
    
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next(); // proceed to next middleware/route
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
