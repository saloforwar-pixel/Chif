const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Загрузка изображений для анимации
let leftImage = new Image();
let rightImage = new Image();
let platformImage = new Image(); // Загружаем изображение платформы

leftImage.src = 'assets/Чиф1.png';  // Путь к изображению для движения влево
rightImage.src = 'assets/Чиф2.png'; // Путь к изображению для движения вправо
platformImage.src = 'assets/Земля1.png'; // Путь к изображению платформы

// Персонаж (charter)
let player = {
    x: 100,
    y: canvas.height - 150,  // Спавним на первой платформе
    width: 40,  // Ширина персонажа
    height: 40,  // Высота персонажа
    speed: 5,  // Скорость движения
    dx: 0,  // Скорость по оси X
    dy: 0,  // Скорость по оси Y
    gravity: 0.5,  // Гравитация
    jumpPower: -15,  // Мощность прыжка
    grounded: false,  // Флаг, показывающий, находится ли персонаж на платформе
    image: rightImage,  // Начальное изображение для движения вправо
    walking: false, // Для анимации ходьбы
    frame: 0,  // Для анимации
    maxFrame: 1,  // Максимальное количество кадров для анимации
    frameInterval: 10, // Интервал смены кадров
    frameTimer: 0 // Таймер для смены кадров
};

// Платформы
let platforms = [
    { x: 0, y: canvas.height - 100, width: canvas.width, height: 20 }, // Земля (платформа)
    { x: 200, y: canvas.height - 200, width: 200, height: 20 },
    { x: 500, y: canvas.height - 300, width: 200, height: 20 }
];

// Управление
let keys = {
    left: false,
    right: false,
    up: false
};

let gameStarted = false;

const menu = document.getElementById('menu');
const startButton = document.getElementById('startButton');

startButton.addEventListener('click', startGame); // При нажатии на кнопку запускаем игру

// Функция, чтобы начать игру
function startGame() {
    gameStarted = true;
    menu.style.display = 'none'; // Скрываем меню
    gameLoop(); // Запускаем игровой цикл
}

// Управление через клавиши
document.addEventListener('keydown', (e) => {
    if (e.key === 'a') keys.left = true; // Управление через A
    if (e.key === 'd') keys.right = true; // Управление через D
    if (e.key === 'w' && player.grounded) { // Прыжок через W
        keys.up = true;
        player.dy = player.jumpPower;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'a') keys.left = false;
    if (e.key === 'd') keys.right = false;
    if (e.key === 'w') keys.up = false;
});

// Двигаем персонажа
function movePlayer() {
    if (keys.left) {
        player.dx = -player.speed;
        player.walking = true;
        player.image = leftImage; 
    } else if (keys.right) {
        player.dx = player.speed;
        player.walking = true;
        player.image = rightImage; 
    } else {
        player.dx = 0;  
        player.walking = false;
    }

    player.x += player.dx;
    player.y += player.dy;

    player.grounded = false;
    for (let p of platforms) {
        if (player.x + player.width > p.x && player.x < p.x + p.width &&
            player.y + player.height <= p.y + player.height && player.y + player.height + player.dy >= p.y) {
            player.y = p.y - player.height;
            player.dy = 0;
            player.grounded = true;
        }
    }

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    if (!player.grounded) {
        player.dy += player.gravity;
    }

    // Управление анимацией
    if (player.walking) {
        player.frameTimer++;
        if (player.frameTimer >= player.frameInterval) {
            player.frameTimer = 0;
            player.frame++;
            if (player.frame > player.maxFrame) {
                player.frame = 0;
            }
        }
    } else {
        player.frame = 0;  // Если Чиф не двигается, показываем первый кадр
    }
}

// Рисуем персонажа
function drawPlayer() {
    // Отрисовываем нужный кадр для анимации
    ctx.drawImage(player.image, player.frame * player.width, 0, player.width, player.height, player.x, player.y, player.width, player.height);
}

// Рисуем платформы
function drawPlatforms() {
    for (let p of platforms) {
        ctx.drawImage(platformImage, p.x, p.y, p.width, p.height); // Рисуем платформу с изображением
    }
}

// Игровой цикл
function gameLoop() {
    if (!gameStarted) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    movePlayer();   
    drawPlatforms(); 
    drawPlayer();    
    requestAnimationFrame(gameLoop); 
}
