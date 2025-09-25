import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to Community Platform API 🚀");
});

// User routes
app.use("/api/users", userRoutes);

// Complaint routes (our implementation)
app.use("/api/complaints", complaintRoutes);

// Issue routes (from remote)
app.use("/api/issues", issueRoutes);

export default app;
