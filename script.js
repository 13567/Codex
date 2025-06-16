const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let apple = { x: 5, y: 5 };
let velocity = { x: 0, y: 0 };
let gameInterval;

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp': if (velocity.y === 0) velocity = { x: 0, y: -1 }; break;
    case 'ArrowDown': if (velocity.y === 0) velocity = { x: 0, y: 1 }; break;
    case 'ArrowLeft': if (velocity.x === 0) velocity = { x: -1, y: 0 }; break;
    case 'ArrowRight': if (velocity.x === 0) velocity = { x: 1, y: 0 }; break;
  }
});

function gameLoop() {
  update();
  draw();
}

enableStart();

function update() {
  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  // wrap around edges
  head.x = (head.x + tileCount) % tileCount;
  head.y = (head.y + tileCount) % tileCount;

  // check collision with self
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    reset();
    return;
  }

  snake.unshift(head);

  if (head.x === apple.x && head.y === apple.y) {
    placeApple();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.fillStyle = '#f2f2f2';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'green';
  snake.forEach(({ x, y }) => {
    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
  });

  ctx.fillStyle = 'red';
  ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

function placeApple() {
  apple.x = Math.floor(Math.random() * tileCount);
  apple.y = Math.floor(Math.random() * tileCount);
  if (snake.some(segment => segment.x === apple.x && segment.y === apple.y)) {
    placeApple();
  }
}

function reset() {
  snake = [{ x: 10, y: 10 }];
  velocity = { x: 0, y: 0 };
  placeApple();
}

function enableStart() {
  reset();
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 100);
}
