const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let birdY, birdX, velocity, score, gameRunning;
let pipes = [];
let highScore = localStorage.getItem('flappyHighScore') || 0;

// ADJUSTED PHYSICS (Easier Mode)
const gravity = 0.15;      // Reduced (was 0.25) - Bird falls slower
const jump = -4.0;         // Reduced (was -5.2) - Jump is less aggressive
const pipeWidth = 70;
const pipeGap = 220;       // Increased (was 170) - Much wider opening
const pipeSpeed = 2.5;     // Reduced (was 4.0) - Pipes move slower

function init() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    birdX = canvas.width * 0.25;
    birdY = canvas.height / 2;
    velocity = 0;
    score = 0;
    pipes = [];
    gameRunning = true;
}

function saveHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('flappyHighScore', highScore);
    }
}

function createPipe() {
    const minPipeHeight = 50;
    const maxPipeHeight = canvas.height - pipeGap - minPipeHeight;
    const height = Math.floor(Math.random() * (maxPipeHeight - minPipeHeight + 1)) + minPipeHeight;
    
    pipes.push({ x: canvas.width, y: height, passed: false });
}

function update() {
    if (!gameRunning) return;

    velocity += gravity;
    birdY += velocity;

    // Boundary check
    if (birdY > canvas.height || birdY < 0) {
        endGame();
    }

    // Pipe spawning frequency
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 450) {
        createPipe();
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= pipeSpeed;

        // Collision
        if (birdX + 15 > pipes[i].x && birdX - 15 < pipes[i].x + pipeWidth) {
            if (birdY - 15 < pipes[i].y || birdY + 15 > pipes[i].y + pipeGap) {
                endGame();
            }
        }

        // Scoring
        if (pipes[i].x + pipeWidth < birdX && !pipes[i].passed) {
            score++;
            pipes[i].passed = true;
        }

        if (pipes[i].x + pipeWidth < 0) pipes.splice(i, 1);
    }
}

function endGame() {
    gameRunning = false;
    saveHighScore();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Pipes
    ctx.fillStyle = "#2ecc71";
    pipes.forEach(p => {
        ctx.fillRect(p.x, 0, pipeWidth, p.y);
        ctx.fillRect(p.x, p.y + pipeGap, pipeWidth, canvas.height);
        ctx.strokeStyle = "#27ae60";
        ctx.lineWidth = 3;
        ctx.strokeRect(p.x, 0, pipeWidth, p.y);
        ctx.strokeRect(p.x, p.y + pipeGap, pipeWidth, canvas.height);
    });

    // Draw Bird
    ctx.fillStyle = "#f1c40f";
    ctx.beginPath();
    ctx.arc(birdX, birdY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // SIDE SCOREBOARD (Right Hand Side)
    const panelWidth = 200;
    const panelX = canvas.width - panelWidth - 20;
    
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(panelX, 20, panelWidth, 110, 10);
        ctx.fill();
    } else {
        ctx.fillRect(panelX, 20, panelWidth, 110);
    }

    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.font = "bold 20px Arial";
    ctx.fillText(`SCORE: ${score}`, panelX + 20, 55);
    ctx.fillText(`BEST: ${highScore}`, panelX + 20, 95);

    if (!gameRunning) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = "bold 60px Arial";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = "24px Arial";
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
        ctx.fillText("Tap to Restart", canvas.width / 2, canvas.height / 2 + 70);
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

const handleInput = (e) => {
    if (e.type === 'keydown' && e.code !== 'Space') return;
    if (gameRunning) {
        velocity = jump;
    } else {
        init();
    }
};

window.addEventListener('keydown', handleInput);
window.addEventListener('mousedown', handleInput);
window.addEventListener('touchstart', (e) => { e.preventDefault(); handleInput(e); }, {passive: false});
window.addEventListener('resize', init);

init();
loop();