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
    return SpriteFactory.fromMap(AstronautSprite.MAP, AstronautSprite.PALETTE, AstronautSprite.SCALE);
  }
}
