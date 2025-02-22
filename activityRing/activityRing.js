
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

function adjustBrightness(hex, percent) {
    hex = hex.replace(/^#/, ""); // Remove "#" if present
    let num = parseInt(hex, 16);
    
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00FF) + percent;
    let b = (num & 0x0000FF) + percent;

    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return `rgb(${r}, ${g}, ${b})`;
}

function createActivityRing(exerciseMinutes, exerciseGoal, baseColor) {

    const container = document.createElement("div");
    container.classList.add("progress-container");

    // Create unique IDs for the gradient and shadow
    const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
    const shadowId = `shadow-${Math.random().toString(36).substr(2, 9)}`;

    container.innerHTML = `
        <svg class="progress-ring" width="120" height="120">
            <defs>
                <!-- Gradient for the ring -->
                <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stop-color="${baseColor}" />
                    <stop offset="100%" stop-color="${adjustBrightness(baseColor, 50)}" />
                </linearGradient>

                <!-- Radial gradient for endpoint glow -->
                <radialGradient id="${shadowId}" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stop-color="${adjustBrightness(baseColor, 100)}" />
                    <stop offset="100%" stop-color="transparent" />
                </radialGradient>
            </defs>

            <circle class="progress-ring-bg" cx="60" cy="60" r="50" />
            <circle class="progress-ring-fill" cx="60" cy="60" r="50"
                stroke="url(#${gradientId})"
                stroke-dasharray="314" stroke-dashoffset="314"
                stroke-linecap="round"
                filter="drop-shadow(2px 2px 4px ${baseColor})" />
            
            <!-- Glow effect at the endpoint -->
            <circle class="progress-ring-end" cx="60" cy="10" r="5"
                fill="url(#${shadowId})" opacity="1" />

            <circle class="progress-ring-overflow glow" cx="60" cy="60" r="50"
                stroke="url(#${gradientId})"
                stroke-dasharray="314" stroke-dashoffset="314"
                stroke-linecap="round"
                filter="drop-shadow(3px 3px 5px ${baseColor})" />

            <text x="50%" y="50%" text-anchor="middle" dy=".3em" class="progress-text">
                <tspan id="exercise-text">${exerciseMinutes}</tspan> / <tspan id="goal-text">${exerciseGoal}</tspan>
            </text>
        </svg>
    `;

    const ring = container.querySelector(".progress-ring-fill");
    const overflowRing = container.querySelector(".progress-ring-overflow");
    const endGlow = container.querySelector(".progress-ring-end");

    if (!ring) {
        console.error("❌ ERROR: .progress-ring-fill element not found!");
        return container;
    }

    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    let percentage = (exerciseMinutes / exerciseGoal) * 100;
    let newOffset = circumference - (percentage / 100) * circumference;

    function updateGlowPosition(progress) {
        const angle = (progress / 100) * 360; // Convert progress to degrees
        const radians = (angle - 90) * (Math.PI / 180); // Convert degrees to radians (starting at top)
        const glowX = 60 + Math.cos(radians) * radius;
        const glowY = 60 + Math.sin(radians) * radius;
        endGlow.setAttribute("cx", glowX);
        endGlow.setAttribute("cy", glowY);
    }

    function animateRing(ringElement, startOffset, endOffset, duration, callback) {
        let startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            let progress = (timestamp - startTime) / duration;
            let easedProgress = Math.min(progress, 1);
            let currentOffset = startOffset + (endOffset - startOffset) * easedProgress;

            ringElement.style.strokeDashoffset = currentOffset;
            updateGlowPosition((1 - currentOffset / circumference) * 100);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else if (callback) {
                callback();
            }
        }

        requestAnimationFrame(step);
    }

    if (percentage <= 100) {
        animateRing(ring, circumference, newOffset, 1000);
    } else {
        animateRing(ring, circumference, 0, 1000, () => {
            setTimeout(() => {
                overflowRing.style.opacity = "1";
                let overflowOffset = circumference - ((percentage - 100) / 100 * circumference);
                animateRing(overflowRing, circumference, overflowOffset, 1000);
            }, 500);
        });
    }

    return container;
}

// Example: Try different values
//updateExerciseRing(100, 60); // 200% progress
// updateExerciseRing(75, 60); // 125% progress
// updateExerciseRing(60, 60); // 100% progress
