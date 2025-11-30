import { Schema, model } from 'mongoose';

const allowedCourseTypes =
  process.env.COURSE_TYPES?.split(',').map((t) => t.trim()).filter(Boolean) ??
  ['vocabulary', 'toeic', 'ielts', 'communication', 'grammar'];

const courseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v) => allowedCourseTypes.includes(v),
        message: (props) => `${props.value} is not a supported course type`
      }
    },
    coverImage: { type: String, trim: true },
    topics: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
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