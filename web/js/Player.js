class Player {
  constructor(scene, x, y, textureKey) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, textureKey);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setData('ref', this);
    this.scene.anims.create({ key: 'walkLeft', frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 3, end: 5 }), frameRate: 10, repeat: -1 });
    this.scene.anims.create({ key: 'walkRight', frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 6, end: 8 }), frameRate: 10, repeat: -1 });
    this.scene.anims.create({ key: 'climb', frames: this.scene.anims.generateFrameNumbers(textureKey, { start: 9, end: 11 }), frameRate: 10, repeat: -1 });

    this.keys = scene.input.keyboard.addKeys({ left: 'LEFT', a: 'A', right: 'RIGHT', d: 'D', up: 'UP', w: 'W', down: 'DOWN', s: 'S', action: 'SPACE' });

    this.speed = PLAYER_SPEED;
    this.climbSpeed = CLIMB_SPEED;
    this.isInvulnerable = false;
    this.lives = 3;
    this.currentPowerUp = null;
  }

  update(time, delta) {
    let velX = 0, velY = 0;
    if (this.keys.left.isDown || this.keys.a.isDown) {
      velX = -this.speed;
      this.sprite.anims.play('walkLeft', true);
    } else if (this.keys.right.isDown || this.keys.d.isDown) {
      velX = this.speed;
      this.sprite.anims.play('walkRight', true);
    }
    const onLadder = this.scene.physics.overlapCirc(this.sprite.x, this.sprite.y, 16, true, this.scene.ladderGroup);
    if (onLadder && (this.keys.up.isDown || this.keys.w.isDown)) {
      velY = -this.climbSpeed;
      this.sprite.anims.play('climb', true);
    } else if (onLadder && (this.keys.down.isDown || this.keys.s.isDown)) {
      velY = this.climbSpeed;
      this.sprite.anims.play('climb', true);
    }
    this.sprite.setVelocity(velX, velY);

    if (Phaser.Input.Keyboard.JustDown(this.keys.action) && this.currentPowerUp) {
      this.activatePowerUp();
    }
  }

  onLadderOverlap() {}

  handleComponentCollision(playerSpr, compSpr) {
    const comp = compSpr.getData('ref');
    if (!comp.isFalling) comp.startFalling();
  }

  handleEnemyCollision(playerSpr, enemySpr) {
    if (this.isInvulnerable) return;
    this.loseLife();
  }

  loseLife() {
    this.lives--;
    this.isInvulnerable = true;
    this.sprite.setTint(0xff0000);
    this.scene.events.emit('updateLives', this.lives);
    this.scene.time.delayedCall(2000, () => {
      this.isInvulnerable = false;
      this.sprite.clearTint();
    });
    this.sprite.setPosition(400, 50);
    if (this.lives <= 0) {
      this.scene.scene.start('GameOverScene', { finalScore: this.scene.gameState.score });
    }
  }

  handlePowerUpPickup(playerSpr, puSpr) {
    const pu = puSpr.getData('ref');
    this.currentPowerUp = pu.type;
    puSpr.setVisible(false).disableBody(true, true);
    this.scene.events.emit('updatePowerUpIcon', pu.type);
  }

  activatePowerUp() {
    switch (this.currentPowerUp) {
      case 'Coffee':
        this.speed *= 1.3;
        this.climbSpeed *= 1.3;
        this.scene.time.delayedCall(7000, () => {
          this.speed = PLAYER_SPEED;
          this.climbSpeed = CLIMB_SPEED;
        });
        break;
      default:
        break;
    }
    this.currentPowerUp = null;
    this.scene.events.emit('updatePowerUpIcon', null);
  }

  disableInput() {
    Object.values(this.keys).forEach(k => k.reset());
    this.sprite.setVelocity(0, 0);
  }
}
