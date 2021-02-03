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
    log("obj :", obj)
    if (obj.body.toLowerCase().indexOf("create ") === 0) {
      var body = obj.body.split(" ")
      body.shift();
      var nom = body.join(" ")
      all.resto[obj.address] = nom;
      log("create ", all)
      await writeAll(all);
    }
    else {
      if (all.resto[obj.address]) {
        log("nouveau plats", all)
        var at = new Date(obj.date);
        log("at", at);
        var key = at.getFullYear() * 10000 + at.getMonth() * 100 + at.getDay();
        log("key", key)
        if (all.tab[key] === undefined)
          all.tab[key] = {};
        all.tab[key][all.resto[obj.address]] = { from: all.resto[obj.address], txt: obj.body.split(",") };
        log(JSON.stringify(all), "ici")
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
    log("clean!");
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

    var txt = "<div class='title'>Platos do Dias </div><br>";
    log(key)
    log(all)
    log(all.tab[key])
    if (all.tab[key]) {
      for (var i in all.tab[key]) {
        var l = all.tab[key][i];
        txt += "<div class='Name'>No restaurante " + l.from + "</div><br>"
        if (l.txt.length > 0) {
          for (var j = 0; j < l.txt.length; j++) {
            if (l.txt[j].trim().length > 0) {
              txt += "<div class='Plat'>" + l.txt[j] + " : " + l.txt[j + 1] + "</div><br>";
            }
            j++;
          }
        } else {
          txt += "<div class='Plat Empty'>Este restaurante ainda não foi publicado :(</div><br>";
        }
        txt + "<br>";
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
