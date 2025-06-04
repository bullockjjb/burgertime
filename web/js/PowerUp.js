class PowerUp {
  constructor(scene, x, y, type, delay = 0) {
    this.scene = scene;
    this.type = type;
    this.isActive = false;
    this.sprite = scene.physics.add.sprite(x, y, ASSETS.SPRITESHEET_POWERUPS, 0).setVisible(false);
    this.sprite.body.setImmovable(true);
    this.sprite.body.allowGravity = false;
    this.sprite.setData('ref', this);
    if (delay > 0) {
      scene.time.delayedCall(delay, () => { this.sprite.setVisible(true); this.isActive = true; });
    } else {
      this.sprite.setVisible(true); this.isActive = true;
    }
  }

  update(time, delta) {}

  consume() {
    this.isActive = false;
    this.sprite.disableBody(true, true);
  }
}
