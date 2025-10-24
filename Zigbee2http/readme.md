
# Zigbee2Mqtt2HTTP Node-RED Flow

This Node-RED flow processes status updates from Zigbee2MQTT (Z2M) via MQTT and translates them into custom HTTP GET requests for a connected home automation system. It also handles initial IP configuration and includes a simple motion-based lighting automation.


### Node-RED Setup
<div style="display: flex; gap: 20px;">
  <img src="/docs/images/zgb2http.png" alt="zgb2http" width="95%"/>
</div>

## Features

*   **Global IP Configuration:** Reads/writes the `con_ip` to a file (`media/con_ip`) and stores it as a global flow variable (`global.con_ip`) for use in all subsequent HTTP requests.
*   **Single AC/Switch Control:** Translates simple `ON`/`OFF` or `brightness` states for single-channel devices (e.g., lights, switches) into an HTTP request on port 1905.
*   **Dual AC/Switch Control (/set topics):** Translates command messages (`.../l1/set`, `.../l2/set`) for multi-channel devices into an HTTP request on port 1905.
*   **Sensor Data:** Processes data from temperature/humidity, contact (door/window), and motion sensors, sending the relevant status updates to the custom backend via HTTP on port 1905.
*   **Motion-to-Light Automation:** A dedicated logic block monitors motion sensors in the `Biztonság` (Security) room and publishes an `ON`/`OFF` state to a corresponding RGB light's `set` topic (e.g., `gtl/gtl/RoomName/RGB-RoomName/set`), filtered to prevent unnecessary rapid updates.
*   **Full Device Read:** Processes the Z2M bridge's device list and forwards the structured JSON data via HTTP to a backend endpoint on port 1904.

## Prerequisites

*   **Node-RED:** Installed and running.
*   **MQTT Broker:** Configured and accessible (using the config node `4644b114d998fd7b`).
*   **Custom Backend:** A target system listening for HTTP GET requests on ports `1904` (full device list) and `1905` (device status updates) at the IP address stored in `global.con_ip`.

## Dependencies (Standard Nodes)

This flow primarily uses core Node-RED nodes, with the exception of the MQTT broker connection.

*   `node-red-node-base` (Standard core nodes like `inject`, `change`, `function`, `debug`, `http request`, `file`, `file in`).
*   `node-red-node-mqtt` (Standard MQTT nodes).
