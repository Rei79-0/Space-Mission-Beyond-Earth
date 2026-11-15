/* Shared profile astronaut sprite. Pixel map is adapted from Minigame 1's AstronautSprite. */
(function (global) {
  const MAP = [
    '..WWWWWW..', '.WWYYYYWW.', '.WYYOYYYW.', '.WYOOYYYW.', '.WWYYYYWW.',
    '..WWWWWW..', '.WWBBBBWW.', 'WWWWWWWWWW', 'WW.WWWW.WW', '...WWWW...',
    '...WBBW...', '..WW..WW..', '..GG..GG..'
  ];
  const COLORS = {
    blue: '#3988ff', pink: '#ff78bd', purple: '#ad82ff', teal: '#49d8d0', gold: '#f2bd42', green: '#72d99a'
  };
  function create(gender, helmetColor, scale) {
    const s = scale || 4;
    const canvas = document.createElement('canvas');
    canvas.width = MAP[0].length * s;
    canvas.height = MAP.length * s;
    canvas.className = 'astronaut-pixel-sprite';
    const ctx = canvas.getContext('2d');
    const helmet = COLORS[helmetColor] || (gender === 'girl' ? COLORS.pink : COLORS.blue);
    const palette = { W: '#f4f2ff', B: helmet, Y: '#ffd84d', O: '#ff9a43', G: '#9aa4c8' };
    MAP.forEach((row, y) => [...row].forEach((pixel, x) => {
      if (!palette[pixel]) return;
      ctx.fillStyle = palette[pixel];
      ctx.fillRect(x * s, y * s, s, s);
    }));
    return canvas;
  }
  global.BeyondEarthAstronaut = { create, colors: COLORS };
})(window);
