import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
    } catch (err) {
        console.log("Connect Mongo Error");
        process.exit(1);
    }
};

export default connectDb;
