Module.register("MMM-HealthKit", {
    defaults: {
        updateInterval: 60000,
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

    socketNotificationRecieved: function (notification, payload) {
        if (notification === "HEALTH_DATA") {
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
        wrapper.innerHTML = `
        <p><strong>Move:</strong> ${this.healthData.move}</p>
            <p><strong>Exercise:</strong> ${this.healthData.exercise}</p>
            <p><strong>Stand:</strong> ${this.healthData.stand}</p>
            <p><strong>Calories:</strong> ${this.healthData.activeCalories}</p>
            <p><strong>Heart Rate:</strong> ${this.healthData.heartRate.join(", ")}</p>
        `;
        return wrapper;
    }
});