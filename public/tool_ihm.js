// @ts-check
/*function windowResize() {
    if (!isready)
        return;
    var w = window.innerWidth;
    var h = window.innerHeight;
    w = Math.min(w, 1000);
    h = Math.min(h, 1000);
    var ratio = w / h;
    if (isFn(resizeAll))
        resizeAll(ratio);
}
window.onresize = windowResize;
*/

function log() {
    //  alert("ok")
    var err = new Error();
    var s = err.stack;
    var l = s.split("\n");
    var res = [];
    for (var i = 0; i < l.length; i++) {
        var s = l[i];
        s = s.replace('"', "")
        s = s.replace("'", "")
        s = s.replace(" at ", " ")
        if (s === "Error" || s.length === 0)
            continue;
        if (s.indexOf("tool_ihm.js") === -1)
            res.push(s);
    }
    console.log(res);
    var all = +Date.now() + ":" + JSON.stringify(arguments) + "\n";
    console.log(all);
    if (typeof require !== "undefined") {
        var fs = require("fs")
        all = all + res.toString();
        fs.appendFileSync("log.txt", all);
    }
}

function openFullscreen() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem.msRequestFullscreen();
    }
}

function closeFullscreen() {
    var doc = document;
    if (doc.exitFullscreen) {
        doc.exitFullscreen();
    } else if (doc.mozCancelFullScreen) {
        /* Firefox */
        doc.mozCancelFullScreen();
    } else if (doc.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        doc.webkitExitFullscreen();
    } else if (doc.msExitFullscreen) {
        /* IE/Edge */
        doc.msExitFullscreen();
    }
}


function getAjax(url, fun, err, progress) {
    var r = new XMLHttpRequest();
    r.open("GET", url, true);
    r.onprogress = progress;
    r.onreadystatechange = function () {
        if (r.readyState !== 4)
            return;
        if (r.status === 200)
            fun(r.responseText);
        else if (err)
            err();
    };
    r.send();
}

function getAjaxLS(url, fun, err, progress) {
    if (localStorage[url] !== undefined) {
        fun(localStorage[url]);
        return;
    }
    var r = new XMLHttpRequest();
    r.open("GET", url, true);
    r.onprogress = progress;
    r.onreadystatechange = function () {
        if (r.readyState !== 4)
            return;
        if (r.status === 200) {
            localStorage[url] = r.responseText;
            fun(r.responseText);
        } else if (err)
            err();
    };
    r.send();
}

function postAjax(url, data, success, progress) {
    var params = typeof data === "string" ?
        data :
        Object.keys(data)
            .map(function (k) {
                return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
            })
            .join("&");
    var xhr = XMLHttpRequest ?
        new XMLHttpRequest() :
        new ActiveXObject("Microsoft.XMLHTTP");
    xhr.onprogress = progress;
    xhr.open("POST", url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState > 3 && xhr.status === 200) {
            if (success !== undefined)
                success(xhr.responseText);
        }
    };
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(params);
    return xhr;
}


window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
    var div = document.createElement("div")
    div.innerHTML = 'Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber + ' Column: ' + column + ' StackTrace: ' + errorObj
    log(div.innerHTML);
    document.body.insertAdjacentElement('afterbegin', div);
};

Element.prototype.$id = function (sel) {
    return this.getElementById(sel);
}

Element.prototype.$class = function (sel) {
    return this.getElementsByClassName(sel);
}

Element.prototype.$forAllEvent = function (sel, event, fun) {
    var all = this.$all(sel);
    for (var i = 0; i < all.length; i++) {
        all[i][event] = fun.bind(all[i]);
    }
}

Element.prototype.$forAllMap = function (sel, fun) {
    var all = this.$all(sel);
    for (var i = 0; i < all.length; i++) {
        fun.call(all[i]);
    }
}

Element.prototype.$sel = function (sel) {
    return this.querySelector(sel);
}

Element.prototype.$all = function (sel) {
    return this.querySelectorAll(sel);
}

Element.prototype.appendDiv = function (str) {
    var scr = document.createElement("div");
    scr.innerHTML = str;
    this.appendChild(scr);
}

function appendScript(str, dst, doc) {
    if (!!doc) {
        doc = document;
    }
    var scr = doc.createElement("script").innerHTML = str;
    dst.appendChild(scr);
}

function $id(sel) {
    return document.getElementById(sel);
}

function $class(sel) {
    return document.getElementsByClassName(sel);
}

function $forAllEvent(sel, event, fun) {
    var all = $all(sel);
    for (var i = 0; i < all.length; i++) {
        all[i][event] = fun.bind(all[i]);
    }
}

function $forAllMap(sel, fun) {
    var all = $all(sel);
    for (var i = 0; i < all.length; i++) {
        fun.call(all[i]);
    }
}

function $sel(sel) {
    return document.querySelector(sel);
}

function $all(sel) {
    return document.querySelectorAll(sel);
}

function $changeCSS(sel, newval, doc) {
    var style = document.createElement('style');
    style.innerHTML = sel + '{' + newval + '}';
    if (!!doc) {
        doc.appendChild(style);
    } else {
        document.head.appendChild(style);
    }
}

function recNode(node, fn) {
    if (fn(node) === false)
        return false;
    for (let i = 0; i < node.childNodes.length; i++)
        recNode(node.childNodes[i], fn)
}

function recElement(elm, fn) {
    if (fn(elm) === false)
        return false;
    for (let i = 0; i < elm.children.length; i++)
        recElement(elm.children[i], fn);
}

function makeID() {
    recNode(document, function (node) {
        if (node.id !== undefined)
            window["$" + node.id] = node;
    });
}
//window.makeID = makeID;
