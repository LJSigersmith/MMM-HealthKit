// Frontend module
// Integrates with MagicMirror
// Displays Data

Module.register("MMM-HealthKit", {
   
    // Config 
    defaults: {
        updateInterval: 10000,
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
        const move = this.healthData.activityRings?.move
            ? `${this.healthData.activityRings.move.value} / ${this.healthData.activityRings.move.goal}`
            : "N/A";
        const exercise = this.healthData.activityRings?.exercise
            ? `${this.healthData.activityRings.exercise.value} / ${this.healthData.activityRings.exercise.goal}`
            : "N/A";
        const stand = this.healthData.activityRings?.stand
            ? `${this.healthData.activityRings.stand.value} / ${this.healthData.activityRings.stand.goal}`
            : "N/A";
        
            const fat = this.healthData.macros?.fat || 0;
        const protein = this.healthData.macros?.protein || 0;
        const carbs = this.healthData.macros?.carb || 0;
        
        // Create a container for the health data
        const dataContainer = document.createElement("div");
        dataContainer.innerHTML = `
            <div>
                <h3>HealthKit Data</h3>
                
                ${activityRings ? `
                    <p>Move: ${move} kcal</p>
                    <p>Exercise: ${exercise} min</p>
                    <p>Stand: ${stand} hours</p>
                ` : ""}
                
                ${latestHeartRate ? `<p>Heart Rate: ${latestHeartRate} BPM</p>` : ""}
                
                ${caloriesConsumed ? `<p>Calories Consumed: ${caloriesConsumed.toFixed(0)} kcal</p>` : ""}
            </div>
        `;
        wrapper.appendChild(dataContainer);

        const macroBar = document.createElement("div");
        macroBar.innerHTML = `
            <div style="display: flex; width: 100%; height: 20px; border-radius: 5px; overflow: hidden; border: 1px solid #ccc;">
                <div style="width: ${fat}%; background-color: orange;"></div>
                <div style="width: ${protein}%; background-color: yellow;"></div>
                <div style="width: ${carb}%; background-color: blue;"></div>
            </div>
        `;
        wrapper.appendChild(macroBar);

        return wrapper;
        /*
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
        */


        return wrapper;
    },
});    
