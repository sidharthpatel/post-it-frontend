const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

mongoose
  .connect(
    "mongodb+srv://sid:" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0.8cx44.mongodb.net/node-angular?retryWrites=true&w=majority"
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

/**
 * Allows access to any folder with /images
 * Any request going to /images is re-routed to backend/images
 */
app.use("/images", express.static(path.join("backend/images")));

/* Middleware to deal with CORS problem. ** Details in Server.js file. */

/** The CORS headers are not required if you are hosting the MEAN app as one combined application 
 * composed of Angular (hosted on port 4200) and Node.js, Express, and MongoDB (hosted on port 3000) */

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
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  /** type of methods or http words can be used to send request */
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

/**
 * The app will only accept routes from the router which will contain '/api/posts' routes.
 */
app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
