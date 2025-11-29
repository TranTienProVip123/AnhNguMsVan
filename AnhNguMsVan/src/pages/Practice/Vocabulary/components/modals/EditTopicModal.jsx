import React, { useState, useEffect } from 'react';
import { useCloudinary } from '../../hooks/useCloudinary';

const EditTopicModal = ({ isOpen, topic, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    category: "vocabulary"
  });

  const { uploadImage, isUploading } = useCloudinary();
  const [imagePreview, setImagePreview] = useState("");

  // Load topic data khi mở modal
  useEffect(() => {
    if (topic) {
      setFormData({
        name: topic.name || "",
        image: topic.image || "",
        description: topic.description || "",
        category: topic.category || "vocabulary"
      });
      setImagePreview(topic.image || "");
    }
  }, [topic]);

  const handleImageUpload = async () => {
    try {
      const url = await uploadImage('vocabulary_topics');
      setFormData({ ...formData, image: url });
      setImagePreview(url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Có lỗi khi upload ảnh!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên chủ đề!");
      return;
    }

    if (!formData.image) {
      alert("Vui lòng upload ảnh chủ đề!");
      return;
    }

    const result = await onSubmit(topic.id, formData);
    
    if (result.success) {
      alert('Cập nhật chủ đề thành công!');
      onClose();
    } else {
      alert(result.message || 'Có lỗi xảy ra');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-topic-modal-overlay" onClick={onClose}>
      <div className="add-topic-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} type="button">✕</button>
        <h2 className="modal-title">
          <span className="modal-icon">✏️</span>
          Sửa chủ đề
        </h2>
        <form onSubmit={handleSubmit} className="add-topic-form">
          <div className="form-group">
            <label htmlFor="editTopicName">Tên chủ đề *</label>
            <input
              type="text"
              id="editTopicName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Ảnh chủ đề *</label>
            <div className="image-upload-area">
              <div className="image-upload-label" onClick={handleImageUpload}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <span className="upload-icon">📁</span>
                    <p>{isUploading ? 'Đang upload...' : 'Click để chọn ảnh'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="editTopicDescription">Mô tả</label>
            <textarea
              id="editTopicDescription"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="editTopicCategory">Danh mục</label>
            <select
              id="editTopicCategory"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="vocabulary">Từ vựng</option>
              <option value="toeic">TOEIC</option>
              <option value="ielts">IELTS</option>
              <option value="conversation">Hội thoại</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={isUploading}>
              {isUploading ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTopicModal;