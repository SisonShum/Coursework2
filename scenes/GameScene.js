var gameConf = {
	key: "Game",
  title: 'Chess',

  margin: 50
}

var GameScene = new Phaser.Scene(gameConf);


//called before the scene is loaded
GameScene.preload = function() {}

//called as soon as the scene is created
GameScene.create = function(scene) {

  var me = true;

  for(var i =0; i <15; i++)
  {
      var line = scene.add.graphics();
        line.lineStyle(3, 0x00ff00, 1.0);
        line.setDepth(20);
        line.beginPath();
        line.lineBetween(i, 0, i, 450);
        line.closePath();
        line.strokePath();
    for(var j =0; j <15; j++)
      {
        //绘制横线
        var line2 = scene.add.graphics();
        line2.lineStyle(3, 0x00ff00, 1.0);
        line2.setDepth(20);
        line2.beginPath();
        line2.lineBetween(0, j, 0, 450);
        line2.closePath();
        line2.strokePath();
      }
    }
}

//called every frame, time is the time when the update method was called, and delta is the time in milliseconds since last frame
GameScene.update = function(time, delta,event) {

  //指定当前位置是否下了其，1代表黑，2代表白，0代表空
  var curIndex = [];
  for(var i =0; i <15; i++) {
    curIndex[i] = [];
    for(var j =0; j <15; j++)
      curIndex[i][j] = 0;
      } ;
}

	// When mouse is down, put a colliding tile at the mouse location
	const pointer = this.input.activePointer;

	if (pointer.isDown)
	{
	  //获取要下的棋子的位置
    var x = Math.floor(this.offsetX /30);
    var y = Math.floor(this.offsetY /30);
    //判断该点是否已被下了
    if(curIndex[x][y] != 0)
      {
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
  }
  };
	

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