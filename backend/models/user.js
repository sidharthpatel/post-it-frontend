const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

/**
 * Passing JS object.
 * In Node.js & js in general, string is String with capital S. In Ts it does not matter.
 */
/**
 * The unique attribute does not automatically validate unique emails or rather it does not throw any error, so we are using an external plugin called mongoose-unique-validator to throw error upon a validation failure.
 */
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

/**
 * model (Name, schema)
 * the name should start with upper case letter.
 * module.exports will export the schema outside this file.
 */
module.exports = mongoose.model("User", userSchema);
