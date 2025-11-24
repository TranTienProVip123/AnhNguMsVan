import mongoose from "mongoose";
import { config } from "../config/config.js";

const connectDb = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log("MongoDB connected");
    } catch (err) {
        console.log("Connect Mongo Error");
        process.exit(1);
    }
};

export default connectDb;
