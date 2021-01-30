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
  var obj = JSON.parse(req.query.res);
  tab.push({ from: obj.address, txt: obj.body, at: obj.date })
  res.send(req.query)
})

app.get('/clean', function (req, res) {
  log(req.query)
  tab = [];
  res.send(req.query)
})

app.get('/menu', function (req, res) {
  var txt = "";
  for (var i = 0; i < tab.length; i++) {
    var l = tab[i];
    txt += "From : " + l.from + " at " + l.at + " say :" + l.txt + "<br>";
  }
  res.send(txt);
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
