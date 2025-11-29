const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Начальное меню
const menu = document.getElementById('menu');
const startButton = document.getElementById('startButton');

// Флаг для отслеживания начала игры
let gameStarted = false;

// Загрузка изображений для анимации (обновлено на .png)
let leftImage = new Image();
let rightImage = new Image();

leftImage.src = 'assets/Чиф1.png';  // Путь к первому изображению (для движения влево)
rightImage.src = 'assets/Чиф2.png'; // Путь ко второму изображению (для движения вправо)

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

// Платформы
let platforms = [
    { x: 0, y: canvas.height - 100, width: canvas.width, height: 20 }, // Земля
    { x: 200, y: canvas.height - 200, width: 200, height: 20 },
    { x: 500, y: canvas.height - 300, width: 200, height: 20 }
];

// Управление
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
    if (e.key === 'a') keys.left = true; // Управление через A
    if (e.key === 'd') keys.right = true; // Управление через D
    if (e.key === ' ' && player.grounded) {
        keys.up = true;
        player.dy = player.jumpPower;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'a') keys.left = false;
    if (e.key === 'd') keys.right = false;
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

    // Коллизия с платформами
    player.grounded = false;
    for (let i = 0; i < platforms.length; i++) {
        let p = platforms[i];

        if (player.x + player.width > p.x && player.x < p.x + p.width &&
            player.y + player.height <= p.y + player.height && player.y + player.height + player.dy >= p.y) {
            player.y = p.y - player.height;
            player.dy = 0;
            player.grounded = true;
        }
    }

    // Если персонаж выходит за границы экрана
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Если игрок не на платформе, применять гравитацию
    if (!player.grounded) {
        player.dy += player.gravity;
    }
}

function drawPlayer() {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = "#8B4513";  // Цвет платформ
    for (let i = 0; i < platforms.length; i++) {
        let p = platforms[i];
        ctx.fillRect(p.x, p.y, p.width, p.height);
    }
}

function gameLoop() {
    if (!gameStarted) return; // Если игра не началась, не запускаем игровой цикл

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movePlayer();
    drawPlatforms();
    drawPlayer();
    requestAnimationFrame(gameLoop); // Вызываем функцию gameLoop для следующего кадра
}
