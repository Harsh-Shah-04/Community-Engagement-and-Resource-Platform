import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved"],
      default: "open",
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    category: {
      type: String,
      enum: [
        'infrastructure', 
        'sanitation', 
        'transportation', 
        'utilities', 
        'environment', 
        'safety', 
        'other'
      ],
      default: 'other'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // link issue to the user who created it
      required: true,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
