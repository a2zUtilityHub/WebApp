
export const extractVideoMetadata = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve({
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
          size: file.size,
          name: file.name,
          type: file.type
        });
      };

      video.onerror = () => {
        window.URL.revokeObjectURL(video.src);
        reject(new Error("Failed to load video metadata"));
      };

      video.src = window.URL.createObjectURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

export const formatDuration = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
