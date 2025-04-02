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
let player = { speed: 7, score: 0, isMoving: false, moveDirection: null };
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

// Mobile control buttons
const leftBtn = document.createElement('div');
const rightBtn = document.createElement('div');
leftBtn.className = 'mobile-btn left-btn';
rightBtn.className = 'mobile-btn right-btn';
gameArea.appendChild(leftBtn);
gameArea.appendChild(rightBtn);

level.addEventListener('click', (e) => {
    player.speed = levelSpeed[e.target.id];
});

startScreen.addEventListener('click', () => {
    startScreen.classList.add('hide');
    gameArea.innerHTML = "";

    // Re-add mobile controls
    gameArea.appendChild(leftBtn);
    gameArea.appendChild(rightBtn);

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
    player.isMoving = false;
    gameStart.pause();
    gameOver.play();
    startScreen.classList.remove('hide');
    startScreen.innerHTML = "Game Over <br> Your final score is " + player.score + "<br> Tap to restart.";
}

function moveRoadLines() {
    document.querySelectorAll('.roadLines').forEach((item) => {
        if (item.y >= gameArea.offsetHeight) {
            item.y -= gameArea.offsetHeight;
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
        if (item.y >= gameArea.offsetHeight) {
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

        // Handle keyboard controls
        if (keys.ArrowUp && player.y > (road.top + 70)) player.y -= player.speed;
        if (keys.ArrowDown && player.y < (road.bottom - 85)) player.y += player.speed;
        if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if (keys.ArrowRight && player.x < (road.width - 70)) player.x += player.speed;

        // Handle touch movement
        if (player.isMoving) {
            if (player.moveDirection === 'left' && player.x > 0) {
                player.x -= player.speed * 2;
            }
            if (player.moveDirection === 'right' && player.x < (road.width - 70)) {
                player.x += player.speed * 2;
            }
        }

        carElement.style.top = player.y + "px";
        carElement.style.left = player.x + "px";

        window.requestAnimationFrame(gamePlay);
        player.score++;
        score.innerHTML = 'Score: ' + (player.score - 1);
    }
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        keys[e.key] = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        keys[e.key] = false;
    }
});

// Enhanced Touch Controls
document.addEventListener("touchstart", (e) => {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchmove", (e) => {
    e.preventDefault();
}, { passive: false });

document.addEventListener("touchend", (e) => {
    e.preventDefault();
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    
    handleSwipe();
});

function handleSwipe() {
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    // Check if it's a horizontal swipe (more horizontal than vertical movement)
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 50) { // Swipe right
            player.x = Math.min(player.x + (player.speed * 3), gameArea.offsetWidth - 70);
        } else if (dx < -50) { // Swipe left
            player.x = Math.max(player.x - (player.speed * 3), 0);
        }
    }
}

// Mobile button controls
leftBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    player.isMoving = true;
    player.moveDirection = 'left';
});

leftBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    player.isMoving = false;
});

rightBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    player.isMoving = true;
    player.moveDirection = 'right';
});

rightBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    player.isMoving = false;
});

// Handle window resize
window.addEventListener('resize', () => {
    if (player.start) {
        let carElement = document.querySelector('.car');
        if (carElement) {
            player.x = Math.min(player.x, gameArea.offsetWidth - 70);
            carElement.style.left = player.x + 'px';
        }
    }
});
