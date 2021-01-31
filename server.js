var express = require('express');
var app = express();
var http = require('http').createServer(app);
var anchorme = require("anchorme").default;
var emoji = require('node-emoji');

var getAll = require('./nosql').getAll;
var writeAll = require('./nosql').write;

var log = console.log;

app.use(express.static(__dirname + "/public"));

app.set('port', process.env.PORT || 3000);


var all = {
  tab: {},
  resto: {}
};

app.get('/lisboa', function (req, res) {
  log(req.query.res)
  async function a() {
    var all = await getAll();
    log(req.query)
    var obj = JSON.parse(req.query.res);
    log(obj)
    if (obj.body.toLowerCase().indexOf("create ") === 0) {
      var body = obj.body.split(" ")
      body.unshift();
      var nom = body.join(" ")
      all.resto[obj.address] = nom;
      log("create ", all)
      await writeAll(all);
    }
    else {
      if (all.resto[obj.address]) {
        log("nouveau plats", all)
        var at = new Date(obj.date);
        var key = at.getFullYear() * 10000 + at.getMonth() * 100 + at.getDay();
        if (all.tab[key] === undefined)
          all.tab[key] = [];
        all.tab[key].push({ a: "aa" });//{ from: all.resto[obj.address], txt: obj.body.split(".") });
        log(all, "ici")
        await writeAll(all)
        console.dir(all);
      }
    }
    res.send(req.query)
  }
  a();
})

app.get('/clean', function (req, res) {
  async function a() {
    log(req.query)
    var all = {
      tab: {},
      resto: {}
    }
    await writeAll(all)
  }
  a();
  res.send(req.query)
})
var log = console.log;

app.get('/menu', function (req, res) {
  async function a() {

    var at = new Date(Date.now());
    var key = at.getFullYear() * 10000 + at.getMonth() * 100 + at.getDay();
    all = await getAll();

    var txt = "<div class='title'>Today : </div><br>";
    log(key)
    log(all)
    log(all.tab[key])
    if (all.tab[key]) {
      for (var i = 0; i < all.tab[key].length; i++) {
        var l = all.tab[key][i];
        txt += "<div class='Name'>" + l.from + "</div><br>"
        for (var j = 0; j < l.txt.length; j++) {
          txt += "<div class='Plat'>" + l.txt[j] + " : " + l.txt[j + 1] + "</div><br>";
          j++;
        }
        l.txt + "<br>";
      }
    }
    var out = tpl.replace("%%insert%%", txt)
    res.send(out);
  }
  a();
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

var fs = require("fs");

var tpl = fs.readFileSync("./public/menu.tpl.html").toString();

console.log("port: " + app.get("port"))
