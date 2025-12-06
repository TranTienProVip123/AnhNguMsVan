import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: '' },
    content: { type: String, trim: true, required: true },
    category: { type: String, trim: true, default: 'Tat ca' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Post', PostSchema);
