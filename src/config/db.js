import dotenv from "dotenv";

import mongoose from "mongoose";
dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log("Connecting to:", uri);

    if (!uri) {
      throw new Error("❌ MONGO_URI is missing in .env file");
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
