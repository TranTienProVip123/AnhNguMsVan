import Course from "../models/Course.js";

export const listCourses = async ({ page = 1, limit = 20, type, topic, category, level }) => {
  const skip = (page - 1) * limit;
  const filter = {};
  if (type) filter.type = type;
  if (topic) filter.topic = topic;
  if (category) filter.category = category;
  if (level) filter.level = level;

  const [items, total] = await Promise.all([
    Course.find(filter)
      .select("_id title description type topic category level coverImage isPro isPublished stats createdAt")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Course.countDocuments(filter),
  ]);

  return { items, total, page, limit };
};

export const createCourse = async (payload) => {
  const course = await Course.create(payload);
  return { course };
};

export const updateCourse = async (id, payload) => {
  const course = await Course.findByIdAndUpdate(
    id,
    payload,
    { runValidators: true, new: true }
  ).select("_id title description type topic category level coverImage isPro isPublished stats createdAt");

  if (!course) return { reason: "NOT_FOUND" };
  return { course };
};

export const deleteCourse = async (id) => {
  const result = await Course.findByIdAndDelete(id);
  if (!result) return { reason: "NOT_FOUND" };
  return {};
}
