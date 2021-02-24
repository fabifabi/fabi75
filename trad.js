window.addEventListener("load", mytrad);
var trad = `
<div id="moduletrad" style="display:fixed;z-index:5000;top:5%;right:5%">
    <div>Original</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
    <div>%%lang%%</div>
</div>`;


var log = console.log
var all = {}
function mytrad() {
    var scr = document.createElement("div");
    scr.innerHTML = trad;
    log(trad, scr);
    log(scr);
    document.body.appendChild(scr);

    var mtrad = document.getElementById('moduletrad');
    mtrad.onclick = function (e) {
        var dst = e.target.innerText;
        if (dst === "Original")
            return;
        postAjax("trad.json", { url: urlsrc, lang: dst }, onsuccess);
    }
}

function makeDico(nodeBody) {
    var cloneTrad = $viewTrad.doc.createElement("trad");
    cloneTrad.style.cursor = "text";
    cloneTrad.onclick = function (event) {
        log("click");
        if (!modeEdit) return;
        event.stopImmediatePropagation();
        return false;
    }
    cloneTrad.onfocus = function (event) {
        if (!modeEdit) return;
        this.classList.add("onedit");
    };
    //cloneTrad.contentEditable = true;
    cloneTrad.onkeydown = function (event) {
        if (!modeEdit) return;
        this.classList.remove("onedit");
        var nowElm = allelement[this.id];
        var nowtext = this.innerText;
        nowElm.trad = nowtext;
        for (var i = 0; i < nowElm.where.length; i++) {
            //    nowElm.where[i].dataset.original = false;
            if (nowElm.where[i].id !== this.id)
                nowElm.where[i].innerText = nowtext;
        }
        doList()
        needsave = true;
    }

    recNode(nodeBody, function (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            var element = node;
            if (element.tagName === "IFRAME") {
                log("IFRAME ", element)
                iframeExt(element);
                element.nwfaketop = true;
                element.nwdisable = true;
                makeDico(element.body);
            }
            element.onclick = function (event) {
                if (!modeEdit) {
                    return;
                }
                event.stopImmediatePropagation();
                return false;
            }
            element.onauxclick = function (event) {
                if (!modeEdit) return;
                event.stopImmediatePropagation();
                return false;
            }
            return;
        }
        if (node.nodeType !== 3 || node.isElementContentWhitespace)
            return;
        var element = node.parentElement;
        if (element === null) {
            log("null?", node);
            return;
        }
        if (element.tagName === "SCRIPT" || element.tagName === "STYLE")
            return;
        var toTrad = node.textContent;
        toTrad = toTrad.replaceAll("\n", "").replace(/[\n\r]+|[\s]{2,}/g, ' ').trim();
        var text = toTrad;
        text = text.replaceAll("\n", " ");
        text = text.replaceAll("\t", " ");
        text = text.replace(/  +/g, ' ');
        text = normalizeWord(text, constante);
        text = text.replace(/  +/g, ' ');
        text = text.replaceAll(" ", "");
        if (text.length === 0)
            return;
        if (all[toTrad] !== undefined) {
            node.textContent = all[toTrad].trad;
        }
    });
}

function onsucess(res) {
    log(res);
    all = JSON.parse(res);
    recNode(document.body);
}