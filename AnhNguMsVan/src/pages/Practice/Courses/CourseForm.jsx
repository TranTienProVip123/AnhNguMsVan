import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext.jsx";
import "./CourseForm.css";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const defaultForm = {
  title: "",
  type: "vocabulary",
  topic: "",
  coverImage: "",
  description: "",
  stats: { wordCount: 0, learnerCount: 0 },
  isPro: false,
  isPublished: true,
};

const CourseForm = ({ mode = "create", initial, onSuccess, onClose }) => {
  const { token } = useAuth();
  const [form, setForm] = useState(initial || defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(initial || defaultForm);
  }, [initial, mode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "wordCount" || name === "learnerCount") {
      setForm((prev) => ({ ...prev, stats: { ...prev.stats, [name]: Number(value) || 0 } }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const isEdit = mode === "edit" && initial?._id;
    try {
      const url = isEdit ? `${API_BASE_URL}/api/admin/courses/${initial._id}` : `${API_BASE_URL}/api/admin/courses`;
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lưu thất bại");
      onSuccess?.(data.data.course);
      if (!isEdit) setForm(defaultForm);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-title">
          <h3>{mode === "create" ? "Thêm khóa học" : "Chỉnh sửa khóa học"}</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="course-form">
          <input name="title" placeholder="Tiêu đề" value={form.title} onChange={handleChange} required />
          <input name="type" placeholder="Loại (vd: vocabulary, toeic, ielts, ...)" value={form.type} onChange={handleChange} required />
          <input name="topic" placeholder="Topic (vd: common-1000, toeic-basic...)" value={form.topic} onChange={handleChange} />
          <input name="coverImage" placeholder="Ảnh bìa (URL)" value={form.coverImage} onChange={handleChange} />
          <textarea name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} />
          <div className="form-row">
            <input type="number" name="learnerCount" min="0" placeholder="Số học viên" value={form.stats?.learnerCount ?? 0} onChange={handleChange} />
            <input type="number" name="wordCount" min="0" placeholder="Số từ" value={form.stats?.wordCount ?? 0} onChange={handleChange} />
          </div>
          <div className="form-row check-row">
            <label>
              <input type="checkbox" name="isPro" checked={!!form.isPro} onChange={handleChange} /> PRO
            </label>
            <label>
              <input type="checkbox" name="isPublished" checked={!!form.isPublished} onChange={handleChange} /> Hiển thị
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
            <button type="button" className="ghost-btn" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
