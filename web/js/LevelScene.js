class LevelScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelScene' });
  }

  init(data) {
    this.levelIndex = data.levelIndex || 1;
    this.gameState = { score: 0, lives: 3, racksRemaining: 0, startTime: 0 };
    this.rackStacks = [];
  }

  create() {
    this.cameras.main.setBackgroundColor('#000022');
    const levelData = this.cache.json.get(`level${this.levelIndex}`) || {};
    this.platformGroup = this.physics.add.staticGroup();
    if (levelData.platforms) {
      levelData.platforms.forEach(p => {
        const platform = this.add.tileSprite(p.x, p.y, p.width, 32, ASSETS.TILESET_PLATFORMS);
        this.physics.add.existing(platform, true);
        this.platformGroup.add(platform);
      });
    }
    this.ladderGroup = this.physics.add.staticGroup();
    if (levelData.ladders) {
      levelData.ladders.forEach(l => {
        const ladder = this.add.tileSprite(l.x, l.y, 32, l.height, ASSETS.TILESET_LADDERS);
        this.physics.add.existing(ladder, true);
        ladder.body.checkCollision.none = true;
        this.ladderGroup.add(ladder);
      });
    }
    this.componentsGroup = this.physics.add.group();
    if (levelData.componentPositions) {
      levelData.componentPositions.forEach(c => {
        const comp = new Component(this, c.x, c.y, c.type, c.column);
        this.componentsGroup.add(comp.sprite);
      });
    }
    this.enemiesGroup = this.physics.add.group();
    if (levelData.enemySpawns) {
      levelData.enemySpawns.forEach(e => {
        const enemy = new Enemy(this, e.x, e.y, e.type, ENEMY_SPEED_BASE);
        this.enemiesGroup.add(enemy.sprite);
      });
    }
    this.powerUpsGroup = this.physics.add.group();
    if (levelData.powerUpSpawns) {
      levelData.powerUpSpawns.forEach(p => {
        const pu = new PowerUp(this, p.x, p.y, p.type, p.delay);
        this.powerUpsGroup.add(pu.sprite);
      });
    }
    this.gameState.racksRemaining = levelData.demand || 0;
    this.rackStacks = new Array(levelData.demand || 0).fill(0);

    this.player = new Player(this, 400, 50, ASSETS.SPRITESHEET_PLAYER);

    this.physics.add.collider(this.player.sprite, this.platformGroup);
    this.physics.add.collider(this.enemiesGroup, this.platformGroup);
    this.physics.add.overlap(this.player.sprite, this.ladderGroup, this.player.onLadderOverlap, null, this.player);
    this.physics.add.overlap(this.player.sprite, this.componentsGroup, this.player.handleComponentCollision, null, this.player);
    this.physics.add.overlap(this.componentsGroup, this.enemiesGroup, (c, e) => c.getData('ref').handleEnemyHit(e.getData('ref')), null, this);
    this.physics.add.overlap(this.player.sprite, this.enemiesGroup, this.player.handleEnemyCollision, null, this.player);
    this.physics.add.overlap(this.player.sprite, this.powerUpsGroup, this.player.handlePowerUpPickup, null, this.player);

    this.events.emit('initUI', { score: this.gameState.score, lives: this.gameState.lives, racksRemaining: this.gameState.racksRemaining });
    this.events.on('updateScore', s => this.gameState.score = s);
    this.events.on('updateLives', l => this.gameState.lives = l);
    this.events.on('updateDemand', d => this.gameState.racksRemaining = d);

    this.bgm = this.sound.add(`${ASSETS.AUDIO_BGM}${this.levelIndex}`, { loop: true, volume: 0.5 });
    if (this.bgm) this.bgm.play();

    this.gameState.startTime = this.time.now;
  }

  update(time, delta) {
    if (this.player) this.player.update(time, delta);
    this.enemiesGroup.children.iterate(s => s.getData('ref').update(time, delta));
    this.componentsGroup.children.iterate(s => s.getData('ref').update(time, delta));
    this.powerUpsGroup.children.iterate(s => s.getData('ref').update(time, delta));

    if (this.gameState.racksRemaining <= 0) {
      if (this.bgm) this.bgm.stop();
      const elapsedSec = (this.time.now - this.gameState.startTime) / 1000;
      if (elapsedSec <= SPEED_BONUS_TIME) {
        this.gameState.score += SPEED_BONUS_POINTS;
        this.events.emit('updateScore', this.gameState.score);
      }
      this.player.disableInput();
      this.time.delayedCall(1000, () => {
        if (this.levelIndex < 5) {
          this.scene.restart({ levelIndex: this.levelIndex + 1 });
        } else {
          this.scene.start('VictoryScene', { finalScore: this.gameState.score });
        }
      });
    }
  }
}
