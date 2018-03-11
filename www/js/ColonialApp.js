var stage, canvas;
var initScreen, failScreen, successScreen, deepScreen, warning, overFrame;
var seaBG, hookGroup, hook, light, cord, fishesLayer, seaLayersPack, seaDarkness, treasure;
var seaAnimation;
var bubblesLayer, bubbleImg;
var stillAlive = true; // TRUE if no collition with fishes

function initGame(cvs, stg){
    canvas = cvs;
    stage = stg;

    initScreen = new createjs.Bitmap("img/initScreen.jpg");
    failScreen = new createjs.Bitmap("img/failScreen.jpg");
    successScreen = new createjs.Bitmap("img/successScreen.jpg");
    overFrame = new createjs.Bitmap("img/frame.png");
    warning = new createjs.Bitmap("img/warning.jpg");
    TweenMax.set(failScreen, {regX:768, regY:1024, x:768, y:1024, alpha:0, scaleX:1.05, scaleY:1.05, visible:false});
    TweenMax.set(successScreen, {regX:768, regY:1024, x:768, y:1024, alpha:0, scaleX:1.05, scaleY:1.05, visible:false});
    TweenMax.set(warning, {y:1638, alpha:0});
    TweenMax.to(warning, 0.6, {alpha:1});

    /* Bubbles */
    bubblesLayer = new createjs.Container();

    /* Game BG Scenario */
    seaLayersPack = new createjs.Container();
    seaBG = new createjs.Bitmap("img/seaBG.jpg");
    deepScreen = new createjs.Bitmap("img/deepScreen.png");
    treasure = new createjs.Bitmap("img/treasure.png");
    seaDarkness = new createjs.Shape();
    seaDarkness.graphics.beginFill("rgba(0,0,0,0.5)").drawRect(0, 0, canvas.width, canvas.height);
      TweenMax.set(deepScreen, {y:1800});
      TweenMax.set(seaDarkness, {alpha:0});
      TweenMax.set(treasure, {y:1700, x:200});
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
    TweenMax.set(hook, {y:1310, x:-48});
    TweenMax.set(light, {y:1160, x:-240, alpha:0});
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
  seaAnimation = new TimelineLite();
  seaAnimation.set(seaDarkness, {alpha:0});
  seaAnimation.set(light, {alpha:0});
  seaAnimation.set(deepScreen, {y:1800});
  seaAnimation.set(treasure, {y:1700});
  seaAnimation.set(fishesLayer, {y:0});
  seaAnimation.to(seaDarkness, 7, {alpha:1, ease:Power2.easeOut});
  seaAnimation.to(light, 8, {alpha:1}, "-=5");
  seaAnimation.to(deepScreen, 10, {y:-300, ease:Sine.easeInOut}, "-=10");
  seaAnimation.to(fishesLayer, 10, {y:-2000, ease:Sine.easeOut}, "-=10");
  seaAnimation.to(treasure, 3, {y:1150, ease: Sine.easeOut}, "-=3");
  seaAnimation.pause();
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
      x: getRandomInt(0, canvas.width),
      y: canvas.height - warning.getBounds().height,
      scaleX: randomScale,
      scaleY:randomScale
    });

    TweenMax.to(bubblePart, getRandomArbitrary(4,8), {
      y:-bubbleImg.height,
      ease: Linear.easeNone,
      onComplete: function(){ bubblesLayer.removeChild(bubblePart) }
    });
    TweenMax.delayedCall(getRandomArbitrary(0, 0.1), createBubblesAnimation);
  }

}

function showInitScreen(){
  stage.addChildAt(initScreen, stage.getChildIndex(warning));
  TweenMax.set(initScreen, {regX:768, regY:1024, x:768, y:1024, alpha:0, scaleX:1.05, scaleY:1.05, });
  TweenMax.to(initScreen, 0.6, {scaleX:1, scaleY:1, alpha:1});
}

function startGame(e){
  stillAlive = true;
  createSeaAnimation();
  createBubblesAnimation();

  TweenMax.set(seaBG, {visible:true});
  TweenMax.set(overFrame, {visible:true});
  TweenMax.to(initScreen, 0.3, {scaleX:1.05, scaleY:1.05, alpha:0, ease:Power1.easeIn});
  TweenMax.set(hookGroup, {x:768, y:-1500, alpha:1});
  TweenMax.to(hookGroup, 4, {x:768, y:-1000, delay:0.3, ease:Back.easeOut});

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
  if(Drag.deepLevel > 500){
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
  var dir = ["left", "right"];
  if(stillAlive){
    createFish(dir[getRandomInt(0,1)]);
    createFish(dir[getRandomInt(0,1)]);

    TweenMax.delayedCall(getRandomArbitrary(2,4), throwFishes);
  }
}

function createFish(origin){
  // Create Fish
  var fishImg = new Image(), fishCont, finalX;
  fishImg.src = "img/fish" + getRandomInt(1,4) + ".png";

  fishImg.onload = function(){

    fishCont = new createjs.Bitmap(this.src);
    fishCont.regX = this.width/2;
    fishCont.regY = this.height/2;

    fishesLayer.addChild(fishCont);
    fishCont.y = getRandomInt(0, canvas.height - warning.getBounds().height - this.height) + (-fishesLayer.y);

    if(origin === "left"){
      initialX = -this.width/2;
      finalX = canvas.width + this.width/2;
      pointingTo = 1;
    }else if(origin === "right"){
      initialX = canvas.width + this.width/2;
      finalX = -this.width + this.width/2;
      pointingTo = -1;
    }

    fishCont.x = initialX;
    fishCont.scaleX = pointingTo;
    TweenMax.to(fishCont, getRandomArbitrary(4,12), {x:finalX, ease:Linear.easeNone, onComplete:function(){
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
