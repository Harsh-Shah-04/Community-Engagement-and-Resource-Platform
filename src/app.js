import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Community Platform API 🚀");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/issues", issueRoutes);

// Error Handling (should be last)
app.use(notFound);
app.use(errorHandler);

export default app;
