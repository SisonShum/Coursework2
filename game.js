var config = {
  width: 450,
  height: 450,
  type: Phaser.AUTO,
  scene: [LoaderScene, BootScene, GameScene],
  title: 'Chess',
  display: block,
  margin: 50 auto,
  box-shadow: -2 -2 2 #efefef , 5 5 5 #b9b9b9,
};

var game = new Phaser.Game(config);

