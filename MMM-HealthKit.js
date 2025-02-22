// Frontend module
// Integrates with MagicMirror
// Displays Data
import {createActivityRing } from "./activityRing/activityRing.js";

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
        const moveValue = this.healthData.activityRings.move.value;
        const moveGoal = this.healthData.activityRings.move.goal;
        const exerciseValue = this.healthData.activityRings.exercise.value;
        const exerciseGoal = this.healthData.activityRings.exercise.goal;
        const standValue = this.healthData.activityRings.stand.value;
        const standGoal = this.healthData.activityRings.stand.goal;

        const move = this.healthData.activityRings?.move
            ? `${moveValue} / ${moveGoal}`
            : "N/A";
        const exercise = this.healthData.activityRings?.exercise
            ? `${exerciseValue} / ${exerciseGoal}`
            : "N/A";
        const stand = this.healthData.activityRings?.stand
            ? `${standValue} / ${standGoal}`
            : "N/A";
        
        const fat = this.healthData.macros?.fat || 0;
        const protein = this.healthData.macros?.protein || 0;
        const carbs = this.healthData.macros?.carb || 0;

       // const fatPercent = fat / 100;
       // const proteinPercent = protein / 100;
       // const carbPercent = carbs / 100;
        
        // Create a container for the health data
        const dataContainer = document.createElement("div");
        dataContainer.innerHTML = `
            <div>
                <h3>HealthKit Data</h3>
                
                ${latestHeartRate ? `<p>Heart Rate: ${latestHeartRate} BPM</p>` : ""}
                
                ${caloriesConsumed ? `<p>Calories Consumed: ${caloriesConsumed.toFixed(0)} kcal</p>` : ""}
            </div>
        `;
        wrapper.appendChild(dataContainer);

        // MACRO BAR
        const macroBar = document.createElement("div");
        macroBar.innerHTML = `
            <div style="display: flex; width: 100%; height: 20px; border-radius: 5px; overflow: hidden; border: 1px solid #ccc;">
                <div style="width: ${fat}%; background-color: rgb(109, 76, 201);">Fat</div>
                <div style="width: ${protein}%; background-color: rgb(103, 182, 222);">Protein</div>
                <div style="width: ${carbs}%; background-color: rgb(235, 219, 102);;">Carbs</div>
            </div>
        `;
        wrapper.appendChild(macroBar);

        // ACTIVITY RINGS
        //const exerciseRingElement = createActivityRing(moveValue, moveGoal);
        //wrapper.appendChild(exerciseRingElement);

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

    },
});    
