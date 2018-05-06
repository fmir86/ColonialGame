var stage, canvas;
var initScreen, failScreen, successScreen, deepScreen, warning, overFrame;
var seaBG, hookGroup, hook, light, cord, fishesLayer, seaLayersPack, seaDarkness, treasure;
var seaAnimation;
var bubblesLayer, bubbleImg;
var stillAlive = true; // TRUE if no collition with fishes
var difficulty = 1;
var realStageWidth = 800;
var realStageHeight = 1067;

var fishTopPosition = [
                        Math.round(realStageHeight * 0.10),
                        Math.round(realStageHeight * 0.36),
                        Math.round(realStageHeight * 0.36),
                        Math.round(realStageHeight * 0.76)
                      ];

var selectedFishAsset = 0;
var selectedDir = 0; // 0 = left / 1 = right
var selectedY = fishTopPosition[2];

function initGame(cvs, stg){
    
    canvas = cvs;
    stage = stg;

    initScreen = new createjs.Bitmap("img/initScreen.jpg");
    failScreen = new createjs.Bitmap("img/failScreen.jpg");
    successScreen = new createjs.Bitmap("img/successScreen.jpg");
    overFrame = new createjs.Bitmap("img/frame.png");
    warning = new createjs.Bitmap("img/warning.jpg");
    
    TweenMax.set(failScreen, {regX:400, regY:426, x:400, y:426, alpha:0, scaleX:1.05, scaleY:1.05, visible:false});
    TweenMax.set(successScreen, {regX:400, regY:426, x:400, y:426, alpha:0, scaleX:1.05, scaleY:1.05, visible:false});
    TweenMax.set(warning, {y:853, alpha:0});
    TweenMax.to(warning, 0.6, {alpha:1});

    /* Bubbles */
    bubblesLayer = new createjs.Container();

    /* Game BG Scenario */
    seaLayersPack = new createjs.Container();
    seaBG = new createjs.Bitmap("img/seaBG.jpg");
    deepScreen = new createjs.Bitmap("img/deepScreen.png");
    treasure = new createjs.Bitmap("img/treasure.png");
    seaDarkness = new createjs.Shape();
    seaDarkness.graphics.beginFill("rgba(0,0,0,0.5)").drawRect(0, 0, realStageWidth, realStageHeight);
	console.log("stage width: " + stage.getBounds());
      TweenMax.set(deepScreen, {y:100});
      TweenMax.set(seaDarkness, {alpha:0});
      TweenMax.set(treasure, {y:950, x:100, alpha:0});
        seaLayersPack.addChild(seaBG);
        seaLayersPack.addChild(seaDarkness);
        seaLayersPack.addChild(deepScreen);
        seaLayersPack.addChild(treasure);
        stage.addChild(seaLayersPack);

    TweenMax.set([seaBG, overFrame], {visible:false});

    fishesLayer = new createjs.Container();

    /* Hook */
    hookGroup = new createjs.Container();

    hook = new createjs.Bitmap("img/hook.png");
    light = new createjs.Bitmap("img/light.png");
    cord = new createjs.Bitmap("img/cord.png");
    TweenMax.set(hook, {y:1310, x:-24});
    TweenMax.set(light, {y:1220, x:-120, alpha:0});
    hookGroup.addChild(light);
    hookGroup.addChild(hook);
    hookGroup.addChild(cord);

    var activeArea = new createjs.Shape();
    activeArea.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(-48, 0, 76, 1500);

    hookGroup.addChild(activeArea);
    TweenMax.set(hookGroup, {x:768, y:-1500});

    stage.addChild(fishesLayer);
    stage.addChild(hookGroup);
    stage.addChild(overFrame);
    stage.addChild(bubblesLayer);
    stage.addChild(failScreen);
    stage.addChild(successScreen);
    stage.addChild(warning); // 1 (Top)


    initScreen.addEventListener("mousedown", startGame);
    showInitScreen();
}

