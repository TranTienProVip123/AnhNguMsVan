import User from "../models/User.js";

export const listUsers = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        User.find()
            .select('_id email name role isVerified createdAt')
            .skip(skip)
            .limit(limit),
        User.countDocuments(),
    ]);
    return { items, total, page, limit };
};

export const updateUserService = async ({ id, name, role, isVerified }) => {
    const update = {};
    if (name !== undefined) update.name = name;
    if (role !== undefined) update.role = role;
    if (isVerified !== undefined) update.isVerified = isVerified;

    const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true })
        .select('_id email name role isVerified createdAt');
    if (!user) return { reason: 'USER_NOT_FOUND' };
    return { user };
};

export const deleteUserService = async ({ id }) => {
    const user = await User.findByIdAndDelete(id).select('_id');
    if (!user) return { reason: 'USER_NOT_FOUND' };
    return { user };
};