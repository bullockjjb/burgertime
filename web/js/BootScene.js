class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Load image assets directly from the repo's original img/ folder
    this.load.spritesheet(
      ASSETS.SPRITESHEET_PLAYER,
      '../img/burger_time_characters_and_objects_sprites.png',
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      ASSETS.SPRITESHEET_ENEMY,
      '../img/burger_time_characters_and_objects_sprites2.png',
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.image(ASSETS.TILESET_PLATFORMS, '../img/floor.png');
    this.load.image(ASSETS.TILESET_LADDERS, '../img/stairs.png');
    this.load.spritesheet(
      ASSETS.SPRITESHEET_COMPONENTS,
      '../img/burger_time_characters_and_objects_sprites.png',
      { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet(
      ASSETS.SPRITESHEET_POWERUPS,
      '../img/burger_time_characters_and_objects_sprites2.png',
      { frameWidth: 32, frameHeight: 32 }
    );

    // Audio from the original audio/ folder
    for (let i = 1; i <= 5; i++) {
      this.load.audio(`${ASSETS.AUDIO_BGM}${i}`, `../audio/${i}1_main.ogg`);
    }
    this.load.audio(ASSETS.SFX_DROP, '../audio/0_burger_going_down.ogg');
    this.load.audio(ASSETS.SFX_ENEMY_STUN, '../audio/15_peppered.ogg');
    this.load.audio(ASSETS.SFX_PLAYER_HURT, '../audio/16_stepping_on_burger.ogg');
    this.load.audio(ASSETS.SFX_POWERUP_PICK, '../audio/14_pepper.ogg');
    this.load.audio(ASSETS.SFX_POWERUP_USE, '../audio/14_pepper.ogg');
    this.load.audio(ASSETS.SFX_RACK_COMPLETE, '../audio/17_win.ogg');
    this.load.audio(ASSETS.SFX_GAME_OVER, '../audio/17_win.ogg');

    for (let i = 1; i <= 5; i++) {
      this.load.json(`level${i}`, `levels/level${i}.json`);
    }
  }

  create() {
    this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, 'Loading Assets...', { fontFamily: 'Press Start 2P', fontSize: '20px', fill: '#ffffff' }).setOrigin(0.5);
    this.time.delayedCall(500, () => {
      this.scene.start('TitleScene');
    });
  }
}
