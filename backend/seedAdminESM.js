import mongoose from "mongoose";
import "dotenv/config.js";
import Admin from "./models/Admin.js";

const seedAdmin = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://LF_db_user:EojgXh2EKr1AtLkq@cluster0.ewobb1o.mongodb.net/?appName=Cluster0";

        await mongoose.connect(MONGODB_URI);
        console.log("✅ MongoDB Connected");

        const adminExists = await Admin.findOne({ email: "admin@test.com" });

        if (adminExists) {
            console.log("ℹ️ Admin already exists");
            process.exit();
        }

        await Admin.create({
            name: "Super Admin",
            email: "admin@test.com",
            password: "password123",
            role: "superadmin",
            permissions: ["users", "items", "reports", "settings"],
        });

        console.log("✅ Admin created successfully");
        console.log("📧 Email: admin@test.com");
        console.log("🔑 Password: password123");
        process.exit();
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
