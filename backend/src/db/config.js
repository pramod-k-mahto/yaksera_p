import mongoose from "mongoose";

const connectDb = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new Error("DB_URL is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.DB_URL, {
      dbName: "yaksera",
    });

    console.log(`Database connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error while connecting to database:", error.message);
    process.exit(1);
  }
};

export default connectDb;
