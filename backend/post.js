/**
 * We are going to create our post model using Mongoose.
 */

/** Imported Mongoose from our package.json */
// const { stringify } = require('@angular/compiler/src/util');
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    /** 
     * Passing JS object.
     * In Node.js & js in general, string is String with capital S. In Ts it does not matter.
     */
    title: { type: String, required: true },
    content: { type: String, required: true }
});

/**
 * model (Name, schema)
 * the name should start with upper case letter.
 * module.exports will export the schema outside this file.
 */
module.exports = mongoose.model('Post', postSchema);