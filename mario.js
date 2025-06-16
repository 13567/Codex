const marioGame = (function() {
    let canvas, ctx;
    let player;
    let keys = {};
    const gravity = 0.5;
    const ground = 380;
    const goalX = 360;
    let requestId;
    let win = false;

    function init() {
        canvas = document.getElementById('marioCanvas');
        if (!canvas) return;
        ctx = canvas.getContext('2d');
        reset();
        document.addEventListener('keydown', keyDown);
        document.addEventListener('keyup', keyUp);
        loop();
    }

    function reset() {
        player = { x: 20, y: ground - 20, width: 20, height: 20, vx: 0, vy: 0 };
        win = false;
    }

    function keyDown(e) {
        keys[e.keyCode] = true;
        if (win && e.keyCode === 13) { // Enter to restart
            reset();
        }
    }

    function keyUp(e) {
        keys[e.keyCode] = false;
    }

    function loop() {
        update();
        draw();
        requestId = requestAnimationFrame(loop);
    }

    function update() {
        if (keys[37]) player.vx = -2;
        else if (keys[39]) player.vx = 2;
        else player.vx = 0;

        if ((keys[38] || keys[32]) && player.y >= ground - player.height) {
            player.vy = -10;
        }

        player.vy += gravity;
        player.x += player.vx;
        player.y += player.vy;

        if (player.y >= ground - player.height) {
            player.y = ground - player.height;
            player.vy = 0;
        }

        if (player.x < 0) player.x = 0;
        if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

        if (player.x + player.width >= goalX) {
            win = true;
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#5DADE2';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#27AE60';
        ctx.fillRect(0, ground, canvas.width, canvas.height - ground);

        ctx.fillStyle = '#F4D03F';
        ctx.fillRect(goalX, ground - 40, 10, 40);

        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(player.x, player.y, player.width, player.height);

        if (win) {
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#333';
            ctx.font = '30px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('胜利！按 Enter 重玩', canvas.width / 2, canvas.height / 2);
        }
    }

    function stop() {
        cancelAnimationFrame(requestId);
        document.removeEventListener('keydown', keyDown);
        document.removeEventListener('keyup', keyUp);
    }

    return { init, stop };
})();
