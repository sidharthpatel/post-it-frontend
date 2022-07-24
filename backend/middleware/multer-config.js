// Multer is a node.js middleware for handling file uploads.
const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

// Multer configuration (where multer should put files)
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Security measure if file type does not match MIME_TYPE_MAP by throwing error
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }

    // Callback is relevant to the server.js file which is why we must add backend/..
    callback(error, "backend/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + "-" + Date.now() + "." + ext);
  },
});

module.exports = multer({ storage: storage }).single("image");
