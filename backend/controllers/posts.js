const Post = require("../models/post");

exports.createPost = (request, response, next) => {
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
  post
    .save()
    .then((createdPost) => {
      response.status(201).json({
        message: "Post added successfully!",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    })
    .catch((error) => {
      response.status(500).json({ message: "Creating a post failed!" });
    });
};

exports.updatePost = (req, res, next) => {
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
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Couldn't update post" });
    });
};

exports.getPosts = (request, response, next) => {
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
    })
    .catch((error) => {
      response.status(500).json({
        message: "Fetching posts failed!",
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      // Checks if the post exists
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post Not Found!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching post failed!",
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching post failed!",
      });
    });
};
