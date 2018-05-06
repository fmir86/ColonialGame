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

        var w = 800;
        var h = 1067;
        
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = "auto";
        
        
        stage.scaleX =1;
        stage.scaleY = 1;

        createjs.Ticker.setFPS(30);
        createjs.Ticker.addEventListener("tick", stage);

        initGame(canvas, stage);
    }
};

app.initialize();
