var gameConf = {
	key: "Game",
  title: 'Chess',
  display: block,
  margin: 50,
}

var GameScene = new Phaser.Scene(gameConf);

//called before the scene is loaded
GameScene.preload = function() {}

//called as soon as the scene is created
GameScene.create = function() {

	 //获取棋盘canvas
  var chess = document.getElementById("chess");
//获取2d画布
  var context = chess.getContext('2d');
  //指定当前是否黑色下，只在UI中使用
  var me = true;
  //指定当前位置是否下了其，1代表黑，2代表白，0代表空
  var curIndex = [];
  for(var i =0; i <15; i++) {
    curIndex[i] = [];
    for(var j =0; j <15; j++)
      curIndex[i][j] = 0;
      } ;
}


GameScene.Drawtable = function(scene)
{
	 //我们设置棋盘总共15根横线15根总线，左右上下都有15px的边距，其中每个棋子相距30px,因此绘制棋盘从15px开始
 
    for(var i =0; i <15; i++)
      for(var j =0; j <15; j++)
        {
          //绘制横线
          context.moveTo(15, 15 +j *30);
          context.lineTo(435, 15 +j *30);
          //绘制竖线
          context.moveTo(15 +j *30, 15);
          context.lineTo(15 +j *30, 435); 
 
          //使用灰色描边
          context.strokeStyle = "#bfbfbf";
          context.stroke();
        }
}


//called every frame, time is the time when the update method was called, and delta is the time in milliseconds since last frame
GameScene.update = function(time, delta,event) {
	player.Update(delta / 1000);

	// When mouse is down, put a colliding tile at the mouse location
	const pointer = this.input.activePointer;
	const worldPoint = pointer.positionToCamera(this.cameras.main);
	if (pointer.isDown)
	{
	  //获取要下的棋子的位置
    var x = Math.floor(event.offsetX /30);
    var y = Math.floor(event.offsetY /30);
    //判断该点是否已被下了
    if(curIndex[x][y] != 0)
      return;
    //开始绘制
    context.beginPath();
    //绘制指定圆
    context.arc(15 +x *30, 15 +y *30, 15, 0, 2 *Math.PI);
    //进行填充
    if(me) {
      context.fillStyle = "#636766";
      curIndex[x][y] = 1;
      me = false;
    }
    else {
      context.fillStyle = "#b9b9b9";
      curIndex[x][y] = 2;
      me = true;
    }
    context.fill();
    //结束绘制
    context.closePath();
  };
	}

GameScene.judge = function(che,color)
{
	 // length 属性可返回字符串中的字符数目
            for (var i = 0;i < che.length;i++) {
              // 棋子横坐标
              var x = che[i]%lineNum;
              // 棋子竖坐标
              var y = parseInt(che[i]/lineNum);
              // \这样的倾斜判断
              if ( x <= lineNum - 5 && y <= lineNum - 5 && che[i] != 0 ) {
                if( che[i+1*lineNum+1] != 0 && che[i+2*lineNum+2] != 0 && che[i+3*lineNum+3] != 0 && che[i+4*lineNum+4] != 0 ){
                  alert(color+'Win!');
                  // 胜利后刷新页面
                  location.replace(location);
                  return true;
                  GameScene.scene.start("Boot");
                }
              };
              // |这样的竖直判断
              if ( y <= lineNum - 5 && che[i] != 0 ) {
                if( che[i+1*lineNum] != 0 && che[i+2*lineNum] != 0 && che[i+3*lineNum] != 0 && che[i+4*lineNum] != 0 ){
                  alert(color+'Win!');
                  // Location 对象方法replace() 用新的文档替换当前文档
                  location.replace(location);
                  return true;
                  GameScene.scene.start("Boot");
                }
              };
              // /这样的倾斜判断
              if ( x >= 4 && y <= lineNum - 5 && che[i] != 0 ) {
                if( che[i+1*lineNum-1] != 0 && che[i+2*lineNum-2] != 0 && che[i+3*lineNum-3] != 0 && che[i+4*lineNum-4] != 0 ){
                  alert(color+'Win!');
                  location.replace(location);
                  return true;
                  GameScene.scene.start("Boot");
                }
              };
              // ——这样的平行判断
              if ( x <= lineNum - 5 && che[i] != 0 ) {
                if( che[i+1] != 0 && che[i+2] != 0 && che[i+3] != 0 && che[i+4] != 0 ){
                  alert(color+'Win!');
                  location.replace(location);
                  return true;
                  GameScene.scene.start("Boot");
                }
              };
            };
}