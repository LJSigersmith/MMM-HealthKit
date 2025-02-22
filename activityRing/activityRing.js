
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

export function createActivityRing(exerciseMinutes, exerciseGoal) {

    const container = document.createElement("div");
    container.classList.add("progress-container");

    /*container.innerHTML = `
        <svg class="progress-ring" width="120" height="120">
            <circle class="progress-ring-bg" cx="60" cy="60" r="50" />
            <circle class="progress-ring-fill" cx="60" cy="60" r="50"
                stroke-dasharray="314" stroke-dashoffset="314" />
            <circle class="progress-ring-overflow" cx="60" cy="60" r="50"
                stroke-dasharray="314" stroke-dashoffset="314" />
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" class="progress-text">
                <tspan id="exercise-text">20</tspan> / <tspan id="goal-text">20</tspan>
            </text>
        </svg>
    `;
    */

    /*const ring = document.querySelector(".progress-ring-fill");
    const overflowRing = document.querySelector(".progress-ring-overflow");
    const exerciseText = document.getElementById("exercise-text");
    const goalText = document.getElementById("goal-text");

    const radius = 50;
    const circumference = 2 * Math.PI * radius;

    let percentage = (exerciseMinutes / exerciseGoal) * 100;
    let newOffset = circumference - (percentage / 100) * circumference;

    // Update text inside the ring
    exerciseText.textContent = exerciseMinutes;
    goalText.textContent = exerciseGoal;

    if (percentage <= 100) {
        // Only animate the green ring up to 100%
        animateProgress(ring, parseFloat(ring.style.strokeDashoffset) || circumference, newOffset, 1000);
        ring.style.stroke = "#00cc66"; // Green
        overflowRing.style.opacity = "0"; //Ensure overflow ring is fully hidden
    } else {
        // Step 1: Fully fill the green ring first
        animateProgress(ring, parseFloat(ring.style.strokeDashoffset) || circumference, 0, 1000, () => {
            console.log("Green ring animation completed!");

            // Step 2: Ensure overflow ring is fully hidden before showing it
            overflowRing.style.opacity = "0"; //Ensure it's hidden at this point
            overflowRing.style.strokeDashoffset = circumference; // Reset overflow position

            // Step 3: Add an additional delay before revealing the overflow ring
            setTimeout(() => {
                console.log(" Now starting overflow animation!");
                overflowRing.style.opacity = "1"; //Now show overflow ring

                let overflowOffset = circumference - ((percentage - 100) / 100 * circumference);
                animateProgress(overflowRing, circumference, overflowOffset, 1000);
            }, 750); //Adjust this delay to fine-tune the appearance
        });

        overflowRing.style.stroke = "#ff9900"; // Orange
    }
        */

    return container;
}

// Example: Try different values
//updateExerciseRing(100, 60); // 200% progress
// updateExerciseRing(75, 60); // 125% progress
// updateExerciseRing(60, 60); // 100% progress
