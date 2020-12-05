var express = require('express');
var app = express();
var http = require('http').createServer(app);
var anchorme = require("anchorme").default;
var emoji = require('node-emoji');
const { runInThisContext } = require('vm');

var log = console.log;
function truc() { log("a)"); }
truc();
for (var i in global)
  log(i);
log(global);

app.use(express.static(__dirname + "/public"));
app.set('port', process.env.PORT || 3000);
var options = {};
http.listen(3000, () => {
  console.log('listening on *:3000');
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

console.log("http://localhost:" + app.get("port"))
