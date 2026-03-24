import multer from "multer";

const ALLOWED_MIME_TYPES = ["audio/wav"];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only WAV files are allowed."));
    }
  },
});
