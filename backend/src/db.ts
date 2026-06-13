import mongoose from "mongoose";

export async function connectDB() {
    try {
        console.log("hi");
        await mongoose.connect(process.env.MONGODB_URL!);
        console.log("MongoDB connected");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}