import multer from "multer";

// Configure multer to store files in memory (not disk) so we can save to MongoDB
const storage = multer.memoryStorage();

// File filter - only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // accept file
  } else {
    cb(new Error("Only image files are allowed"), false); // reject file
  }
};

// Configure multer with limits and filters
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter
});

export default upload;