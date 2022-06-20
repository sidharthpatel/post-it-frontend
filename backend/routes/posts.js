/**
 * Routes for all of our POSTS
 */

const express = require("express");

const Post = require("../models/post");

const checkAuth = require("../middleware/check-auth");

/**
 * Initializing express router (comes built-in with express)
 */
const router = express.Router();

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
  (request, response, next) => {
    /**
     * URL to the image file.
     * request.protocol: Returns the type of protocol you are using ('http/https')
     */
    const url = request.protocol + "://" + request.get("host");

    /* One post */
    const post = new Post({
      title: request.body.title,
      content: request.body.content,
      /* request.file: Property provided by Multer to extract file's name. */
      imagePath: url + "/images/" + request.file.filename,
      creator: request.userData.userId,
    });
    /** Default Mongoose method */
    post.save().then((createdPost) => {
      response.status(201).json({
        message: "Post added successfully!",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    });
  }
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
  (req, res, next) => {
    //Default image path naming convention
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });
    Post.updateOne(
      { _id: req.params.id, creator: req.userData.userId },
      post
    ).then((result) => {
      if (result.nModified > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not autorized!" });
      }
    });
  }
);

/**
 * Only the /api/posts requests will be handled by our backend.
 * /api is to ensure we are dealing with ONLY the REST api requests.
 */
router.get("", (request, response, next) => {
  //Generating API that works with the given const/ query params below.
  // + converts the query string into integer.
  const pageSize = +request.query.pagesize;
  const currentPage = +request.query.page;
  const postQuery = Post.find();

  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  /**
   * First, I am fetching all the posts,
   * Then I am issuing another query to get the number of posts.
   */
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      response.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count,
      });
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    // Checks if the post exists
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post Not Found!" });
    }
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
    (result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not autorized!" });
      }
    }
  );
});

module.exports = router;
