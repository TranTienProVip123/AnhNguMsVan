import { validationResult } from "express-validator";
import { createConsultation, listConsultations, updateConsultationStatus, deleteConsultationService } from "../services/consultationService.js";

export const submitConsultation = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: "Dữ liệu không hợp lệ",
            errors: errors.array().map((e) => ({
                field: e.param,
                message: e.msg,
            })),
        });
    }

    try {
        const { name, phone } = req.body;

        const result = await createConsultation({ name, phone });

        if (result.reason === "INVALID_NAME") {
            return res.status(400).json({
                success: false,
                message: "Họ và tên không hợp lệ.",
            });
        }

        if (result.reason === "INVALID_PHONE") {
            return res.status(400).json({
                success: false,
                message: "Số điện thoại không hợp lệ.",
            });
        }

        const { consultation } = result;

        return res.status(201).json({
            success: true,
            message:
                "Gửi yêu cầu tư vấn thành công, hãy chờ phản hồi từ chúng tôi.",
            data: {
                consultation: {
                    id: consultation._id,
                    name: consultation.name,
                    phone: consultation.phone,
                    status: consultation.status,
                    createdAt: consultation.createdAt,
                },
            },
        });
    } catch (err) {
        next(err);
    }
};

export const getConsultations = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Math.min(Number(req.query.limit) || 20, 100);
        const result = await listConsultations({ page, limit });
        return res.json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

export const updateStatus = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ', errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await updateConsultationStatus({ id, status });
        if (result.reason === 'CONSULTATION_NOT_FOUND') {
            return res.status(404).json({ success: false, message: 'Yêu cầu tư vấn không tồn tại' });
        }
        if (result.reason === 'INVALID_STATUS') {
            return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ' });
        }
        return res.json({ success: true, message: 'Cập nhật trạng thái thành công', data: { consultation: result.consultation } });
    } catch (err) {
        next(err);
    }
};

export const deleteConsultation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await deleteConsultationService({ id });
        if (result.reason === 'CONSULTATION_NOT_FOUND') {
            return res.status(404).json({ success: false, message: 'Yêu cầu tư vấn không tồn tại' });
        }
        return res.json({ success: true, message: 'Xóa yêu cầu tư vấn thành công' });
    } catch (err) {
        next(err);
    }
};

