const score = document.querySelector('.score');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');
const level = document.querySelector('.level');

let gameStart = new Audio();
let gameOver = new Audio();
gameStart.src = "assets/audio/game_theme.mp3";
gameOver.src = "assets/audio/gameOver_theme.mp3";

const levelSpeed = { easy: 7, moderate: 10, difficult: 14 };

let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
let player = { speed: 7, score: 0 };

level.addEventListener('click', (e) => {
    player.speed = levelSpeed[e.target.id];
});

startScreen.addEventListener('click', () => {
    startScreen.classList.add('hide');
    gameArea.innerHTML = "";

    player.start = true;
    gameStart.play();
    gameStart.loop = true;
    player.score = 0;
    window.requestAnimationFrame(gamePlay);

    for (let i = 0; i < 5; i++) {
        let roadLineElement = document.createElement('div');
        roadLineElement.setAttribute('class', 'roadLines');
        roadLineElement.y = (i * 150);
        roadLineElement.style.top = roadLineElement.y + "px";
        gameArea.appendChild(roadLineElement);
    }

    let carElement = document.createElement('div');
    carElement.setAttribute('class', 'car');
    gameArea.appendChild(carElement);

    player.x = carElement.offsetLeft;
    player.y = carElement.offsetTop;

    

    for (let i = 0; i < 3; i++) {
        let enemyCar = document.createElement('div');
        enemyCar.setAttribute('class', 'enemyCar');
        enemyCar.y = ((i + 1) * 350) * -1;
        enemyCar.style.top = enemyCar.y + "px";
        enemyCar.style.backgroundColor = randomColor();
        enemyCar.style.left = Math.floor(Math.random() * (gameArea.clientWidth - 50)) + "px";
        gameArea.appendChild(enemyCar);
    }
});

function randomColor() {
    function c() {
        let hex = Math.floor(Math.random() * 256).toString(16);
        return ("0" + String(hex)).substr(-2);
    }
    return "#" + c() + c() + c();
}

function onCollision(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    return !((aRect.top > bRect.bottom) || (aRect.bottom < bRect.top) ||
        (aRect.right < bRect.left) || (aRect.left > bRect.right));
}

function onGameOver() {
    player.start = false;
    gameStart.pause();
    gameOver.play();
    startScreen.classList.remove('hide');
    startScreen.innerHTML = "Game Over <br> Your final score is " + player.score + "<br> Press here to restart the game.";
}

function moveRoadLines() {
    let roadLines = document.querySelectorAll('.roadLines');
    roadLines.forEach((item) => {
        if (item.y >= window.innerHeight) {
            item.y -= window.innerHeight + 150;
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function moveEnemyCars(carElement) {
    let enemyCars = document.querySelectorAll('.enemyCar');
    enemyCars.forEach((item) => {
        if (onCollision(carElement, item)) {
            onGameOver();
        }
        if (item.y >= window.innerHeight) {
            item.y = -300;
            item.style.left = Math.floor(Math.random() * (gameArea.clientWidth - 50)) + "px";
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function gamePlay() {
    let carElement = document.querySelector('.car');
    let road = gameArea.getBoundingClientRect();

    if (player.start) {
        moveRoadLines();
        moveEnemyCars(carElement);

        if (keys.ArrowUp && player.y > road.top + 70) player.y -= player.speed;
        if (keys.ArrowDown && player.y < road.bottom - 85) player.y += player.speed;
        if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if (keys.ArrowRight && player.x < road.width - carElement.clientWidth) player.x += player.speed;

        carElement.style.top = player.y + "px";
        carElement.style.left = player.x + "px";

        window.requestAnimationFrame(gamePlay);
        player.score++;
        score.innerHTML = 'Score: ' + player.score;
    }
}

document.addEventListener('keydown', (e) => {
    e.preventDefault();
    keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    e.preventDefault();
    keys[e.key] = false;
});

// SWIPE CONTROLS FOR MOBILE
// let startX = 0;
document.addEventListener("DOMContentLoaded", () => {
    let gameArea = document.querySelector(".gameArea");
    let car = document.querySelector(".car");

    let startX = 0;
    let playerX = (gameArea.clientWidth - car.clientWidth) / 2; // Start at center
    car.style.left = playerX + "px";  // Set initial position

    // Listen for swipe start
    document.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    // Listen for swipe move
    document.addEventListener("touchmove", (e) => {
        let currentX = e.touches[0].clientX;
        let moveThreshold = 10; // Minimum movement needed for swipe

        let moveAmount = gameArea.clientWidth * 0.3; // Move 30% of the road width

        if (Math.abs(currentX - startX) > moveThreshold) {
            if (currentX < startX) {
                // Swipe Left
                playerX -= moveAmount;
                if (playerX < 0) playerX = 0;
            } else {
                // Swipe Right
                playerX += moveAmount;
                if (playerX > gameArea.clientWidth - car.clientWidth)
                    playerX = gameArea.clientWidth - car.clientWidth;
            }
            
            car.style.left = playerX + "px";  // Update position
            startX = currentX;  // Reset start position to prevent multiple moves per swipe
        }
    });
});

