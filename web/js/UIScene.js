class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: true });
  }

  create() {
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontFamily: 'Press Start 2P', fontSize: '16px', fill: '#ffffff' });
    this.livesGroup = this.add.group();
    this.racksText = this.add.text(GAME_WIDTH - 160, 16, 'Racks: 0', { fontFamily: 'Press Start 2P', fontSize: '16px', fill: '#ffffff' });
    this.powerUpIcon = this.add.image(GAME_WIDTH - 100, 48, ASSETS.SPRITESHEET_POWERUPS, 0).setVisible(false);

    const levelScene = this.scene.get('LevelScene');
    levelScene.events.on('initUI', data => {
      this.updateScore(data.score);
      this.updateLives(data.lives);
      this.updateRacks(data.racksRemaining);
    });
    levelScene.events.on('updateScore', s => this.updateScore(s));
    levelScene.events.on('updateLives', l => this.updateLives(l));
    levelScene.events.on('updateDemand', d => this.updateRacks(d));
    levelScene.events.on('updatePowerUpIcon', p => this.updatePowerUpIcon(p));
  }

  updateScore(score) {
    this.scoreText.setText(`Score: ${score}`);
  }

  updateLives(lives) {
    this.livesGroup.clear(true, true);
    for (let i = 0; i < lives; i++) {
      const lifeSprite = this.add.image(16 + i * 24, 48, ASSETS.SPRITESHEET_PLAYER, 0).setScale(0.5);
      this.livesGroup.add(lifeSprite);
    }
  }

  updateRacks(racks) {
    this.racksText.setText(`Racks: ${racks}`);
  }

  updatePowerUpIcon(puType) {
    if (!puType) {
      this.powerUpIcon.setVisible(false);
      return;
    }
    let idx = 0;
    switch (puType) {
      case 'ZipTie': idx = 0; break;
      case 'Coffee': idx = 1; break;
      case 'ComplianceCertificate': idx = 2; break;
      case 'WalkieTalkie': idx = 3; break;
      case 'USBStick': idx = 4; break;
      case 'LabelMaker': idx = 5; break;
    }
    this.powerUpIcon.setFrame(idx).setVisible(true);
  }
}
