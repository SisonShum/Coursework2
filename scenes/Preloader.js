//initialise global variables
var centerX, centerY, score;

//map stuff
var map, tileset;
//layers
var backgroundLayer, platformsLayer, objectsLayer;

var loaderConf = {
	key: "Loader"
}

var LoaderScene = new Phaser.Scene(loaderConf);

//called before the scene is loaded
LoaderScene.preload = function() {
	//calculate the middle of the screen
	centerX = 100;
	centerY = 100 / 2;

	//loading text
	this.add.text(centerX, centerY * 1.4, "Loading", { font: "12px Arial", fill: "#fff" }).setOrigin(0.5, 0.5);

	//setup our progress bar
	progressbar = this.add.graphics();
	this.load.on("progress", this.updateProgressbar);
	this.load.once("complete", this.finishedLoading);

	//load images
	this.load.image("img_logo", "img/Title.png");
	this.load.image("img_startBtn", "img/StartGameBtn.png");


}

//called as soon as the scene is created
LoaderScene.create = function() {
	
}

//called every frame, time is the time when the update method was called, and delta is the time in milliseconds since last frame
LoaderScene.update = function(time, delta) {}

LoaderScene.updateProgressbar = function(percentage)
{
	progressbar.clear();
    progressbar.fillStyle(0xffffff, 1);
    progressbar.fillRect(centerX - (centerX / 2), centerY * 2, percentage * centerX, 30);
}

LoaderScene.finishedLoading = function()
{
    LoaderScene.load.off("progress", this.updateProgressbar);
    LoaderScene.scene.start("Boot");
}