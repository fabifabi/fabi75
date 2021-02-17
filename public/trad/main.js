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
            var lang = txt.data.detections.language;
            var urls = urlFr2pt.replace("##", localStorage.langdst).replace("%%", localStorage.lang);
            var urld = urlPt2fr.replace("##", localStorage.lang).replace("%%", localStorage.langdst);
            if (lang === localStorage.lang) {
                urls = urlFr2pt.replace("##", localStorage.lang).replace("%%", localStorage.langdst);
                urld = urlPt2fr.replace("##", localStorage.langdst).replace("%%", localStorage.lang);

            }
            getAjax(urls + enc, function (res) {
                var txt = JSON.parse(res);
                log(txt);
                var val = txt.data.translations[0].translatedText
                trad.value = val;
                //var enc = encodeURI(trad.value);
                trad.select();
                trad.setSelectionRange(0, 99999); /* For mobile devices */
                document.execCommand("copy");
                srcid.focus();
                /*    hop2 = setTimeout(
                        get2
                        , 500);
                    function get2() {
                        getAjax(urld + enc, function (res) {
                            var txt = JSON.parse(res);
                            log(txt);
                            var val = txt.data.translations[0].translatedText
                            trad2.value = val;
                        });
                    }*/
            });
        });
    }
}

window.onload = openFullscreen;
//setTimeout("change()", 4000);
