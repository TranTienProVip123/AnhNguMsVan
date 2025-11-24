import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        email: { type: String, required: true, lowercase: true, unique: true, trim: true },
        name: { type: String, required: true, trim: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        passwordResetToken: String,
        passwordResetExpires: Date,
        passwordChangedAt: Date,
        isVerified: { type: Boolean, default: false },
        emailVerificationToken: String,
        emailVerificationExpires: Date
    },
    { timestamps: true }
);

export default model("User", userSchema)