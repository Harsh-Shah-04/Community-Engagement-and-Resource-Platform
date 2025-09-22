import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Welcome to Community Platform API 🚀");
});

export default app;
