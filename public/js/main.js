makeID();

var socket = io.connect();
socket.on("connect", () => {
    console.log("socket id ", socket.id); // x8WIv7-mJelg7on_ALbx
    socket.emit("hop", { type: "msg", txt: "hop" })
});

socket.on("disconnect", () => {
    console.log("bye ", socket.id); // undefined
});

function notify(str) {
    if (window.Notification && Notification.permission === "granted") {
        new Notification(str);
    }
}

socket.on("message", function (event) {
    console.log(event)
    if (visible === false) {
        bip.play();
    }
    var html = $chat.innerHTML;
    var w = event.txt;
    notify(w);
    html += w;
    $chat.innerHTML = html + "<br>";
    $chat.scrollTop = 1000000;
});


$notif.addEventListener('click', function () {
    if (visible)
        return;
    if (window.Notification && Notification.permission !== "granted") {
        Notification.requestPermission(function (status) {
            if (Notification.permission !== status) {
                Notification.permission = status;
            }
        });
    }
});

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
    }
});

$text.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        socket.emit("message", { type: "msg", txt: user + "¤ " + $text.value });
        old = $text.value;
        $text.value = "";
    }
    if (event.which === 38) {
        $text.value = old;
    }
});
