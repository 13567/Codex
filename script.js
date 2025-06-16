const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let apple = { x: 15, y: 15 };
let velocity = { x: 0, y: 0 };
let score = 0;
let gameOver = false;
let gameInterval;

function init() {
    snake = [{ x: 10, y: 10 }];
    velocity = { x: 0, y: 0 };
    score = 0;
    gameOver = false;
    placeApple();
    if (gameInterval) {
        clearInterval(gameInterval);
    }
    gameInterval = setInterval(gameLoop, 1000 / 10); // 10 fps
    draw();
}

function placeApple() {
    apple.x = Math.floor(Math.random() * tileCount);
    apple.y = Math.floor(Math.random() * tileCount);

    // Ensure apple is not placed on the snake
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === apple.x && snake[i].y === apple.y) {
            placeApple();
            return;
        }
    }
}

function gameLoop() {
    if (gameOver) {
        clearInterval(gameInterval);
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = "20px Arial";
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
        ctx.font = "16px Arial";
        ctx.fillText("Press 'Enter' to Restart", canvas.width / 2, canvas.height / 2 + 50);
        return;
    }
    update();
    draw();
}

function update() {
    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver = true;
        return;
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            return;
        }
    }

    snake.unshift(head);

    // Apple collision
    if (head.x === apple.x && head.y === apple.y) {
        score++;
        placeApple();
    } else {
        // Do not pop if velocity is 0 (at start)
        if (velocity.x !== 0 || velocity.y !== 0) {
            snake.pop();
        }
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#f2f2f2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(({ x, y }) => {
        ctx.fillRect(x * gridSize, y * gridSize, gridSize - 1, gridSize - 1);
    });

    // Draw apple
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 1, gridSize - 1);

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}`, 10, 25);
}

document.addEventListener('keydown', (e) => {
    if (gameOver && e.key === 'Enter') {
        init();
        return;
    }
    
    switch (e.key) {
        case 'ArrowUp':
            if (velocity.y !== 1) velocity = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (velocity.y !== -1) velocity = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (velocity.x !== 1) velocity = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (velocity.x !== -1) velocity = { x: 1, y: 0 };
            break;
    }
});

init();
