function initWS(url, onmessage) {
    var myws = {
        send: function () { }
    };
    function reinit() {
        try {
            var webSocket = new WebSocket("ws://" + url);
            webSocket.onopen = function (event) {
            };
            webSocket.onmessage = function (event) {
                console.log("message come", event.data);
                onmessage(event);
            }
            webSocket.onerror = function (event) {
                myws = reinit(url, onmessage);
            }
        }
        catch (e) {
            myws = reinit();
        }
        myws.send = webSocket.send;
        return myws;
    }
    myws = reinit();
    return myws;
}