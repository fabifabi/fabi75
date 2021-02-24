var express = require('express');
var app = express();
var getLangDB = require("./nosqlSimple").getLangDB;
var connected = require("./nosqlSimple").connected;

initServeur();

function initServeur() {
  if (!connected) {
    setTimeout(initServeur, 200);
    return;
  }
  run()
}

function run() {

  var http = require('http').createServer(app);
  var anchorme = require("anchorme").default;
  var emoji = require('node-emoji');
  var fs = require("fs");


  var getAllDB = require('./nosql').getAll;
  var writeAll = require('./nosql').write;

  var searchMail = require("./outlook").searchMail;

  //var console.trace = console.trace;

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
    console.trace(req.query.res)
    async function a() {
      var all = await getAll();
      console.trace(req.query)
      var obj = JSON.parse(req.query.res);
      console.trace("obj :", obj)
      if (obj.body.toLowerCase().indexOf("create ") === 0) {
        var body = obj.body.split(" ")
        body.shift();
        var nom = body.join(" ")
        all.resto[obj.address] = nom;
        console.trace("create ", all)
        await writeAll(all);
      }
      else {
        if (all.resto[obj.address]) {
          console.trace("nouveau plats", all)
          var at = new Date(obj.date);
          console.trace("at", at);
          var key = at.getFullYear() * 10000 + at.getMonth() * 100 + at.getDay();
          console.trace("key", key)
          if (all.tab[key] === undefined)
            all.tab[key] = {};
          all.tab[key][all.resto[obj.address]] = { from: all.resto[obj.address], txt: obj.body.split(",") };
          console.trace(JSON.stringify(all), "ici")
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
      console.trace(req.query)
      var all = {
        tab: {},
        resto: {}
      }
      await writeAll(all)
      console.trace("clean!");
    }
    a();
    res.send(req.query)
  })

  app.get('/menu', function (req, res) {
    //console.trace("header-----", JSON.stringify(req));
    async function a() {
      var at = new Date(Date.now());
      var key = at.getFullYear() * 10000 + at.getMonth() * 100 + at.getDay();
      var all = await searchMail();

      console.trace(key)
      //    console.trace(all)
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
    } 1 + 1;
    a();
  })

  var tradscript = ";" + fs.readFileSync("trad.js").toString();
  app.get('/mytrad.js', function (req, res) {
    //console.trace("header-----", JSON.stringify(req));
    async function a() {
      var url = req.get("referer");//.get('host')
      console.trace("url:", url);
      var langs = await getLangDB(url)
      var out = "var urlsrc=`" + url + "`;var langdispo=" + JSON.stringify(langs) + tradscript;
      //    console.trace(out);
      if (langs)
        for (var i = 0; i < langs.length; i++) {
          out = out.replace("%%lang%%", langs[i]);
        }
      while (out.includes("%%lang%%"))
        out = out.replace("%%lang%%", "");
      res.send(out);
    }
    a();
  })
  var bodyParser = require('body-parser');
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

  app.post('/trad.json', function (req, res) {
    //console.trace("header-----", JSON.stringify(req));
    async function a() {
      var url = req.body.url;
      var lang = req.body.lang;
      console.trace(url, lang);
      var all = await getDB(url, lang)
      console.trace(all);
      res.send(all);
    }
    a();
  })

  var options = {};
  http.listen(app.get("port"), () => {
    console.trace("listening ws *: ", app.get("port"));
    var io = require('socket.io')(http);
    io.on('connection', (socket) => {
      console.trace('a user connected');
      socket.emit("message", { type: "txt", txt: "Welcome !" });
      socket.on("message", data => {
        console.trace(data);
        io.emit("message", data);
      });
    });
  });

  var tpl = fs.readFileSync("./public/menu.tpl.html").toString();

  console.trace("port: " + app.get("port"))
}