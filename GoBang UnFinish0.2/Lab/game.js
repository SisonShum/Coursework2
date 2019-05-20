var config = {
  width: 80*10,
  height: 80*10,
  type: Phaser.AUTO,
  scene: [LoaderScene, BootScene, GameScene],
  title: 'Phaser 3 Multiplayer GoBang',
  pixelArt: true,
  backgroundColor: 'ffffff'
};

var game = new Phaser.Game(config);

//resizing window resizes the game
game.events.on('resize', resize, game);

function resize (width, height)
{
    if (width === undefined) { width = game.sys.game.config.width; }
    if (height === undefined) { height = game.sys.game.config.height; }

    game.cameras.resize(width, height);

    game.bg.setSize(width, height);
    game.logo.setPosition(width / 2, height / 2);
}