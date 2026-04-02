
export const SUPPORTED_FORMATS = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
export const MAX_FILE_SIZE_MB = 500;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const validateVideoFormat = (file) => {
  if (!file) return { valid: false, error: "No file provided" };
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    return { valid: false, error: `Unsupported format. Please use MP4, WebM, MOV, or AVI.` };
  }
  return { valid: true };
};

export const validateFileSize = (file) => {
  if (!file) return { valid: false, error: "No file provided" };
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.` };
  }
  return { valid: true };
};

export const validateVideoDuration = (duration, maxDuration = 3600) => {
  if (duration > maxDuration) {
    return { valid: false, error: `Video is too long. Maximum duration is ${maxDuration / 60} minutes.` };
  }
  return { valid: true };
};

export const validateVideo = (file) => {
  const formatCheck = validateVideoFormat(file);
  if (!formatCheck.valid) return formatCheck;

  const sizeCheck = validateFileSize(file);
  if (!sizeCheck.valid) return sizeCheck;

  return { valid: true };
};
