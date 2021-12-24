/**
 * Routes for all of our POSTS
 */

const express = require("express");

const Post = require("../models/post");

/**
 * Initializing express router (comes built-in with express)
 */
const router = express.Router();

/* Middle ware for post requests only. */
router.post("", (request, response, next) => {
  /* One post */
  const post = new Post({
    title: request.body.title,
    content: request.body.content,
  });
  /** Default Mongoose method */
  post.save().then((createdPost) => {
    response.status(201).json({
      message: "Post added successfully!",
      postId: createdPost._id,
    });
  });
});

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