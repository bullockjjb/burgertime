/* Resolution-independent, original 2D art for the Accelevation crew and parts. */
(function (root) {
  "use strict";
  const INK = "#10232e",
    ORANGE = "#e87722",
    STEEL = "#b5c9d2",
    LIGHT = "#edf5f5";
  function path(ctx, points, fill, stroke, width = 1) {
    ctx.beginPath();
    points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = width;
      ctx.stroke();
    }
  }
  function round(ctx, x, y, w, h, r, fill, stroke, width = 1) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = width;
      ctx.stroke();
    }
  }
  function line(ctx, x1, y1, x2, y2, color, width = 1) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }
  function ellipse(ctx, x, y, rx, ry, fill, stroke) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
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
  function label(ctx, str, x, y, size, color = LIGHT, align = "center") {
    ctx.font = `600 ${size}px Barlow, Arial, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(str, x, y);
  }
  function metal(ctx, x, y, w, h) {
    const g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, "#e0eced");
    g.addColorStop(0.32, "#b3c9d2");
    g.addColorStop(0.58, "#7799ab");
    g.addColorStop(1, "#a4bdc8");
    round(ctx, x, y, w, h, 1, g, "#152e3b", 1);
  }
  function screw(ctx, x, y, r = 1.5) {
    ellipse(ctx, x, y, r, r, "#e6f0f3", "#4f6c7b");
    line(ctx, x - r * 0.5, y, x + r * 0.5, y, "#375765", 0.8);
  }
  function glass(ctx, x, y, w, h) {
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, "#9fd8e3");
    g.addColorStop(0.45, "#568699");
    g.addColorStop(1, "#30566b");
    round(ctx, x, y, w, h, 1, g, "#d6e9eb", 1);
    path(
      ctx,
      [
        [x + 2, y + 2],
        [x + w * 0.7, y + 2],
        [x + 2, y + h * 0.8],
      ],
      "#e2ffff22",
    );
    line(ctx, x + 4, y + h - 5, x + w - 5, y + 4, "#def8ff55", 1);
  }
  /** Match the bitmap to the actual displayed size, including Retina/zoom. */
  function prepareCanvas(canvas, w, h) {
    const ratio = Math.min(
      canvas.clientWidth / w || 1,
      canvas.clientHeight / h || 1,
    );
    const scale = Math.max(
      0.25,
      Math.min(4, ratio * (root.devicePixelRatio || 1)),
    );
    const pw = Math.max(1, Math.round(w * scale)),
      ph = Math.max(1, Math.round(h * scale));
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw;
      canvas.height = ph;
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(pw / w, 0, 0, ph / h, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    return ctx;
  }
  function builder(
    ctx,
    {
      x = 0,
      y = 0,
      scale = 1,
      character = "female",
      walk = 0,
      moving = false,
      climbing = false,
      facing = 1,
    } = {},
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * (facing < 0 ? -1 : 1), scale);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const female = character === "female",
      skin = female ? "#c7916c" : "#d9b08b",
      shade = female ? "#956348" : "#af8061",
      hair = female ? "#3c2924" : "#584037";
    const swing = moving ? Math.sin(walk) * 4.3 : 0,
      bob = moving ? Math.abs(Math.sin(walk)) * 0.7 : 0;
    ellipse(ctx, 0, 1, 20, 3.3, "#07151e88");
    // Articulated trousers, kneepads, and steel-toe boots.
    for (const side of [-1, 1]) {
      const sx = side * 7,
        step = swing * side;
      line(ctx, sx, -24, sx - step * 0.5, -12, "#10222d", 12);
      line(ctx, sx - step * 0.5, -12, sx + step, -3, "#10222d", 11);
      line(
        ctx,
        sx,
        -23,
        sx - step * 0.5,
        -12,
        side < 0 ? "#49616c" : "#5c7480",
        8,
      );
      line(ctx, sx - step * 0.5, -12, sx + step, -3, "#405762", 7);
      round(ctx, sx - step * 0.5 - 4, -15, 8, 6, 2, "#263f4c", "#708d99");
      round(ctx, sx + step - 5, -5, 14, 6, 2, "#243442", "#0b1b25", 1.4);
      line(ctx, sx + step - 4, 0, sx + step + 8, 0, "#91a0a4", 1.4);
    }
    ctx.translate(0, -bob);
    if (female) {
      ctx.beginPath();
      ctx.moveTo(-10, -58);
      ctx.bezierCurveTo(-22, -63, -22, -45, -15, -39);
      ctx.bezierCurveTo(-13, -42, -10, -47, -11, -55);
      ctx.fillStyle = hair;
      ctx.fill();
      round(ctx, -16, -55, 5, 3, 1, ORANGE);
    }
    // Far sleeve and glove.
    const arm = climbing ? -13 : swing;
    line(ctx, -12, -43, -18, -30 + arm, "#10232e", 9);
    line(ctx, -12, -43, -18, -30 + arm, "#536a73", 6);
    line(ctx, -18, -30 + arm, -14, -23 + arm, "#405965", 6);
    round(ctx, -17, -25 + arm, 7, 8, 2, "#c7d2c8", "#142c38");
    // High-visibility vest with reflective tape, seams, pockets, and radio.
    const vest = ctx.createLinearGradient(-12, -45, 14, -23);
    vest.addColorStop(0, "#ffa443");
    vest.addColorStop(0.5, ORANGE);
    vest.addColorStop(1, "#b85119");
    path(
      ctx,
      [
        [-8, -49],
        [8, -49],
        [15, -43],
        [13, -23],
        [-13, -23],
        [-15, -43],
      ],
      vest,
      INK,
      1.5,
    );
    path(
      ctx,
      [
        [-8, -48],
        [-3, -43],
        [0, -39],
        [3, -43],
        [8, -48],
      ],
      "#304b59",
    );
    line(ctx, -8, -45, -8, -27, "#f6f0ba", 3.2);
    line(ctx, 8, -45, 8, -27, "#f6f0ba", 3.2);
    line(ctx, -12, -30, 12, -30, "#e8f2d9", 3.2);
    line(ctx, 0, -38, 0, -24, "#633f2c", 1);
    round(ctx, 3, -40, 8, 7, 1, "#1c3542", "#ffb876");
    line(ctx, 5, -39, 5, -34, "#b8d7dc", 1);
    line(ctx, 5, -41, 5, -44, "#192d38", 1.5);
    round(ctx, -14, -25, 28, 5, 1, "#2c3b40", INK);
    round(ctx, -3, -25, 6, 5, 1, "#d3dcd9", INK);
    round(ctx, 10, -23, 8, 9, 2, "#b07535", "#132934");
    ellipse(ctx, 14, -19, 2.8, 2.8, "#f2b945", "#152e3b");
    line(ctx, -11, -22, -12, -14, "#c3d5d9", 2);
    round(ctx, -14, -16, 4, 5, 1, "#51697a", INK);
    // Near arm bends during walking and reaches above the shoulder on ladders.
    const near = climbing ? -16 : -swing;
    line(ctx, 13, -43, 19, -31 + near, INK, 10);
    line(ctx, 13, -43, 19, -31 + near, "#63808b", 7);
    line(ctx, 19, -31 + near, 15, -24 + near, "#496875", 7);
    round(ctx, 12, -27 + near, 8, 8, 2, "#dce2cf", INK);
    line(ctx, 14, -23 + near, 18, -23 + near, "#869687", 1);
    round(ctx, -4, -52, 9, 8, 2, shade, INK);
    // Face, safety glasses, and a small smile. Both choices wear the same PPE.
    round(ctx, -10, -66, 23, 19, 7, skin, INK, 1.2);
    ellipse(ctx, -10, -57, 2.4, 3.2, skin, INK);
    path(
      ctx,
      [
        [11, -58],
        [15, -55],
        [11, -54],
      ],
      skin,
      shade,
      0.7,
    );
    path(
      ctx,
      [
        [-9, -63],
        [-6, -66],
        [8, -66],
        [12, -62],
        [11, -60],
        [-9, -60],
      ],
      hair,
    );
    if (!female)
      path(
        ctx,
        [
          [-7, -54],
          [-4, -51],
          [6, -50],
          [11, -53],
          [10, -47],
          [4, -45],
          [-4, -47],
        ],
        hair,
      );
    round(ctx, -7, -59, 9, 5, 1.5, "#add4df", "#183746", 1);
    round(ctx, 4, -59, 9, 5, 1.5, "#badce4", "#183746", 1);
    line(ctx, 2, -57, 4, -57, "#183746", 1.5);
    line(ctx, -10, -58, -7, -57, "#183746", 1.4);
    ellipse(ctx, -1, -56.5, 0.9, 1.1, "#152b37");
    ellipse(ctx, 9, -56.5, 0.9, 1.1, "#152b37");
    line(ctx, 4, -51, 8, -51.5, "#693e32", 1);
    // Sculpted hard hat with Accelevation-inspired upward insignia.
    const helmet = ctx.createLinearGradient(0, -77, 0, -61);
    helmet.addColorStop(0, "#fffdf1");
    helmet.addColorStop(0.6, "#e8ecde");
    helmet.addColorStop(1, "#a9bfc1");
    ctx.beginPath();
    ctx.moveTo(-13, -63);
    ctx.quadraticCurveTo(-13, -76, 0, -77);
    ctx.quadraticCurveTo(14, -77, 15, -63);
    ctx.closePath();
    ctx.fillStyle = helmet;
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    round(ctx, -16, -65, 35, 4, 1.5, "#e6eee5", INK, 1.2);
    line(ctx, 0, -75, 0, -66, "#bfcac4", 2);
    path(
      ctx,
      [
        [6, -72],
        [2, -67],
        [6, -68],
        [10, -67],
      ],
      ORANGE,
    );
    line(ctx, -8, -72, -10, -68, "#ffffff", 1.3);
    ctx.restore();
  }
  function carrier(ctx, type, color, { family = "containment" } = {}) {
    // Components sit on one coherent carrier; five underside markers are drawn
    // separately by the renderer and have exactly the original gameplay width.
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    switch (type) {
      case "panel":
        metal(ctx, -83, -41, 166, 33);
        for (let i = 0; i < 3; i++) {
          glass(ctx, -78 + i * 54, -36, 48, 23);
          screw(ctx, -78 + i * 54, -10, 1);
        }
        break;
      case "door":
        metal(ctx, -78, -49, 156, 41);
        metal(ctx, -84, -52, 168, 5);
        glass(ctx, -71, -43, 68, 30);
        glass(ctx, 3, -43, 68, 30);
        metal(ctx, -2, -46, 4, 36);
        round(ctx, -11, -34, 3, 12, 1, ORANGE, INK);
        round(ctx, 8, -34, 3, 12, 1, ORANGE, INK);
        for (const x of [-59, 59]) {
          ellipse(ctx, x, -49, 3, 2, "#375667");
          screw(ctx, x, -49, 1.2);
        }
        break;
      case "roof":
        path(
          ctx,
          [
            [-85, -13],
            [-60, -45],
            [85, -45],
            [61, -13],
          ],
          "#c3e4e955",
          STEEL,
          3,
        );
        for (let i = 0; i < 5; i++)
          line(ctx, -85 + i * 36.5, -13, -60 + i * 36.5, -45, "#aecbd5", 2);
        line(ctx, -70, -30, 72, -30, "#7ba4b5", 2);
        path(
          ctx,
          [
            [-85, -13],
            [61, -13],
            [61, -8],
            [-85, -8],
          ],
          "#739baa",
          INK,
        );
        line(ctx, -85, -13, 61, -13, LIGHT, 2);
        break;
      case "frame":
        if (family === "containment") {
          for (let i = 0; i < 3; i++) {
            metal(ctx, -80 + i * 4, -21 - i * 8, 123, 6);
            for (const x of [-76, 36])
              line(
                ctx,
                x + i * 4,
                -20 - i * 8,
                x + i * 4,
                -16 - i * 8,
                "#446878",
                1,
              );
          }
          for (let i = 0; i < 3; i++) {
            ellipse(
              ctx,
              65,
              -25,
              17 - i * 4,
              17 - i * 4,
              i === 0 ? "#273f48" : null,
              "#adc7c3",
            );
          }
          round(ctx, 51, -12, 25, 4, 1, "#425d5f");
        } else {
          metal(ctx, -80, -44, 160, 7);
          metal(ctx, -80, -15, 160, 7);
          for (const x of [-80, -3, 73]) metal(ctx, x, -42, 7, 29);
          for (const x of [-74, 2])
            line(ctx, x, -16, x + 65, -37, "#527788", 4);
          for (const x of [-76, 77]) {
            screw(ctx, x, -40);
            screw(ctx, x, -11);
          }
        }
        break;
      case "beam":
        metal(ctx, -85, -42, 170, 7);
        metal(ctx, -81, -34, 162, 19);
        metal(ctx, -85, -15, 170, 7);
        line(ctx, -80, -32, 79, -32, "#648b9c", 1);
        path(
          ctx,
          [
            [77, -41],
            [84, -41],
            [84, -35],
            [81, -35],
            [81, -15],
            [84, -15],
            [84, -9],
            [77, -9],
          ],
          "#dce9ed",
          INK,
        );
        round(ctx, -70, -30, 29, 9, 1, "#df8a43");
        label(ctx, "STEEL", -55, -23, 6, INK);
        break;
      case "post":
        for (const x of [-63, -9, 45]) {
          metal(ctx, x - 13, -14, 35, 6);
          metal(ctx, x, -48, 10, 34);
          metal(ctx, x + 4, -48, 6, 32);
          screw(ctx, x - 8, -11);
          screw(ctx, x + 16, -11);
          round(ctx, x + 1, -43, 7, 7, 0, "#294c60", "#e5eef0");
        }
        break;
      case "arm":
        for (const x of [-73, -16, 41]) {
          metal(ctx, x, -46, 8, 36);
          metal(ctx, x, -19, 46, 8);
          line(ctx, x + 7, -40, x + 37, -20, "#bed1d7", 4);
          for (const y of [-40, -28])
            ellipse(ctx, x + 4, y, 1.5, 1.5, "#355669");
        }
        break;
      case "bolt":
        round(ctx, -83, -41, 166, 34, 3, "#45616d", "#9fb7c0");
        round(ctx, -79, -37, 158, 26, 2, "#233d49");
        for (let i = 0; i < 4; i++) {
          const x = -63 + i * 25;
          ellipse(ctx, x, -20, 7, 3, "#bdd2da", "#718d9c");
          line(ctx, x, -20, x, -31, "#a6c2cc", 5);
          for (let j = 0; j < 3; j++)
            line(ctx, x - 2, -22 - j * 3, x + 2, -24 - j * 3, "#405f71", 1);
          path(
            ctx,
            [
              [x - 5, -35],
              [x, -38],
              [x + 5, -35],
              [x + 5, -30],
              [x, -27],
              [x - 5, -30],
            ],
            "#d7e4e9",
            "#4d6d7c",
          );
        }
        path(
          ctx,
          [
            [43, -34],
            [52, -34],
            [52, -18],
            [72, -18],
            [72, -12],
            [43, -12],
          ],
          "#b6cdd7",
          "#628899",
        );
        screw(ctx, 47, -27);
        screw(ctx, 64, -15);
        break;
      case "enclosure":
        round(ctx, -41, -53, 68, 45, 2, "#b1c6ce", INK, 1.5);
        path(
          ctx,
          [
            [27, -53],
            [39, -47],
            [39, -8],
            [27, -8],
          ],
          "#627f8f",
          INK,
        );
        round(ctx, -35, -47, 55, 34, 1, "#23404f", "#e7eff0");
        round(ctx, -29, -42, 39, 20, 1, "#436576");
        for (let i = 0; i < 4; i++)
          line(ctx, -24, -38 + i * 4, 5, -38 + i * 4, "#87a7b7", 1);
        path(
          ctx,
          [
            [-41, -51],
            [-64, -43],
            [-64, -9],
            [-41, -11],
          ],
          "#8eafb9",
          "#dcebee",
        );
        line(ctx, -59, -35, -59, -26, "#223f4c", 2);
        round(ctx, -17, -21, 20, 5, 0, ORANGE);
        label(ctx, "RPP", -7, -17, 4.5, INK);
        break;
      case "breaker":
        metal(ctx, -82, -44, 164, 36);
        round(ctx, -76, -39, 152, 25, 1, "#d3dfe0", "#637f8a");
        for (let i = 0; i < 8; i++) {
          round(ctx, -70 + i * 18, -36, 14, 19, 1, "#1d3543", "#466877");
          round(ctx, -67 + i * 18, -32, 8, 9, 1, "#849ea9");
          round(
            ctx,
            -66 + i * 18,
            -31,
            6,
            4,
            1,
            i % 3 === 0 ? ORANGE : "#dbe4df",
          );
        }
        break;
      case "cable":
        for (let i = 0; i < 3; i++) {
          const y = -36 + i * 9;
          ctx.beginPath();
          ctx.moveTo(-70, y);
          ctx.bezierCurveTo(-29, y - 19, 24, y + 18, 63, y - 1);
          ctx.strokeStyle = INK;
          ctx.lineWidth = 7;
          ctx.stroke();
          ctx.strokeStyle = i === 1 ? "#7299b0" : "#b9c7ce";
          ctx.lineWidth = 4;
          ctx.stroke();
          round(ctx, -82, y - 6, 14, 12, 2, "#d2dfe0", INK);
          round(ctx, 62, y - 6, 18, 12, 2, i === 1 ? ORANGE : "#586f7a", INK);
          for (let j = 0; j < 3; j++)
            line(ctx, 80, y - 3 + j * 3, 84, y - 3 + j * 3, "#e4c782", 1.5);
        }
        break;
      case "tray":
        path(
          ctx,
          [
            [-83, -11],
            [-62, -39],
            [84, -39],
            [63, -11],
          ],
          "#284858",
          "#abc6d0",
          2,
        );
        for (let i = 0; i < 12; i++)
          line(ctx, -77 + i * 12, -13, -58 + i * 12, -37, "#a3c0ce", 3);
        metal(ctx, -84, -13, 151, 5);
        line(ctx, -62, -42, 86, -42, "#d6e7eb", 3);
        break;
      case "pipe":
        for (let i = 0; i < 2; i++) {
          const y = -39 + i * 20;
          line(ctx, -81, y, 82, y, INK, 10);
          line(ctx, -81, y, 82, y, "#d3e5e5", 7);
          line(ctx, -80, y - 2, 81, y - 2, "#f1faf6", 1.3);
          for (const x of [-60, -13, 35, 68]) {
            round(ctx, x - 3, y - 6, 6, 12, 1, "#688e9b", "#bed8df");
            line(ctx, x, y, x, y + (i ? 9 : -9), "#b5d1d9", 4);
            ellipse(
              ctx,
              x,
              y + (i ? 8 : -8),
              5,
              2.2,
              i ? "#7cbacc" : ORANGE,
              INK,
            );
          }
          label(ctx, i ? "RETURN" : "SUPPLY", -36, y + 2, 5, INK);
        }
        break;
      case "label":
        for (let i = 0; i < 3; i++) {
          const x = -74 + i * 52;
          round(ctx, x, -43 + i * 2, 45, 31, 2, "#e1e9df", "#6e939e");
          round(
            ctx,
            x + 3,
            -40 + i * 2,
            39,
            7,
            0,
            i === 1 ? "#80b9bb" : ORANGE,
          );
          label(ctx, "ID / REV A", x + 22, -35 + i * 2, 4.8, INK);
          for (let j = 0; j < 11; j++)
            round(
              ctx,
              x + 5 + j * 3,
              -28 + i * 2,
              j % 3 ? 1 : 2,
              10,
              0,
              "#253c44",
            );
          screw(ctx, x + 4, -15 + i * 2, 1.2);
        }
        break;
    }
    // Transport rail ties the physical silhouette to its walkable width.
    round(ctx, -90, -7, 180, 6, 2, "#527582", INK, 1);
    line(ctx, -87, -6, 87, -6, "#c0d4d9", 1);
    round(ctx, -87, -4, 174, 3, 1, "#213e4b");
    ctx.restore();
  }
  function setback(ctx, e, time, reduced = false) {
    if (e.respawn > 0) return;
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.lineCap = "round";
    const c =
      e.stun > 0
        ? "#99d9e2"
        : e.kind === "delay"
          ? "#e5bd78"
          : e.kind === "heat"
            ? "#ed9867"
            : "#d898a0";
    ellipse(ctx, 0, 1, 20, 3, "#07151e77");
    if (e.kind === "rework") {
      for (const x of [-12, 12]) {
        ellipse(ctx, x, -3, 5, 5, "#223a47", "#829ba6");
        ellipse(ctx, x, -3, 2, 2, "#c3d2d4");
      }
      round(ctx, -20, -33, 40, 27, 6, c, INK, 2);
      round(ctx, -15, -29, 30, 14, 4, "#233e4c", "#f2c8c8");
      for (const x of [-8, 8])
        round(ctx, x - 3, -25, 6, 5, 2, e.stun > 0 ? "#b7e6ed" : "#ffdbc1");
      round(ctx, -9, -12, 18, 3, 1, "#6f5d66");
      line(ctx, 0, -34, 0, -40, "#7e929d", 2);
      ellipse(ctx, 0, -42, 3, 3, ORANGE, INK);
      line(ctx, -20, -22, -27, -15, c, 4);
      line(ctx, 20, -22, 27, -15, c, 4);
      path(
        ctx,
        [
          [-31, -16],
          [-25, -16],
          [-28, -9],
        ],
        STEEL,
        INK,
      );
      path(
        ctx,
        [
          [24, -16],
          [30, -16],
          [27, -9],
        ],
        STEEL,
        INK,
      );
    } else if (e.kind === "delay") {
      round(ctx, -8, -45, 16, 5, 2, "#aabfc6", INK);
      line(ctx, 0, -41, 0, -37, STEEL, 4);
      ellipse(ctx, 0, -21, 19, 19, c, INK);
      ellipse(ctx, 0, -21, 14, 14, "#243f4e", "#f4d7a8");
      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI) / 6;
        line(
          ctx,
          Math.sin(a) * 11,
          -21 + Math.cos(a) * 11,
          Math.sin(a) * 12.5,
          -21 + Math.cos(a) * 12.5,
          "#c3d4d9",
          1,
        );
      }
      line(ctx, 0, -21, 0, -31, LIGHT, 2);
      line(ctx, 0, -21, 8, -18, ORANGE, 2);
      ellipse(ctx, 0, -21, 2, 2, "#e5efe9");
      round(ctx, -14, -4, 10, 5, 2, "#718793", INK);
      round(ctx, 4, -4, 10, 5, 2, "#718793", INK);
    } else {
      const drift = reduced ? 0 : Math.sin(time * 6) * 2;
      ctx.beginPath();
      ctx.moveTo(-16, -5);
      ctx.bezierCurveTo(-30, -22, -6, -35, -8, -46);
      ctx.bezierCurveTo(3, -41, 8, -31, 6, -26);
      ctx.bezierCurveTo(14, -31, 11, -37, 14, -41 + drift);
      ctx.bezierCurveTo(37, -19, 20, 1, -16, -5);
      const fire = ctx.createLinearGradient(0, -44, 0, 0);
      fire.addColorStop(0, "#ffd199");
      fire.addColorStop(1, e.stun > 0 ? "#75b4c6" : "#d66535");
      ctx.fillStyle = fire;
      ctx.fill();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 2;
      ctx.stroke();
      ellipse(ctx, 0, -11, 9, 8, "#f2c887");
      for (const x of [-7, 8]) round(ctx, x - 2, -22, 4, 4, 1, "#513e37");
      line(ctx, -3, -13, 5, -13, "#875335", 1.5);
    }
    label(ctx, e.stun > 0 ? "ON HOLD" : e.kind.toUpperCase(), 0, -53, 8, c);
    if (e.stun > 0) {
      label(ctx, "✦", -23, -35, 11, "#c1eef3");
      label(ctx, "✦", 24, -34, 11, "#c1eef3");
    }
    ctx.restore();
  }
  root.AccelevationArt = {
    prepareCanvas,
    builder,
    carrier,
    setback,
    round,
    label,
  };
})(globalThis);
