# Browser edition validation

Validated September 8, 2026 (America/New_York).

## Simulation checks

`npm test` runs 11 deterministic checks with Node’s built-in test runner:

- Complete content identities and valid quiz answers for all four product families.
- Five-section activation and a full downward component cascade.
- Partial traversal cannot drop a component.
- A complete four-project campaign using only movement and pulse inputs.
- Pause freezes clocks, movement, falling components, and pulse cooldown.
- Ladder alignment and reversing a climb.
- Nearby pulse stun, distance limit, and recharge.
- Holding a climb lands on a floor, allowing a clean ladder exit.
- Arcade life loss and Guided recovery.
- Clean restart without inherited component progress.
- Incomplete assemblies cannot advance; long frame stalls are bounded.

All 11 checks pass.

## Browser checks

Playwright CLI and Chromium were used to check the actual interface:

- Full Guided campaign through all four projects using keyboard movement and pulse input; all 48 component instances installed and the final solution screen reached.
- Incorrect-answer feedback, correct-answer bonus, project transitions, and final results.
- Desktop start and result layouts, including 1440 × 900 and 1440 × 1080 viewports.
- Phone emulation at 390 × 844 with no horizontal overflow; real browser touch events moved the technician using the on-screen controls.
- Pause/resume freezes time; opening the field guide pauses play and closing it resumes.
- All four field-guide tabs, reduced-motion preference, sound toggle, and restart confirmation.
- Extractable static build opened from `file://` with the browser network disabled; keyboard movement worked and no HTTP requests were attempted.
- No JavaScript page errors during the device and offline checks.

Screenshots and temporary browser automation are retained locally in the ignored `output/playwright/` folder. They are not needed by the game.

## Scope

Browser checks used Chromium on Windows, including a simulated touch device. Physical phones and Safari were not tested. This is a visual action game; the field guide and interface have keyboard and semantic accessibility support, but the game board is not fully playable by screen reader. The original C++ application was preserved and not rebuilt.

## Publishing

The build script copies an explicit allowlist into `dist/`. The GitHub Actions workflow runs the simulation suite and static build before publishing to GitHub Pages. No private company reference files or legacy arcade media are included in the browser artifact.
