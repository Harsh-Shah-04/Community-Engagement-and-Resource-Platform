import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Community Platform API 🚀");
});

// User routes
app.use("/api/users", userRoutes);

// Complaint routes
app.use("/api/complaints", complaintRoutes);

export default app;
