/* Deterministic arcade simulation. Rendering, input, and storage live elsewhere. */
(function (root) {
  "use strict";
  const WIDTH = 960,
    HEIGHT = 660;
  const FLOORS = [140, 262, 384, 506],
    BASE = 611;
  const CENTERS = [218, 480, 742],
    PART_WIDTH = 180,
    SEGMENTS = 5;
  const LADDER_LAYOUTS = [
    [
      [66, 350, 610, 894],
      [66, 350, 610, 894],
      [66, 350, 610, 894],
    ],
    [
      [90, 352, 610, 870],
      [90, 352, 610, 870],
      [90, 352, 610, 870],
    ],
    [
      [66, 348, 612, 894],
      [66, 348, 612, 894],
      [66, 348, 612, 894],
    ],
    [
      [80, 350, 610, 880],
      [80, 350, 610, 880],
      [80, 350, 610, 880],
    ],
  ];
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  class Game {
    constructor(catalog, onEvent = () => {}) {
      this.catalog = catalog;
      this.onEvent = onEvent;
      this.mode = "guided";
      this.status = "ready";
      this.score = 0;
      this.elapsed = 0;
      this.lives = 3;
      this.hits = 0;
      this.level = 0;
      this.installLevel(0);
      this.status = "ready";
    }
    event(type, data = {}) {
      this.onEvent({ type, ...data });
    }
    start(mode = "guided") {
      this.mode = mode === "arcade" ? "arcade" : "guided";
      this.score = 0;
      this.elapsed = 0;
      this.lives = 3;
      this.hits = 0;
      this.quizBonuses = new Set();
      this.installLevel(0);
      this.status = "playing";
      this.event("start");
    }
    installLevel(index) {
      this.level = index;
      this.levelElapsed = 0;
      this.pulseCooldown = 0;
      this.pulseRing = null;
      this.player = {
        x: 66,
        y: FLOORS[0],
        row: 0,
        climbing: null,
        facing: 1,
        invulnerable: 2.5,
        walk: 0,
        moving: false,
      };
      this.ladders = LADDER_LAYOUTS[index];
      this.particles = [];
      this.floaters = [];
      this.parts = [];
      for (let bay = 0; bay < 3; bay++)
        for (let row = 0; row < 4; row++) {
          this.parts.push({
            id: `${index}-${bay}-${row}`,
            bay,
            kind: 3 - row,
            row,
            x: CENTERS[bay],
            y: FLOORS[row],
            steps: Array(SEGMENTS).fill(false),
            state: "idle",
            target: 0,
            chain: 1,
          });
        }
      this.enemies = [
        {
          x: 830,
          y: FLOORS[2],
          row: 2,
          kind: "rework",
          direction: -1,
          climbing: null,
          stun: 0,
          respawn: 0,
        },
        {
          x: 480,
          y: FLOORS[3],
          row: 3,
          kind: "delay",
          direction: 1,
          climbing: null,
          stun: 0,
          respawn: 0,
        },
      ];
      if (this.mode === "arcade" || index > 1)
        this.enemies.push({
          x: 840,
          y: FLOORS[1],
          row: 1,
          kind: "heat",
          direction: -1,
          climbing: null,
          stun: 1.5,
          respawn: 0,
        });
      this.status = "playing";
      this.event("level", { index });
    }
    get installed() {
      return this.parts.filter((p) => p.state === "installed").length;
    }
    get baysComplete() {
      return CENTERS.map(
        (_, bay) =>
          this.parts.filter((p) => p.bay === bay && p.state === "installed")
            .length === 4,
      );
    }
    snapshot() {
      return {
        status: this.status,
        mode: this.mode,
        score: this.score,
        elapsed: this.elapsed,
        level: this.level,
        lives: this.lives,
        hits: this.hits,
        installed: this.installed,
        pulseCooldown: this.pulseCooldown,
        player: { ...this.player },
        parts: this.parts.map((p) => ({ ...p, steps: [...p.steps] })),
        enemies: this.enemies.map((e) => ({ ...e })),
      };
    }
    pause() {
      if (this.status === "playing") {
        this.status = "paused";
        this.event("pause");
      }
    }
    resume() {
      if (this.status === "paused") {
        this.status = "playing";
        this.event("resume");
      }
    }
    nextLevel() {
      if (this.status !== "level-complete") return false;
      if (this.level === this.catalog.length - 1) {
        this.status = "won";
        this.event("won");
      } else {
        this.lives = Math.min(3, this.lives + 1);
        this.installLevel(this.level + 1);
      }
      return true;
    }
    quizBonus() {
      if (this.status !== "level-complete" || this.quizBonuses.has(this.level))
        return false;
      this.quizBonuses.add(this.level);
      this.score += 500;
      this.event("quiz");
      return true;
    }
    pulse() {
      if (this.status !== "playing" || this.pulseCooldown > 0) return false;
      this.pulseCooldown = this.mode === "guided" ? 6 : 9;
      this.pulseRing = { x: this.player.x, y: this.player.y - 16, life: 0.55 };
      let count = 0;
      for (const e of this.enemies)
        if (
          !e.respawn &&
          Math.hypot(e.x - this.player.x, e.y - this.player.y) < 164
        ) {
          e.stun = 4;
          count++;
        }
      this.event("pulse", { count });
      return true;
    }
    addFloater(x, y, text, color = "#f6bd8b") {
      this.floaters.push({ x, y, text, color, life: 1.35 });
    }
    drop(part, chain = 1) {
      if (part.state !== "idle") return;
      part.state = "falling";
      part.target = part.row + 1;
      part.chain = chain;
      part.steps.fill(false);
      this.score += 50 * chain;
      this.addFloater(
        part.x,
        part.y - 30,
        chain > 1 ? `CHAIN ×${chain}` : "+50",
      );
      this.event("drop", { chain, part });
    }
    moveActor(actor, horizontal, vertical, dt, speed) {
      actor.moving = false;
      if (!vertical) actor.climbLatch = 0;
      if (actor.climbing) {
        if (!vertical) return;
        const climb = actor.climbing;
        actor.y = clamp(
          actor.y + vertical * speed * 0.76 * dt,
          FLOORS[climb.upper],
          FLOORS[climb.upper + 1],
        );
        actor.moving = true;
        if (
          actor.y === FLOORS[climb.upper] ||
          actor.y === FLOORS[climb.upper + 1]
        ) {
          actor.row =
            actor.y === FLOORS[climb.upper] ? climb.upper : climb.upper + 1;
          actor.climbing = null;
          // Land cleanly on a floor; the next climb requires releasing up/down.
          // This gives keyboard and touch players a generous exit from ladders.
          if (actor === this.player) actor.climbLatch = vertical;
        }
        return;
      }
      if (vertical && actor.climbLatch !== vertical) {
        const upper = vertical < 0 ? actor.row - 1 : actor.row;
        if (upper >= 0 && upper < 3) {
          const ladder = this.ladders[upper].find(
            (x) => Math.abs(x - actor.x) < 21,
          );
          if (ladder !== undefined) {
            actor.x = ladder;
            actor.climbing = { upper };
            actor.moving = true;
            return;
          }
        }
      }
      if (horizontal) {
        actor.x = clamp(actor.x + horizontal * speed * dt, 43, 917);
        actor.facing = horizontal;
        actor.moving = true;
      }
    }
    moveEnemies(dt) {
      const p = this.player;
      this.enemies.forEach((enemy, i) => {
        if (enemy.respawn > 0) {
          enemy.respawn -= dt;
          if (enemy.respawn <= 0) {
            enemy.x = i % 2 ? 80 : 880;
            enemy.row = 3;
            enemy.y = FLOORS[3];
            enemy.climbing = null;
            enemy.stun = 1;
          }
          return;
        }
        if (enemy.stun > 0) {
          enemy.stun = Math.max(0, enemy.stun - dt);
          return;
        }
        let dx = 0,
          dy = 0;
        if (enemy.climbing) dy = enemy.climbDirection;
        else {
          const targetRow = p.climbing
            ? p.climbing.upper + (p.y > FLOORS[p.climbing.upper] + 61 ? 1 : 0)
            : p.row;
          if (targetRow === enemy.row) dx = Math.sign(p.x - enemy.x);
          else {
            dy = targetRow > enemy.row ? 1 : -1;
            const choices = this.ladders[dy > 0 ? enemy.row : enemy.row - 1];
            const target = choices.reduce(
              (best, x) =>
                Math.abs(x - enemy.x) + Math.abs(x - p.x) * 0.45 <
                Math.abs(best - enemy.x) + Math.abs(best - p.x) * 0.45
                  ? x
                  : best,
              choices[0],
            );
            if (Math.abs(target - enemy.x) > 10) {
              dx = Math.sign(target - enemy.x);
              dy = 0;
            }
          }
        }
        enemy.climbDirection = dy || enemy.climbDirection;
        this.moveActor(
          enemy,
          dx,
          dy,
          dt,
          (this.mode === "guided" ? 37 : 61) + this.level * 4 + i * 3,
        );
      });
    }
    step(dt, input = {}) {
      if (this.status !== "playing") return;
      dt = clamp(dt, 0, 0.05);
      this.elapsed += dt;
      this.levelElapsed += dt;
      this.pulseCooldown = Math.max(0, this.pulseCooldown - dt);
      this.player.invulnerable = Math.max(0, this.player.invulnerable - dt);
      this.moveActor(
        this.player,
        Number(!!input.right) - Number(!!input.left),
        Number(!!input.down) - Number(!!input.up),
        dt,
        208,
      );
      if (this.player.moving) this.player.walk += dt * 12;
      if (input.pulse) this.pulse();
      for (const part of this.parts) {
        if (
          part.state === "idle" &&
          !this.player.climbing &&
          part.row === this.player.row &&
          Math.abs(this.player.x - part.x) < PART_WIDTH / 2 + 3
        ) {
          const segment = clamp(
            Math.floor(
              (this.player.x - (part.x - PART_WIDTH / 2)) /
                (PART_WIDTH / SEGMENTS),
            ),
            0,
            SEGMENTS - 1,
          );
          if (!part.steps[segment]) {
            part.steps[segment] = true;
            this.event("step", { segment });
          }
          if (part.steps.every(Boolean)) this.drop(part);
        }
      }
      this.moveEnemies(dt);
      for (const part of this.parts) {
        if (part.state !== "falling") continue;
        const oldY = part.y;
        const targetY =
          part.target === 4 ? BASE - part.kind * 9 : FLOORS[part.target];
        part.y = Math.min(targetY, part.y + 355 * dt);
        for (const e of this.enemies)
          if (
            e.respawn <= 0 &&
            Math.abs(e.x - part.x) < PART_WIDTH / 2 &&
            e.y >= oldY - 6 &&
            e.y <= part.y + 12
          ) {
            e.respawn = 5;
            this.score += 150;
            this.addFloater(e.x, e.y - 25, "SETBACK CLEARED +150", "#a8dcb6");
            this.event("clear-enemy");
          }
        if (part.y === targetY) {
          part.row = part.target;
          if (part.row === 4) {
            part.state = "installed";
            this.score += 200;
            this.addFloater(part.x, BASE - 60, "+200 INSTALLED", "#aedfb6");
            this.event("installed", { part });
          } else {
            const beneath = this.parts.find(
              (other) =>
                other !== part &&
                other.bay === part.bay &&
                other.row === part.row &&
                other.state === "idle",
            );
            if (beneath) this.drop(beneath, part.chain + 1);
            part.state = "idle";
          }
        }
      }
      for (const enemy of this.enemies) {
        if (enemy.stun > 0 || enemy.respawn > 0 || this.player.invulnerable > 0)
          continue;
        if (
          Math.abs(enemy.x - this.player.x) < 26 &&
          Math.abs(enemy.y - this.player.y) < 29
        ) {
          this.hits++;
          this.score = Math.max(0, this.score - 150);
          if (this.mode === "arcade") this.lives--;
          // A small knockback keeps the player near unfinished work. Teleporting
          // to the far end of a floor could silently skip an entire component.
          if (!this.player.climbing)
            this.player.x = clamp(
              this.player.x - this.player.facing * 45,
              43,
              917,
            );
          this.player.y = FLOORS[this.player.row];
          this.player.climbing = null;
          this.player.invulnerable = 3;
          enemy.stun = 1.25;
          this.event("hit");
          if (this.mode === "arcade" && this.lives <= 0) {
            this.status = "game-over";
            this.event("game-over");
            return;
          }
          break;
        }
      }
      this.floaters = this.floaters.filter((f) => {
        f.life -= dt;
        f.y -= dt * 19;
        return f.life > 0;
      });
      if (this.pulseRing) {
        this.pulseRing.life -= dt;
        if (this.pulseRing.life <= 0) this.pulseRing = null;
      }
      if (this.installed === this.parts.length) {
        this.score += 1000;
        this.status = "level-complete";
        this.event("level-complete");
      }
    }
  }
  const api = {
    Game,
    WIDTH,
    HEIGHT,
    FLOORS,
    BASE,
    CENTERS,
    PART_WIDTH,
    SEGMENTS,
    LADDER_LAYOUTS,
  };
  root.AccelevationEngine = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
