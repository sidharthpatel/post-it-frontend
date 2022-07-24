/**
 * Routes for all of our POSTS
 */

const express = require("express");

const checkAuth = require("../middleware/check-auth");

const multerConfig = require("../middleware/multer-config");

/**
 * Initializing express router (comes built-in with express)
 */
const router = express.Router();

const PostController = require("../controllers/posts");

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
  multerConfig,
  PostController.createPost
);

/**
 * `Put` will delete the existing resource/post and generate a new resource/post
 * You can also use `patch` which will simply replace the resource.
 * Put will basically update the database.
 */
router.put("/:id", checkAuth, multerConfig, PostController.updatePost);

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
