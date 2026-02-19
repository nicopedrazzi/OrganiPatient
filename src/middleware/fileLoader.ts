import multer from "multer";

const upload = multer({
  dest: "uploads/",
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

export const uploadMiddleware = upload.single("file");
