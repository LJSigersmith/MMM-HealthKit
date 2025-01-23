
const NodeHelper = require("node_helper");
const express = require("express");
const bodyParser = require("body-parser");

module.exports = NodeHelper.create({
    start: function () {
        this.healthData = null;

        // set up express server to recieve data
        this.expressApp = express();
        this.expressApp.use(bodyParser.json());

        // Endpoint to recieve HealthKit data
        this.expressApp.post("/healthData", (req, res) => {
            console.log("Recieved HealthKit data:", req.body);
            this.healthData = req.body; // store data
            this.sendSocketNotification("HEALTH_DATA", this.healthData);
            res.status(200).send({ message: "Data recieved successfully" });
        });

        // Start server
        this.expressApp.listen(8080, () => {
            console.log("MMM-HealthKit helper listening on port 8080.");
        });
    },

    socketNotificationRecieved: function (notification, payload) {
        if (notification === "REQUEST_HEALTH_DATA") {
            this.sendSocketNotification("HEALTH_DATA", this.healthData);
        }
    }
});