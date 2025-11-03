
if (!msg.topic || typeof msg.topic !== "string") {
    return null;
}

const topicParts = msg.topic.split('/');
if (topicParts.length !== 6 || topicParts[0] !== "gtl" ||
    !["l1", "l2"].includes(topicParts[4]) || topicParts[5] !== "set" ||
    topicParts[3] == "Dimmer") {
    return null;
}

const room = topicParts[2];
const baseDeviceName = topicParts[3];
const channel = topicParts[4];
const avdevicename = `${baseDeviceName}/${channel}`;
const type = "power";

const allowedRooms = ["GTL", "Nappali", "Konyha", "Fürdő", "Háló", "Terasz", "Biztonság", "Műhely", "Garázs", "Áram", "Szerver", "Sátor"];

if (!allowedRooms.includes(room)) {
    return null;
}

// STRING payload kezelése (/set topic-oknál)
let avnewstatus;
if (typeof msg.payload === "string") {
    if (msg.payload === "OFF" || msg.payload === "off") {
        avnewstatus = "OFF";
    } else if (msg.payload === "ON" || msg.payload === "on") {
        avnewstatus = "ON";
    } else {
        return null;
    }
}
// OBJECT payload kezelése
else if (typeof msg.payload === "object" && msg.payload.state) {
    if (msg.payload.state === "OFF") {
        avnewstatus = "OFF";
    } else if (msg.payload.state === "ON") {
        avnewstatus = "ON";
    } else {
        return null;
    }
}
else {
    return null;
}

let port = 1905;
let ip = global.get("con_ip");

if (!ip || typeof ip !== "string" || !ip.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
    return null;
}

let url = `http://${ip}:${port}`;

return {
    payload: {
        room: room,
        avdevicename: avdevicename,
        avnewstatus: avnewstatus,
        type: type
    },
    url: url,
    _original: {
        topic: msg.topic,
        payload: msg.payload
    }
};
