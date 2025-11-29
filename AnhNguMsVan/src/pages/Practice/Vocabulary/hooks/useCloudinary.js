import { useState, useCallback } from 'react';

const CLOUD_NAME = "da6gk23w6";
const UPLOAD_PRESET = "AnhNguMsVan";

export const useCloudinary = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  const uploadImage = useCallback((folder = 'vocabulary_topics') => {
    return new Promise((resolve, reject) => {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUD_NAME,
          uploadPreset: UPLOAD_PRESET,
          sources: ['local', 'url', 'camera'],
          multiple: false,
          maxFileSize: 5000000,
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
          folder: folder,
        },
        (error, result) => {
          if (error) {
            setIsUploading(false);
            reject(error);
            return;
          }

          if (result.event === 'success') {
            const url = result.info.secure_url;
            setUploadedUrl(url);
            setIsUploading(false);
            resolve(url);
          }

          if (result.event === 'queues-start') {
            setIsUploading(true);
          }
        }
      );

      widget.open();
    });
  }, []);

  const resetUpload = useCallback(() => {
    setUploadedUrl("");
    setIsUploading(false);
  }, []);

  return {
    uploadImage,
    isUploading,
    uploadedUrl,
    resetUpload
  };
};