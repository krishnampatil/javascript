// State Variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;
let lapCount = 0;

// DOM Elements
const displayEl = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsList = document.getElementById('lapsList');

/**
 * Core Functionality: Start Stopwatch
 */
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        // Set timestamp reference point subtracting any previously elapsed time
        startTime = performance.now() - elapsedTime;
        // Update display every 10ms for smooth real-time rendering
        timerInterval = setInterval(updateTime, 10);
        
        // UI State Updates
        toggleButtons({ start: false, pause: true, resume: false, lap: true });
    }
}

/**
 * Core Functionality: Pause Stopwatch
 */
function pauseTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        
        toggleButtons({ start: false, pause: false, resume: true, lap: false });
    }
}

/**
 * Core Functionality: Resume Stopwatch
 */
function resumeTimer() {
    if (!isRunning) {
        isRunning = true;
        // Pick up right where the timestamp left off
        startTime = performance.now() - elapsedTime;
        timerInterval = setInterval(updateTime, 10);
        
        toggleButtons({ start: false, pause: true, resume: false, lap: true });
    }
}

/**
 * Core Functionality: Reset Stopwatch
 */
function resetTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    elapsedTime = 0;
    lapCount = 0;
    
    // Clear display and laps
    displayEl.textContent = "00:00:00.00";
    lapsList.innerHTML = "";
    
    toggleButtons({ start: true, pause: false, resume: false, lap: false });
}

/**
 * Lap Functionality: Record and Display Laps
 */
function recordLap() {
    if (isRunning) {
        lapCount++;
        const currentLapTime = formatTime(elapsedTime);
        
        // Create lap list item
        const li = document.createElement('li');
        li.innerHTML = `<span>Lap ${lapCount}</span> <strong>${currentLapTime}</strong>`;
        
        // Prepend so the latest lap always appears at the top
        lapsList.insertBefore(li, lapsList.firstChild);
    }
}

/**
 * Helper: Real-time calculation loop
 */
function updateTime() {
    const currentTime = performance.now();
    elapsedTime = currentTime - startTime;
    displayEl.textContent = formatTime(elapsedTime);
}

/**
 * Helper: Formats milliseconds into HH:MM:SS.ms string
 */
function formatTime(ms) {
    let totalSeconds = Math.floor(ms / 1000);
    let totalMinutes = Math.floor(totalSeconds / 60);
    let totalHours = Math.floor(totalMinutes / 60);

    // Calculate individual components using remainder operator
    let hours = totalHours;
    let minutes = totalMinutes % 60;
    let seconds = totalSeconds % 60;
    let centiseconds = Math.floor((ms % 1000) / 10); // Extracted for smooth 2-digit display

    // Pad single digits with leading zeros
    hours = String(hours).padStart(2, '0');
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');
    centiseconds = String(centiseconds).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}.${centiseconds}`;
}

/**
 * Helper: UI Component state machine managing visible/disabled buttons
 */
function toggleButtons({ start, pause, resume, lap }) {
    if (start) {
        startBtn.style.display = "inline-block";
        resumeBtn.style.display = "none";
    } else if (resume) {
        startBtn.style.display = "none";
        resumeBtn.style.display = "inline-block";
    } else {
        startBtn.style.display = "inline-block";
        resumeBtn.style.display = "none";
    }
    
    pauseBtn.disabled = !pause;
    lapBtn.disabled = !lap;
}