const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: 100,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpPower: -15,
    grounded: false,
    image: new Image()
};
player.image.src = 'path_to_your_pixelated_chef_image.png'; // Путь к изображению пиксельного Чифа

let bread = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - 100,
    width: 30,
    height: 30,
    image: new Image()
};
bread.image.src = 'path_to_bread_image.png'; // Путь к изображению хлеба

let keys = {
    left: false,
    right: false,
    up: false
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === ' ' && player.grounded) {
        keys.up = true;
        player.dy = player.jumpPower;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === ' ') keys.up = false;
});

function movePlayer() {
    if (keys.left) player.dx = -player.speed;
    if (keys.right) player.dx = player.speed;
    if (!keys.left && !keys.right) player.dx = 0;

    player.x += player.dx;
    player.y += player.dy;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    if (player.y + player.height > canvas.height - 50) {
        player.y = canvas.height - 50 - player.height;
        player.dy = 0;
        player.grounded = true;
    } else {
        player.dy += player.gravity;
        player.grounded = false;
    }
}

function drawPlayer() {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

function drawBread() {
    ctx.drawImage(bread.image, bread.x, bread.y, bread.width, bread.height);
}

function checkCollision() {
    if (player.x < bread.x + bread.width &&
        player.x + player.width > bread.x &&
        player.y < bread.y + bread.height &&
        player.y + player.height > bread.y) {
        bread.x = Math.random() * canvas.width;
        bread.y = Math.random() * canvas.height - 100;
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    drawPlayer();
    drawBread();
    checkCollision();
    requestAnimationFrame(gameLoop);
}

gameLoop();
