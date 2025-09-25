import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Simple auth middleware (main one used in routes)
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");
    req.user = decoded; // This now contains { id, role } from login
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Enhanced middleware (if needed later)
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");
    
    // Get user from token and attach to req
    req.user = await User.findById(decoded.id).select("-password"); // Use decoded.id not decoded.userId
    
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default authMiddleware;
