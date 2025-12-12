
import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, //null -> comment gốc, có giá trị -> reply.
  },
  { timestamps: true }
);

commentSchema.index({ post: 1, parent: 1, createdAt: -1 }); //count list comments
commentSchema.index({ author: 1, createdAt: -1 }); //count theo user

export default mongoose.model("Comment", commentSchema);
