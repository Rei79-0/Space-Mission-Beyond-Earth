# Astro Flap

A Flappy Bird style game with an astronaut dodging asteroids. Pure HTML, CSS and JavaScript, with no libraries and no image files. Every sprite is drawn from code.

## Play

Open `index.html` in a browser. It also works on GitHub Pages (see below).

## Controls

| Action | Keys |
| --- | --- |
| Jump (also starts and retries) | Space, Enter, left mouse click, tap |
| Pause / resume | Esc or P, or click the pause button (top-right) |

The game also pauses by itself when you switch to another browser tab.

## Project structure

```
astronaut-flappy/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── config.js                 all tweakable numbers + game states
    ├── main.js                   entry point
    ├── Game.js                   game loop, state, update and draw
    ├── sprites/
    │   ├── SpriteFactory.js      helpers: pixel map -> canvas, seeded random
    │   ├── AstronautSprite.js    astronaut pixel art
    │   ├── AsteroidSprite.js     procedural asteroids
    │   └── BackgroundSprite.js   starfield
    ├── entities/
    │   ├── Astronaut.js          player physics, hitbox, drawing
    │   ├── AsteroidColumn.js     the obstacle (stack with a gap)
    │   └── SteamParticle.js      SteamParticle + SteamSystem
    └── systems/
        ├── InputHandler.js       keyboard, mouse, touch
        └── UI.js                 score, how-to-play, pause, game over
```

The scripts are loaded with plain `<script>` tags (in the order listed in `index.html`), so the game runs by double-clicking `index.html` without a local server.

## Tweaking the game

Open `js/config.js`. Useful values:

- `GAP`: size of the opening between asteroids (smaller is harder)
- `SCROLL_SPEED`: how fast the asteroids move
- `GRAVITY` and `FLAP_POWER`: how the astronaut feels
- `COLUMN_SPACING`: distance between asteroid columns

To change how things look, edit the pixel map in `js/sprites/AstronautSprite.js` (each letter is a colour in `PALETTE`).

## Publish on GitHub Pages

1. Create a repository and upload all files, keeping the folder structure.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then save.
4. After a minute your game is live at `https://<your-username>.github.io/<repo-name>/`.
