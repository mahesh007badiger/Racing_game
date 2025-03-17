// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: {
        default: "arcade",
        arcade: { debug: false }
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);
let player, cursors, obstacles, scoreText, score = 0, opponentCar;

// Preload assets
function preload() {
    this.load.image("road", "https://mahesh007badiger.github.io/pi-racing-game/resources/car.png");  // Replace with actual track image
    this.load.image("car", "https://mahesh007badiger.github.io/pi-racing-game/resources/obstacle.png");    // Replace with player car image
    this.load.image("opponent", "https://mahesh007badiger.github.io/pi-racing-game/resources/opponent.png"); // Opponent car
    this.load.image("obstacle", "https://mahesh007badiger.github.io/pi-racing-game/resources/road.png"); // Obstacle
}

// Create game objects
function create() {
    this.add.image(200, 300, "road").setScale(1.2);

    // Player car
    player = this.physics.add.sprite(200, 500, "car").setScale(0.5);
    player.setCollideWorldBounds(true);

    // Opponent car
    opponentCar = this.physics.add.sprite(200, 100, "opponent").setScale(0.5);
    opponentCar.setVelocityY(100);

    // Obstacles group
    obstacles = this.physics.add.group();

    // Spawn obstacles every 1.5 seconds
    this.time.addEvent({
        delay: 1500,
        callback: spawnObstacle,
        callbackScope: this,
        loop: true
    });

    // Score display
    scoreText = this.add.text(10, 10, "Score: 0", { fontSize: "20px", fill: "#fff" });

    // Collision detection
    this.physics.add.collider(player, obstacles, hitObstacle, null, this);
    this.physics.add.collider(player, opponentCar, hitOpponent, null, this);

    // Controls
    cursors = this.input.keyboard.createCursorKeys();
}

// Update game loop
function update() {
    player.setVelocity(0);

    if (cursors.left.isDown) player.setVelocityX(-200);
    if (cursors.right.isDown) player.setVelocityX(200);
    if (cursors.up.isDown) {
        player.setVelocityY(-200);
        score += 1;  // Increase score when moving up
        scoreText.setText("Score: " + score);
    }
    if (cursors.down.isDown) player.setVelocityY(200);

    // Reset opponent car when off screen
    if (opponentCar.y > 600) opponentCar.y = -50;
}

// Spawn random obstacles
function spawnObstacle() {
    let xPosition = Phaser.Math.Between(50, 350);
    let obstacle = obstacles.create(xPosition, -50, "obstacle").setScale(0.5);
    obstacle.setVelocityY(150);
}

// Collision with obstacle
function hitObstacle(player, obstacle) {
    obstacle.destroy();
    score -= 10; // Lose points on crash
    scoreText.setText("Score: " + score);
}

// Collision with opponent
function hitOpponent() {
    score -= 20;
    scoreText.setText("Score: " + score);
}
