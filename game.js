var config = {
  type: Phaser.AUTO,
  scene: [LoaderScene, BootScene, GameScene],
  title: 'Chess',
  backgroundColor: '000000'
};

var game = new Phaser.Game(config);

game.events.on('resize', resize, game);

function resize (width, height)
{
    if (width === undefined) { width = game.sys.game.config.width; }
    if (height === undefined) { height = game.sys.game.config.height; }

    game.cameras.resize(width, height);

    game.bg.setSize(width, height);
    game.logo.setPosition(width / 2, height / 2);
}