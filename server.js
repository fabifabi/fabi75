var express = require('express');
var app = express();
var http = require('http').createServer(app);
var anchorme = require("anchorme").default;
var emoji = require('node-emoji');

var log = console.log;

app.use(express.static(__dirname + "/public"));

app.set('port', process.env.PORT || 3000);

var tab = [];

app.get('/lisboa', function (req, res) {
  log(req.query)
  tab.push(req.query)
  res.send(req.query)
})

app.get('/Menu', function (req, res) {
  res.send(JSON.stringify(tab));
})

var options = {};
http.listen(app.get("port"), () => {
  console.log("listening ws *: ", app.get("port"));
  var io = require('socket.io')(http);
  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit("message", { type: "txt", txt: "Welcome !" });
    socket.on("message", data => {
      console.log(data);
      io.emit("message", data);
    });
  });
});

console.log("port: " + app.get("port"))
