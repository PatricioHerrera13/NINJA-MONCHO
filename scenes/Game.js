// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("main");
  }

  init() {
    this.gameOver = false;
    this.timer = 30;
    this.score = 0;
    this.shapes = {
      triangulo: { points: 10, count:0},
      cuadrado: { points: 20, count:0},
      rombo: { points: 30, count:0},
    };
  }

  preload() {
    ///cargar assets 

    //import Cielo
    this.load.image ("cielo","../public/assets/Cielo.webp");

    //import plataform
    this.load.image ("plataforma","../public/assets/platform.png");

    //import personaje
    this.load.image ("personaje","../public/assets/Ninja.png");

    //crear grupo y asignar imagenes
    this.load.image("triangulo", "../public/assets/triangle.png");
    this.load.image("cuadrado", "../public/assets/square.png");
    this.load.image("rombo", "../public/assets/diamond.png");
  }

  create() {
    //cargar elementos
    this.cielo = this.add.image(400, 300, "cielo");
    this.cielo.setScale(2);

    //cargar grupo plataforma
    this.plataformas = this.physics.add.staticGroup();
    //cargar al grupo de plataformas agregar una plataforma
    this.plataformas.create(400, 560, "plataforma").setScale(2).refreshBody();
    //agregar otra plataforma en otro lugar
    this.plataformas.create(200, 400, "plataforma");

    //crear personaje
    this.personaje = this.physics.add.sprite(400, 300, "personaje");
    this.personaje.setScale(0.1);
    this.personaje.setCollideWorldBounds(true);

    //agregar colision entre personaje y plataforma
    this.physics.add.collider(this.personaje, this.plataformas);

    //crgarar teclas
    this.cursor = this.input.keyboard.createCursorKeys();

    //cargar grupo recolectables
    this.recolectables = this.physics.add.group();

    // evento 1 segundo
    this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });
    
    //add tecla r 
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    // evento 1 segundo
    this.time.addEvent({
      delay: 1000,
      callback: this.handlerTimer,
      callbackScope: this,
      loop: true,
    });
    
    //agergar texto de timer en la esquina superior derecha
    this.timerText = this.add.text (10, 10, `tiempo restante: ${this.timer}`,{
      fontSize: "32px",
      fill: "#fff",
    });

    this.scoreText = this.add.text(
      10,
      50,
      `Puntaje: ${this.score}
      T: ${this.shapes["triangulo"].count}
      C: ${this.shapes["cuadrado"].count}
      R: ${this.shapes["rombo"].count}`
    );
   
    //agregar collider entre recolectables y personaje
    this.physics.add.collider(
      this.personaje,
      this.recolectables,
      this.onShapeCollect,
      null,
      this
    );
  }

  update() {
    if (this.gameOver  && this.recolectables.isDown){
      this.scene.restart();
    }
    if (this.gameOver){
      this.physics.pause();
      this.timerText.setText("Game Over");
      return;
    }
    // movimiento personaje
    if (this.cursor.left.isDown) {
      this.personaje.setVelocityX(-160);
    } else if (this.cursor.right.isDown) {
      this.personaje.setVelocityX(160);
    } else {
      this.personaje.setVelocityX(0);
    }
    if (this.cursor.up.isDown && this.personaje.body.touching.down) {
      this.personaje.setVelocityY(-330);
    }
  }

  onSecond () {
    if (this.gameOver){
      return;
    }
    //crear recolectable
    const tipos = ["triangulo","cuadrado","rombo"];
    const tipo = Phaser.Math.RND.pick(tipos);
    let recolectable = this.recolectables.create(
      Phaser.Math.Between(10, 790),
      0,
      tipo
    );
    recolectable.setVelocity(0, 100);
  }

  onShapeCollect (personaje, recolectable) {
    console.log("recolectado", recolectable.texture.key);
    const nombreFig = recolectable.texture.key;

    this.score += this.shapes[nombreFig].points;
    this.shapes[nombreFig].count += 1;

    console.table(this.shapes);
    console.log("score", this.score);
    recolectable.destroy();
    //recolectable.disbleBody(true, true);

    this.scoreText.setText(
      `Puntaje: ${this.score}
      T: ${this.shapes["triangulo"].count}
      C: ${this.shapes["cuadrado"].count}
      R: ${this.shapes["rombo"].count}`
    );

    this.chechWin();
  }

  chechWin(){
      const cumplePuntos = this.score >= 100;
      const cumpleFiguras =
        this.shapes["triangulo"].count >= 2 &&
        this.shapes["cuadrado"].count >= 2 &&
        this.shapes["rombo"].count >= 2;

    if (cumplePuntos && cumpleFiguras) {
      console.log("Ganaste");
      this.scene.start("end",{
        score: this.score,
        gameOver: this.gameOver,
      });
    } 
  }

  handlerTimer() {
    this.timer -= 1;
    this.timerText.setText(`tiempo restante: ${this.timer}`);
    if (this.timer === 0) {
      this.gameOver = true;
      this.scene.start("end", {
        score: this.score,
        gameOver: this.gameOver,
      });
    }
  }
}