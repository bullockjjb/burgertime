const { test } = require("node:test");
const assert = require("node:assert/strict");
const catalog = require("../js/catalog.js");
const { Game, FLOORS, CENTERS } = require("../js/engine.js");
const tick = (game, seconds, input = {}) => {
  for (let i = 0; i < Math.ceil(seconds * 60); i++) game.step(1 / 60, input);
};
function drive(game, predicate, input, limit = 15) {
  for (let i = 0; i < limit * 60; i++) {
    if (predicate() || game.status === "level-complete") return;
    game.step(1 / 60, typeof input === "function" ? input() : input);
  }
  assert.ok(
    predicate(),
    `Navigation reached its target: level=${game.level}, row=${game.player.row}, x=${game.player.x}, y=${game.player.y}`,
  );
}
function sweepLevel(game) {
  for (let row = 0; row < 4 && game.status === "playing"; row++) {
    const right = row % 2 === 0;
    drive(game, () => (right ? game.player.x >= 894 : game.player.x <= 66), {
      [right ? "right" : "left"]: true,
      pulse: true,
    });
    if (row < 3) {
      const ladders = game.ladders[row];
      const target = right ? ladders.at(-1) : ladders[0];
      drive(
        game,
        () => Math.abs(game.player.x - target) < 12,
        () => ({
          [game.player.x < target ? "right" : "left"]: true,
          pulse: true,
        }),
      );
      drive(
        game,
        () => game.player.row === row + 1 && !game.player.climbing,
        () => ({
          down: true,
          pulse: true,
          ...(!game.player.climbing && Math.abs(game.player.x - target) > 15
            ? { [game.player.x < target ? "right" : "left"]: true }
            : {}),
        }),
      );
    }
  }
  tick(game, 3);
}
test("all families have complete, distinct fictional part identities and correct quiz keys", () => {
  assert.equal(catalog.length, 4);
  const ids = new Set();
  for (const f of catalog) {
    assert.equal(f.parts.length, 4);
    assert.ok(f.source.startsWith("https://www.accelevation.com/"));
    assert.ok(f.quiz.options[f.quiz.answer]);
    for (const p of f.parts) {
      assert.match(p.code, /^GAME-/);
      assert.ok(!ids.has(p.code));
      ids.add(p.code);
    }
  }
});
test("crossing all sections starts a cascade and installs the bottom component", () => {
  const game = new Game(catalog);
  game.start();
  drive(game, () => game.player.x > CENTERS[0] + 90, { right: true });
  tick(game, 2);
  assert.equal(
    game.parts.filter((p) => p.bay === 0 && p.state === "installed").length,
    1,
  );
  assert.equal(
    game.parts.filter((p) => p.bay === 0 && p.state === "idle").length,
    3,
  );
  assert.equal(
    game.parts.find((p) => p.bay === 0 && p.kind === 0).state,
    "installed",
  );
  assert.ok(game.score >= 700);
  assert.equal(game.status, "playing");
});
test("partial traversal cannot release a component", () => {
  const game = new Game(catalog);
  game.start();
  drive(game, () => game.player.x > 210, { right: true });
  tick(game, 0.4);
  const top = game.parts.find((p) => p.bay === 0 && p.kind === 3);
  assert.equal(top.state, "idle");
  assert.ok(top.steps.some(Boolean));
  assert.ok(!top.steps.every(Boolean));
});
test("four complete projects can be played with movement and pulse input only", () => {
  const game = new Game(catalog);
  game.start("guided");
  for (let level = 0; level < 4; level++) {
    assert.equal(game.level, level);
    sweepLevel(game);
    assert.equal(game.status, "level-complete", `project ${level + 1} cleared`);
    assert.equal(game.installed, 12);
    assert.deepEqual(game.baysComplete, [true, true, true]);
    const before = game.score;
    assert.equal(game.quizBonus(), true);
    assert.equal(game.quizBonus(), false);
    assert.equal(game.score, before + 500);
    game.nextLevel();
  }
  assert.equal(game.status, "won");
  assert.ok(game.score > 20000);
  assert.ok(game.elapsed > 60);
  assert.equal(game.nextLevel(), false);
});
test("pause freezes clocks, actors, cooldowns and component motion", () => {
  const game = new Game(catalog);
  game.start();
  game.pulse();
  tick(game, 1, { right: true });
  game.pause();
  const before = game.snapshot();
  tick(game, 5, { right: true, pulse: true });
  assert.deepEqual(game.snapshot(), before);
  game.resume();
  tick(game, 0.5, { right: true });
  assert.ok(game.player.x > before.player.x);
});
test("ladders require alignment and support reversing mid-climb", () => {
  const game = new Game(catalog);
  game.start();
  game.player.x = 200;
  tick(game, 1, { down: true });
  assert.equal(game.player.row, 0);
  assert.equal(game.player.climbing, null);
  game.player.x = 66;
  tick(game, 0.4, { down: true });
  assert.ok(game.player.y > FLOORS[0]);
  tick(game, 0.5, { up: true });
  assert.equal(game.player.row, 0);
  assert.equal(game.player.y, FLOORS[0]);
  assert.equal(game.player.climbing, null);
});
test("pulse stuns only nearby setbacks and must recharge", () => {
  const game = new Game(catalog);
  game.start();
  game.enemies[0].x = game.player.x + 40;
  game.enemies[0].y = game.player.y;
  game.enemies[0].row = 0;
  assert.equal(game.pulse(), true);
  assert.equal(game.enemies[0].stun, 4);
  assert.equal(game.enemies[1].stun, 0);
  assert.equal(game.pulse(), false);
  tick(game, 6.1);
  assert.equal(game.pulse(), true);
});
test("holding down lands on one floor so a player can exit the ladder", () => {
  const game = new Game(catalog);
  game.start();
  tick(game, 2, { down: true });
  assert.equal(game.player.row, 1);
  assert.equal(game.player.climbing, null);
  tick(game, 0.1);
  tick(game, 1, { down: true });
  assert.equal(game.player.row, 2);
  assert.equal(game.player.climbing, null);
});
test("arcade collisions consume lives while guided mode preserves progress", () => {
  for (const mode of ["guided", "arcade"]) {
    const game = new Game(catalog);
    game.start(mode);
    for (let i = 0; i < 3; i++) {
      game.player.invulnerable = 0;
      const e = game.enemies[0];
      Object.assign(e, {
        x: game.player.x,
        y: game.player.y,
        row: game.player.row,
        stun: 0,
        respawn: 0,
        climbing: null,
      });
      game.step(1 / 60);
    }
    assert.equal(game.hits, 3);
    assert.equal(game.status, mode === "arcade" ? "game-over" : "playing");
    assert.equal(game.lives, mode === "arcade" ? 0 : 3);
  }
});
test("new shift resets run state and does not reuse component progress", () => {
  const game = new Game(catalog);
  game.start();
  sweepLevel(game);
  game.quizBonus();
  game.nextLevel();
  game.start("arcade");
  assert.equal(game.level, 0);
  assert.equal(game.score, 0);
  assert.equal(game.elapsed, 0);
  assert.equal(game.installed, 0);
  assert.equal(game.lives, 3);
  assert.equal(game.mode, "arcade");
  assert.ok(game.parts.every((p) => p.steps.every((s) => !s)));
});
test("incomplete assemblies cannot advance; time steps are bounded after stalls", () => {
  const game = new Game(catalog);
  game.start();
  assert.equal(game.nextLevel(), false);
  assert.equal(game.quizBonus(), false);
  game.step(100, { right: true });
  assert.ok(game.elapsed <= 0.05);
  assert.ok(game.player.x < 80);
  assert.equal(game.installed, 0);
});
