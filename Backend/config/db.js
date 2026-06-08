import mongoose from "mongoose";
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.warn("MONGO_URI not set. Skipping MongoDB connection (development mode).");
      return;
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't exit the process in development — allow the server to start for local frontend/dev testing.
    if (process.env.NODE_ENV === 'production') process.exit(1);
  }
};

export default connectDB;