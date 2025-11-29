const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Начальное меню
const menu = document.getElementById('menu');
const startButton = document.getElementById('startButton');

// Флаг для отслеживания начала игры
let gameStarted = false;

// Загрузка изображений для анимации
let leftImage = new Image();
let rightImage = new Image();

leftImage.src = 'assets/Чиф1.jpg';  // Путь к первому изображению (для движения влево)
rightImage.src = 'assets/Чиф2.jpg'; // Путь ко второму изображению (для движения вправо)

// Персонаж
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
    image: rightImage  // Начальное изображение — для движения вправо
};

let keys = {
    left: false,
    right: false,
    up: false
};

startButton.addEventListener('click', startGame); // При нажатии на кнопку запускаем игру

function startGame() {
    gameStarted = true;
    menu.style.display = 'none'; // Скрываем меню
    gameLoop(); // Запускаем игровой цикл
}

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
    if (keys.left) {
        player.dx = -player.speed;
        player.image = leftImage;  // Если двигаемся влево, показываем левое изображение
    } else if (keys.right) {
        player.dx = player.speed;
        player.image = rightImage; // Если двигаемся вправо, показываем правое изображение
    } else {
        player.dx = 0;  // Если стоим, не меняем изображение
    }

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

function gameLoop() {
    if (!gameStarted) return; // Если игра не началась, не запускаем игровой цикл

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    drawPlayer();
    requestAnimationFrame(gameLoop); // Вызываем функцию gameLoop для следующего кадра
}
