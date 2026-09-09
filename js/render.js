/* Original vector arcade art. No original BurgerTime sprites or audio are used. */
(function (root) {
  "use strict";
  const {
    WIDTH: W,
    HEIGHT: H,
    FLOORS,
    CENTERS,
    PART_WIDTH,
  } = root.AccelevationEngine;
  const orange = "#e87722";
  const rect = (ctx, x, y, w, h, fill) => {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);
  };
  function line(ctx, x1, y1, x2, y2, color, width = 1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  function poly(ctx, points, fill, stroke) {
    ctx.beginPath();
    points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  function text(
    ctx,
    label,
    x,
    y,
    color,
    size = 10,
    align = "left",
    weight = 600,
  ) {
    ctx.font = `${weight} ${size}px Barlow, Arial, sans-serif`;
    ctx.textAlign = align;
    ctx.fillStyle = color;
    ctx.fillText(label, x, y);
  }
  function box(ctx, x, y, w, h, d, front, side, top) {
    rect(ctx, x, y, w, h, front);
    poly(
      ctx,
      [
        [x + w, y],
        [x + w + d, y - d * 0.55],
        [x + w + d, y + h - d * 0.55],
        [x + w, y + h],
      ],
      side,
    );
    poly(
      ctx,
      [
        [x, y],
        [x + d, y - d * 0.55],
        [x + w + d, y - d * 0.55],
        [x + w, y],
      ],
      top,
    );
  }
  function product(ctx, family, x, y, scale = 1, progress = 4) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    const alpha = ctx.globalAlpha;
    ctx.globalAlpha *= 0.4;
    poly(
      ctx,
      [
        [-84, 22],
        [25, -3],
        [110, 21],
        [0, 50],
      ],
      "#071115",
    );
    ctx.globalAlpha = alpha;
    if (family === "containment") {
      box(ctx, -66, -47, 112, 62, 33, "#233744", "#172a35", "#3c5360");
      for (let i = 0; i < 4; i++) {
        box(ctx, -61 + i * 26, -39, 22, 49, 5, "#344954", "#182b36", "#61737c");
        for (let j = 0; j < 6; j++) {
          rect(ctx, -58 + i * 26, -33 + j * 6, 15, 3, "#162932");
          rect(
            ctx,
            -46 + i * 26,
            -32 + j * 6,
            2,
            1,
            j % 2 ? "#7bbcba" : orange,
          );
        }
      }
      if (progress >= 1) {
        box(ctx, -76, -63, 5, 85, 5, "#8498a0", "#485f6a", "#c4d1d4");
        box(ctx, 51, -63, 5, 85, 5, "#8498a0", "#485f6a", "#c4d1d4");
        box(ctx, -76, -63, 132, 6, 5, "#889da7", "#4e6976", "#c3d1d6");
      }
      if (progress >= 2) {
        poly(
          ctx,
          [
            [-71, -55],
            [-39, -74],
            [85, -74],
            [52, -55],
          ],
          "#83c7d522",
          "#89b7c1",
        );
        poly(
          ctx,
          [
            [56, -56],
            [86, -74],
            [86, 3],
            [56, 20],
          ],
          "#6aacbf28",
          "#79a0ae",
        );
      }
      if (progress >= 3) {
        box(ctx, -31, -56, 4, 76, 3, "#94aab4", "#435f6d", "#bfcdd3");
        poly(
          ctx,
          [
            [-26, -53],
            [48, -53],
            [48, 18],
            [-26, 18],
          ],
          "#8ec8d626",
          "#8ab4c4",
        );
        line(ctx, 10, -52, 10, 17, "#91b1bf", 3);
        rect(ctx, 5, -16, 2, 12, orange);
        rect(ctx, 15, -16, 2, 12, orange);
      }
      if (progress >= 4) {
        poly(
          ctx,
          [
            [-77, -65],
            [-43, -85],
            [90, -85],
            [56, -65],
          ],
          "#b7d5db55",
          "#a9c5cc",
        );
        for (let i = 0; i < 5; i++)
          line(ctx, -77 + i * 26, -65, -43 + i * 26, -85, "#8cb3c2", 2);
        rect(ctx, -76, -66, 132, 4, orange);
      }
    } else if (family === "structure") {
      if (progress >= 1) {
        for (const [px, py] of [
          [-67, 10],
          [52, 10],
          [-32, -16],
          [86, -16],
        ]) {
          box(ctx, px - 7, py, 20, 5, 8, "#879da8", "#405867", "#9eafb8");
          box(ctx, px, py - 87, 7, 89, 7, "#8a9da7", "#3c5666", "#c3cdd0");
        }
      }
      if (progress >= 2) {
        for (const px of [-67, 52]) {
          rect(ctx, px - 3, -57, 12, 13, orange);
          rect(ctx, px, -54, 2, 2, "#ffe0c5");
          rect(ctx, px, -48, 2, 2, "#ffe0c5");
        }
      }
      if (progress >= 3) {
        box(ctx, -78, -51, 146, 7, 13, "#5d8495", "#2b4d60", "#9ab5c1");
        box(ctx, -78, -23, 146, 7, 13, "#5d8495", "#2b4d60", "#9ab5c1");
      }
      if (progress >= 4) {
        box(ctx, -70, -81, 131, 10, 12, "#abbac1", "#4b6a7b", "#d2dce0");
        box(ctx, -36, -102, 131, 10, 9, "#8aa3ae", "#365162", "#b7cad1");
        poly(
          ctx,
          [
            [-70, -81],
            [-36, -102],
            [-27, -102],
            [-61, -81],
          ],
          "#c6d5da",
        );
        poly(
          ctx,
          [
            [52, -81],
            [86, -102],
            [96, -102],
            [61, -81],
          ],
          "#b7cbd1",
        );
        rect(ctx, -68, -80, 127, 3, orange);
      }
    } else if (family === "power") {
      if (progress >= 1) {
        box(ctx, -44, -91, 70, 111, 27, "#a6b5bc", "#425b68", "#c2cfd3");
        box(ctx, -38, -84, 58, 96, 1, "#243942", "#1b2c35", "#637b85");
      }
      if (progress >= 2) {
        rect(ctx, -28, -76, 35, 14, "#e87722");
        for (let r = 0; r < 6; r++)
          for (let c = 0; c < 2; c++) {
            box(
              ctx,
              -28 + c * 19,
              -54 + r * 9,
              15,
              7,
              2,
              "#758993",
              "#3c5663",
              "#a4b6bf",
            );
            rect(ctx, -25 + c * 19, -53 + r * 9, 3, 4, "#112731");
          }
      }
      if (progress >= 3) {
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(53, -67 + i * 10);
          ctx.bezierCurveTo(80, -70 + i * 10, 98, 13, 58 + i * 9, 27);
          ctx.strokeStyle = i === 1 ? orange : "#6eacc0";
          ctx.lineWidth = 4;
          ctx.stroke();
          box(ctx, 53 + i * 9, 24, 10, 7, 3, "#99b4c1", "#315264", "#c1d1d9");
        }
      }
      if (progress >= 4) {
        rect(ctx, -27, -72, 27, 5, "#ffe5bd");
        text(ctx, "RPP", -13, -68, "#363434", 5, "center");
        rect(ctx, -26, 5, 31, 5, "#b7dcbf");
      }
    } else {
      if (progress >= 1) {
        box(ctx, -79, 7, 140, 7, 26, "#9caeb7", "#3e5a69", "#bdcbd2");
        for (const px of [-75, 55])
          box(ctx, px, -74, 6, 83, 6, "#738c98", "#3a5665", "#afc2cb");
        box(ctx, -76, -78, 137, 7, 24, "#a9bdc6", "#4d6e7d", "#c9d9df");
      }
      if (progress >= 2) {
        box(ctx, -52, -48, 94, 48, 17, "#2a424e", "#1d343f", "#637e8c");
        for (let i = 0; i < 3; i++) {
          rect(ctx, -47 + i * 29, -42, 24, 33, "#516875");
          for (let j = 0; j < 5; j++) {
            rect(ctx, -44 + i * 29, -39 + j * 6, 16, 2, "#1d3541");
            rect(ctx, -24 + i * 29, -38 + j * 6, 2, 1, "#9dd2c0");
          }
        }
      }
      if (progress >= 3) {
        box(ctx, -65, -62, 140, 5, 16, "#7295a6", "#2b4d60", "#bdd1d8");
        for (let i = 0; i < 12; i++)
          line(ctx, -60 + i * 11, -61, -43 + i * 11, -71, "#9fc4d2", 2);
      }
      if (progress >= 4) {
        for (let i = 0; i < 2; i++) {
          line(
            ctx,
            -64,
            -91 - i * 8,
            63,
            -91 - i * 8,
            i === 0 ? "#e8a06a" : "#87bdce",
            5,
          );
          for (let j = 0; j < 3; j++) {
            line(
              ctx,
              -42 + j * 36,
              -91 - i * 8,
              -42 + j * 36,
              -82,
              "#a4c0c9",
              3,
            );
            rect(ctx, -44 + j * 36, -94 - i * 8, 5, 4, "#d6e4e8");
          }
        }
      }
    }
    ctx.restore();
  }
  class Renderer {
    constructor(canvas, preview, catalog) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.preview = preview;
      this.catalog = catalog;
      this.reduced = false;
      this.previewLevel = -1;
    }
    drawProductPreview(level) {
      const ctx = this.preview.getContext("2d");
      ctx.clearRect(0, 0, 280, 154);
      product(ctx, this.catalog[level].id, 137, 116, 1.04, 4);
      this.preview.setAttribute(
        "aria-label",
        `Illustration of ${this.catalog[level].name}`,
      );
    }
    draw(game, time) {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#142631");
      bg.addColorStop(1, "#111d26");
      rect(ctx, 0, 0, W, H, bg);
      // Recessed data hall, structural columns, and overhead service runs.
      for (let x = 16; x < W; x += 105) {
        rect(ctx, x, 75, 65, 474, "#172a36");
        rect(ctx, x + 3, 78, 59, 470, "#14232e");
        for (let y = 83; y < 545; y += 22) {
          rect(ctx, x + 8, y, 45, 12, "#1a303e");
          rect(ctx, x + 42, y + 4, 3, 2, "#34505e");
        }
      }
      for (let x = 24; x < W; x += 230) {
        rect(ctx, x, 0, 5, 554, "#2d434e");
        rect(ctx, x + 5, 0, 3, 554, "#0b1821");
      }
      for (let i = 0; i < 3; i++) {
        line(ctx, 0, 44 + i * 9, W, 44 + i * 9, "#375363", i === 0 ? 4 : 2);
      }
      for (let x = 162; x < W; x += 290) {
        rect(ctx, x, 47, 138, 4, "#65828f");
        rect(ctx, x + 3, 51, 132, 2, "#a8c2cb");
        const light = ctx.createLinearGradient(0, 55, 0, 155);
        light.addColorStop(0, "#80b4ca09");
        light.addColorStop(1, "#80b4ca00");
        poly(
          ctx,
          [
            [x + 3, 55],
            [x + 135, 55],
            [x + 192, 160],
            [x - 55, 160],
          ],
          light,
        );
      }
      for (let row = 0; row < 3; row++)
        for (const x of game.ladders[row]) {
          rect(
            ctx,
            x - 15,
            FLOORS[row] + 8,
            30,
            FLOORS[row + 1] - FLOORS[row] - 8,
            "#13232a",
          );
          line(
            ctx,
            x - 13,
            FLOORS[row] - 3,
            x - 13,
            FLOORS[row + 1] + 2,
            "#748f9b",
            4,
          );
          line(
            ctx,
            x + 13,
            FLOORS[row] - 3,
            x + 13,
            FLOORS[row + 1] + 2,
            "#748f9b",
            4,
          );
          for (let y = FLOORS[row] + 16; y < FLOORS[row + 1]; y += 15) {
            line(ctx, x - 11, y, x + 11, y, "#5f7d8d", 3);
            line(ctx, x - 11, y + 2, x + 11, y + 2, "#142832", 1);
          }
        }
      for (let row = 0; row < 4; row++) {
        const y = FLOORS[row];
        rect(ctx, 32, y + 1, 896, 5, "#92a5af");
        rect(ctx, 32, y + 6, 896, 9, "#415c6c");
        rect(ctx, 32, y + 15, 896, 3, "#0a1922");
        for (let x = 38; x < 925; x += 25)
          rect(ctx, x, y + 8, 13, 2, "#69818d");
        for (const x of [44, 322, 595, 910])
          poly(
            ctx,
            [
              [x, y + 17],
              [x + 13, y + 17],
              [x, y + 33],
            ],
            "#3b5361",
          );
        text(ctx, `0${4 - row}`, 16, y + 11, "#8fa4b1", 10, "center");
      }
      rect(ctx, 0, 554, W, 106, "#101b22");
      line(ctx, 0, 554, W, 554, "#3a5260", 2);
      for (let x = 0; x < W; x += 24)
        poly(
          ctx,
          [
            [x, 555],
            [x + 12, 555],
            [x + 1, 562],
            [x - 11, 562],
          ],
          "#e8772238",
        );
      CENTERS.forEach((x, bay) => {
        const count = game.parts.filter(
          (p) => p.bay === bay && p.state === "installed",
        ).length;
        rect(ctx, x - 110, 575, 220, 60, "#1b2b35");
        line(
          ctx,
          x - 110,
          635,
          x + 110,
          635,
          count === 4 ? "#8ac49b" : "#3b5665",
          2,
        );
        ctx.save();
        ctx.globalAlpha = count === 4 ? 1 : 0.32;
        product(
          ctx,
          this.catalog[game.level].id,
          x,
          620,
          0.52,
          Math.max(1, count),
        );
        ctx.restore();
        text(ctx, `BAY 0${bay + 1}`, x - 99, 590, "#93a7b2", 8);
        text(
          ctx,
          count === 4 ? "COMPLETE ✓" : `${count} / 4`,
          x + 99,
          590,
          count === 4 ? "#acd6b5" : "#93a7b2",
          8,
          "right",
        );
      });
      text(
        ctx,
        "ASSEMBLY → CUSTOMER SOLUTION",
        480,
        651,
        "#698592",
        8,
        "center",
      );
      game.parts
        .filter((p) => p.state === "idle")
        .forEach((p) => this.part(ctx, p, game));
      game.enemies.forEach((e, i) => this.enemy(ctx, e, time, i));
      this.player(ctx, game.player, time);
      game.parts
        .filter((p) => p.state === "falling")
        .forEach((p) => this.part(ctx, p, game));
      if (game.pulseRing && !this.reduced) {
        const ring = game.pulseRing;
        ctx.save();
        ctx.globalAlpha = ring.life / 0.55;
        ctx.strokeStyle = "#99deec";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, (1 - ring.life / 0.55) * 164, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      if (!this.reduced)
        game.floaters.forEach((f) => {
          ctx.save();
          ctx.globalAlpha = Math.min(1, f.life * 2);
          text(ctx, f.text, f.x, f.y, f.color, 10, "center", 700);
          ctx.restore();
        });
      // Subtle scanlines retain the arcade character without obscuring the parts.
      for (let y = 0; y < H; y += 4) rect(ctx, 0, y, W, 1, "#020a120b");
      if (this.previewLevel !== game.level) {
        this.drawProductPreview(game.level);
        this.previewLevel = game.level;
      }
    }
    part(ctx, p, game) {
      const def = this.catalog[game.level].parts[p.kind],
        seg = PART_WIDTH / 5,
        left = p.x - PART_WIDTH / 2;
      if (p.state === "falling") {
        ctx.save();
        ctx.globalAlpha = 0.1;
        rect(ctx, left, p.y - 40, PART_WIDTH, 25, def.color);
        ctx.restore();
      }
      for (let i = 0; i < 5; i++) {
        const x = left + i * seg + 1,
          y = p.y - 20 + (p.steps[i] ? 5 : 0),
          w = seg - 2;
        rect(ctx, x + 2, y + 3, w, 18, "#08131b");
        rect(ctx, x, y, w, 17, "#354d5b");
        rect(ctx, x, y, w, 3, def.color);
        line(ctx, x, y + 3, x, y + 17, "#a7bdc966");
        const c = def.color;
        switch (def.type) {
          case "panel":
          case "roof":
          case "door":
            rect(ctx, x + 3, y + 4, w - 6, 10, "#77bfd936");
            line(ctx, x + 3, y + 13, x + w - 4, y + 5, "#a8d0de66");
            if (def.type === "door") rect(ctx, x + w - 7, y + 7, 2, 6, c);
            break;
          case "frame":
          case "beam":
          case "post":
          case "arm":
            rect(ctx, x + 3, y + 6, w - 6, 3, c);
            rect(ctx, x + 4, y + 5, 3, 9, c);
            rect(ctx, x + w - 7, y + 5, 3, 9, c);
            break;
          case "bolt":
            for (let j = 0; j < 3; j++) {
              poly(
                ctx,
                [
                  [x + 7 + j * 10, y + 5],
                  [x + 10 + j * 10, y + 7],
                  [x + 10 + j * 10, y + 11],
                  [x + 7 + j * 10, y + 13],
                  [x + 4 + j * 10, y + 11],
                  [x + 4 + j * 10, y + 7],
                ],
                c,
              );
              rect(ctx, x + 6 + j * 10, y + 8, 2, 2, "#243b47");
            }
            break;
          case "breaker":
            for (let j = 0; j < 3; j++) {
              rect(ctx, x + 4 + j * 10, y + 5, 7, 9, "#acb9be");
              rect(ctx, x + 6 + j * 10, y + 7, 3, 5, "#1a2a34");
            }
            break;
          case "cable":
          case "pipe":
            for (let j = 0; j < 2; j++) {
              line(ctx, x + 3, y + 7 + j * 5, x + w - 3, y + 7 + j * 5, c, 2);
              rect(ctx, x + 5, y + 5 + j * 5, 3, 4, "#c2d5dd");
            }
            break;
          case "enclosure":
            rect(ctx, x + 4, y + 5, w - 8, 9, "#94a9b2");
            rect(ctx, x + w - 9, y + 7, 2, 5, "#283e4b");
            break;
          case "tray":
            for (let j = 0; j < 5; j++)
              rect(ctx, x + 4 + j * 6, y + 5, 2, 9, c);
            rect(ctx, x + 3, y + 11, w - 6, 2, c);
            break;
          case "label":
            rect(ctx, x + 6, y + 5, w - 12, 9, "#cfdfd5");
            for (let j = 0; j < 5; j++)
              rect(ctx, x + 8 + j * 3, y + 6, 1, 6, "#28434b");
            break;
        }
        if (p.steps[i]) {
          rect(ctx, x + 1, y + 15, w - 2, 3, orange);
          text(ctx, "✓", x + w / 2, y - 3, "#ffba7f", 10, "center");
        }
      }
      if (p.state === "idle") {
        text(
          ctx,
          def.name.toUpperCase(),
          p.x,
          p.y - 28,
          "#9cb2c0",
          8,
          "center",
        );
      }
    }
    player(ctx, p, time) {
      ctx.save();
      ctx.translate(Math.round(p.x), Math.round(p.y));
      if (p.invulnerable > 0 && !this.reduced)
        ctx.globalAlpha = 0.55 + Math.sin(time * 14) * 0.2;
      const stride = p.moving && !this.reduced ? Math.sin(p.walk) * 4 : 0;
      ctx.fillStyle = "#020c1480";
      ctx.beginPath();
      ctx.ellipse(0, 1, 18, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      rect(ctx, -10, -17, 8, 14 + stride, "#8b9fa9");
      rect(ctx, 3, -17, 8, 14 - stride, "#7b8e99");
      rect(ctx, -12, -4 + stride, 12, 5, "#152630");
      rect(ctx, 3, -4 - stride, 12, 5, "#152630");
      rect(ctx, -13, -34, 27, 20, orange);
      rect(ctx, -10, -33, 5, 17, "#ffd69e");
      rect(ctx, 6, -33, 5, 17, "#ffd69e");
      rect(ctx, -13, -22, 27, 3, "#f7e1b7");
      rect(ctx, -14, -31, 5, 16, "#526d7b");
      rect(ctx, 12, -31, 5, 16, "#526d7b");
      rect(ctx, -14, -18, 5, 5, "#dfbb99");
      rect(ctx, 12, -18, 5, 5, "#dfbb99");
      rect(ctx, -8, -46, 18, 13, "#e2bea2");
      rect(ctx, -6, -40, 16, 4, "#3b515d");
      rect(ctx, 1 + p.facing * 4, -40, 3, 3, "#bad8e4");
      rect(ctx, -10, -53, 23, 10, "#f6f0dd");
      rect(ctx, -14, -46, 32, 4, "#cfd4c8");
      rect(ctx, 0, -54, 4, 9, orange);
      if (p.climbing) {
        rect(ctx, -16, -40, 5, 7, "#dfbb99");
        rect(ctx, 13, -40, 5, 7, "#dfbb99");
      }
      if (p.invulnerable > 0) {
        ctx.strokeStyle = "#a2d7e34a";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(1, -24, 24, 32, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      text(ctx, "YOU", 1, -62, "#ffbc84", 8, "center");
      ctx.restore();
    }
    enemy(ctx, e, time, i) {
      if (e.respawn > 0) return;
      ctx.save();
      ctx.translate(Math.round(e.x), Math.round(e.y));
      const c =
        e.stun > 0
          ? "#8fceda"
          : e.kind === "delay"
            ? "#dfb570"
            : e.kind === "heat"
              ? "#e28e61"
              : "#cf8790";
      const bounce =
        this.reduced || e.stun > 0 ? 0 : Math.sin(time * 7 + i) * 2;
      ctx.translate(0, bounce);
      rect(ctx, -14, -5, 6, 5, "#788d96");
      rect(ctx, 8, -5, 6, 5, "#788d96");
      if (e.kind === "delay") {
        ctx.beginPath();
        ctx.arc(0, -21, 16, 0, Math.PI * 2);
        ctx.fillStyle = c;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -21, 11, 0, Math.PI * 2);
        ctx.fillStyle = "#263e49";
        ctx.fill();
        line(ctx, 0, -28, 0, -21, c, 2);
        line(ctx, 0, -21, 6, -17, c, 2);
        rect(ctx, -4, -41, 8, 5, c);
        rect(ctx, -9, -7, 18, 4, c);
      } else if (e.kind === "heat") {
        poly(
          ctx,
          [
            [-15, -7],
            [-17, -23],
            [-7, -32],
            [-4, -22],
            [2, -44],
            [10, -31],
            [16, -19],
            [12, -7],
          ],
          c,
        );
        rect(ctx, -7, -21, 4, 4, "#273a44");
        rect(ctx, 5, -21, 4, 4, "#273a44");
        rect(ctx, -4, -11, 10, 3, "#ffc896");
      } else {
        rect(ctx, -17, -30, 34, 22, c);
        rect(ctx, -12, -34, 24, 5, "#e6b2b9");
        rect(ctx, -13, -25, 26, 10, "#233944");
        rect(ctx, -9, -23, 5, 4, "#efc0c3");
        rect(ctx, 5, -23, 5, 4, "#efc0c3");
        line(ctx, -21, -26, -17, -20, c, 3);
        line(ctx, 17, -20, 22, -27, c, 3);
        rect(ctx, -4, -12, 8, 2, "#263e49");
      }
      if (e.stun > 0) {
        text(ctx, "✦  ✦", 0, -45, "#b4e7ee", 13, "center");
        text(ctx, "ON HOLD", 0, -57, "#9ac7d1", 7, "center");
      } else
        text(
          ctx,
          e.kind.toUpperCase(),
          0,
          e.kind === "heat" ? -50 : -46,
          c,
          7,
          "center",
        );
      ctx.restore();
    }
  }
  root.AccelevationRenderer = { Renderer, product };
})(globalThis);
