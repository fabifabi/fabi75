// @ts-check
/*
const { ObjectId } = require('mongodb');

ObjectId.prototype.toString = ObjectId.prototype.toHexString;
var log = console.log;

function sendMail(email) {
    var key = "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"
    const mail = require("@sendgrid/mail");
    mail.setApiKey(key)

    const msg = {
        to: email,
        from: 'fabi75.pro@gmail.com', // Use the email address or domain you verified above
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    mail
        .send(msg)
        .then(() => { }, error => {
            log(error);
            if (error.response) {
                log(error.response.body)
            }
        });
}*/

let allDB;

async function write(all) {
    log("write: ", all);
    try {
        await allDB.updateOne({ url: url, lang: localStorage.dest }, { $set: { data: JSON.stringify(all) } }, { upsert: true });
    }
    catch (e) {
        log(e);
    }
}



async function getLangDB(url) {
    console.log(url);
    var tab = await allDB.find({ url: url }, { lang: 1, _id: 0 }).toArray();
    var res = [];
    for (var i = 0; i < tab.length; i++)
        res.push(tab[i].lang)
    console.trace(tab)
    return res;
}

exports.getLangDB = getLangDB;


async function getDB(url, lang) {
    var all = {};
    if (allDB) {
        var all2 = await allDB.findOne({ url: url, lang: lang });
        log(all2)
        if (all2 !== undefined && all2 !== null && all2.data !== undefined && all2.data !== null)
            all = JSON.parse(all2.data);
    }
    log("get", all)
    return all;
}

/*
exports.getAll = get;
exports.write = write;
*/
function connect() {
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://FabiRoot:FabiRoot1003@cluster0.3or7k.mongodb.net/Trad?retryWrites=true&w=majority";
    MongoClient.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }).then((client) => {
        allDB = client.db("trad").collection("trad");
        connected = true;
    });
}

async function clean() {
    await allDB.write({});
}

var log = console.trace;
var connected = false;
exports.connected = connected;
function initDB() {
    try {
        connect();
        log("fin init db");
    } catch (e) { log(e) }
}

// liste plat du jour pour tout les telephone associé?
//humhum
// tel=nom de resto

initDB();