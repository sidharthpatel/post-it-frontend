let express = require("express");

let app = express();

app.use(express.static(__dirname + "/dist/Social-Network"));

app.get("/*", (req, res, next) => {
  res.sendFile(__dirname + "/dist/Social-Network/index.html");
});

app.listen(process.env.PORT || 8080);
