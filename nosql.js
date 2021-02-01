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

    await allDB.updateOne({ _id: 1 }, { $set: { data: JSON.stringify(all) } });
}



async function get() {
    var all = {
        tab: {},
        resto: {}
    };
    var all2 = await allDB.findOne({ _id: 1 });
    log(all2)
    if (all2 !== undefined)
        all = JSON.parse(all2.data);
    log("get", all)
    return all;
}


exports.getAll = get;
exports.write = write;

async function connect() {
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://FabiRoot:FabiRoot1003@cluster0.3or7k.mongodb.net/Trad?retryWrites=true&w=majority";
    var client = await MongoClient.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
    var fullDB = client.db("lisboa");
    allDB = fullDB.collection("resto");
    get();
}

async function clean() {
    await allDB.write({});
}

var log = console.log;

async function initDB() {
    try {
        await connect();
        log("fin init db");
    } catch (e) { log(e) }
}

// liste plat du jour pour tout les telephone associé?
//humhum
// tel=nom de resto

initDB();