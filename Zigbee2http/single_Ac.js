 if (!msg.topic || typeof msg.topic !== "string") {
    return null;
}

const topicParts = msg.topic.split('/');
if (topicParts.length !== 4 || topicParts[0] !== "gtl") {
    return null;
}

const room = topicParts[2];
const avdevicename = topicParts[3]; 
const type = "power";

const deviceName = topicParts[3];
const knownDualDevices = ["HDD1", "HDD2", "Dimmer", "DualSwitch", "TöltőZgb"]; // Add ide az összes dupla eszköz nevet
// Filter for conflicting (multichanel)devices to avoid redundacy 
if (knownDualDevices.includes(deviceName)) {
    return null;
}

const allowedRooms = ["GTL", "Nappali", "Konyha", "Fürdő", "Háló", "Terasz", "Biztonság", "Műhely", "Garázs", "Áram", "Szerver", "Sátor"];

if (!allowedRooms.includes(room)) {
    return null;
}

if (!msg.payload || typeof msg.payload !== "object" || !msg.payload.state) {
    return null;
}

let avnewstatus;
if (msg.payload.state === "OFF") {
    avnewstatus = 0;
} else if (msg.payload.state === "ON") {
    avnewstatus = msg.payload.brightness !== undefined ? msg.payload.brightness : 100;
} else {
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
