var socket = io.connect("/");
socket.on("connect", () => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    socket.emit("hop", { name: "hop" })
});

socket.on("disconnect", () => {
    console.log(socket.id); // undefined
});
socket.on("message", function (event) {
    console.log(event)
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

var $chat = document.querySelector("#chat");
var $text = document.querySelector("#text");
var $main = document.querySelector("#main");
var $login = document.querySelector("#login");
var $name = document.querySelector("#name");
var $notif = document.querySelector("#notif");
var $bip = document.querySelector("#bip");
/*
$notif.addEventListener('click', function () {
// Premièrement, vérifions que nous avons la permission de publier des notifications. Si ce n'est pas le cas,
demandons la
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
    }
});

$text.addEventListener("keyup", function (event) {
    socket.emit("message", user + "¤ " + $text.value);
    if (event.key === "Enter") {
        socket.emit("message", user + "¤ " + $text.value);
        old = $text.value;
        $text.value = "";
    }
    if (event.which === 38) {
        $text.value = old;
    }
});
socket.on("message", function (event) {
    console.log(event)
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
socket.on("connect", function (event) {
    console.log(event)
    if (visible === false) {
        bip.play();
    }
    var html = $chat.innerHTML;
    var txt = ["hop", "hop"];//event.data.split("¤ ");
    if (window.Notification && Notification.permission === "granted") {
        var n = new Notification(txt[0] + " : " + txt[1]);
    }
    html += txt[0] + " : " + txt[1];
    $chat.innerHTML = html + "<br>";
    $chat.scrollTop = 1000000;
});
socket.on("connected", function (event) {
    console.log(event)
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
});

