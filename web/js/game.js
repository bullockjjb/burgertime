window.onload = () => {
  const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#000000',
    physics: {
      default: 'arcade',
      arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: [BootScene, TitleScene, LevelScene, UIScene, PauseScene, GameOverScene, VictoryScene]
  };
  const game = new Phaser.Game(config);
};
