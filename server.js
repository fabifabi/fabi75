var express = require('express');
var app = express();
var http = require('http').createServer(app);
var anchorme = require("anchorme").default;
var emoji = require('node-emoji');

var log = console.log;

app.use(express.static(__dirname + "/public"));
app.set('port', process.env.PORT || 3000);
var options = {};
http.listen(process.env.PORT, () => {
  console.log("listening ws *: ", app.get("port"));
  var io = require('socket.io')(http);
  io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit("message", { data: "all¤ Hi." });
    socket.on("message", data => {
      console.log(data);
      io.emit("message", data);
    });
  });
});

console.log("port: " + app.get("port"))
