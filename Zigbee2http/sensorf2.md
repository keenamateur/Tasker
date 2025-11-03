if (!msg.sensorData) return null;

let port = 1905;
let ip = global.get("con_ip");

if (!ip || typeof ip !== "string" || !ip.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
    return null;
}

let url = `http://${ip}:${port}`;

return {
    payload: msg.sensorData,
    url: url,
    _original: {
        topic: msg.topic,
        payload: msg.payload
    }
};
