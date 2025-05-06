import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB!");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
    }

};

connectMongoDB();

export default connectMongoDB;
