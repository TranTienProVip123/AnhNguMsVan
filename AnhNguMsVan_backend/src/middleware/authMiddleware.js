import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
    //xac thuc xem co token ko
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Không có token xác thực!" });
    }

    //check token(xem hop le hay da het han chua)
    const token = header.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('passwordChangedAt role');
        if (!user) return res.status(401).json({ message: 'Unauthorized' });

        const pwdChanged = user.passwordChangedAt?.getTime() || 0;
        if (decoded.pwdChangedAt < pwdChanged) {
            return res.status(401).json({ message: 'Token đã hết hiệu lực, vui lòng đăng nhập lại' });
        }
        req.user = { userId: decoded.userId || decoded.id || decoded._id, role: user.role, pwdChangedAt: decoded.pwdChangedAt };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
}

export const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
        return res.status(403).json({ message: "Bạn không có quyền truy cập tài nguyên này!" });
    }
    next();
}