function createSeaAnimation(){
  seaAnimation = new TimelineLite({onUpdate:setDifficulty});
  seaAnimation.set(seaDarkness, {alpha:0});
  seaAnimation.set(light, {alpha:0});
  seaAnimation.set(deepScreen, {y:1800});
  seaAnimation.set(treasure, {y:950, alpha:1});
  seaAnimation.set(fishesLayer, {y:0});
  seaAnimation.set(bubblesLayer, {y:0});
  seaAnimation.to(seaDarkness, 7, {alpha:1, ease:Power2.easeOut});
  seaAnimation.to(light, 8, {alpha:1}, "-=5");
  seaAnimation.to(deepScreen, 10, {y:-200, ease:Sine.easeInOut}, "-=10");
  seaAnimation.to(fishesLayer, 10, {y:-2000, ease:Sine.easeOut}, "-=10");
  seaAnimation.to(bubblesLayer, 10, {y:-2000, ease:Sine.easeOut}, "-=10");
  seaAnimation.to(treasure, 3, {y:600, ease: Sine.easeOut}, "-=3");
  seaAnimation.pause();	
}

function setDifficulty(elem){
	difficulty = Math.round((seaAnimation.progress() * 3) + 1);
	console.log("difficulty: " + difficulty);
}

function createBubblesAnimation(){
  if(bubbleImg == undefined){
    bubbleImg = new Image();
    bubbleImg.src = "img/bubbleParticle.png";
    bubbleImg.onload = animateBubble();
  }else{
    animateBubble();
  }

  function animateBubble(){
    var bubblePart = new createjs.Bitmap("img/bubbleParticle.png");
    var randomScale = getRandomArbitrary(0.5, 2);
    bubblesLayer.addChild(bubblePart);

    TweenMax.set(bubblePart, {
      x: getRandomInt(0, realStageWidth),
      y: realStageHeight - warning.getBounds().height + (-bubblesLayer.y),
      scaleX: randomScale,
      scaleY:randomScale
    });

    TweenMax.to(bubblePart, getRandomArbitrary(4,8), {
      y:-bubbleImg.height + (-bubblesLayer.y),
      ease: Linear.easeNone,
      onComplete: function(){ bubblesLayer.removeChild(bubblePart) }
    });
    TweenMax.delayedCall(getRandomArbitrary(0, 0.1), createBubblesAnimation);
  }

}

function showInitScreen(){
  stage.addChildAt(initScreen, stage.getChildIndex(warning));
  TweenMax.set(initScreen, {regX:400, regY:426, x:400, y:426, alpha:0, scaleX:1.05, scaleY:1.05, });
  TweenMax.to(initScreen, 0.6, {scaleX:1, scaleY:1, alpha:1});
}

function startGame(e){
  stillAlive = true;
  difficulty = 1;
  createSeaAnimation();
  createBubblesAnimation();

  TweenMax.set(seaBG, {visible:true});
  TweenMax.set(overFrame, {visible:true});
  TweenMax.to(initScreen, 0.3, {scaleX:1.05, scaleY:1.05, alpha:0, ease:Power1.easeIn});
  TweenMax.set(hookGroup, {x:400, y:-1500, alpha:1});
  TweenMax.to(hookGroup, 4, {x:400, y:-1100, delay:0.3, ease:Back.easeOut});

  activateHookDragging();
  throwFishes();
}

function activateHookDragging(){
  Drag.startDrag(hookGroup, overFrame);
  createjs.Ticker.addEventListener("tick", onNewAnimationFrame);
}

function onNewAnimationFrame(){
  goingDown();
  checkCollitions();
  checkSuccess();
}


function goingDown(){
	
  if(Drag.deepLevel > 300){
    if(seaAnimation.paused()){
        seaAnimation.play();
        TweenLite.set(seaAnimation, {timeScale:0})
        TweenLite.to(seaAnimation, 1, {timeScale:1})
    }
  }else{
    if(!seaAnimation.paused()){
      TweenLite.to(seaAnimation, 0.3, {timeScale:0, onComplete:function(){
        seaAnimation.pause()
      }});
    }
  }
}

function checkCollitions(){
  for(var i = 0; i < fishesLayer.numChildren; i++){
    try{
      if(ndgmr.checkPixelCollision(fishesLayer.getChildAt(i), hook, 0, true)){
        console.log("collition!");
        Drag.stopDrag();
        seaAnimation.pause();

        var fish = fishesLayer.getChildAt(i);
        var newShortDestiny = fish.x + ((fish.regX * .4) * fish.scaleX);

        TweenMax.to(fish, 1, {rotation:-45 * fish.scaleX, ease:Quad.easeInOut});
        TweenMax.to(fish, 0.6, {x: newShortDestiny, ease:Quad.easeOut});

        createjs.Ticker.removeEventListener("tick", onNewAnimationFrame);
        stillAlive = false;
        onUserFail();
      }
    }catch(error){
      //console.log(error);
    }
  }
}

