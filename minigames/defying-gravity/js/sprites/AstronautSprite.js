/** Pixel art for the astronaut. W=white, B=blue shade, Y=yellow visor, O=orange glint, G=boots. */
class AstronautSprite {
  static SCALE = 3;

  static MAP = [
    '..WWWWWW..',
    '.WWYYYYWW.',
    '.WYYOYYYW.',
    '.WYOOYYYW.',
    '.WWYYYYWW.',
    '..WWWWWW..',
    '.WWBBBBWW.',
    'WWWWWWWWWW',
    'WW.WWWW.WW',
    '...WWWW...',
    '...WBBW...',
    '..WW..WW..',
    '..GG..GG..'
  ];

  static PALETTE = {
    W: '#ffffff',
    B: '#b9c6f2',
    Y: '#ffd23f',
    O: '#f59a1b',
    G: '#8b93b8'
  };

  static create() {
    const palette = { ...AstronautSprite.PALETTE };
    // Use the helmet colour selected on the profile page.
    try {
      const profile = JSON.parse(localStorage.getItem('beyondEarthProfile') || '{}');
      const helmetColors = { blue: '#3988ff', pink: '#ff78bd', purple: '#ad82ff', teal: '#49d8d0', gold: '#f2bd42', green: '#72d99a' };
      palette.B = helmetColors[profile.helmetColor] || (profile.gender === 'girl' ? helmetColors.pink : helmetColors.blue);
    } catch (_) { /* keep the default game sprite palette */ }
    return SpriteFactory.fromMap(AstronautSprite.MAP, palette, AstronautSprite.SCALE);
  }
}
