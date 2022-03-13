/**
 * User.js file is a backend file to authenticate user email and password fetched from frontend and add it to the database for future retrieval of data.
 */
const express = require("express");
const user = require("../models/user");
const router = express.Router();

const bcrpyt = require("bcrypt");

router.post("/signup", (req, res, next) => {
  bcrpyt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      /**
       * This is SUPER BAD!!! If anyone gets an access to our database, they basically have our password since it is saved as a raw text.
       * It is always effective to save passwords encrpyted.
       */
      // password: req.body.password,
      password: hash,
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created",
          result: result,
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

module.exports = router;
