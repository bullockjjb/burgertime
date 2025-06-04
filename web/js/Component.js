class Component {
  constructor(scene, x, y, type, column) {
    this.scene = scene;
    this.type = type;
    this.column = column;
    this.isFalling = false;
    this.sprite = scene.physics.add.sprite(x, y, ASSETS.SPRITESHEET_COMPONENTS, 0);
    this.sprite.body.setImmovable(true);
    this.sprite.body.allowGravity = false;
    this.sprite.setData('ref', this);
  }

  startFalling() {
    this.isFalling = true;
    this.sprite.body.setImmovable(false);
    this.sprite.body.allowGravity = true;
    this.sprite.setVelocityY(COMPONENT_FALL_SPEED);
  }

  update(time, delta) {
    if (!this.isFalling) return;
    if (this.sprite.y >= GAME_HEIGHT) {
      this.stackIntoRack();
    }
  }

  stackIntoRack() {
    const columnX = 50 + this.column * 100;
    const count = this.scene.rackStacks[this.column];
    const snappedY = GAME_HEIGHT - (count + 1) * 32;
    this.sprite.setVelocity(0,0);
    this.sprite.setPosition(columnX, snappedY);
    this.sprite.body.enable = false;
    this.isFalling = false;
    this.scene.rackStacks[this.column] = count + 1;
    this.scene.gameState.score += POINTS_PER_COMPONENT;
    this.scene.events.emit('updateScore', this.scene.gameState.score);
    if (this.scene.rackStacks[this.column] === 6) {
      this.scene.gameState.score += POINTS_PER_RACK_COMPLETE;
      this.scene.events.emit('updateScore', this.scene.gameState.score);
      this.scene.gameState.racksRemaining--;
      this.scene.events.emit('updateDemand', this.scene.gameState.racksRemaining);
    }
    this.sprite.setVisible(false);
  }

  handleEnemyHit(enemy) {
    if (!enemy.isStunned) {
      this.scene.gameState.score += POINTS_PER_ENEMY_HIT;
      this.scene.events.emit('updateScore', this.scene.gameState.score);
      enemy.stun(3000);
    }
  }
}
