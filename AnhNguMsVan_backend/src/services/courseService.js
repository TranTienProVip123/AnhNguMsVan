import Course from "../models/Course.js";

export const listCourses = async ({ page = 1, limit = 20, type }) => {
  const skip = (page - 1) * limit;
  const filter = {};
  if (type) filter.type = type;

  const [items, total] = await Promise.all([
    Course.find(filter)
      .select("_id title description type coverImage isPublished stats topics createdAt")
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
  ).select("_id title description type coverImage isPublished stats topics createdAt");

  if (!course) return { reason: "NOT_FOUND" };
  return { course };
};

export const deleteCourse = async (id) => {
  const result = await Course.findByIdAndDelete(id);
  if (!result) return { reason: "NOT_FOUND" };
  return {};
};

export const getCourseById = async (id) => {
  const course = await Course.findById(id)
    .populate({
      path: "topics",
      match: { isActive: true }, // Chỉ lấy các topics đang active
      select: "_id name image totalWords category isActive createdAt",
      options: { sort: { createdAt: -1 } },
    })
    .select("_id title description type coverImage isPublished stats topics createdAt updatedAt");
  if (!course) return { reason: "NOT_FOUND" };
  return { course };
};
