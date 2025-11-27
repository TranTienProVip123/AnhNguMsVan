import Consultation from "../models/Consultation.js";

export const createConsultation = async ({ name, phone }) => {
    if (!name || name.length < 2 || name.length > 100) {
        return { reason: "INVALID_NAME" };
    }

    // Regex điện thoại VN cơ bản
    const phoneRegex = /^0\d{9,10}$/;
    if (!phone || !phoneRegex.test(phone)) {
        return { reason: "INVALID_PHONE" };
    }

    const consultation = await Consultation.create({
        name: name.trim(),
        phone: phone.trim(),
    });

    return { consultation };
};

export const listConsultations = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        Consultation.find()
            .select('_id name phone status createdAt')
            .skip(skip)
            .limit(limit),
        Consultation.countDocuments(),
    ]);
    return { items, total, page, limit };
};

export const updateConsultationStatus = async ({ id, status }) => {
    const consultation = await Consultation.findById(id);
    if (!consultation) {
        return { reason: "CONSULTATION_NOT_FOUND" };
    }

    if (!["new", "contacted", "closed"].includes(status)) {
        return { reason: "INVALID_STATUS" };
    }

    consultation.status = status;
    await consultation.save();

    return { consultation };
};

export const deleteConsultationService = async ({ id }) => {
    const consultation = await Consultation.findByIdAndDelete(id);
    if (!consultation) {
        return { reason: "CONSULTATION_NOT_FOUND" };
    }

    return { consultation };
};
