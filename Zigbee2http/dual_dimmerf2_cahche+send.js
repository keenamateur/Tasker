// Initialize cache if it doesn't exist
flow.set('device_status_cache', flow.get('device_status_cache') || {});

// Get current device status from the message
const deviceName = msg.payload.avdevicename;
const newStatus = msg.payload.avnewstatus;

// Get current cache
const cache = flow.get('device_status_cache');

// Check for a previous state for this device
if (cache[deviceName]) {
    // If the state hasn't changed, filter out this message
    if (cache[deviceName].status === newStatus) {
        return null;
    }
}

// Update cache with new state (regardless of whether it was in cache before)
cache[deviceName] = {
    timestamp: Date.now(),
    status: newStatus
};
flow.set('device_status_cache', cache);

// IP and port handling
let port = 1905;
let ip = global.get("con_ip");

// Validate IP address
if (!ip || typeof ip !== "string" || !ip.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
    return null;
}

// Coreate output message
let url = `http://${ip}:${port}`;

// Return the original payload structure with URL
return {
    payload: {
        room: msg.payload.room,
        avdevicename: deviceName,
        avnewstatus: newStatus,
        type: msg.payload.type
    },
    url: url,
    // Optional: keep original data for debug
    _original: {
        topic: msg.topic,
        payload: msg.payload
    }
};
