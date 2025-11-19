import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import User from "../models/User.js";

export const register = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let { email, name, password } = req.body;
    //normalize email(backup)
    email = email?.toLowerCase().trim();

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "Email đã tồn tại! "});
        }

        //mã hóa password(hash) trước khi lưu vào db
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ email, name, password: hashed });

        res.status(201).json({
            message: "Đăng ký thành công!",
            user: { id: user._id, email: user.email, name: user.name }
        });
    } catch (err) {
        next(err);
    }
};