import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCloudinary } from '../../hooks/useCloudinary';

const AddTopicModal = ({ isOpen, onClose, onSubmit }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get('courseId');
  
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
    category: "vocabulary"
  });

  const { uploadImage, isUploading, uploadedUrl, resetUpload } = useCloudinary();
  const [imagePreview, setImagePreview] = useState("");

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

    const result = await onSubmit({
      ...formData,
      courseId
    });
    
    if (result.success) {
      alert('Thêm chủ đề thành công!');
      // Reset form
      setFormData({ name: "", image: "", description: "", category: "vocabulary" });
      setImagePreview("");
      resetUpload();
      onClose();
    } else {
      alert(result.message || 'Có lỗi xảy ra');
    }
  };

  const handleClose = () => {
    setFormData({ name: "", image: "", description: "", category: "vocabulary" });
    setImagePreview("");
    resetUpload();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="add-topic-modal-overlay" onClick={handleClose}>
      <div className="add-topic-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} type="button">✕</button>
        <h2 className="modal-title">
          <span className="modal-icon">➕</span>
          Thêm chủ đề mới
        </h2>
        <form onSubmit={handleSubmit} className="add-topic-form">
          <div className="form-group">
            <label htmlFor="topicName">Tên chủ đề *</label>
            <input
              type="text"
              id="topicName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ví dụ: Gia đình, Du lịch..."
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
                    <p className="upload-hint">PNG, JPG (Max 5MB)</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="topicDescription">Mô tả</label>
            <textarea
              id="topicDescription"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả ngắn về chủ đề..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="topicCategory">Danh mục</label>
            <select
              id="topicCategory"
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

          <div className="form-info">
            <p>ℹ️ Sau khi tạo chủ đề, bạn có thể thêm từ vựng vào chủ đề này.</p>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleClose}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={isUploading}>
              {isUploading ? 'Đang upload...' : 'Thêm chủ đề'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTopicModal;