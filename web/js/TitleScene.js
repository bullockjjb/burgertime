class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');
    this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 60, 'ACCELEVATION TIME', { fontFamily: 'Press Start 2P', fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
    this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 20, 'Press SPACE to Start', { fontFamily: 'Press Start 2P', fontSize: '16px', fill: '#ffffff' }).setOrigin(0.5);
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('LevelScene', { levelIndex: 1 });
    });
  }
}
