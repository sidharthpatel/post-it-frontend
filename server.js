const http = require("http");
const expressApp = require("./backend/app");

/**
const server = http.createServer((request, response) => {
    response.end("This is my first response");
});
*/

/* Configure the express app regarding the port we will be listening to. */
const port = process.env.PORT || 3000;
expressApp.set('port', port);

/* To pass the express into the Node.JS server, simply pass the app.*/
const server = http.createServer(expressApp);

server.listen(port);