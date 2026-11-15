# Satellite Rescue

Browser pixel-art game (3 levels). Open `index.html` directly, or host on GitHub Pages.

## Structure
- `src/core.js` - Canvas, constants and math helpers
- `src/sprites.js` - All pixel-art sprites (astronaut, aliens per environment, satellite, items) built from text maps
- `src/data.js` - Static game data: levels (LV), quiz questions, puzzles, Mars bunker/easter eggs, drag-drop questions, keypad
- `src/state.js` - Mutable game state and startLevel()
- `src/mars.js` - Level 2 logic: chests, pylon/pad/orb puzzles, drag-and-drop lock, bunker keypad
- `src/gameplay.js` - Core gameplay: interaction, quiz, stun gun, collisions, satellite rope towing, connect-the-dots puzzle, update loop
- `src/input.js` - Keyboard / mouse / pointer event handling
- `src/ui.js` - Menus, pause, HUD overlays, quiz/puzzle/result screens, drag-drop and keypad UIs
- `src/render.js` - World rendering, environment backgrounds, Mars objects, rope
- `src/main.js` - Game loop

Scripts are plain (non-module) files that share one global scope, so keep the load order in `index.html`.

## Controls
WASD/arrows move, mouse aims, left click fires stun gun, hold right click near the satellite to mount it, E interacts, ESC pauses.
