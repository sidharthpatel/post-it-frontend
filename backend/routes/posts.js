/**
 * Routes for all of our POSTS
 */

const express = require("express");

const checkAuth = require("../middleware/check-auth");

/**
 * Initializing express router (comes built-in with express)
 */
const router = express.Router();

// Multer is a node.js middleware for handling file uploads.
const multer = require("multer");

const PostController = require("../controllers/posts");

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

/* Middle ware for post requests only. */
/**
 * multer(storage).single('image')
 * Multer will try to extract a single file from the incoming request and will try to find it in the 'image' property in the request body.
 */
router.post(
  "",
  /** checkAuth will be passed as reference (no need to add params).
   * Express will take care of automatically passing in arguments to the variable when it enters the middleware. */
  checkAuth,
  multer({ storage: storage }).single("image"),
  PostController.createPost
);

/**
 * `Put` will delete the existing resource/post and generate a new resource/post
 * You can also use `patch` which will simply replace the resource.
 * Put will basically update the database.
 */
router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  PostController.updatePost
);

/**
 * Only the /api/posts requests will be handled by our backend.
 * /api is to ensure we are dealing with ONLY the REST api requests.
 */
router.get("", PostController.getPosts);

/**
 * Fetching a single post given an Id.
 */
router.get("/:id", PostController.getPost);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
