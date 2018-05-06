this.Drag = this.Drag || {};

(function() {

  var dragger;
  var deepLevel;
  var deepLimit = 550;

  var startDrag = function(obj, insertBefore, callback) {

    createjs.Touch.enable(stage);
    stage.mouseMoveOutside = true;

    if(!stage.contains(dragger)){
      dragger = new createjs.Container();
      dragger.addChild(obj);
      stage.addChildAt(dragger, stage.getChildIndex(insertBefore));
    }

    dragger.x = 0;
    dragger.y = 0;
    dragger.mouseChildren = true;

    dragger.on("mousedown", function(evt) {
        // keep a record on the offset between the mouse position and the container
        // position. currentTarget will be the container that the event listener was added to:
          evt.currentTarget.offset = {x: this.x - (evt.stageX), y: this.y - (evt.stageY)};
    });

    dragger.on("pressmove", function(evt) {
        if(!dragger.mouseChildren) return;

        // Calculate the new X and Y based on the mouse new position plus the offset.
        var cappedX = evt.stageX + evt.currentTarget.offset.x;
        var cappedY = ((evt.stageY) + evt.currentTarget.offset.y < deepLimit) ? (evt.stageY) + evt.currentTarget.offset.y : deepLimit;
        TweenMax.to(evt.currentTarget, 1, {x: cappedX, y:cappedY, ease:Back.easeOut});

        Drag.deepLevel = evt.currentTarget.y;

        if(callback != null) callback()
    });

  }


  var stopDrag = function() {
    dragger.mouseChildren = false;
    Drag.deepLevel = 0;
  }


  Drag.startDrag = startDrag;
  Drag.stopDrag = stopDrag;
  Drag.deepLevel = deepLevel;

}());
