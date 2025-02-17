const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads";

    // Определяем поддиректорию в зависимости от типа файла
    switch (file.fieldname) {
      case "video":
        uploadPath = path.join(uploadPath, "videos");
        break;
      case "imgVideo":
        uploadPath = path.join(uploadPath, "coversVideos");
        break;
      case "imgUser":
        uploadPath = path.join(uploadPath, "coversUsers");
        break;
      case "avatar":
        uploadPath = path.join(uploadPath, "avatars");
        break;
      default:
        uploadPath = path.join(uploadPath, "other");
        break;
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

module.exports = upload;
