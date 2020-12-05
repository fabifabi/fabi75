var express = require('express');
var app = express();
var http = require('http').createServer(app);
var anchorme = require("anchorme").default;
var emoji = require('node-emoji');

app.use(express.static(__dirname + "/public"));
app.set('port', process.env.PORT || 3000);
var options = {};
http.listen(3000, () => {
  console.log('listening on *:3000');
  var io = require('socket.io')(http);
  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit("message", { message: "world" });
    socket.on("message", data => {
      console.log(data);
      socket.broadcast.emit("message", data);
    });
  });
});
console.log("http:////localhost:" + app.get("port"))
/*
var wss = new WebSocket.Server({ port: app.get("port") });
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    console.log(data);
    data = anchorme(data, { attributes: [{ name: "target", value: "_blank" }] });
    for (key in t) {
      while (data.indexOf(key) !== -1)
        data = data.replace(key, t[key]);
    }
    // forward to everybody !!
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});*/

console.log("Let's chat !");
