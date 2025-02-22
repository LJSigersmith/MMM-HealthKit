Module.register("MMM-HealthKit", {
    defaults: {
        updateInterval: 60000,
        serverURL: "http://localhost:3000/healthData"
    },

    getScripts: function () {
        return [
            this.file("chart.min.js") // Path to Chart.js
        ];
    },

    start: function () {
        this.healthData = null; // stores health data
        
        this.getData();
        setInterval(() => {
            this.getData();
        }, this.config.updateInterval);
    },

    getData: function () {
        this.sendSocketNotification("REQUEST_HEALTH_DATA", null);
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "HEALTH_DATA") {
            console.log("Recieved health data: ", payload);
            this.healthData = payload; // update health data
            this.updateDom();
        }
    },

    getDom: function () {
        const wrapper = document.createElement("div");

        if (!this.healthData) {
            wrapper.innerHTML = "Waiting for health data....";
            return wrapper;
        }

        // Display health data
        const { activityRings, latestHeartRate, weightData, caloriesConsumed, macros, sleepHours } = this.healthData;

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

        if (weightData && weightData.length > 0) {
	   console.log("Rendering weight...");
            const graphContainer = document.createElement("div");
            graphContainer.style.marginTop = "20px";
            
            const canvas = document.createElement("canvas");
            canvas.id = "weightGraph";
            graphContainer.appendChild(canvas);
            wrapper.appendChild(canvas);

            // Render graph
            setTimeout(() => {
                this.renderWeightGraph(weightData);
            }, 0);
        }

        return wrapper;
    },

    renderWeightGraph: function (weightData) {
        const ctx = document.getElementById("weightGraph").getContext("2d");
    
        // Prepare data for the chart
        const labels = weightData.map(entry => new Date(entry.date).toLocaleDateString());
        const weights = weightData.map(entry => (entry.weight * 2.20462).toFixed(2)); // Convert to lbs
    
        // Create the chart
        new Chart(ctx, {
            type: "line", // Line chart
            data: {
                labels: labels, // Dates as labels
                datasets: [{
                    label: "Weight (lbs)",
                    data: weights, // Weight values
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderWidth: 2,
                    pointRadius: 4,
                    tension: 0.4 // Smooth the line
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: "top"
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Date"
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Weight (lbs)"
                        }
                    }
                }
            }
        });
    }
});    
