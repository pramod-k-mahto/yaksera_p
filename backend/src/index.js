import "./config/.env.js";
import app from "./app.js";
import connectDb from "./db/config.js";

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`App is running at port number ${PORT}`);

      // ✅ Start keep-alive AFTER server is up (Render free tier)
      setInterval(() => {
        fetch("https://yaksera.onrender.com/health")
          .then(() => console.log("Keep-alive ping sent"))
          .catch((err) => console.warn("Keep-alive failed:", err.message));
      }, 14 * 60 * 1000); // every 14 minutes
    });
  } catch (error) {
    console.log("Error while running the server", error);
  }
};

startServer();