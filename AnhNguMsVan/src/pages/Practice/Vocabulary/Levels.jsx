export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const getLevelColor = (level) => {
    const colors = {
        A1: "#fbbf24",
        A2: "#10b981",
        B1: "#3b82f6",
        B2: "#8b5cf6",
        C1: "#6b7280",
        C2: "#ef4444"
    };
    return colors[level] || "#6b7280";
};

export const getLevelInfo = (level) => {
    const info = {
        A1: { name: "Sơ cấp", description: "Hiểu và sử dụng các cụm từ quen thuộc hàng ngày" },
        A2: { name: "Tiền trung cấp", description: "Giao tiếp trong các tình huống đơn giản và thường gặp" },
        B1: { name: "Trung cấp", description: "Xử lý hầu hết các tình huống khi đi du lịch" },
        B2: { name: "Trung cấp cao", description: "Hiểu nội dung chính của văn bản phức tạp" },
        C1: { name: "Cao cấp", description: "Sử dụng ngôn ngữ linh hoạt và hiệu quả" },
        C2: { name: "Thành thạo", description: "Hiểu hầu như mọi thứ được nghe hoặc đọc" }
    };
    return info[level] || { name: "", description: "" };
};