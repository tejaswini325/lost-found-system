import "dotenv/config.js";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/auth.js";
import itemRoutes from "./routes/items.js";
import adminRoutes from "./routes/admin.js";
import notificationRoutes from "./routes/Notification.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: [
    "https://lost-found-system-puce.vercel.app",     // user frontend
    "https://lost-found-system-puce.vercel.app/admin",          // ADD THIS - admin frontend URL
    "https://lost-found-system-p9dw.onrender.com",                            // user local
    "https://lost-found-system-p9dw.onrender.com"                             // ADD THIS - admin local
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://LF_db_user:EojgXh2EKr1AtLkq@cluster0.ewobb1o.mongodb.net/?appName=Cluster0";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    if (err.name === "MongooseServerSelectionError") {
      console.error("\n💡 HINT: This is likely an IP Whitelist issue in MongoDB Atlas.");
      console.error("Please add your current IP address to the whitelist at: https://cloud.mongodb.com/");
    }
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notification", notificationRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start Server (ONLY ONCE)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health`);
});
