import mongoose from "mongoose";

// You can remove dotenv if you're not using environment variables
// import dotenv from "dotenv";
// dotenv.config();

const MONGO_URI = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/yourDatabaseName";

const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB successfully!");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit process if connection fails
    }
};

export default connectMongoDB;
