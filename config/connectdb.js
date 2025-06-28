import mongoose from "mongoose";

/**
 * Establishes a connection to MongoDB using Mongoose
 * @param {string} dbUrl - MongoDB connection URI
 * @returns {Promise<void>} Resolves when connected or rejects on error
 */
const connectDB = async (dbUrl) => {
  try {
    const conn = await mongoose.connect(dbUrl, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout for initial connection
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    // Exit process with failure code
    process.exit(1);
  }
};

export default connectDB;
