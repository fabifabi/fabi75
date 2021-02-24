var express = require('express');
var app = express();
var http = require('http').createServer(app);
var anchorme = require("anchorme").default;
var emoji = require('node-emoji');
var fs = require("fs");


var getAllDB = require('./nosql').getAll;
var writeAll = require('./nosql').write;

var searchMail = require("./outlook").searchMail;

var log = console.log;

app.use(express.static(__dirname + "/public"));

app.set('port', process.env.PORT || 3000);

async function getAll() {
  return await searchMail();
}

/*
var all = {
  tab: {},
  resto: {}
};*/

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
        //        console.dir(all);
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
  //console.log("header-----", JSON.stringify(req));
  async function a() {

    var at = new Date(Date.now());
    var key = at.getFullYear() * 10000 + at.getMonth() * 100 + at.getDay();
    var all = await searchMail();

    log(key)
    //    log(all)
    var txt = "<script>var key=" + key + ";var all=" + JSON.stringify(all) + "</script>"
    for (var i = 0; i < all.length; i++) {
      var l = all[i];
      txt += "<div class='Name resto" + i + "'>No restaurante " + l.resto + "<br>"
      for (var j = 0; j < l.foods.length; j++) {
        if (l.foods[j].length === 0)
          continue;
        txt += "<div class='Plat'>" + l.foods[j] + "</div><br>";
        txt += "<div class='PlatPhoto'><img src='" + l.photo[j] + "' style='width:100px;heigth:100px;'></img></div><br>";
      }
      txt += "</div>";
      txt + "<br>";
    }
    var out = tpl.replace("%%insert%%", txt)
    res.send(out);
  }
  a();
})

var tradscript = ";" + fs.readFileSync("trad.js").toString();
var getLangDB = require("./nosqlSimple").getLangDB;
app.get('/mytrad.js', function (req, res) {
  //console.log("header-----", JSON.stringify(req));
  async function a() {
    var url = req.get("referer");//.get('host')
    log(url);
    var langs = await getLangDB(url)
    var out = "var urlsrc=`" + url + "`;var langdispo=" + JSON.stringify(langs) + tradscript;
    log(out);
    if (langs)
      for (var i = 0; i < langs.length; i++) {
        out = out.replace("%%lang%%", langs[i]);
      }
    out = out.replaceAll("%%lang%%", "");
    res.send(out);
  }
  a();
})
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var all = {};
app.post('/trad.json', function (req, res) {
  //console.log("header-----", JSON.stringify(req));
  async function a() {
    var url = req.body.url;
    var lang = req.body.lang;
    log(url, lang);
    var all = await getDB(url, lang)
    log(all);
    res.send(all);
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

var tpl = fs.readFileSync("./public/menu.tpl.html").toString();

console.log("port: " + app.get("port"))
