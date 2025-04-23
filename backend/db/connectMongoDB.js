import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/yourDatabaseName";

const connectMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB!");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
    }
};

connectMongoDB();

export default connectMongoDB;
