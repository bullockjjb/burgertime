class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.finalScore = data.finalScore;
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');
    this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 40, 'GAME OVER', { fontFamily: 'Press Start 2P', fontSize: '32px', fill: '#ff0000' }).setOrigin(0.5);
    this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, `Score: ${this.finalScore}`, { fontFamily: 'Press Start 2P', fontSize: '16px', fill: '#ffffff' }).setOrigin(0.5);
    this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 60, 'Press SPACE to Retry', { fontFamily: 'Press Start 2P', fontSize: '12px', fill: '#ffffff' }).setOrigin(0.5);
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('LevelScene', { levelIndex: 1 });
    });
  }
}
