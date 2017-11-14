class World {
  constructor(canvas, x, dx) {
    this.x = x;
    this.dx = dx;
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
    this.bird = this.createBird();
    this.obstacles = [];
    this.score = 0;
    this.obstacles[0] = this.createObstacle();

    this.img = new Image();
    this.img.src = 'images/background.jpg';

    this.img.onload = () => {
      this.worldInterval = setInterval(this.start(this.img), SPEED);
      return this.worldInterval;
    }
  }

  createBird() {
    return new Bird(
      this.context,
      BIRD_X_POSITION,
      BIRD_Y_POSITION,
      BIRD_HEIGHT,
      BIRD_WIDTH,
      BIRD_START_ANGLE,
      BIRD_FINAL_ANGLE,
      BIRD_FLY_HEIGHT,
      BIRD_DELTA_TIME,
      BIRD_FALLING_CONSTANT,
      BIRD_FLY_HEIGHT_AREA
    );
  }

  createObstacle() {
    return new Obstacle(
      this.context,
      OBSTACLE_X_POSITION,
      this.getRandomY(OBSTACLE_MIN_Y, OBSTACLE_MAX_Y),
      OBSTACLE_HEIGHT,
      OBSTACLE_WIDTH,
      OBSTACLE_BETWEEN_GAP,
      OBSTACLE_DISPLACEMENT
    );
  }

  getRandomY(min, max) {
    return min + Math.floor(Math.random() * (max - min));
  }

  start(img) {
    return () => {
      if (this.bird.isDead) {
        this.stop();
      } else {
        let totalObstacle = this.obstacles.length;
        this.moveBackground();

        if (totalObstacle && (CANVAS_WIDTH - this.obstacles[totalObstacle - 1].x - this.obstacles[totalObstacle - 1].width * 2) > OBSTACLE_GAP) {
          this.obstacles[totalObstacle] = this.createObstacle();
          this.totalObstacle++;
        }

        for (var i = 0; i < totalObstacle; i++) {
          if ((this.obstacles[i].x + this.obstacles[i].width) > 0) {
            this.obstacles[i].move();
          }
        }

        this.bird.isDead = this.checkCollision(this.bird, this.obstacles[this.score]);

        if (this.bird.x + this.bird.width > this.obstacles[this.score].x + this.obstacles[this.score].width) {
          this.score++;
        }
        this.bird.fall();
      }
    }
  }

  stop() {
    clearInterval(this.worldInterval);
  }

  checkCollision(bird, obstacle) {
    var birdLeft = bird.x;
    var birdRight = bird.x + bird.width;
    var birdTop = bird.y;
    var birdBottom = bird.y + bird.height;

    var obstacleLeft = obstacle.x;
    var obstacleRight = obstacle.x + obstacle.width;
    var obstacleTop = obstacle.y;
    var obstacleBottom = obstacle.y + obstacle.height;

    if (birdRight > obstacleLeft && (birdTop < obstacleTop || birdBottom > obstacleBottom)) {
      return true;
    }
    return false;
  }

  moveBackground() {
    this.context.clearRect(0, 0, this.img.height, this.img.width); // clear the canvas

    // reset, start from beginning
    if (this.x < (-this.img.width)) {
      this.x = 0;
    }

    // surplus image
    if (this.x < 0) {
      this.context.drawImage(this.img, this.img.width + this.x, 0, this.img.width, this.img.height);
    }

    // image width is larger than CANVAS_WIDTH
    if (this.img.width < CANVAS_WIDTH) {
      this.context.drawImage(this.img, this.img.width * 2 + this.x, 0, this.img.width, this.img.height);
    }

    // draw image
    this.context.drawImage(this.img, this.x, 0, this.img.width, this.img.height);
    this.x -= this.dx;
  }
}