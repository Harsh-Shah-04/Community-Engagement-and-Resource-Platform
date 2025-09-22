import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"; // 👈 import routes

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Community Platform API 🚀");
});

// User routes
app.use("/api/users", userRoutes);  // 👈 add this

export default app;
