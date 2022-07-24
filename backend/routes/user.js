/**
 * User.js file is a backend file to authenticate user email and password fetched from frontend and add it to the database for future retrieval of data.
 */
const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user");

/**
 * Note we are not using createUser() since it is a function to be executed.
 * We are using createUser as a reference so the pherentheses are unnecessary.
 */
router.post("/signup", UserController.createUser);

/**
 * Generate token on this route.
 */
router.post("/login", UserController.loginUser);

module.exports = router;
