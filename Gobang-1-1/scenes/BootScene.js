var bootConf = {
	key: "Boot"
}

var BootScene = new Phaser.Scene(bootConf);

//called before the scene is loaded
BootScene.preload = function() {}

//called as soon as the scene is created
BootScene.create = function() {

	//add the image we loaded in the preload function, we use set origin to set the 0, 0 coordinates of the image in the center (.5 is between 0 and 1)
	var logo = this.add.image(centerX, centerY, 'img_logo').setOrigin(0.2, 0.2);
	startBtn = this.add.image(centerX, centerY, 'img_startBtn').setOrigin(0.2, 0.2);

	//now let's make the start button interactive and attach a function to the PointerDown event
	startBtn.setInteractive();
	startBtn.on("pointerdown", this.ImageClicked);
}

//called every frame, time is the time when the update method was called, and delta is the time in milliseconds since last frame
BootScene.update = function(time, delta) {}


//in here we handle what happens if the image is clicked
BootScene.ImageClicked = function() {
	//change scene
	BootScene.scene.start("Game");
}