
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000; // port server runs on

let latestHealthData = {};

// Parse JSON data
app.use(bodyParser.json())

// handle incoming HealthKit data
app.post("/healthData", (req, res) => {
    
    console.log("Received HealthKit data: ", req.body);

    // process/save data
    //const activityData = req.body;
    latestHealthData = req.body;

    // Log recieved data
    console.log("Move: ", latestHealthData.move);

    // respond to client
    res.status(200).send({ message: "Data recieved successfully" });

});

app.get("/healthData", (req,res) => {

    if (Object.keys(latestHealthData).length > 0) {
        res.status(200).json(latestHealthData);
    } else {
        res.status(404).send({ message: "No data available"});
    }
    //if (latestHealthData) {
    //    res.status(200).json(latestHealthData);
    //} else {
    //    res.status(404).send({ message: "No data available"});
    //}
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
