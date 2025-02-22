
function animateProgress(ring, fromOffset, toOffset, duration, callback) {
    let start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        let progress = timestamp - start;
        let easing = Math.min(progress / duration, 1); // Ensures smooth stop at final value
        let currentOffset = fromOffset + (toOffset - fromOffset) * easing;

        ring.style.strokeDashoffset = currentOffset;

        if (progress < duration) {
            requestAnimationFrame(step);
        } else if (callback) {
            callback(); // Call next step only AFTER animation completes
        }
    }

    requestAnimationFrame(step);
}

function createActivityRing(exerciseMinutes, exerciseGoal, ringColor) {

    const container = document.createElement("div");
    container.classList.add("progress-container");

    container.innerHTML = `
        <svg class="progress-ring" width="120" height="120">
            <circle class="progress-ring-bg" cx="60" cy="60" r="50" />
            <circle class="progress-ring-fill" cx="60" cy="60" r="50"
                stroke-dasharray="314" stroke-dashoffset="314" />
            <circle class="progress-ring-overflow" cx="60" cy="60" r="50"
                stroke-dasharray="314" stroke-dashoffset="314" />
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" class="progress-text">
                <tspan id="exercise-text">${exerciseMinutes}</tspan> / <tspan id="goal-text">${exerciseGoal}</tspan>
            </text>
        </svg>
    `;

    const ring = container.querySelector(".progress-ring-fill");
    const overflowRing = container.querySelector(".progress-ring-overflow");
    ring.style.stroke = ringColor;
    overflowRing.style.stroke = ringColor;
    overflowRing.style.setProperty("--ring-color", ringColor);

    const exerciseText = container.querySelector("#exercise-text");
    const goalText = container.querySelector("#goal-text");

    const radius = 50;
    const circumference = 2 * Math.PI * radius;

    let percentage = (exerciseMinutes / exerciseGoal) * 100;
    let newOffset = circumference - (percentage / 100) * circumference;

    // Update text inside the ring
    exerciseText.textContent = exerciseMinutes;
    goalText.textContent = exerciseGoal;

    if (percentage <= 100) {
        // Only animate the green ring up to 100%
        animateProgress(ring,circumference, newOffset, 1000);
        overflowRing.style.opacity = "0";
    } else {
        animateProgress(ring, circumference, 0, 1000, () => {
            setTimeout(() => {
                overflowRing.style.opacity = "1";
                let overflowOffset = circumference - ((percentage - 100) / 100 * circumference);
                animateProgress(overflowRing, circumference, overflowOffset, 1000);
            }, 500);
        });
    }

    return container;
}

// Example: Try different values
//updateExerciseRing(100, 60); // 200% progress
// updateExerciseRing(75, 60); // 125% progress
// updateExerciseRing(60, 60); // 100% progress
