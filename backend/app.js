const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");

const app = express();

mongoose
  .connect(
    "mongodb+srv://sid:ACCwT49G7tquH49E@cluster0.8cx44.mongodb.net/node-angular?retryWrites=true&w=majority"
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

/**
 * The app will only accept routes from the router which will contain '/api/posts' routes.
 */
app.use("/api/posts", postsRoutes);

module.exports = app;
