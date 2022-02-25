import {Scene, Physics, Types, GameObjects} from 'phaser';
export class Game extends Scene {
  private platforms: any;
  private player!: Physics.Arcade.Sprite;
  private foe!: Physics.Arcade.Sprite;
  private cursors!: Types.Input.Keyboard.CursorKeys;
  private scoreText!: GameObjects.Text;
  private gameOver!: boolean;
  private bombs!: Phaser.Physics.Arcade.Group;
  private playerAlive: boolean = false;
  constructor() {
    super({ key: 'preloader' });
  }

  async preload() {
    console.log('preload scene')
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude',
      'assets/dude.png',
      { frameWidth: 32, frameHeight: 48 }
    );
    this.load.spritesheet('explosion',
      'assets/explosion.png',
      { frameWidth: 64, frameHeight: 64, endFrame: 23 }
    );
  }
  async create() {
    console.log('create')
    this.add.image(400, 300, 'sky');
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    //Player creation
    this.createPlayer();

    //Colliders
    this.physics.add.collider(this.player, this.platforms);

    //Controller
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cursors.space.emitOnRepeat= false;

    // stars = this.physics.add.group({
    //   key: 'star',
    //   repeat: 11,
    //   setXY: { x: 12, y: 0, stepX: 70 }
    // });

    // stars.children.iterate(function (child) {
    //   child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    // });
    // this.physics.add.collider(stars, platforms);
    // this.physics.add.overlap(player, stars, collectStar, null, this);
    this.toogleWelcomeMessage(true);
    this.scoreText = this.add.text(400, 300, 'Press enter to join', { fontSize: '32px', color: '#FFF' }).setOrigin(0.5,0.5);

    //Score 
    // this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', color: '#000' });

    this.bombs = this.physics.add.group();

    this.physics.add.collider(this.bombs, this.platforms);

    this.physics.add.collider(this.player, this.bombs, this.hitBomb, undefined, this);

    this.cursors.space.onDown = (event) => {
      console.log('key down');
      this.throwBomb(this.player);
    }
  }

  async update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play('right', true);
    }
    else {
      this.player.setVelocityX(0);

      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-580);
    }
  }

  createPlayer() {
    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.foe = this.spawnFoe(400,200);

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'explodeAnimation',
      frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 31 }),
      frameRate: 20,
      repeat: 0
    });
    this.player.disableBody(true, true);
  }

  toogleWelcomeMessage(toggle: boolean) {
    if(toggle) {
      this.scoreText = this.add.text(400, 300, 'Press enter to join', { fontSize: '32px', color: '#FFF' }).setOrigin(0.5,0.5);
    } else {
      this.scoreText.destroy()
    }
  }
  
  spawnFoe(x: number,y: number): Physics.Arcade.Sprite {
    this.foe = this.physics.add.sprite(x, y, 'dude');
    this.foe.setCollideWorldBounds(true);
    this.foe.setBounce(0.2)
    this.foe.setTint(0xff0000)
    this.physics.add.collider(this.foe, this.platforms);
    return this.foe;
  }

  throwBomb(player: Physics.Arcade.Sprite) {
    var bomb = this.bombs.create(player.x, player.y - 30, 'bomb');
    bomb.setBounce(0.9);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(player.body.velocity.x * 2, -600);
  }
  
  private hitBomb: ArcadePhysicsCallback = (_player, _bomb) => {
    this.physics.pause();

    this.player.setTint(0xff0000);
    this.player.anims.play('turn');
    this.add.sprite(this.player.body.x+20, this.player.body.y+20, 'explosion').play('explodeAnimation')
    this.player.body.destroy()
    this.player.disableBody(true,true);
    _bomb.destroy();
    this.gameOver = true;
  }
}