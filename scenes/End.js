export default class Game extends Phaser.Scene {
    constructor() {
      // key of the scene
      // the key will be used to start the scene by other scenes
      super("end");
    }
    init(data){
        this.scrole = data.score || 0;
        this.gameOver = data.gameOver || true;
    }
    create() {
        this.add
        .text(400, 300, this.gameOver ? "Game Over":"You Win", {
            fontSize: "40px",
            color: "#ffffff"
        })
        .setOrigin(0.5);

        this.add.text(400, 350, `Score: ${this.score}`);
    }
}