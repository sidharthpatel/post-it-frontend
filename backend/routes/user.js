/**
 * User.js file is a backend file to authenticate user email and password fetched from frontend and add it to the database for future retrieval of data.
 */
const express = require("express");
const User = require("../models/user");
const router = express.Router();

const bcrpyt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      .catch((err) => {
        res.status(500).json({
          message: "User Failed",
          error: err,
        });
      });
  });
});

/**
 * Generate token on this route.
 */
router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }
      fetchedUser = user;
      return bcrpyt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }
      /* Creates a new token */
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({ token: token, expiresIn: 3600 });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Auth Failed",
      });
    });
});

module.exports = router;
