new Vue({
    el: '#app',
    data: {
        title: 'Vue 贪吃蛇 Pro',
        score: 0,
        highScore: 0,
        gameIsOver: false,
        isPaused: false,
        gameHasStarted: false,
        gridSize: 20,
        snake: [],
        food: {},
        direction: 'right',
        changingDirection: false,
        gameInterval: null,
        canvas: null,
        ctx: null,
        speeds: {
            slow: 200,
            normal: 120,
            fast: 70,
        },
        speedName: 'normal',
        showTutorial: false,
    },
    computed: {
        tileCount() {
            return this.canvas ? this.canvas.width / this.gridSize : 0;
        },
        currentSpeed() {
            return this.speeds[this.speedName];
        }
    },
    methods: {
        init() {
            this.canvas = this.$refs.gameCanvas;
            this.ctx = this.canvas.getContext('2d');
            this.highScore = localStorage.getItem('snakeHighScore') || 0;
            document.addEventListener('keydown', this.handleKeyDown);
            this.resetGame();
        },
        resetGame() {
            this.snake = [{ x: 10, y: 10 }];
            this.direction = 'right';
            this.score = 0;
            this.gameIsOver = false;
            this.isPaused = false;
            this.gameHasStarted = false;
            this.createFood();
            
            clearInterval(this.gameInterval);

            // Defer drawing to allow Vue to update the DOM
            this.$nextTick(() => {
                this.clearCanvas();
                this.drawFood();
                this.drawSnake();
            });
        },
        startGame() {
            if (this.gameHasStarted) return;
            this.gameHasStarted = true;
            this.isPaused = false;
            this.gameIsOver = false;
            
            // Reset snake and score for a fresh start
            this.snake = [{ x: 10, y: 10 }];
            this.score = 0;
            this.direction = 'right';
            this.createFood();

            this.runGame();
        },
        runGame() {
            clearInterval(this.gameInterval);
            this.gameInterval = setInterval(this.gameLoop, this.currentSpeed);
        },
        gameLoop() {
            if (this.isPaused || this.gameIsOver || !this.gameHasStarted) return;
            
            this.changingDirection = false;
            this.clearCanvas();
            this.drawFood();
            this.moveSnake();
            this.drawSnake();
        },
        endGame() {
            this.gameIsOver = true;
            this.gameHasStarted = false;
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('snakeHighScore', this.score);
            }
            clearInterval(this.gameInterval);
        },
        clearCanvas() {
            if (!this.ctx) return;
            this.ctx.fillStyle = 'black';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        },
        drawSnake() {
            this.ctx.fillStyle = 'lightgreen';
            this.snake.forEach(part => {
                this.ctx.fillRect(part.x * this.gridSize, part.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
            });
        },
        moveSnake() {
            const head = { x: this.snake[0].x, y: this.snake[0].y };

            switch (this.direction) {
                case 'up': head.y -= 1; break;
                case 'down': head.y += 1; break;
                case 'left': head.x -= 1; break;
                case 'right': head.x += 1; break;
            }

            if (this.checkCollision(head)) {
                this.endGame();
                return;
            }

            this.snake.unshift(head);

            if (head.x === this.food.x && head.y === this.food.y) {
                this.score += 10;
                this.createFood();
            } else {
                this.snake.pop();
            }
        },
        createFood() {
            let foodX = Math.floor(Math.random() * this.tileCount);
            let foodY = Math.floor(Math.random() * this.tileCount);
            let foodOnSnake = this.snake.some(part => part.x === foodX && part.y === foodY);
            
            if (foodOnSnake) {
                this.createFood();
            } else {
                this.food = { x: foodX, y: foodY };
            }
        },
        drawFood() {
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
        },
        checkCollision(head) {
            if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
                return true;
            }
            for (let i = 1; i < this.snake.length; i++) {
                if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                    return true;
                }
            }
            return false;
        },
        togglePause() {
            this.isPaused = !this.isPaused;
        },
        setSpeed(speed) {
            this.speedName = speed;
            if (!this.isPaused && !this.gameIsOver) {
                this.runGame();
            }
        },
        openTutorial() {
            this.showTutorial = true;
        },
        closeTutorial() {
            this.showTutorial = false;
        },
        handleKeyDown(event) {
            const LEFT_KEY = 37;
            const RIGHT_KEY = 39;
            const UP_KEY = 38;
            const DOWN_KEY = 40;
            const ENTER_KEY = 13;
            const P_KEY = 80;

            if (event.keyCode === ENTER_KEY && this.gameIsOver) {
                this.resetGame();
                return;
            }
            
            if (event.keyCode === P_KEY && !this.gameIsOver && this.gameHasStarted) {
                this.togglePause();
                return;
            }

            if (this.changingDirection || this.isPaused || !this.gameHasStarted) return;
            this.changingDirection = true;

            const keyPressed = event.keyCode;
            const goingUp = this.direction === 'up';
            const goingDown = this.direction === 'down';
            const goingRight = this.direction === 'right';
            const goingLeft = this.direction === 'left';

            if (keyPressed === LEFT_KEY && !goingRight) this.direction = 'left';
            if (keyPressed === UP_KEY && !goingDown) this.direction = 'up';
            if (keyPressed === RIGHT_KEY && !goingLeft) this.direction = 'right';
            if (keyPressed === DOWN_KEY && !goingUp) this.direction = 'down';
        }
    },
    mounted() {
        this.init();
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.handleKeyDown);
        clearInterval(this.gameInterval);
    }
}); 