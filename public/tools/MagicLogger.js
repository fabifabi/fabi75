// read config
//console.log(JSON.stringify(window.performance.timing));
if (debug !== undefined && debug === true) {
    if (typeof logConfig === "undefined") {
        window.logConfig = {
            buffer: true,
            SendStatUrl: "",
            format: "JSON",
            event: true,
            ExcludeEvent: [],
            logException: true,
            useWorker: false,
            sendOnlyOnError: false,
            bufferSize: 10000,
            showHTMLChange: false,
            log: {
                timeStamp: true,
                stack: true,
                consoleErrorAsWarning: true,
            },
            display: {
                html: true, // todo,more option
                console: {
                    // todo
                }
            }
        }
    }


    window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
        var s = errorObj.stack.split("\n");
        var line = s[0].includes(":") ? s[0] : s[1]; // chrome put "error" on first line
        var posdeb = line.lastIndexOf("/") + 1;
        var now = line.substring(posdeb, line.indexOf(":", posdeb))
        s.shift();
        var aux = [];
        for (var i = 0; i < s.length; i++) {
            if (s[i].indexOf(now) === -1)
                aux.push(s[i]);
        }
        if (aux.length === 0) {
            alert("oups, inner error in MagicLogger,sorrrrry");
            return;
        }
        log(aux);
        var join = aux.join("\n");
        alert(join);
    }
    ___run();

    function fakeWorker() {
        this.send = function (data) {

        }
    }

    function composition(that) {
        this.tab = [];
        return function () {
            for (var i = 0; i < tab.length; i++) {
                tab[i].call(that, Array.prototype.slice.call(arguments));
            }
        }
    }

    // type, message, timestamp, 

    function ___run() {
        var $idlog = false;
        if (logConfig.display && logConfig.display.html && (typeof logConfig.display.html.id === "undefined")) {
            var html = '<div id="___console" style="overflow: scroll; position: fixed;z-index: 1000;top:5%;right:5%;width: 25%;height: 25%;background-color: rgba(255, 255, 255, 0.3);border:2px solid black ;  border-radius: 10px;"></div>';
            document.write(html);
            $idlog = document.getElementById("___console");
        }
        if (typeof logConfig.display.html.id !== "undefined")
            $idlog = logConfig.display.html.id;
        var ws;
        if (logConfig.useWorker) {
            ws = new Worker("webWorker.js");
        }
        else {
            ws = new fakeWorker();
        }

        var oldConsole = {};
        for (var i in console) {
            oldConsole[i] = console[i];
        }
        window.log = function () {
            {
                var err = new Error();
                var s = err.stack;
                var l = s.split("/n");
                var line = l[0].includes(":") ? l[1] : l[2]; // chrome put "error" on first line
                var myarg = Array.prototype.slice.call(arguments);
                //    oldConsole.log(line.trim());
                for (var i = 0; i < myarg.length; i++) {
                    oldConsole.table(myarg[i]);
                    if ($idlog !== false) {
                        $idlog.innerHTML = myarg[i] + "<br>" + $idlog.innerHTML;
                    }
                }
            }
        }
        log("___run");
        // 1: redefine log
        if (logConfig.log) {
            function redefLog(name) {
                return function () {
                    if (logConfig.log.timeStamp)
                        oldConsole.log("time", + new Date());
                    if (logConfig.log.stack) {
                        var err = new Error();
                        var s = err.stack;
                        var l = s.split("\n");
                        var line = l[0].includes(":") ? l[1] : l[2]; // chrome put "error" on first line
                        oldConsole.log(line.trim());
                    }
                    var myarg = Array.prototype.slice.call(arguments);
                    oldConsole.log(myarg);
                    if (name !== "error" || (logConfig.log && !logConfig.log.consoleErrorAsWarning)) {
                        oldConsole[name].apply(null, myarg);
                    }
                    else {
                        oldConsole["log"].apply(null, myarg);
                    }
                    if ($idlog !== false) {
                        var log = name;
                        for (var i = 0; i < myarg.length; i++)
                            log += "<br>" + myarg[i].toString();
                        $idlog.innerHTML = log + $idlog.innerHTML;
                    }
                }
            }
            for (var i in console) {
                oldConsole[i] = console[i];
                console[i] = redefLog(i);
            }
        }
        // 2: handle on event of window
        var superH = {};
        function overrideOnWindowEvent(name) {
            superH[name] = function () { };
            function closureOn(name, oldfun) {
                return function (e) {
                    console.log(" Event run by " + name, " with arguments ", e);
                    oldfun.call(window, e);
                };
            }
            window[name] = function (e) {
                if (superH[name].on === undefined)
                    return;
                oldConsole.log(name + " sent!! with:", e);
                superH[name].on.call(window, e);
            }
            Object.defineProperty(window, name, {
                set: function (x) {
                    oldConsole.log("Set the event:", name);
                    superH[name].on = x;
                }
            });
        }
        var stockOn = [];
        for (var i in window) {
            //   console.log(i, window[i]);
            if (i !== "onerror" && i.indexOf("on") === 0) {
                overrideOnWindowEvent(i);
                stockOn.push(i);
            }
        }
        // 4: setTimeout etc
        if (logConfig.timerEvent) {
            function closureOn(name, oldfun, arg) {
                return function () {
                    oldConsole.log(" Event run by " + name, "with arguments", arg);
                    oldfun.call(window, arg[0], arg[1], arg[2], arg[3], arg[4], arg[5], arg[6], arg[7], arg[8], arg[9]);
                    oldConsole.log(name, "end.");
                };
            }
            var tempout = setTimeout;
            window.setTimeout = function (fun) {
                oldConsole.log("settimeout set.", Array.prototype.slice.call(arguments, 2));
                return tempout(closureOn("setTimeout", fun, Array.prototype.slice.call(arguments, 2)));
            };
            var tempinter = setInterval;
            window.setInterval = function (fun) {
                oldConsole.log("setInterval set.", Array.prototype.slice.call(arguments, 2));
                return tempinter(closureOn("setInterval", fun, Array.prototype.slice.call(arguments, 2)));
            };
            var tempCleanInter = clearInterval;
            window.clearInterval = function (h) {
                oldConsole.log("ClearInterval.");
                tempCleanInter(h);
            };
            var tempCleanTimeout = clearTimeout;
            window.clearInterval = function (h) {
                oldConsole.log("ClearTimeout.");
                tempCleanTimeout(h);
            };
        }

        // intercept onclick in html
        function hookOnHTML(n) {
            for (var i = 0; i < stockOn.length; i++) {
                var q = "[" + stockOn[i] + "]";
                var inject = "console.log('call " + stockOn[i] + "');"
                var on = n.querySelectorAll(q);
                for (var j = 0; j < on.length; j++) {
                    var txt = on[j].getAttribute(stockOn[i]);
                    var txt = inject + txt;
                    oldConsole.log(txt);
                    on[j].setAttribute(stockOn[i], txt);
                }
            }
        };

        // 3: intercept added html
        var configMut = { childList: true, subtree: true };

        function node2elm(node) {
            if (node.nodeType !== Node.ELEMENT_NODE)
                return false;
            var papa = node.parentElement;
            if ($idlog && papa.id === "___console")
                return false;
            for (var i = 0; i < papa.children.length; i++) {
                var elm = papa.children[i];
                if (elm.isSameNode(node))
                    return elm;
            }
            return false;
        }

        // Callback function to execute when mutations are observed
        var callback = function (mutationsList, observer) {
            for (var i = 0; i < mutationsList.length; i++) {
                var mutation = mutationsList[i];
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // mutation.target, 
                    oldConsole.log("----added", mutation.addedNodes, mutation);
                    for (var j = 0; j < mutation.addedNodes.length; j++) {
                        var n = mutation.addedNodes[j];
                        var elm = node2elm(n);
                        if (elm === false)
                            continue;
                        hookOnHTML(elm);
                    }
                }
            }
        };

        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);
        if (logConfig.showHTMLChange)
            observer.observe(document, configMut);

        // override addvenetlistener
        function callFun(str, fun, that) {
            var truc = function (arg) {
                oldConsole.log("event:", str, that, arg);
                fun.bind(that)(arg);
            };
            return truc;
        }

        function MyaddEventListener(str, fun, x) {
            oldConsole.log("add event", str);
            if (typeof this.__added === "undefined")
                this.__added = [];
            var add = callFun(str, fun, this);
            if (typeof x === "undefined")
                x = {};
            this.__added.push({ key: fun.toString(), arg: JSON.stringify(x), myfun: add })
            this.addEventListener2(str, add, x);
        }

        function MyremoveEventListener(str, fun, x) {
            oldConsole.log("remove event", str);
            var funStr = fun.toString();
            if (typeof x === "undefined")
                x = {};
            var argStr = JSON.stringify(x);
            for (var i = 0; i < this.__added.length; i++) {
                if (this.__added[i].key === funStr && this.__added[i].arg === argStr) {
                    this.removeEventListener2(str, this.__added[i].myfun);
                    this.__added.splice(i, 1);
                    return;
                }
            }
            oldConsole.log("Error ! not such event...");
        }
        if (logConfig.event) {
            EventTarget.prototype.addEventListener2 = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = MyaddEventListener;

            EventTarget.prototype.removeEventListener2 = EventTarget.prototype.removeEventListener;
            EventTarget.prototype.removeEventListener = MyremoveEventListener;

        }

        //   all(window);
        function all(obj) {
            //        log(typeof obj + "--------------run");
            for (var i in obj) {
                if (i === "parent")
                    continue;
                if (i.indexOf("on") === 0) {

                }
                if (typeof obj[i] === "object") {
                    log(i + " : est un object");
                    all(obj[i]);
                }
                else
                    log(i + " :" + typeof obj[i]);
            }

        }


    }

    //alert("b.js");
    function hop() {
        console.log("hop");
    }
    /*
    var temp = setTimeout;   
    //eval("var setTimeout;");
    var setTimeout;
    setTimeout = function () { };
    
    setTimeout(hop, 100);
    window.setTimeout(hop, 50);
    //temp(hop, 50);
    //var aux = GlobalEventHandlers.onclick;
    //document.addEventListener("DOMContentLoaded", ready);
    
    var tempw = {};
    eval("var window;");
    window = tempw;
    var onclick2 = Window.prototype.onclick;
    
    Object.defineProperty(window, 'onclick', {
        set: function (x) {
            console.log("try to set on click in window!");
            onclick2 = x;
        }
    });*/

    function alerte() { }
    /*var oldw = window;
    var tempw = {};
    eval("var window;");
    //window = tempw;*/
    //var onclick2 = window.onclick;
    /*
    Object.defineProperty(window, 'onclick2', {
        set: function (x) {
            window.onclick = x;
            console.log("try to set on click in window!");
            //        oldw.setAttribute("onclick")
            //    Window.prototype.onclick = x;
        }
    });*//*
    Object.defineProperty(window, 'onclick', {
        set: function (x) {
            console.log(x, "try to set on click in window!");
            document.onclick = x;
            //        oldw.setAttribute("onclick")
            //    Window.prototype.onclick = x;
        }
    });*/

    /*
    window.onclick = function (e) {
        console.log("my onclick event!!");
        this.onclickH.on.call(window, e);
    }*/


    //overrideOnWindowEvent("onclick");
    console.log("-----end");
    /*Document.prototype.createElement2 = Document.prototype.createElement;
    Document.prototype.createElement = function (txt) {
        console.log(txt);
        var res = document.createElement2(txt);
        Object.defineProperty(res, 'onclick', {
            set: function (x) {
                //    console.log("try to set on click !");
            }
        });
        return res;
    };*/

    /*
    Object.defineProperty(document.body, 'onclick', {
        set: function (x) {
            console.log("try to set on click in body!");
        }
    });*/


    /*
    var old = document;
    for (var i in document) {
    console.log(i, document[i]);
    eval("var " + i + ";");
    }
    */

    function ready() {
        /*  var temp2 = document;
       
           eval("var document={body:{onclick:0}};");
           eval("var body;");
           var document;
           document.onclick = function () { }
           document.body.onclick = function () { }*/
        var clicks = document.querySelectorAll("[onclick]");
        for (var i = 0; i < clicks.length; i++) {
            console.log(clicks[i].getAttribute("onclick"));
            clicks[i].setAttribute("onclick", "");
        }

        return;
        // Options for the observer (which mutations to observe)
        const config = { attributeFilter: ["onclick"], attributes: true, childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        const callback = function (mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for (let mutation of mutationsList) {
                console.log(mutation);
                if (mutation.type === 'childList') {
                    console.log(mutation.target, mutation.addedNodes, 'A child node has been added or removed.');
                }
                else if (mutation.type === 'attributes') {
                    console.log('The ' + mutation.attributeName + ' attribute was modified.');
                }
            }
            // observer.disconnect();
            var clicks = document.querySelectorAll("[onclick]");
            for (var i = 0; i < clicks.length; i++) {
                //    clicks[i].setAttribute("onclick", "");
            }
            // setTimeout(function () { observer.observe(document, config); }, 0);
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        //   observer.observe(document, config);
        Document.prototype.createElement2 = Document.prototype.createElement;
        Document.prototype.createElement = function (txt) {
            console.log(txt);
            var res = document.createElement2(txt);
            Object.defineProperty(res, 'onclick', {
                set: function (x) {
                    console.log("try to set on click !");
                }
            });
            return res;
        };

        //document.getElementById("div").setAttribute("onclick", function () { console.log("b"); });
    }
}