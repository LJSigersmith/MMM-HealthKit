// Backend helper file
// Handles communication between frontend and external data

// Imports & Setup
const NodeHelper = require("node_helper");
const axios = require("axios"); // HTTP requests
const { spawn } = require("child_process"); // External server.js process


module.exports = NodeHelper.create({
    start: function () {
        this.healthData = null; // Store the health data
        console.log("MMM-HealthKit helper started!");

        // Start local server.js
        this.serverProcess = spawn("node", ["server.js"], {
            cwd: __dirname, //ensure it runs from module's directory
            detached: true, // Keep process running independently
            stdio: ["ignore", "pipe", "pipe"],
        });

        // Log server output
        this.serverProcess.stdout.on("data", (data) => {
            console.log(`Server: ${data.toString()}`);
        });

        this.serverProcess.stderr.on("data", (data) => {
            console.error(`Server Error: ${data.toString()}`);
        });

        this.serverProcess.on("close", (code) => {
            console.log(`Server process exited with code ${code}`);
        });

    },
    stop: function () {
        if (this.serverProcess) {
            console.log("Stopping server...");
            this.serverProcess.kill(); // terminate server process
            this.serverProcess = null;
        }
    },
    socketNotificationReceived: function (notification, payload) {
        // Wait for REQUEST_HEALTH_DATa from frontend
        if (notification === "REQUEST_HEALTH_DATA") {
            console.log("Received REQUEST_HEALTH_DATA notification.");

            // Fetch data from the remote server
            axios
                .get("http://localhost:3000/healthData") // Replace with your server IP and port
                .then((response) => {
                    this.healthData = response.data; // Store the fetched data
                    console.log("Fetched data from remote server:", this.healthData);

                    // Send the data to the MagicMirror module
                    this.sendSocketNotification("HEALTH_DATA", this.healthData);
                })
                .catch((error) => {
                    console.error("Error fetching data from remote server:", error.message);
                });
        }
    }
});
