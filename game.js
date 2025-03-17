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
let player, cursors, road, obstacles, scoreText, score = 0, opponentCars;

// Preload assets
function preload() {
    this.load.image("road", "https://mahesh007badiger.github.io/pi-racing-game/resources/car.png");  // Replace with actual track image
    this.load.image("car", "https://mahesh007badiger.github.io/pi-racing-game/resources/obstacle.png");    // Replace with player car image
    this.load.image("opponent", "https://mahesh007badiger.github.io/pi-racing-game/resources/opponent.png"); // Opponent car
    this.load.image("obstacle", "https://mahesh007badiger.github.io/pi-racing-game/resources/road.png"); // Obstacle
}

// Create game objects
function create() {
    // Road scrolling background
    road = this.add.tileSprite(200, 300, 400, 600, "road");

    // Player car
    player = this.physics.add.sprite(200, 500, "car").setScale(0.5);
    player.setCollideWorldBounds(true);

    // Group for opponent cars
    opponentCars = this.physics.add.group();

    // Group for obstacles
    obstacles = this.physics.add.group();

    // Spawn obstacles and opponent cars
    this.time.addEvent({ delay: 1500, callback: spawnObjects, callbackScope: this, loop: true });

    // Score display
    scoreText = this.add.text(10, 10, "Score: 0", { fontSize: "20px", fill: "#fff" });

    // Collision detection
    this.physics.add.collider(player, obstacles, hitObstacle, null, this);
    this.physics.add.collider(player, opponentCars, hitOpponent, null, this);

    // Controls
    cursors = this.input.keyboard.createCursorKeys();
}

// Update game loop
function update() {
    // Scroll the road background
    road.tilePositionY -= 5;

    // Player movement
    if (cursors.left.isDown) player.setVelocityX(-200);
    else if (cursors.right.isDown) player.setVelocityX(200);
    else player.setVelocityX(0);
}

// Spawn obstacles and opponent cars
function spawnObjects() {
    let xPosition = Phaser.Math.Between(50, 350);

    if (Phaser.Math.Between(0, 1)) {
        let obstacle = obstacles.create(xPosition, -50, "obstacle").setScale(0.5);
        obstacle.setVelocityY(200);
    } else {
        let opponent = opponentCars.create(xPosition, -50, "opponent").setScale(0.5);
        opponent.setVelocityY(200);
    }
}

// Collision with obstacle
function hitObstacle(player, obstacle) {
    obstacle.destroy();
    score -= 10;
    scoreText.setText("Score: " + score);
}

// Collision with opponent
function hitOpponent() {
    score -= 20;
    scoreText.setText("Score: " + score);
}
