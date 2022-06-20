const mongoose = require("mongoose");

/**
 * Passing JS object.
 * In Node.js & js in general, string is String with capital S. In Ts it does not matter.
 */
const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

/**
 * model (Name, schema)
 * the name should start with upper case letter.
 * module.exports will export the schema outside this file.
 */
module.exports = mongoose.model("Post", postSchema);
