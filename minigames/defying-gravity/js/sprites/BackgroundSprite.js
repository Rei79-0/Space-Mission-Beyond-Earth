/** Clean, deterministic dark-purple starfield (no random/debug values are rendered). */
class BackgroundSprite {
  static COLOR_SPACE = '#221f3a';
  static COLOR_STAR_DIM = '#463f80';
  static COLOR_STAR_BRIGHT = '#8b83d8';

  static create(width, height) {
    const canvas = SpriteFactory.createCanvas(width, height);
    const g = canvas.getContext('2d');

    // Paint an opaque base so no old canvas pixels or numeric/debug artifacts
    // can show through when the background is tiled during gameplay.
    g.fillStyle = BackgroundSprite.COLOR_SPACE;
    g.fillRect(0, 0, width, height);

    // Use a repeatable coordinate pattern rather than a random array. The
    // modular spacing keeps stars distributed and fully inside the canvas.
    const columns = 24;
    const rows = 14;
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const selector = (row * 17 + column * 29) % 11;
        if (selector === 0 || selector === 5) continue;

        const x = Math.floor((column + 0.5) * width / columns + ((row * 13 + column * 7) % 9) - 4);
        const y = Math.floor((row + 0.5) * height / rows + ((column * 11 + row * 5) % 9) - 4);
        const size = selector === 3 ? 3 : 2;
        g.fillStyle = selector === 2 ? BackgroundSprite.COLOR_STAR_BRIGHT : BackgroundSprite.COLOR_STAR_DIM;
        g.fillRect(Math.max(0, Math.min(width - size, x)), Math.max(0, Math.min(height - size, y)), size, size);
      }
    }

    return canvas;
  }
}
