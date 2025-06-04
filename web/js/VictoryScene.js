class VictoryScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VictoryScene' });
  }

  init(data) {
    this.finalScore = data.finalScore;
  }

  create() {
    this.cameras.main.setBackgroundColor('#002200');
    this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 80, 'AGI ACHIEVED!', { fontFamily: 'Press Start 2P', fontSize: '32px', fill: '#00ff00' }).setOrigin(0.5);
    this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 20, `Score: ${this.finalScore}`, { fontFamily: 'Press Start 2P', fontSize: '16px', fill: '#ffffff' }).setOrigin(0.5);
    this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 40, 'Play Again? Press SPACE', { fontFamily: 'Press Start 2P', fontSize: '12px', fill: '#ffffff' }).setOrigin(0.5);
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('LevelScene', { levelIndex: 1 });
    });
  }
}
