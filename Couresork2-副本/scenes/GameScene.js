var turn = true;
var tiles = [];
var tilesValues = [];

var waitingImage = null;
var server = null;
var gameStarted = false;

var Tile = function(img, x, y, value)
{
	this.image = img;
	this.x = x;
	this.y = y;
}

var gameConf = {
	key: "Game"
}

var GameScene = new Phaser.Scene(gameConf);

//called before the scene is loaded
GameScene.preload = function() {}

//called as soon as the scene is created
GameScene.create = function() {
	//we add the "waiting for opponent" image on top of everything until somebody connects
	waitingImage = this.add.image(centerX, centerY, 'img_waiting').setOrigin(0.2, 0.2).setDepth(10);

	//init online functionality
	server = new SSMMS(true);
	
	//connect our handlers
	server.onMessage = this.MessageReceived;
	server.onRoomsReceived = this.RoomsReceived;
	server.onUserDisconnected = this.UserDisconnected;
	server.onError = this.ErrorReceived;

	server.Connect(server);
	server.GetRooms();

	//create all our tiles
	for (x = 0; x < 10; x++)
	{
		tilesValues[x] = []; //creating our 2D Array
		for (y = 0; y <10; y++)
		{
			//create new tile with empty image
			var tempTile = new Tile(this.add.image(x * 16 * 5, y * 16 * 5, "img_tile").setOrigin(0, 0).setScale(5), x, y, 0);
			//push tile in our array
			tiles.push(tempTile);

			//set our 2D Array values
			tilesValues[x][y] = 0;
		}		
	}

	//make our tiles clickable
	tiles.forEach(function(element)
	{
		//set tile to be interactive
		element.image.setInteractive();
		//handle mouse clicks
		element.image.on("pointerdown", function(){
			if (gameStarted && turn) //we make a move only if the game is started and it is our turn!
			{
				GameScene.MakeMove(element.x, element.y);
				//instead of just making a move, we also send it to our opponent
				server.SendMessage("move", element);

				//after sending the message, we check if it was the last move
				GameScene.CheckForWin();

				//finally swap turn
				turn = !turn;
			}
		});
	})
}

//called every frame, time is the time when the update method was called, and delta is the time in milliseconds since last frame
GameScene.update = function(time, delta) {
	
}

GameScene.MessageReceived = function(type, message){
	console.log("received message type: " + type + ", with value: " + message);

	if (type == "player joined")
	{
		gameStarted = true;
		waitingImage.destroy();
	}

	if (type == "move")
	{
		//we get these from our opponent!
		GameScene.MakeMove(message.x, message.y);

		//after receiving the message, we check if it was the last move
		GameScene.CheckForWin();

		//finally swap turn
		turn = !turn;
	}
}

GameScene.RoomsReceived = function(rooms)
{
	console.log("rooms on the server:");
	console.log(rooms);

	var roomExists = false;

	rooms.forEach(function(room){
		if (room.name == "My Room") //somebody already created the room, so we join it
		{
			turn = false;
			server.JoinRoom("My Room");
			roomExists = true;
			//after joining, we notify the host that we have indeed joined, then start the game!
			server.SendMessage("player joined");
			gameStarted = true;
			waitingImage.destroy();
		}
	})

	if (!roomExists) //the room does not exist, we can host!
	{
		server.CreateRoom("My Room", 2); //we can only have 2 players at any given time
		turn = true;
	}
}

GameScene.UserDisconnected = function()
{
	//the other person left, might as well end the game
	alert("You won by default, the other player left...");
	GameScene.EndLevel();
}

GameScene.ErrorReceived = function(code, description)
{
	if (code == "CNC") //happens when we cannot create a room
	{
		alert("Unfortunately we could not create a room");
	}

	if (code == "CNJ") //happens when we cannot join a room
	{
		alert("Unfortunately we could not join a room");
	}	
}

GameScene.EndLevel = function()
{
	//reset variables
	tiles = [];
	tilesValues = [];
	turn = true;

	//let's leave the room since we have finished playing
	server.LeaveRoom("My Room");

	this.scene.start("Boot");
}

GameScene.MakeMove = function(locationX, locationY)
{
	//find our tile from the location
	var selectedTile = tiles.find(function(tempTile)
	{
		return locationX == tempTile.x && locationY == tempTile.y;
	});

	selectedTile.image.destroy();

	//add new tile according to player turn
	if (turn) //player 1
	{
		selectedTile.image = this.add.image(selectedTile.x * 16 * 5, selectedTile.y * 16 * 5, "img_x").setOrigin(0, 0).setScale(5);
		tilesValues[locationX][locationY] = 1;
	}
	else //player 2
	{
		selectedTile.image = this.add.image(selectedTile.x * 16 * 5, selectedTile.y * 16 * 5, "img_o").setOrigin(0, 0).setScale(5);
		tilesValues[locationX][locationY] = 2;
	}

	//we move the win check to after we sent the move to our opponent!
}

GameScene.CheckForWin = function(che,tilesValues)
{
						// length 属性可返回字符串中的字符数目
						for (var i = 0;i < 10;i++) {
							// 棋子横坐标
							var x = che[i]%10;
							// 棋子竖坐标
							var y = 10(che[i]/10);
							// \这样的倾斜判断
							if ( x <= 10 - 5 && y <= 10 - 5 && che[i] != 0 ) {
								if( che[i+1*10+1] != 0 && che[i+2*10+2] != 0 && che[i+3*10+3] != 0 && che[i+4*10+4] != 0 ){
									alert(tilesValues+'Win!');
									// 胜利后刷新页面
									location.replace(location);
									return true;
								}
							};
							// |这样的竖直判断
							if ( y <= 10 - 5 && che[i] != 0 ) {
								if( che[i+1*10] != 0 && che[i+2*10] != 0 && che[i+3*10] != 0 && che[i+4*10] != 0 ){
									alert(tilesValues+'Win!');
									// Location 对象方法replace()	用新的文档替换当前文档
									location.replace(location);
									return true;
								}
							};
							// /这样的倾斜判断
							if ( x >= 4 && y <= 10 - 5 && che[i] != 0 ) {
								if( che[i+1*10-1] != 0 && che[i+2*10-2] != 0 && che[i+3*10-3] != 0 && che[i+4*10-4] != 0 ){
									alert(tilesValues+'Win!');
									location.replace(location);
									return true;
								}
							};
							// ——这样的平行判断
							if ( x <= 10 - 5 && che[i] != 0 ) {
								if( che[i+1] != 0 && che[i+2] != 0 && che[i+3] != 0 && che[i+4] != 0 ){
									alert(tilesValues+'Win!');
									location.replace(location);
									return true;
								}
							};
						};
					}