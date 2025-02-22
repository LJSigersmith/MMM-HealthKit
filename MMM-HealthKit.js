// Frontend module
// Integrates with MagicMirror
// Displays Data

Module.register("MMM-HealthKit", {
   
    // Config 
    defaults: {
        updateInterval: 60000,
        serverURL: "http://localhost:3000/healthData"
    },
    getScripts: function () {
        return [
            this.file("chart.min.js") // Path to Chart.js
        ];
    },

    // Setup
    start: function () {
        this.healthData = null; // Stores health data
        
        this.getData();
        setInterval(() => {
            this.getData();
        }, this.config.updateInterval); // call getData every 60 seconds
    },
    getData: function () {
        this.sendSocketNotification("REQUEST_HEALTH_DATA", null); // sends REQUEST_HEALTH_DATA to node_helper.js
    },

    // Listen for response
    socketNotificationReceived: function (notification, payload) {
        if (notification === "HEALTH_DATA") {
            console.log("Recieved health data: ", payload);
            this.healthData = payload; // update health data
            this.updateDom();
        }
    },

    // Setup UI
    getDom: function () {
        const wrapper = document.createElement("div");
        // While no health data exists
        if (!this.healthData) {
            wrapper.innerHTML = "Waiting for health data....";
            return wrapper;
        }

        // Display health data
        const { activityRings, latestHeartRate, weightData, caloriesConsumed, macros, sleepHours } = this.healthData;
        console.log("Activity Rings: ", this.healthData.activityRings);
        console.log("Latest Heart Rate: ", this.healthData.latestHeartRate);
        console.log("Calories Consumed: ", this.healthData.caloriesConsumed);
        console.log("Macros: ", this.healthData.macros);
        console.log("SLeep Hours: ", this.healthData.sleepHours);

        // Create a container for the health data
        const dataContainer = document.createElement("div");
        dataContainer.innerHTML = `
            <div>
                <h3>HealthKit Data</h3>
                
                ${activityRings ? `
                    <p>Move: ${activityRings.move[0]} / ${activityRings.move[1]} kcal</p>
                    <p>Exercise: ${activityRings.exercise[0]} / ${activityRings.exercise[1]} min</p>
                    <p>Stand: ${activityRings.stand[0]} / ${activityRings.stand[1]} hours</p>
                ` : ""}
                
                ${latestHeartRate ? `<p>Heart Rate: ${latestHeartRate} BPM</p>` : ""}
                
                ${caloriesConsumed ? `<p>Calories Consumed: ${caloriesConsumed.toFixed(0)} kcal</p>` : ""}
                
                ${macros ? `
                    <h4>Macronutrient Breakdown:</h4>
                    <p>Fat: ${macros.fat.toFixed(1)}%</p>
                    <p>Carbs: ${macros.carb.toFixed(1)}%</p>
                    <p>Protein: ${macros.protein.toFixed(1)}%</p>
                ` : ""}
                
                ${sleepHours ? `<p>Sleep Hours Last Night: ${sleepHours.toFixed(1)} hours</p>` : ""}
            </div>
        `;
        wrapper.appendChild(dataContainer);

        return wrapper;
    },
});    
