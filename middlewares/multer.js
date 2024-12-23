const Multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const storage = Multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueID = crypto.randomBytes(16).toString("hex");
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uniqueID}${fileExtension}`;
    cb(null, fileName);
  },
});

const multer = Multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    checkFileType(req, file, cb);
  },
});

const checkFileType = (req, file, cb) => {
  if (file.fieldname == "image") {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.error = new Error("Only images are allowed");
      return cb(null, false);
    }
  }

  return cb(null, true);
};
module.exports = multer;
