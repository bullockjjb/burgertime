(function () {
  "use strict";
  const $ = (id) => document.getElementById(id),
    catalog = AccelevationCatalog;
  const input = {},
    keys = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down",
      a: "left",
      d: "right",
      w: "up",
      s: "down",
    };
  const storage = {
    get(key, fallback) {
      try {
        return (
          JSON.parse(localStorage.getItem(`accelevation-time:${key}`)) ??
          fallback
        );
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(`accelevation-time:${key}`, JSON.stringify(value));
      } catch {
        /* Private browsers can still play. */
      }
    },
  };
  let selectedMode = "guided",
    soundOn = storage.get("sound", false),
    audioContext,
    lastSound = 0,
    toastUntil = 0,
    lastHud = "",
    dialogWasPlaying = false;
  const renderer = new AccelevationRenderer.Renderer(
    $("board"),
    $("product-preview"),
    catalog,
  );
  renderer.reduced = storage.get(
    "reduced",
    matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  let game;
  game = new AccelevationEngine.Game(catalog, (event) => {
    if (game) onGameEvent(event);
  });
  const formatTime = (t) =>
    `${Math.floor(t / 60)
      .toString()
      .padStart(2, "0")}:${Math.floor(t % 60)
      .toString()
      .padStart(2, "0")}`;
  const formatScore = (n) => Math.max(0, n).toString().padStart(6, "0");
  const escapeHTML = (s) =>
    s.replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const startMarkup = $("overlay-card").innerHTML;
  function clearInput() {
    for (const key of Object.keys(input)) delete input[key];
  }
  function tone(kind) {
    if (!soundOn) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === "suspended")
        audioContext.resume().catch(() => {});
      const now = audioContext.currentTime;
      if (kind === "step" && now - lastSound < 0.06) return;
      lastSound = now;
      const notes = {
        step: [350, 0.035],
        drop: [170, 0.13],
        installed: [660, 0.16],
        pulse: [420, 0.28],
        hit: [100, 0.22],
        win: [880, 0.3],
        quiz: [740, 0.18],
      };
      const [frequency, duration] = notes[kind] || notes.drop;
      const osc = audioContext.createOscillator(),
        gain = audioContext.createGain();
      osc.type = kind === "hit" ? "sawtooth" : "triangle";
      osc.frequency.setValueAtTime(frequency, now);
      osc.frequency.exponentialRampToValueAtTime(
        kind === "drop" ? 70 : frequency * 1.4,
        now + duration,
      );
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.055, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      soundOn = false;
      updateSoundButton();
    }
  }
  function updateSoundButton() {
    const b = $("sound-button");
    b.setAttribute("aria-pressed", String(soundOn));
    b.setAttribute("aria-label", `Turn sound ${soundOn ? "off" : "on"}`);
  }
  function toast(message, duration = 3200) {
    $("board-toast").textContent = message;
    $("board-toast").classList.add("visible");
    toastUntil = performance.now() + duration;
  }
  function announce(message) {
    $("live-status").textContent = message;
  }
  function saveBest() {
    const key = `best-${game.mode}`;
    if (game.score > storage.get(key, 0)) storage.set(key, game.score);
  }
  function updateMission() {
    const f = catalog[game.level];
    $("level-number").textContent = String(game.level + 1).padStart(2, "0");
    $("project-badge").textContent = String(game.level + 1).padStart(2, "0");
    $("mission-title").textContent = f.name;
    $("mission-description").textContent = f.description;
    $("customer-value").textContent = f.value;
    $("product-caption").textContent = f.caption;
    $("board-name").textContent = `${f.short.toUpperCase()} / ASSEMBLY FLOOR`;
    $("component-list").innerHTML = f.parts
      .map(
        (p, i) =>
          `<li id="part-${i}"><span class="part-swatch" style="--part-color:${p.color}"></span><span>${p.name}</span><span class="part-count">0 / 3</span></li>`,
      )
      .join("");
    $("project-track").innerHTML = catalog
      .map(
        (c, i) =>
          `<div class="track-item ${i < game.level ? "complete" : i === game.level ? "active" : ""}" ${i === game.level ? 'aria-current="step"' : ""}><span class="track-num">${i < game.level ? "✓" : String(i + 1).padStart(2, "0")}</span><span class="track-text">${c.short}<small>${["Manage airflow", "Support the systems", "Connect the power", "Bring it together"][i]}</small></span></div>`,
      )
      .join("");
    renderer.drawProductPreview(game.level);
    lastHud = "";
    updateHud();
  }
  function updateHud() {
    const signature = [
      game.score,
      Math.floor(game.elapsed),
      game.installed,
      game.lives,
      game.mode,
      Math.ceil(game.pulseCooldown),
      game.status,
    ].join("|");
    if (signature === lastHud) return;
    lastHud = signature;
    $("score").textContent = formatScore(game.score);
    $("timer").textContent = formatTime(game.elapsed);
    $("best").textContent = formatScore(
      Math.max(storage.get(`best-${game.mode}`, 0), game.score),
    );
    $("health-label").textContent =
      game.mode === "guided" ? "GUIDED MODE" : "LIVES";
    $("health").innerHTML =
      game.mode === "guided"
        ? "∞ <small>TRIES</small>"
        : `${"●".repeat(game.lives)}<small>${"○".repeat(3 - game.lives)}</small>`;
    $("health").setAttribute(
      "aria-label",
      game.mode === "guided"
        ? "Unlimited tries"
        : `${game.lives} lives remaining`,
    );
    $("progress-count").textContent = `${game.installed} / 12`;
    $("progress-fill").style.width = `${(game.installed / 12) * 100}%`;
    $("build-progress").setAttribute("aria-valuenow", game.installed);
    catalog[game.level].parts.forEach((_, i) => {
      const count = game.parts.filter(
        (p) => p.kind === i && p.state === "installed",
      ).length;
      const li = $(`part-${i}`);
      if (li) {
        li.classList.toggle("complete", count === 3);
        li.querySelector(".part-count").textContent = `${count} / 3`;
      }
    });
    const cooling = game.pulseCooldown > 0;
    $("pulse-ready").textContent = cooling
      ? `${Math.ceil(game.pulseCooldown)}s`
      : "READY";
    $("pulse-title").textContent = cooling
      ? "Pulse recharging"
      : "Quality pulse";
    $("pulse-caption").textContent = cooling
      ? "Keep moving. It will be ready soon."
      : "Space to stop nearby setbacks";
    $("pulse-button").disabled = game.status !== "playing" || cooling;
    $("pause-button").disabled = !["playing", "paused"].includes(game.status);
    $("pause-button").setAttribute(
      "aria-label",
      game.status === "paused" ? "Resume game" : "Pause game",
    );
    $("pause-button").textContent = game.status === "paused" ? "▷" : "Ⅱ";
  }
  function showOverlay(html, cls = "start-card result-card") {
    $("overlay-card").className = cls;
    $("overlay-card").innerHTML = html;
    $("game-overlay").hidden = false;
    clearInput();
    updateHud();
    const b = $("overlay-card").querySelector("button:not(:disabled)");
    if (b) b.focus({ preventScroll: true });
  }
  function hideOverlay() {
    $("game-overlay").hidden = true;
    clearInput();
    $("board").focus({ preventScroll: true });
  }
  function onGameEvent(e) {
    if (["step", "drop", "installed", "pulse", "hit", "quiz"].includes(e.type))
      tone(e.type);
    if (e.type === "level") updateMission();
    if (e.type === "installed") {
      saveBest();
      announce(
        `${catalog[game.level].parts[e.part.kind].name} installed. ${game.installed} of 12 components.`,
      );
    }
    if (e.type === "pulse")
      toast(
        e.count
          ? `${e.count} setback${e.count === 1 ? "" : "s"} on hold. Keep building!`
          : "Pulse sent. Get closer to a setback to put it on hold.",
        2200,
      );
    if (e.type === "hit")
      toast(
        game.mode === "guided"
          ? "A setback! −150 points. Your build is safe."
          : "Setback! −1 life. Your build is safe.",
        2600,
      );
    if (e.type === "level-complete") {
      saveBest();
      tone("win");
      showLevelComplete();
    }
    if (e.type === "game-over") {
      saveBest();
      showGameOver();
    }
    if (e.type === "won") {
      saveBest();
      tone("win");
      showWon();
    }
  }
  function start() {
    hideOverlay();
    game.start(selectedMode);
    updateMission();
    tone("quiz");
    toast(
      "Cross all 5 sections of each component. Then climb down and repeat.",
      5500,
    );
  }
  function bindStart() {
    document.querySelectorAll("[data-mode]").forEach((b) =>
      b.addEventListener("click", () => {
        selectedMode = b.dataset.mode;
        game.mode = selectedMode;
        document.querySelectorAll("[data-mode]").forEach((o) => {
          o.classList.toggle("selected", o === b);
          o.setAttribute("aria-pressed", String(o === b));
        });
        lastHud = "";
        updateHud();
      }),
    );
    $("start-button").addEventListener("click", start);
  }
  function returnToStart() {
    game.installLevel(0);
    game.status = "ready";
    game.score = 0;
    game.elapsed = 0;
    game.mode = selectedMode;
    showOverlay(startMarkup, "start-card");
    bindStart();
    document.querySelector(`[data-mode="${selectedMode}"]`).click();
    updateMission();
  }
  function pause() {
    if (game.status === "playing") {
      game.pause();
      clearInput();
      showPause();
    } else if (game.status === "paused" && !$("info-dialog").open) {
      game.resume();
      hideOverlay();
      updateHud();
    }
  }
  function showPause() {
    showOverlay(
      `<span class="tag">TAKE A BREATHER</span><h2>Build on <em>hold.</em></h2><p>Your project is right where you left it.</p><div class="result-stats"><div><strong>${formatScore(game.score)}</strong><span>POINTS</span></div><div><strong>${game.installed} / 12</strong><span>INSTALLED</span></div></div><div class="result-actions"><button class="primary-button" id="resume-button">Resume shift ↗</button><button class="secondary-button" id="restart-button">Restart</button></div>`,
    );
    $("resume-button").onclick = pause;
    $("restart-button").onclick = confirmRestart;
  }
  function confirmRestart() {
    showOverlay(
      `<span class="tag">FRESH START</span><h2>Restart this <em>shift?</em></h2><p>This run’s progress will reset. Your personal best stays saved on this browser.</p><div class="result-actions"><button class="primary-button" id="keep-button">Keep building</button><button class="secondary-button" id="confirm-restart">Restart shift</button></div>`,
    );
    $("keep-button").onclick = () => {
      game.resume();
      hideOverlay();
    };
    $("confirm-restart").onclick = returnToStart;
  }
  function showLevelComplete() {
    const f = catalog[game.level];
    announce(`${f.name} complete. All three bays assembled.`);
    showOverlay(
      `<span class="tag">PROJECT ${String(game.level + 1).padStart(2, "0")} COMPLETE · +1,000 POINTS</span><h2>${f.short} <em>delivered.</em></h2><p>${f.takeaway}</p><p class="quiz-question">${f.quiz.question}</p><div class="quiz-options" role="group" aria-label="Product knowledge question">${f.quiz.options.map((o, i) => `<button data-answer="${i}">${o}</button>`).join("")}</div><p class="quiz-feedback" id="quiz-feedback" aria-live="polite">Quick knowledge check · +500 bonus points</p><div class="result-actions"><button class="primary-button" id="next-button" disabled>${game.level === 3 ? "Complete the shift" : "Next project"} ↗</button><button class="secondary-button" id="skip-quiz">Skip question</button></div>`,
    );
    document.querySelectorAll("[data-answer]").forEach(
      (b) =>
        (b.onclick = () => {
          if (Number(b.dataset.answer) === f.quiz.answer) {
            b.classList.add("correct");
            game.quizBonus();
            saveBest();
            $("quiz-feedback").textContent = f.quiz.explanation;
            document
              .querySelectorAll("[data-answer]")
              .forEach((o) => (o.disabled = true));
            $("next-button").disabled = false;
            $("skip-quiz").hidden = true;
            updateHud();
            $("next-button").focus({ preventScroll: true });
          } else {
            b.classList.add("incorrect");
            $("quiz-feedback").textContent =
              "Give it another try. Think about the customer value of this system.";
          }
        }),
    );
    const next = () => {
      hideOverlay();
      game.nextLevel();
      if (game.status === "playing") {
        updateMission();
        toast(
          `${catalog[game.level].name}: cross the layers and build all three bays.`,
          4500,
        );
      }
    };
    $("next-button").onclick = next;
    $("skip-quiz").onclick = next;
  }
  function showGameOver() {
    announce("Shift ended. Try another build.");
    showOverlay(
      `<span class="tag">SHIFT ENDED</span><h2>A setback. <em>A new start.</em></h2><p>You reached project ${game.level + 1} of 4. Try another run, or switch to Guided for unlimited tries.</p><div class="result-stats"><div><strong>${formatScore(game.score)}</strong><span>POINTS</span></div><div><strong>${formatTime(game.elapsed)}</strong><span>SHIFT TIME</span></div></div><div class="result-actions"><button class="primary-button" id="retry-button">Try again ↗</button><button class="secondary-button" id="guided-button">Play guided</button></div>`,
    );
    $("retry-button").onclick = start;
    $("guided-button").onclick = () => {
      selectedMode = "guided";
      start();
    };
  }
  function showWon() {
    document.querySelectorAll(".track-item").forEach((el) => {
      el.classList.remove("active");
      el.classList.add("complete");
      el.removeAttribute("aria-current");
      el.querySelector(".track-num").textContent = "✓";
    });
    announce(
      `Shift complete. Four product families delivered. Score ${game.score}.`,
    );
    showOverlay(
      `<span class="tag">DESIGNED. MANUFACTURED. INSTALLED.</span><h2>One complete <em>solution.</em></h2><p>You brought every family together. That’s the Accelevation advantage: coordinated infrastructure, from first design to customer handoff.</p><div class="completion-families">${catalog.map((f) => `<span>✓ ${f.short}</span>`).join("")}</div><div class="result-stats"><div><strong>${formatScore(game.score)}</strong><span>${game.mode.toUpperCase()} SCORE</span></div><div><strong>${formatTime(game.elapsed)}</strong><span>SHIFT TIME</span></div></div><div class="result-actions"><button class="primary-button" id="again-button">Build again ↗</button><button class="secondary-button" id="final-guide">Explore the products</button></div>`,
    );
    $("again-button").onclick = returnToStart;
    $("final-guide").onclick = () => openGuide(0);
  }
  function openDialog(eyebrow, html) {
    if (!$("info-dialog").open) {
      dialogWasPlaying = game.status === "playing";
      if (dialogWasPlaying) {
        game.pause();
        showPause();
      }
    }
    clearInput();
    $("dialog-eyebrow").textContent = eyebrow;
    $("dialog-content").innerHTML = html;
    if (!$("info-dialog").open) $("info-dialog").showModal();
    $("close-dialog").focus({ preventScroll: true });
  }
  function closeDialog() {
    $("info-dialog").close();
  }
  $("info-dialog").addEventListener("close", () => {
    if (dialogWasPlaying && game.status === "paused") {
      game.resume();
      hideOverlay();
    }
    dialogWasPlaying = false;
    updateHud();
  });
  $("close-dialog").onclick = closeDialog;
  function openGuide(index = game.level) {
    const f = catalog[index];
    openDialog(
      "THE PRODUCT FIELD GUIDE",
      `<h2 id="dialog-title">Know what you’re building.</h2><div class="guide-tabs" role="tablist" aria-label="Product families">${catalog.map((c, i) => `<button role="tab" id="guide-tab-${i}" aria-selected="${index === i}" aria-controls="guide-panel" tabindex="${index === i ? 0 : -1}" data-guide="${i}">${c.short}</button>`).join("")}</div><section id="guide-panel" role="tabpanel" aria-labelledby="guide-tab-${index}"><canvas class="guide-illustration" id="guide-art" width="280" height="170" role="img" aria-label="${f.name} illustration"></canvas><span class="eyebrow">${f.label}</span><h3>${f.name}</h3><p>${f.takeaway}</p><h3>What goes into it</h3><ul class="guide-parts">${f.parts.map((p) => `<li><strong>${p.name}</strong> — ${p.detail}</li>`).join("")}</ul><div class="guide-callout"><h3>Take it to the conversation</h3><p>“${f.sales}”</p></div><p class="dialog-note">${f.proof}</p><a class="source-link" href="${f.source}" target="_blank" rel="noopener noreferrer">Explore ${f.sourceTitle} ↗</a></section>`,
    );
    AccelevationRenderer.product(
      $("guide-art").getContext("2d"),
      f.id,
      138,
      126,
      1.1,
      4,
    );
    document.querySelectorAll("[data-guide]").forEach((b) => {
      b.onclick = () => {
        openGuide(Number(b.dataset.guide));
        $(`guide-tab-${b.dataset.guide}`).focus();
      };
      b.onkeydown = (e) => {
        if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
          e.preventDefault();
          const next =
            e.key === "Home"
              ? 0
              : e.key === "End"
                ? 3
                : (index + (e.key === "ArrowRight" ? 1 : 3)) % 4;
          openGuide(next);
          $(`guide-tab-${next}`).focus();
        }
      };
    });
  }
  function openHelp() {
    openDialog(
      "YOUR FIRST SHIFT",
      `<h2 id="dialog-title">Small moves. Big builds.</h2><div class="steps"><div><span class="step-number">1</span><div><strong>Walk every section.</strong><p>Use the arrow keys or W A S D. Cross all five sections of a component to turn its underside orange and drop it to the next floor.</p></div></div><div><span class="step-number">2</span><div><strong>Climb down. Keep the chain going.</strong><p>Line up with a ladder, then press up or down. A falling component drops the one below it. Sweep each floor to deliver all four layers into each bay.</p></div></div><div><span class="step-number">3</span><div><strong>Keep setbacks out of your way.</strong><p>Rework bots, delays, and heat chase you. Space sends a quality pulse that holds nearby setbacks for four seconds. Falling components clear them, too.</p></div></div><div><span class="step-number">4</span><div><strong>Take the know-how with you.</strong><p>Finish three bays, learn the customer value, and move to the next product. Answer a quick question for a bonus, or skip it and keep playing.</p></div></div></div><p><strong>Guided:</strong> slower setbacks, unlimited tries, six-second pulse recharge.<br><strong>Arcade:</strong> three lives, quicker setbacks, nine-second recharge. Completing a project restores one life.</p><label class="option-row"><input type="checkbox" id="reduce-motion" ${renderer.reduced ? "checked" : ""}> Reduce decorative motion and flashing</label><p class="dialog-note">P or Escape pauses. Touch controls appear on touch devices. Switching tabs pauses the shift automatically. Scores stay on this browser, separately for Guided and Arcade.</p>`,
    );
    $("reduce-motion").onchange = (e) => {
      renderer.reduced = e.target.checked;
      storage.set("reduced", renderer.reduced);
    };
  }
  function openAbout() {
    openDialog(
      "ABOUT THE ARCADE",
      `<h2 id="dialog-title">Built around Accelevation.</h2><p>A short product-learning game for the team. Four simplified assembly projects introduce containment, structure, power distribution, and modular integration.</p><p>Product teaching content is based on Accelevation’s public product information and supplied brand references. The illustrations, component quantities, timing, setbacks, and scores are game abstractions. They are not engineering specifications or installation instructions.</p><p>No account, tracking, or production-system connection. Only sound preferences, motion preferences, and personal bests are saved locally.</p><h3>Credits</h3><p>This repository began with the BurgerTime C++/SFML clone by Lorién López Villellas, Adrián Samatán Alastuey, and Isaac Valdivia López. Their desktop source remains in the repository. This browser edition uses original vector art and synthesized sounds.</p><p>Code: GPL v3 or later. Barlow: SIL Open Font License. Accelevation names and supplied logos belong to their respective owner.</p><a class="source-link" href="https://github.com/bullockjjb/burgertime" target="_blank" rel="noopener noreferrer">Source, credits & offline download ↗</a>`,
    );
  }
  $("guide-button").onclick = () => openGuide();
  $("help-button").onclick = openHelp;
  $("about-button").onclick = openAbout;
  $("pause-button").onclick = pause;
  $("pulse-button").onclick = () => {
    game.pulse();
    $("board").focus({ preventScroll: true });
  };
  $("sound-button").onclick = () => {
    soundOn = !soundOn;
    storage.set("sound", soundOn);
    updateSoundButton();
    if (soundOn) tone("quiz");
  };
  $("fullscreen-button").onclick = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if ($("game").requestFullscreen) await $("game").requestFullscreen();
      else toast("Fullscreen is unavailable in this browser.");
    } catch {
      toast("Fullscreen is unavailable in this browser.");
    }
  };
  document.addEventListener("fullscreenchange", () => {
    $("fullscreen-button").setAttribute(
      "aria-label",
      document.fullscreenElement ? "Exit fullscreen" : "Enter fullscreen",
    );
  });
  window.addEventListener("keydown", (e) => {
    if ($("info-dialog").open) return;
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (
      ["p", "Escape"].includes(key) &&
      ["playing", "paused"].includes(game.status)
    ) {
      e.preventDefault();
      if (!e.repeat) pause();
      return;
    }
    if (game.status !== "playing") return;
    // Preserve native keyboard activation for controls outside the canvas.
    if (
      e.target instanceof HTMLElement &&
      e.target.closest("button,a,input,select,textarea")
    )
      return;
    if (keys[key]) {
      e.preventDefault();
      input[keys[key]] = true;
    }
    if (e.code === "Space") {
      e.preventDefault();
      if (!e.repeat) game.pulse();
    }
  });
  window.addEventListener("keyup", (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (keys[key]) delete input[keys[key]];
  });
  function autoPause() {
    clearInput();
    if (game.status === "playing") {
      game.pause();
      showPause();
    }
  }
  window.addEventListener("blur", autoPause);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) autoPause();
  });
  const touchPointers = new Map();
  document.querySelectorAll("[data-control]").forEach((b) => {
    b.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (game.status !== "playing") return;
      b.setPointerCapture(e.pointerId);
      const c = b.dataset.control;
      touchPointers.set(e.pointerId, c);
      if (c === "pulse") game.pulse();
      else input[c] = true;
    });
    const release = (e) => {
      const c = touchPointers.get(e.pointerId);
      touchPointers.delete(e.pointerId);
      if (c && ![...touchPointers.values()].includes(c)) delete input[c];
    };
    b.addEventListener("pointerup", release);
    b.addEventListener("pointercancel", release);
    b.addEventListener("lostpointercapture", release);
  });
  $("board").addEventListener("pointerdown", () => {
    if (game.status === "playing") $("board").focus({ preventScroll: true });
  });
  // Read-only state is useful for QA and assistive integrations; it cannot mutate a run.
  Object.defineProperty(window, "accelevationTime", {
    value: Object.freeze({ snapshot: () => game.snapshot() }),
    writable: false,
  });
  let last = performance.now(),
    accumulator = 0;
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (game.status === "playing") {
      accumulator += dt;
      while (accumulator >= 1 / 60) {
        game.step(1 / 60, input);
        accumulator -= 1 / 60;
        if (game.status !== "playing") {
          accumulator = 0;
          break;
        }
      }
    } else accumulator = 0;
    renderer.draw(game, now / 1000);
    updateHud();
    if (toastUntil && now > toastUntil) {
      $("board-toast").classList.remove("visible");
      toastUntil = 0;
    }
    requestAnimationFrame(frame);
  }
  updateSoundButton();
  bindStart();
  updateMission();
  requestAnimationFrame(frame);
})();
