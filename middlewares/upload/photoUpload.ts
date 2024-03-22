import { Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path"

const multerStorage = multer.memoryStorage();

const multerFilter = (req: Request, file: any, cb: Function) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

export const photoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 8000000 },
});

export const profilePhotoResize = async (
  req: Request,
  res: Response,
  next: Function
) => {
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
  await sharp(req.file.buffer)
  .resize(250,250)
  .toFormat("jpeg")
  .jpeg({quality:90})
  .toFile(path.join(`public/images/profile/${req.file.filename}`))
  next()
};
