// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("main");
  }

  init() {}

  preload() {
    ///cargar assets 

    //import Cielo
    this.load.image ("cielo","../public/assets/Cielo.webp");

    //import plataform
    this.load.image ("plataforma","../public/assets/platform.png");

    //import personaje
    this.load.image ("personaje","../public/assets/Ninja.png");

    //crear grupo y asignar imagenes
  }

  create() {
    //cargar elementos
    this.cielo = this.add.image(400, 300, "cielo");
    this.cielo.setScale(2);

    //cargar grupo plataforma
    this.plataformas = this.physics.add.staticGroup();
    //cargar al grupo de plataformas agregar una plataforma
    this.plataformas.create(400, 560, "plataforma").setScale(2).refreshBody();


    //crear personaje
    this.personaje = this.physics.add.sprite(400, 300, "personaje");
    this.personaje.setScale(0.1);
    this.personaje.setCollideWorldBounds(true);

    //agregar colision entre personaje y plataforma
    this.physics.add.collider(this.personaje, this.plataformas);

    //crar teclas
    this.cursor = this.input.keyboard.createCursorKeys();

    //crarr grupo recolectables
    this.recolectables = this.physics.add.group();
    this.physics.add.collider(this.personaje, this,this.recolectables);

    //evento 1 segundo
    this.time.addEvent({
      delay: 1000,
      callback: console.log("hola"),
      callbackScope: this,
      loop: true,
    });
  }

  onSecond () {
    //crear recolectable
    const tipos = ["triangulo","cuadrado","rombo"];
    const tipo = Phaser.Math.RND.pick(tipos);
    let recolectable = this.recolectables.create(
      Physics.Math.Between(10, 790),
      0,
      tipo
    );
    recolectable.setVelocity(0, 100);
  }

  update() {
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
}