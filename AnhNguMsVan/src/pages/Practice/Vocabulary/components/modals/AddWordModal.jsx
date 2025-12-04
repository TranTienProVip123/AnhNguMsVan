import React, { useState } from 'react';
import { useCloudinary } from '../../hooks/useCloudinary';

const AddWordModal = ({ isOpen, topic, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    english: "",
    vietnamese: "",
    phoneticUS: "",
    phoneticUK: "",
    definition: "",
    meaning: "",
    example: "",
    exampleVN: "",
    image: "",
    wordType: "noun"
  });

  const { uploadImage, isUploading } = useCloudinary();
  const [imagePreview, setImagePreview] = useState("");

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

    if (!topic?.id) {
      alert("Không xác định được chủ đề!");
      return;
    }

    const result = await onSubmit(topic.id, formData);
    
    if (result.success) {
      alert('Thêm từ vựng thành công!');
      // Reset form
      setFormData({
        english: "",
        vietnamese: "",
        phoneticUS: "",
        phoneticUK: "",
        definition: "",
        meaning: "",
        example: "",
        exampleVN: "",
        image: "",
        wordType: "noun"
      });
      setImagePreview("");
      onClose();
    } else {
      alert(result.message || 'Có lỗi xảy ra');
    }
  };

  const handleClose = () => {
    setFormData({
      english: "",
      vietnamese: "",
      phoneticUS: "",
      phoneticUK: "",
      definition: "",
      meaning: "",
      example: "",
      exampleVN: "",
      image: "",
      wordType: "noun"
    });
    setImagePreview("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="add-topic-modal-overlay" onClick={handleClose}>
      <div className="add-topic-modal add-word-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose} type="button">✕</button>
        <h2 className="modal-title">
          <span className="modal-icon">📝</span>
          Thêm từ vựng vào "{topic?.name}"
        </h2>
        <form onSubmit={handleSubmit} className="add-topic-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="wordVietnamese">Nghĩa tiếng Việt *</label>
              <input
                type="text"
                id="wordVietnamese"
                value={formData.vietnamese}
                onChange={(e) => setFormData({ ...formData, vietnamese: e.target.value })}
                placeholder="gia đình"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="wordEnglish">Từ tiếng Anh *</label>
              <input
                type="text"
                id="wordEnglish"
                value={formData.english}
                onChange={(e) => setFormData({ ...formData, english: e.target.value })}
                placeholder="family"
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneticUS">Phiên âm US (IPA)</label>
              <input
                type="text"
                id="phoneticUS"
                value={formData.phoneticUS}
                onChange={(e) => setFormData({ ...formData, phoneticUS: e.target.value })}
                placeholder="ˈfæm.əl.i"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneticUK">Phiên âm UK (IPA)</label>
              <input
                type="text"
                id="phoneticUK"
                value={formData.phoneticUK}
                onChange={(e) => setFormData({ ...formData, phoneticUK: e.target.value })}
                placeholder="ˈfæm.ɪ.li"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="wordType">Loại từ</label>
            <select
              id="wordType"
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
            <label htmlFor="wordDefinition">Định nghĩa tiếng Anh</label>
            <textarea
              id="wordDefinition"
              value={formData.definition}
              onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
              placeholder="A group of people related by blood or marriage"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="wordMeaning">Giải thích tiếng Việt</label>
            <textarea
              id="wordMeaning"
              value={formData.meaning}
              onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
              placeholder="Nhóm người có quan hệ huyết thống hoặc hôn nhân"
              rows="2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="wordExample">Ví dụ tiếng Anh</label>
            <input
              type="text"
              id="wordExample"
              value={formData.example}
              onChange={(e) => setFormData({ ...formData, example: e.target.value })}
              placeholder="My family has 5 people"
            />
          </div>

          <div className="form-group">
            <label htmlFor="wordExampleVN">Ví dụ tiếng Việt</label>
            <input
              type="text"
              id="wordExampleVN"
              value={formData.exampleVN}
              onChange={(e) => setFormData({ ...formData, exampleVN: e.target.value })}
              placeholder="Gia đình tôi có 5 người"
            />
          </div>

          <div className="form-group">
            <label>Ảnh minh họa (không bắt buộc)</label>
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
            <button type="button" className="btn-cancel" onClick={handleClose}>Hủy</button>
            <button type="submit" className="btn-submit" disabled={isUploading}>
              {isUploading ? 'Đang xử lý...' : 'Thêm từ vựng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWordModal;