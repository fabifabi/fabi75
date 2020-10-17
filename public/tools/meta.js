//   all(window);
//don't work on array
function all(obj, tabexception, funproxy, propchange, propread) {
    //        log(typeof obj + "--------------run");
    for (var i in obj) {
        try {
            if (tabexception.indexOf(i) > -1)
                continue;
            if (Array.isArray(obj[i]))
                continue;
            if (typeof obj[i] === "object") {
                all(obj[i], tabexception, funproxy, propchange, propread);
                continue;
            }
            if (typeof obj[i] === "function") {
                obj[i] = funproxy(i, obj[i]);
                continue;
            }
            Object.defineProperty(obj, i, {
                set: function (newval) { propchange(i, obj[i], newval); },
                get: function () { return propread(i, obj[i]); }
            });
        }
        catch (e) {
            log(i, " : ", e);
        }

    }
}

