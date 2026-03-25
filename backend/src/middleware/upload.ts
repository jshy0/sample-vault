import multer from "multer";
import { Request, Response, NextFunction } from "express";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

// WAV magic bytes: "RIFF" at 0-3 and "WAVE" at 8-11
const WAV_RIFF = [0x52, 0x49, 0x46, 0x46];
const WAV_WAVE = [0x57, 0x41, 0x56, 0x45];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "audio/wav") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only WAV files are allowed."));
    }
  },
});

export const validateWavBuffer = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) return next();
  const buf = req.file.buffer;
  const isWav =
    buf.length >= 12 &&
    WAV_RIFF.every((b, i) => buf[i] === b) &&
    WAV_WAVE.every((b, i) => buf[8 + i] === b);
  if (!isWav) {
    return res.status(400).json({ error: "Invalid file. Only WAV files are allowed." });
  }
  next();
};
