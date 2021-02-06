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

var urlFr2pt = 'https://www.googleapis.com/language/translate/v2?target=pt&source=fr&format=text&key=' + api + '&q=';
var urlPt2fr = 'https://www.googleapis.com/language/translate/v2?target=fr&source=pt&format=text&key=' + api + '&q=';

var hop, hop2;

function change(src, urlsrc, urldst) {
    var enc = encodeURI(src.value);
    clearTimeout(hop);
    clearTimeout(hop2);
    hop = setTimeout(
        get
        , 1000);
    function get() {
        getAjax(urlsrc + enc, function (res) {
            var txt = JSON.parse(res);
            log(txt);
            var val = txt.data.translations[0].translatedText
            trad.value = val;
            var enc = encodeURI(trad.value);
            trad.select();
            trad.setSelectionRange(0, 99999); /* For mobile devices */
            document.execCommand("copy");
            src.focus();
            hop = setTimeout(
                get2
                , 2000);
            function get2() {
                getAjax(urldst + enc, function (res) {
                    var txt = JSON.parse(res);
                    log(txt);
                    var val = txt.data.translations[0].translatedText
                    trad2.value = val;
                })
            }
        })
    }
}

function changeFr() {
    change(fr, urlFr2pt, urlPt2fr)
}
function changePt() {
    change(pt, urlPt2fr, urlFr2pt)
}
//window.onload = change;
//setTimeout("change()", 4000);
