if (document.readyState !== 'loading') {
    run();
} else {
    document.addEventListener('DOMContentLoaded', run);
}

function run() {
    var $chat = document.querySelector("#chat");
    var $text = document.querySelector("#text");
    var $main = document.querySelector("#main");
    var $login = document.querySelector("#login");
    var $name = document.querySelector("#name");
    var $notif = document.querySelector("#notif");
    var $bip = document.querySelector("#bip");
    var myip = "https://fabi75.herokuapp.com:8081";

    var ws = initWS(myip, function (event) {
        if (visible === false) {
            bip.play();
        }
        var html = $chat.innerHTML;
        var txt = event.data.split("¤ ");
        if (window.Notification && Notification.permission === "granted") {
            var n = new Notification(txt[0] + " : " + txt[1]);
        }
        html += txt[0] + " : " + txt[1];
        $chat.innerHTML = html + "<br>";
        $chat.scrollTop = 1000000;
        console.log(event.data);
    });
    ws.send("hop");
    return;
    /*
    $notif.addEventListener('click', function () {
        // Premièrement, vérifions que nous avons la permission de publier des notifications. Si ce n'est pas le cas, demandons la
        if (window.Notification && Notification.permission !== "granted") {
            Notification.requestPermission(function (status) {
                if (Notification.permission !== status) {
                    Notification.permission = status;
                }
            });
        }
    });*/
    var visible = true;
    window.onblur = function () {
        visible = false;
    }
    window.onfocus = function () {
        visible = true;
    }

    var user = "";
    $name.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            user = $name.value;
            $login.style.display = "none";
            $main.style.display = "block";
            webClient();
        }
    });
    function webClient() {
        var exampleSocket = new WebSocket("ws://" + myip);
        exampleSocket.onopen = function (event) {
            exampleSocket.send(user + "¤ " + " is connected !! ");
            var old = "";
            $text.addEventListener("keyup", function (event) {
                if (event.key === "Enter") {
                    exampleSocket.send(user + "¤ " + $text.value);
                    old = $text.value;
                    $text.value = "";
                }
                if (event.which === 38) {
                    $text.value = old;
                }
                up: 38
            });
            exampleSocket.onmessage = function (event) {
                if (visible === false) {
                    bip.play();
                }
                var html = $chat.innerHTML;
                var txt = event.data.split("¤ ");
                if (window.Notification && Notification.permission === "granted") {
                    var n = new Notification(txt[0] + " : " + txt[1]);
                }
                html += txt[0] + " : " + txt[1];
                $chat.innerHTML = html + "<br>";
                $chat.scrollTop = 1000000;
                console.log(event.data);
            }
            exampleSocket.onerror = function (event) {
                location.reload(true);
            }
        };
    }
}