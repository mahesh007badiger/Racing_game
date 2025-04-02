const score = document.querySelector('.score');
const startScreen = document.querySelector('.startScreen');
const gameArea = document.querySelector('.gameArea');
const level = document.querySelector('.level');

// Loading audio files
let gameStart = new Audio();
let gameOver = new Audio();

gameStart.src = "assets/audio/game_theme.mp3";
gameOver.src = "assets/audio/gameOver_theme.mp3";

const levelSpeed = { easy: 7, moderate: 10, difficult: 14 };
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
let player = { speed: 7, score: 0 };
let touchStartX = 0;
let touchEndX = 0;

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
        roadLineElement.y = i * 150;
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
        enemyCar.y = (i + 1) * -350;
        enemyCar.style.top = enemyCar.y + "px";
        enemyCar.style.backgroundColor = randomColor();
        enemyCar.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
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

    return !(aRect.top > bRect.bottom || aRect.bottom < bRect.top || aRect.right < bRect.left || aRect.left > bRect.right);
}

function onGameOver() {
    player.start = false;
    gameStart.pause();
    gameOver.play();
    startScreen.classList.remove('hide');
    startScreen.innerHTML = "Game Over <br> Your final score is " + player.score + "<br> Tap to restart.";
}

function moveRoadLines() {
    document.querySelectorAll('.roadLines').forEach((item) => {
        if (item.y >= window.innerHeight) {
            item.y -= window.innerHeight;
        }
        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

function moveEnemyCars(carElement) {
    document.querySelectorAll('.enemyCar').forEach((item) => {
        if (onCollision(carElement, item)) {
            onGameOver();
        }
        if (item.y >= window.innerHeight) {
            item.y = -300;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
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

        if (keys.ArrowUp && player.y > (road.top + 70)) player.y -= player.speed;
        if (keys.ArrowDown && player.y < (road.bottom - 85)) player.y += player.speed;
        if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if (keys.ArrowRight && player.x < (road.width - 70)) player.x += player.speed;

        carElement.style.top = player.y + "px";
        carElement.style.left = player.x + "px";

        window.requestAnimationFrame(gamePlay);
        player.score++;
        score.innerHTML = 'Score: ' + (player.score - 1);
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

// Swipe Controls for Mobile

document.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
});

document.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;
    let swipeDistance = touchStartX - touchEndX;
    
    if (swipeDistance > 50 && player.x < gameArea.offsetWidth - 70) {
        player.x += player.speed * 3; // Swipe Right
    }
    if (swipeDistance < -50 && player.x > 0) {
        player.x -= player.speed * 3; // Swipe Left
    }
});
