import mongoose from "mongoose";

async function connectDB() {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log("Connected to mongoDB")
}

export { connectDB };