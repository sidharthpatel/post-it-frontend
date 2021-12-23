const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

const app = express();

mongoose
  .connect(
    "mongodb+srv://sid:aDPZoiKHnPS60fX4@cluster0.8cx44.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Database Connection Successful!");
  })
  .catch(() => {
    console.log("Connection Failed!");
  });

app.use(bodyParser.json());
/* Only support default URL features. */
app.use(bodyParser.urlencoded({ extended: false }));

/* Middle ware to deal with CORS problem. ** Details in Server.js file. ** */
/**
 * setHeader(key, value)
 * Our key is a browser identifier which will give access, but to what??
 * the star * represents a universal symbol. So, we are giving universal access.
 */
app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  /** Any extra headers that may be blocked can also gain access */
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  /** type of methods or http words can be used to send request */
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

/* Middle ware for post requests only. */
app.post("/api/posts", (request, response, next) => {
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
app.put("/api/posts/:id", (req, res, next) => {
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
app.get("/api/posts", (request, response, next) => {
  Post.find().then((documents) => {
    response.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents,
    });
  });
});

app.get("/api/posts/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    // Checks if the post exists
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post Not Found!" });
    }
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = app;
