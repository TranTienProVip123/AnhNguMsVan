import { validationResult } from "express-validator";
import { listUsers, updateUserService, deleteUserService } from "../services/userAdminService.js";

export const getUsers = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1; //mac dinh trang 1
    const limit = Math.min(Number(req.query.limit) || 20, 100); //mac dinh 20, toi da 100
    const result = await listUsers({ page, limit });
    return res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ', errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const { name, role, isVerified } = req.body;

        const result = await updateUserService({ id,name, role, isVerified });
        if (result.reason === 'USER_NOT_FOUND') {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
        }
        return res.json({ success: true, message: 'Cập nhật tài khoản thành công', data: { user: result.user } });
    } catch (err) {
        next(err);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await deleteUserService({ id });
        if (result.reason === 'USER_NOT_FOUND') {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
        }
        return res.json({ success: true, message: 'Xóa người dùng thành công', data: { user: result.user } });
    } catch (err) {
        next(err);
    }
};