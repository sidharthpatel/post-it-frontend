/**
 * Routes for all of our POSTS
 */

const express = require("express");

const Post = require("../models/post");

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
    const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
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
    });
    /** Default Mongoose method */
    post.save().then((createdPost) => {
      response.status(201).json({
        message: "Post added successfully!",
        postId: createdPost._id,
        post: {
          ...createdPost,
          id: createdPost._id,
          // title: createdPost.title,
          // content: createdPost.content,
          // imagePath: createdPost.imagePath,
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
router.put("/:id", (req, res, next) => {
  const newPost = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, newPost).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Update successful!" });
  });
});

/**
 * Only the /api/posts requests will be handled by our backend.
 * /api is to ensure we are dealing with ONLY the REST api requests.
 */
router.get("", (request, response, next) => {
  Post.find().then((documents) => {
    response.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents,
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

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;
