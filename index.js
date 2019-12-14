var myip = "[2a01:e35:139f:b290:78f6:ea7c:db6a:8673]";
var t = {
  'o/': '👋',
  '</3': '💔',
  '<3': '💗',
  '8-D': '😁',
  '8D': '😁',
  ':-D': '😁',
  '=-3': '😁',
  '=-D': '😁',
  '=3': '😁',
  '=D': '😁',
  'B^D': '😁',
  'X-D': '😁',
  'XD': '😁',
  'x-D': '😁',
  'xD': '😁',
  ':\')': '😂',
  ':\'-)': '😂',
  ':-))': '😃',
  '8)': '😄',
  ':)': '😄',
  ':-)': '😄',
  ':3': '😄',
  ':D': '😄',
  ':]': '😄',
  ':^)': '😄',
  ':c)': '😄',
  ':o)': '😄',
  ':}': '😄',
  ':っ)': '😄',
  '=)': '😄',
  '=]': '😄',
  '0:)': '😇',
  '0:-)': '😇',
  '0:-3': '😇',
  '0:3': '😇',
  '0;^)': '😇',
  'O:-)': '😇',
  '3:)': '😈',
  '3:-)': '😈',
  '}:)': '😈',
  '}:-)': '😈',
  '*)': '😉',
  '*-)': '😉',
  ':-,': '😉',
  ';)': '😉',
  ';-)': '😉',
  ';-]': '😉',
  ';D': '😉',
  ';]': '😉',
  ';^)': '😉',
  ':-|': '😐',
  ':|': '😐',
  ':(': '😒',
  ':-(': '😒',
  ':-<': '😒',
  ':-[': '😒',
  ':-c': '😒',
  ':<': '😒',
  ':[': '😒',
  ':c': '😒',
  ':{': '😒',
  ':っC': '😒',
  '%)': '😖',
  '%-)': '😖',
  ':-P': '😜',
  ':-b': '😜',
  ':-p': '😜',
  ':-Þ': '😜',
  ':-þ': '😜',
  ':P': '😜',
  ':b': '😜',
  ':p': '😜',
  ':Þ': '😜',
  ':þ': '😜',
  ';(': '😜',
  '=p': '😜',
  'X-P': '😜',
  'XP': '😜',
  'd:': '😜',
  'x-p': '😜',
  'xp': '😜',
  ':-||': '😠',
  ':@': '😠',
  ':-.': '😡',
  ':-/': '😡',
  ':/': '😡',
  ':L': '😡',
  ':S': '😡',
  ':\\': '😡',
  '=/': '😡',
  '=L': '😡',
  '=\\': '😡',
  ':\'(': '😢',
  ':\'-(': '😢',
  '^5': '😤',
  '^<_<': '😤',
  'o/\\o': '😤',
  '|-O': '😫',
  '|;-)': '😫',
  ':###..': '😰',
  ':-###..': '😰',
  'D-\':': '😱',
  'D8': '😱',
  'D:': '😱',
  'D:<': '😱',
  'D;': '😱',
  'D=': '😱',
  'DX': '😱',
  'v.v': '😱',
  '8-0': '😲',
  ':-O': '😲',
  ':-o': '😲',
  ':O': '😲',
  ':o': '😲',
  'O-O': '😲',
  'O_O': '😲',
  'O_o': '😲',
  'o-o': '😲',
  'o_O': '😲',
  'o_o': '😲',
  ':$': '😳',
  '#-)': '😵',
  ':#': '😶',
  ':&': '😶',
  ':-#': '😶',
  ':-&': '😶',
  ':-X': '😶',
  ':X': '😶',
  ':-J': '😼',
  ':*': '😽',
  ':^*': '😽',
  'ಠ_ಠ': '🙅',
  '*\\0/*': '🙆',
  '\\o/': '🙆',
  ':>': '😄',
  '>.<': '😡',
  '>:(': '😠',
  '>:)': '😈',
  '>:-)': '😈',
  '>:/': '😡',
  '>:O': '😲',
  '>:P': '😜',
  '>:[': '😒',
  '>:\\': '😡',
  '>;)': '😈',
  '>_>^': '😤'
};


var WebSocket = require('ws');
var express = require('express');
var http = require('http');
var anchorme = require("anchorme").default;
var emoji = require('node-emoji');

var app = express();

app.use(express.static(__dirname + "/public"));
app.set('port', process.env.PORT || 3000);
var options = {};
var server = http.createServer(options, app);
server.listen(app.get("port"));

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
});

console.log("Let's chat !");
