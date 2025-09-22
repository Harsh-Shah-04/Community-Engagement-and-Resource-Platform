import mongoose from "mongoose";

// Step 1: Define schema (like blueprint for a user)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // name must be provided
    },
    email: {
      type: String,
      required: true,
      unique: true,   // no two users with same email
    },
    password: {
      type: String,
      required: true, // password must exist
    },
    role: {
      type: String,
      enum: ["user", "admin"], // only two roles
      default: "user",
    }
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

// Step 2: Make a model (User = collection "users")
const User = mongoose.model("User", userSchema);

export default User;
