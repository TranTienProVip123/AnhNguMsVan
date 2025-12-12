import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    content: { type: String, trim: true, required: true },
    category: { type: String, trim: true, default: "Tất cả" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

PostSchema.index({ author: 1, isActive: 1 }); //countDoc

export default mongoose.model("Post", PostSchema);
