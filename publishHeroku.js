const { execSync } = require("child_process");
let fs = require("fs")
let path = require("path");


var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);
if (myArgs.length === 0)
    myArgs.push("fabi75");

let app = myArgs[0];


try {
    var dst = "temp"
    if (fs.existsSync(dst))
        fs.rmdirSync(dst, { recursive: true });
    if (fs.existsSync(app))
        fs.rmdirSync(app, { recursive: true });

    fs.mkdirSync(dst);

    var exclude = fs.readFileSync(".exclude").toString();
    exclude = exclude.split("\n");
    exclude.push("temp");
    exclude.push(app);
    function filter(f) {
        if (f === ".exclude")
            return false;
        if (f.indexOf("archive") !== -1)
            return false;
        if (exclude.indexOf(f) !== -1)
            return false;
        return true;
    }
    function traverseDir(dir) {
        fs.readdirSync(dir).forEach(file => {
            if (filter(file) === false)
                return;
            let fullPath = path.join(dir, file);
            let stat = fs.lstatSync(fullPath);
            if (stat.isDirectory() || stat.isSymbolicLink()) {
                // console.log(fullPath);
                fs.mkdirSync(dst + "/" + fullPath)
                traverseDir(fullPath);
            } else {
                //   console.log(fullPath);
                fs.copyFileSync(fullPath, dst + "/" + fullPath)
            }
        });
    }
    var log = console.log;
    //execSync("heroku repo:download -a fabi75");
    let now = new Date();
    let timestamp = "at" + new Date().getMilliseconds();

    function exec(str) {
        log(str);
        log(execSync(str).toString());
    }

    let message = "hop";
    message = message.split(" ").join("")
    log(message)
    exec("heroku git:clone -a " + app)
    //    execSync("mkdir temp/.git");
    traverseDir(".");
    exec("cp -R " + app + "/.git temp/.git");
    exec("cd  temp")
    exec('git add .');
    exec('git commit -m ' + message);
    exec('git push heroku master');
    fs.mkdirSync(dst);
    fs.mkdirSync(app);

} catch (e) {
    // console.log(e);
}
/* test github
execSync("git remote add origin https://github.com/fabifabi/MagicObj.git");
execSync("git  commit -m 'descriptive message'");
execSync("git push origin master");
*/