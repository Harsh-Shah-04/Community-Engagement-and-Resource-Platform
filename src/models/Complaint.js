import mongoose from "mongoose";

// Define schema for complaints
const complaintSchema = new mongoose.Schema(
  {
    headline: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    photo: {
      data: {
        type: Buffer,
        required: false
      }, // store image as binary data in MongoDB
      contentType: {
        type: String,
        required: false
      } // store mime type (image/jpeg, image/png, etc.)
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "resolved", "rejected"],
      default: "pending",
    },
    category: {
      type: String,
      enum: ["roads", "drainage", "electricity", "water", "waste", "other"],
      default: "other",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    }
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

// Create model (Complaint = collection "complaints")
const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;