function checkSuccess(){
  if(ndgmr.checkPixelCollision(treasure, hook, 0, true)){
    console.log("success!");
    Drag.stopDrag();
    seaAnimation.pause();
    createjs.Ticker.removeEventListener("tick", onNewAnimationFrame);
    stillAlive = false;
    onUserSuccess();
  }
}

function throwFishes(){
	
	if(stillAlive){
		if(difficulty == 1){
			TweenMax.delayedCall(getRandomArbitrary(1, 2), throwFishes);
			selectedY = getRandomNewIndex(0,2, selectedY);
		}else if(difficulty == 2){
			TweenMax.delayedCall(getRandomArbitrary(0.6, 1), throwFishes);
			selectedY = getRandomNewIndex(0,3, selectedY);
		}else if(difficulty == 3){
			TweenMax.delayedCall(getRandomArbitrary(0.5, 0.8), throwFishes);
			selectedY = getRandomNewIndex(1,3, selectedY);
		}else if(difficulty == 4){
			TweenMax.delayedCall(getRandomArbitrary(0.5, 0.7), throwFishes);
			selectedY = getRandomNewIndex(1,3, selectedY);
		}
		
		selectedFishAsset = getRandomNewIndex(1,4, selectedFishAsset);
		selectedDir = getRandomNewIndex(0,1, selectedDir)

		createFish( selectedFishAsset, selectedDir, selectedY );
	}
}

function createFish(index, origin, yposition){
  // Create Fish
  var fishImg = new Image(), fishCont, finalX;
  fishImg.src = "img/fish" + index + ".png";
	console.log(fishImg.src);

  fishImg.onload = function(){

    fishCont = new createjs.Bitmap(this.src);
    fishCont.regX = this.width/2;
    fishCont.regY = this.height/2;

    fishesLayer.addChild(fishCont);
    fishCont.y = fishTopPosition[yposition] + (-fishesLayer.y);

    if(origin === 0){ // LEFT
      initialX = -this.width/2;
      finalX = realStageWidth + this.width/2;
      pointingTo = 1;
    }else if(origin === 1){ // RIGHT
      initialX = realStageWidth + this.width/2;
      finalX = -this.width + this.width/2;
      pointingTo = -1;
    }

    fishCont.x = initialX;
    fishCont.scaleX = pointingTo;
	  
    TweenMax.to(fishCont, getRandomArbitrary(4,12), {
		x: finalX,
		ease: Linear.easeNone,
		
		onComplete:function(){
		  fishesLayer.removeChild(fishCont);
		}});
  }
}

function onUserSuccess(){
  TweenMax.to(hookGroup, 0.3, {alpha:0});
  TweenMax.set(successScreen, {visible:true});
  TweenMax.to(successScreen, 0.3, {scaleX:1, scaleY:1, alpha:1, ease:Power1.easeIn, onComplete:function(){
    TweenMax.killAll();
    fishesLayer.removeAllChildren();
    bubblesLayer.removeAllChildren();
    TweenMax.delayedCall(3, resetGame);
  }});
}

function onUserFail(){
  TweenMax.to(hookGroup, 0.3, {alpha:0});
  TweenMax.set(failScreen, {visible:true});
  TweenMax.to(failScreen, 0.3, {scaleX:1, scaleY:1, alpha:1, ease:Power1.easeIn, onComplete:function(){
    TweenMax.killAll();
    fishesLayer.removeAllChildren();
    bubblesLayer.removeAllChildren();
    TweenMax.delayedCall(3, resetGame);
  }});
}

function resetGame(){
	
  if(failScreen.alpha == 1){
    TweenMax.to(failScreen, 0.3, {alpha:0, ease:Linear.easeNone});
  }else if(successScreen.alpha == 1){
    TweenMax.to(successScreen, 0.3, {alpha:0, ease:Linear.easeNone});
  }

  showInitScreen();
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomNewIndex(lowest, highest, existingValue){
	var temp;
    do{
		temp = getRandomInt(lowest, highest);
	}while(temp == selectedFishAsset);
	
	return temp;
}
