var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id){
        var canvas, stage, anim_container;

        anim_container = document.getElementById("animation_container");
        canvas = document.getElementById("canvas");
        stage = new createjs.Stage(canvas);

        var w = canvas.getAttribute("width"), h = canvas.getAttribute("height");
        canvas.width = w * window.devicePixelRatio;
        canvas.height = h * window.devicePixelRatio;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        stage.scaleX = 0.5 * window.devicePixelRatio;
        stage.scaleY = 0.5 * window.devicePixelRatio;

        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", stage);

        initGame(canvas, stage);
    }
};

app.initialize();
