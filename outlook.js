const Client = require('yapople').Client;
var fs = require("fs");
var base64 = require('base64-stream');


const client = new Client({
    username: 'arroiosrestaurante@outlook.com',
    password: 'restaurante2&23',
    host: 'outlook.office365.com',
    mailparser: true,
    port: 995,
    tls: true
}
);

var all = [];
var lastTry = undefined;

var log = console.log;
async function searchMail() {
    log("searchmail");
    try {
        var date = new Date();
        if (lastTry !== undefined) {
            var diff = lastTry - date;
            if (diff < 1000 * 60 * 10)
                return all;
        }
        lastTry = date;
        all = [];//[{resto:"",foods:[""],photo:[""]}]}];
        await client.connect();
        const messages = await client.retrieveAll();

        var datestr = date.toISOString();
        log(datestr.substr(0, 10), "");
        messages.forEach((message) => {
            var unresto = {}
            log(typeof message.date);
            console.log(message.subject);
            unresto.date = message.date.toISOString();
            if (unresto.date.indexOf(datestr) !== -1)
                return;
            unresto.resto = message.subject;
            console.log(message.text)
            unresto.foods = message.text.split("/n");
            unresto.photo = [];
            for (var i = 0; i < message.attachments.length; i++) {
                //    log(message.attachments[i])
                var ext = message.attachments[i].fileName.substr(message.attachments[i].fileName.lastIndexOf(".") + 1);
                log(ext)
                var src = "data:image/" + ext + ";base64," + message.attachments[i].content.toString("base64");
                unresto.photo.push(src);
            }
            all.push(unresto);
        });
        await client.quit();
    } catch (e) {
        log(e);
        all = [];
    }
    log(all);
    return all;
};

searchMail();

searchMail();

exports.searchMail = searchMail;