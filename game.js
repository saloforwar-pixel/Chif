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
platformImage.src = '/mnt/data/Земля1.png'; // Путь к изображению платформы

// Персонаж
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
    image: rightImage  // Начальное изображение для движения вправо
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

startButton.addEventListener('click', startGame); // При нажатии на кнопку запускаем игру

function startGame() {
    gameStarted = true;
    menu.style.display = 'none'; // Скрываем меню
    gameLoop(); // Запускаем игровой цикл
}

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
    for (let p of platforms) {
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

// Рисуем персонажа
function drawPlayer() {
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

// Рисуем платформы с использованием изображения
function drawPlatforms() {
    for (let p of platforms) {
        ctx.drawImage(platformImage, p.x, p.y, p.width, p.height); // Рисуем платформу с изображением
    }
}

// Игровой цикл
function gameLoop() {
    if (!gameStarted) return; // Если игра не началась, не запускаем игровой цикл

    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Очистка экрана
    movePlayer();   // Обновляем положение игрока
    drawPlatforms(); // Рисуем платформы
    drawPlayer();    // Рисуем персонажа
    requestAnimationFrame(gameLoop); // Вызываем gameLoop для следующего кадра
}
