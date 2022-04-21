/**
 * Class that will parse the request and decide whether the request is allowed to continue or not using validation through token..
 * In the case of denial of access, sending a response indicating you are not authorized.
 */

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  /**
   * Token convention: "bearer [encrypted token]"
   * Bearer tokens consists of opaque strings which has no meaning to clients using it.
   */
  try {
    const token = req.headers.authorization.split(" ")[1];
    /* Verifying Token */
    jwt.verify(token, "secret_this_should_be_longer");
  } catch (error) {
    res.status(401).json({ message: "Auth Failed!" });
  }
};
