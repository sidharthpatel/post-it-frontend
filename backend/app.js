/* Holds the express file. */
const express = require('express');

/* Initial express usage. */
const app = express();
app.use((request, response, next) => {
    console.log('First middleware');
    /* With the help of next function, the request can continue it's journey. */
    next();
});

app.use((request, response, next) => {
    response.send("Hello from express!");
});

/* Exporting the express class to the Node.JS. */
module.exports = app;