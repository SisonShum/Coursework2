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
	waitingImage = this.add.image(centerX, centerY, 'img_waiting2').setOrigin(0.2, 0.2).setDepth(10);

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
		for (y = 0; y < 10; y++)
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

GameScene.CheckForWin = function()
{
  console.log(floor);
  //check all horizontal win states
  for (y = 0; y < 5; y++)
  {
    //player 1
    if (floor[0][y] == 1 && floor[1][y] == 1 && floor[2][y] == 1 && floor[3][y] == 1 && floor[4][y] == 1)
    {
      alert("Player 1 won!");
      this.EndLevel();
    }
    
    //player 2
    if (floor[0][y] == 2 && floor[1][y] == 2 && floor[2][y] == 2 && floor[3][y] == 2 && floor[4][y] == 2)
    {
      alert("Player 2 won!");
      this.EndLevel();
    }
  }

  //check all vertical win states
  for (x = 0; x < 5; x++)
  {
    //player 1
    if (floor[x][0] == 1 && floor[x][1] == 1 && floor[x][2] == 1 && floor[x][3] == 1 && floor[x][4] == 1)
    {
      alert("Player 1 won!");
      this.EndLevel();
    }
    
    //player 2
    if (floor[x][0] == 2 && floor[x][1] == 2 && floor[x][2] == 2 && floor[x][3] == 2 && floor[x][4] == 2)
    {
      alert("Player 2 won!");
      this.EndLevel();
    }
  }

  //check diagonals
  //player 1
  if (floor[0][0] == 1 && floor[1][1] == 1 && floor[2][2] == 1 && floor[3][3] == 1 && floor[4][4] == 1 )
  {
    alert("Player 1 won!");
    this.EndLevel();
  }

  if (floor[4][0] == 1 && floor[3][1] == 1 && floor[2][2] == 1 && floor[1][3] == 1 && floor[0][4] == 1)
  {
    alert("Player 1 won!");
    this.EndLevel();
  }

  //player 2
  if (floor[0][0] == 2 && floor[1][1] == 2 && floor[2][2] == 2 && floor[3][3] == 2 && floor[4][4] == 2)
  {
    alert("Player 2 won!");
    this.EndLevel();
  }

  if (floor[2][0] == 2 && floor[1][1] == 2 && floor[0][2] == 2 && floor[1][3] == 2 && floor[0][4] == 2)
  {
    alert("Player 2 won!");
    this.EndLevel();
  }
}