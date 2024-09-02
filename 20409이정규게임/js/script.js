const alphabetElement = document.querySelector('.alphabet');
const scoree = document.getElementById('score-value');
const timer = document.getElementById('timer-value');
const highscoree = document.getElementById('high-score-value');
let score = 0;
let targetAlphabet = '';
let timeLeft = 30;
let countdown;
let x = 0;
let y = 0;
let dx = 2;
let dy = 2;
let animationFrameId;

// Show "Ready?" in the center for 3 seconds and then start the game
function startGame() {
    alphabetElement.style.opacity = 0; // Hide the "Ready?" message
    startCountdown();
    updateAlphabet();
    startMovingAlphabet(); // Start moving the alphabet
}

function showReadyMessage() {
    alphabetElement.textContent = 'Ready?';
    alphabetElement.style.opacity = 1; // Show the "Ready?" message
    alphabetElement.style.left = '50%'; // Center horizontally
    alphabetElement.style.top = '50%'; // Center vertically
    alphabetElement.style.transform = 'translate(-50%, -50%)'; // Center both horizontally and vertically
    setTimeout(startGame, 3000); // Start the game after 3 seconds
}

// Initial setup
showReadyMessage();

// Event listeners for keydown
document.addEventListener('keydown', (event) => {
    const pressedKey = event.key.toUpperCase();
    if (pressedKey === targetAlphabet) {
        score++;
        animateScore();
        updateAlphabet();
    } else {
        endGame();
    }
});

// Start countdown
function startCountdown() {
    clearInterval(countdown); // Clear previous interval if exists
    countdown = setInterval(updateTime, 1000);
}

// Update time
function updateTime() {
    timeLeft--;
    timer.textContent = timeLeft;
    if (timeLeft === 0) {
        clearInterval(countdown);
        endGame();
    }
}

// Function to update alphabet
function updateAlphabet() {
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    targetAlphabet = alphabets[Math.floor(Math.random() * alphabets.length)];
    alphabetElement.textContent = targetAlphabet;

    // Random position
    const container = document.getElementById('game-container');
    const containerRect = container.getBoundingClientRect();
    x = Math.random() * (containerRect.width - alphabetElement.clientWidth);
    y = Math.random() * (containerRect.height - alphabetElement.clientHeight);
    
    alphabetElement.style.left = `${x}px`;
    alphabetElement.style.top = `${y}px`;
    alphabetElement.style.opacity = 1; // Ensure visible
}

// Animate the score
function animateScore() {
    const initialScale = 1;
    const maxScale = 1.5;
    const animationDuration = 300; // Animation duration in milliseconds
    const startTime = performance.now();

    function step(timestamp) {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        const scale = initialScale + Math.sin(progress * Math.PI) * (maxScale - initialScale);
        scoree.style.transform = `scale(${scale})`;
        
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            scoree.style.transform = `scale(${initialScale})`; // Reset to initial scale
            scoree.textContent = score; // Update score value
        }
    }

    requestAnimationFrame(step);
}

// Function to end the game
function endGame() {
    clearInterval(countdown);
    cancelAnimationFrame(animationFrameId); // Stop the animation loop
    if (score > localStorage.getItem('highScore')) {
        localStorage.setItem('highScore', score);
    }
    highscoree.textContent = localStorage.getItem('highScore') || 0;
    alert(`당신의 점수는 ${score}점\n바로 시작?`);
    location.reload(true);
}

// Function to start moving the alphabet
function startMovingAlphabet() {
    const container = document.getElementById('game-container');
    const containerRect = container.getBoundingClientRect();

    function move() {
        const alphabetRect = alphabetElement.getBoundingClientRect();

        // Move the alphabet
        x += dx;
        y += dy;

        // Check for collisions with the container edges
        if (x < 0 || x + alphabetRect.width > containerRect.width) {
            dx = -dx; // Reverse x direction
        }
        if (y < 0 || y + alphabetRect.height > containerRect.height) {
            dy = -dy; // Reverse y direction
        }

        alphabetElement.style.left = `${x}px`;
        alphabetElement.style.top = `${y}px`;

        animationFrameId = requestAnimationFrame(move); // Request the next frame
    }

    move(); // Start the movement
}

// Set initial high score
highscoree.textContent = localStorage.getItem('highScore') || 0;