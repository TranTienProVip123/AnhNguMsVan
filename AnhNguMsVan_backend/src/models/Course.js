import { Schema, model } from 'mongoose';

const courseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: { type: String, required: true, trim: true },
    topic: { type: String, trim: true },
    category: { type: String, trim: true },
    level: { type: String, trim: true },
    coverImage: { type: String, trim: true },
    isPro: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    stats: {
      wordCount: { type: Number, default: 0, min: 0 },
      learnerCount: { type: Number, default: 0, min: 0 }
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default model('Course', courseSchema);
