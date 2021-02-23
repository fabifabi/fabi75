"use strict";
var api = "AIzaSyBu55yQpFnfcJD9ncVAzhQmXl61d-F-hHE"
var log = console.log;
var test = {
    "q": "The Great Pyramid of Giza (also known as the Pyramid of Khufu or the Pyramid of Cheops) is the oldest and largest of the three pyramids in the Giza pyramid complex.",
    "source": "en",
    "target": "es",
    "format": "text"
};

var text = "Bonjour ! comment ca va ?";

var urlFr2pt = 'https://www.googleapis.com/language/translate/v2?target=%%&source=##&format=text&key=' + api + '&q=';
var urlPt2fr = 'https://www.googleapis.com/language/translate/v2?target=%%&source=##&format=text&key=' + api + '&q=';

var urlDetect = "https://translation.googleapis.com/language/translate/v2/detect";

var hop, hop2;

function focus() {
    log("focus");
    if (navigator.clipboard && navigator.clipboard.readText)
        navigator.clipboard.readText().then(function (clipText) { if (clipText.length === 0) return; srcid.value = clipText; change(srcid.value); });
}
window.onfocus = focus;

function change(src) {
    var enc = encodeURI(src);
    clearTimeout(hop);
    clearTimeout(hop2);
    hop = setTimeout(
        get
        , 500);
    function get() {
        postAjax(urlDetect, { key: api, q: src }, function (res) {
            var txt = JSON.parse(res);
            log(txt);
            var lang = txt.data.detections[0][0].language;
            log(txt.data);
            log(lang);
            var urls = urlFr2pt.replace("##", localStorage.langdst).replace("%%", localStorage.lang);
            var urld = urlPt2fr.replace("##", localStorage.lang).replace("%%", localStorage.langdst);
            if (lang === localStorage.lang) {
                urld = urlFr2pt.replace("##", localStorage.langdst).replace("%%", localStorage.lang);
                urls = urlPt2fr.replace("##", localStorage.lang).replace("%%", localStorage.langdst);
                //                    clipText => document.getElementById("outbox").innerText = clipText);

            }
            getAjax(urls + enc, function (res) {
                var txt = JSON.parse(res);
                log(txt);
                var val = txt.data.translations[0].translatedText
                trad.value = val;
                //var enc = encodeURI(trad.value);
                //     trad.select();
                /*                trad.setSelectionRange(0, 99999); /* For mobile devices */
                /*document.execCommand("copy");
                srcid.focus();*/
                if (navigator.clipboard && navigator.clipboard.writeText)
                    navigator.clipboard.writeText(trad.value).then(function () {
                        /* clipboard successfully set */
                    }, function () {
                        /* clipboard write failed */
                    });
                //                navigator.clipboard.readText().then(
                get2();/*
                    hop2 = setTimeout(
                        get2
                        , 500);*/
                function get2() {
                    getAjax(urld + enc, function (res) {
                        var txt = JSON.parse(res);
                        log(txt);
                        var val = txt.data.translations[0].translatedText
                        trad2.value = val;
                    });
                }
            });
        });
    }
}

window.onload = openFullscreen;
//setTimeout("change()", 4000);
