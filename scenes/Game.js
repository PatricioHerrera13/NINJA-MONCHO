// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    super("main");
  }

  init() {
    this.gameOver = false;
    this.timer = 30;
    this.score = 0;
    this.shapes = {
      triangle: { points: 10, count: 0 },
      square: { points: 20, count: 0 },
      diamond: { points: 30, count: 0 },
      bomb: { points: -10, count: 0 },
    };
  }

  preload() {
    this.load.image("sky", "./public/assets/Cielo.webp");
    this.load.image("platform", "./public/assets/platform.png");
    this.load.image("character", "./public/assets/Ninja.png");
    this.load.image("triangle", "./public/assets/triangle.png");
    this.load.image("square", "./public/assets/square.png");
    this.load.image("diamond", "./public/assets/diamond.png");
    this.load.image("bomb", "./public/assets/R.png");
  }

  create() {
    this.sky = this.add.image(400, 300, "sky");
    this.sky.setScale(2);
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, "platform").setScale(2).refreshBody();
    this.platforms.create(200, 400, "platform");
    this.character = this.physics.add.sprite(400, 300, "character");
    this.character.setScale(0.1);
    this.character.setCollideWorldBounds(true);
    this.physics.add.collider(this.character, this.platforms);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.collectibles = this.physics.add.group();
    this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });
    this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.time.addEvent({
      delay: 1000,
      callback: this.handleTimer,
      callbackScope: this,
      loop: true,
    });
    this.timerText = this.add.text(10, 10, `Time left: ${this.timer}`, {
      fontSize: "32px",
      fill: "#fff",
    });
    this.scoreText = this.add.text(
      10,
      50,
      `Score: ${this.score}
        T: ${this.shapes["triangle"].count}
        S: ${this.shapes["square"].count}
        D: ${this.shapes["diamond"].count}`
    );
    this.physics.add.collider(
      this.character,
      this.collectibles,
      this.onShapeCollect,
      null,
      this
    );
    this.physics.add.collider(
      this.collectibles,
      this.platforms,
      this.onCollectibleBounced,
      null,
      this
    );
  }

  update() {
    if (this.gameOver && this.rKey.isDown) {
      this.scene.restart();
    }
    if (this.gameOver) {
      this.physics.pause();
      this.timerText.setText("Game Over");
      return;
    }
    if (this.cursors.left.isDown) {
      this.character.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.character.setVelocityX(160);
    } else {
      this.character.setVelocityX(0);
    }
    if (this.cursors.up.isDown && this.character.body.touching.down) {
      this.character.setVelocityY(-330);
    }
  }

  onSecond() {
    if (this.gameOver) {
      return;
    }
    const types = ["triangle", "square", "diamond", "bomb"];
    const type = Phaser.Math.RND.pick(types);
    let collectible = this.collectibles.create(
      Phaser.Math.Between(10, 790),
      0,
      type
    );
    collectible.setVelocity(0, 100);
    const bounce = Phaser.Math.FloatBetween(0.4, 0.8);
    collectible.setBounce(bounce);
    collectible.setData("points", this.shapes[type].points);
    collectible.setData("type", type);
  }

  onShapeCollect(character, collectible) {
    const typeName = collectible.getData("type");
    const points = collectible.getData("points");
    this.score += points;
    this.shapes[typeName].count += 1;
    console.table(this.shapes);
    console.log("Collected ", collectible.texture.key, points);
    console.log("Score ", this.score);
    collectible.destroy();
    this.scoreText.setText(
      `Score: ${this.score}
        T: ${this.shapes["triangle"].count}
        S: ${this.shapes["square"].count}
        D: ${this.shapes["diamond"].count}`
    );
    this.checkWin();
  }

  checkWin() {
    const meetsPoints = this.score >= 100;
    const meetsShapes =
      this.shapes["triangle"].count >= 2 &&
      this.shapes["square"].count >= 2 &&
      this.shapes["diamond"].count >= 2;
    if (meetsPoints && meetsShapes) {
      console.log("You won");
      this.scene.start("end", {
        score: this.score,
        gameOver: this.gameOver,
      });
    }
  }

  handleTimer() {
    this.timer -= 1;
    this.timerText.setText(`Time left: ${this.timer}`);
    if (this.timer === 0) {
      this.gameOver = true;
      this.scene.start("end", {
        score: this.score,
        gameOver: this.gameOver,
      });
    }
  }

  onCollectibleBounced(collectible, platform) {
    console.log("Collectible bounced");
    let points = collectible.getData("points");
    points -= 5;
    collectible.setData("points", points);
    if (points <= 0) {
      collectible.destroy();
    }
  }
}