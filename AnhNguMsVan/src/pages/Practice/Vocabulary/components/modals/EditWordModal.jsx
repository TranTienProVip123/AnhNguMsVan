import React, { useState, useEffect } from 'react';
import { useCloudinary } from '../../hooks/useCloudinary';

const EditWordModal = ({ isOpen, word, topicId, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    english: "",
    vietnamese: "",
    definition: "",
    meaning: "",
    example: "",
    exampleVN: "",
    image: "",
    wordType: "noun"
  });

  const { uploadImage, isUploading } = useCloudinary();
  const [imagePreview, setImagePreview] = useState("");

  // Load word data khi mở modal
  useEffect(() => {
    if (word) {
      setFormData({
        english: word.english || "",
        vietnamese: word.vietnamese || "",
        definition: word.definition || "",
        meaning: word.meaning || "",
        example: word.example || "",
        exampleVN: word.exampleVN || "",
        image: word.image || "",
        wordType: word.wordType || "noun"
      });
      setImagePreview(word.image || "");
    }
  }, [word]);

  const handleImageUpload = async () => {
    try {
      const url = await uploadImage('vocabulary_words');
      setFormData({ ...formData, image: url });
      setImagePreview(url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Có lỗi khi upload ảnh!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.english.trim() || !formData.vietnamese.trim()) {
      alert("Vui lòng nhập từ tiếng Anh và nghĩa tiếng Việt!");
      return;
    }

    const result = await onSubmit(topicId, word._id, formData);
    
    if (result.success) {
      alert('Cập nhật từ vựng thành công!');
      onClose();
    } else {
      alert(result.message || 'Có lỗi xảy ra');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-topic-modal-overlay" onClick={onClose}>
      <div className="add-topic-modal add-word-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} type="button">✕</button>
        <h2 className="modal-title">
          <span className="modal-icon">✏️</span>
          Sửa từ vựng
        </h2>
        <form onSubmit={handleSubmit} className="add-topic-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="editWordEnglish">Từ tiếng Anh *</label>
              <input
                type="text"
                id="editWordEnglish"
                value={formData.english}
                onChange={(e) => setFormData({ ...formData, english: e.target.value })}
                placeholder="family"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="editWordVietnamese">Nghĩa tiếng Việt *</label>
              <input
                type="text"
                id="editWordVietnamese"
                value={formData.vietnamese}
                onChange={(e) => setFormData({ ...formData, vietnamese: e.target.value })}
                placeholder="gia đình"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="editWordType">Loại từ</label>
            <select
              id="editWordType"
              value={formData.wordType}
              onChange={(e) => setFormData({ ...formData, wordType: e.target.value })}
            >
              <option value="noun">Danh từ</option>
              <option value="verb">Động từ</option>
              <option value="adjective">Tính từ</option>
              <option value="adverb">Trạng từ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="editWordDefinition">Định nghĩa tiếng Anh</label>
            <textarea
              id="editWordDefinition"
              value={formData.definition}
              onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
              placeholder="A group of people related by blood or marriage"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="editWordMeaning">Giải thích tiếng Việt</label>
            <textarea
              id="editWordMeaning"
              value={formData.meaning}
              onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
              placeholder="Nhóm người có quan hệ huyết thống hoặc hôn nhân"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="editWordExample">Ví dụ tiếng Anh</label>
            <input
              type="text"
              id="editWordExample"
              value={formData.example}
              onChange={(e) => setFormData({ ...formData, example: e.target.value })}
              placeholder="My family has 5 people"
            />
          </div>

          <div className="form-group">
            <label htmlFor="editWordExampleVN">Ví dụ tiếng Việt</label>
            <input
              type="text"
              id="editWordExampleVN"
              value={formData.exampleVN}
              onChange={(e) => setFormData({ ...formData, exampleVN: e.target.value })}
              placeholder="Gia đình tôi có 5 người"
            />
          </div>

          <div className="form-group">
            <label>Ảnh minh họa</label>
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

export default EditWordModal;