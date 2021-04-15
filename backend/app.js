/* Holds the express file. */
const express = require('express');

/* Initial express usage. */
const app = express();
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
    next();
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
   */
  response.status(200).json({
      message: 'Posts fetched successfully!',
      posts: posts
  });
});

/* Exporting the express class to the Node.JS. */
module.exports = app;
