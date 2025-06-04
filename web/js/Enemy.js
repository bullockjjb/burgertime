class Enemy {
  constructor(scene, x, y, type, speed) {
    this.scene = scene;
    this.type = type;
    this.speed = speed;
    this.direction = 1;
    this.isStunned = false;
    this.sprite = scene.physics.add.sprite(x, y, ASSETS.SPRITESHEET_ENEMY, 0);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setData('ref', this);
    this.patrolRange = { left: x - 100, right: x + 100 };
    this.sprite.setVelocityX(this.speed);
  }

  update(time, delta) {
    if (this.isStunned) return;
    if (this.sprite.x <= this.patrolRange.left) {
      this.direction = 1;
    } else if (this.sprite.x >= this.patrolRange.right) {
      this.direction = -1;
    }
    this.sprite.setVelocityX(this.speed * this.direction);
  }

  stun(duration = 3000) {
    this.isStunned = true;
    this.sprite.setTint(0xffff00);
    this.sprite.setVelocity(0,0);
    this.scene.time.delayedCall(duration, () => {
      this.isStunned = false;
      this.sprite.clearTint();
      this.sprite.setVelocityX(this.speed * this.direction);
    });
  }
}
