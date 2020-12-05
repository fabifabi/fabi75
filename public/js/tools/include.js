function include(url) {
    /*    var ext = url.substr(url.lastIndexOf(".") + 1);
        console.log(ext);
        if (ext==="js")*/
    document.write("<script src='" + url + "'></script>")
}

// exemple :
include("js/tools/tool_ihm.js");
include("js/lib/socket.io.js");
include("js/main.js");