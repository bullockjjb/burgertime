class PauseScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PauseScene' });
  }

  create() {
    this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6);
    this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 40, 'PAUSED', { fontFamily: 'Press Start 2P', fontSize: '32px', fill: '#ffffff' }).setOrigin(0.5);
    this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 10, 'Press ENTER to Resume', { fontFamily: 'Press Start 2P', fontSize: '12px', fill: '#ffffff' }).setOrigin(0.5);
    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.stop();
      this.scene.resume('LevelScene');
    });
  }
}
