/* Holds the express file. */
const express = require('express');
const bodyParser = require('body-parser');

const Post = require('./post');

/* Initial express usage. */
const app = express();

/** Importing Mongoose */
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://siddharth:VpuRHguny0C3F1oT@cluster0.8cx44.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
.then(() => {
  console.log("Database Connection Successful!")
})
.catch(() => {
  console.log("Connection Failed!");
});

app.use(bodyParser.json());
/* Only support default URL features. */
app.use(bodyParser.urlencoded({extended: false}));

app.use((request, response, next) => {
  console.log('First middleware');
  /* With the help of next function, the request can continue it's journey. */
  next();
});



/* Middle ware to deal with CORS problem. ** Details in Server.js file. ** */
app.use((request, response, next) => {
    /**
     * setHeader(key, value)
     * Our key is a browser identifier which will give access, but to what??
     * the star * represents a universal symbol. So, we are giving universal access.
     */
    response.setHeader('Access-Control-Allow-Origin', '*');
    // request.setHeader('Access-Control-Allow-Origin', '*');
    /** Any extra headers that may be blocked can also gain access */
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    /** type of methods or http words can be used to send request */
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

/* Middle ware for post requests only. */
app.post("/api/posts", (request, response, next) => {
  /* One post */
  const posts = new Post({
    title: request.body.title,
    content: request.body.content
  });
  console.log(posts);
  /** Status code means everything is okay and a new resource was created. */
  response.status(201).json({
    message: 'Post added successfully'
  });
});

/**
 * Only the /api/posts requests will be handled by our backend.
 * /api is to ensure we are dealing with ONLY the REST api requests.
 */
app.use('/api/posts', (request, response, next) => {
  // response.send("Hello from express!");
  const posts = [{
      id: 'fadf12421l',
      title: 'First Server-side post',
      content: 'This is coming from the server'
    },
    {
      id: 'ksajflaj132',
      title: 'Second Server-side post',
      content: 'This is coming from the server!!'
    }
  ];
  //   response.json(posts);
  /**
   * We can send the posts array directly in json as an Array is valid json object.
   * Status code 200: Everything is okay.
   */
  response.status(200).json({
      message: 'Posts fetched successfully!',
      posts: posts
  });
});

/* Exporting the express class to the Node.JS. */
module.exports = app;
