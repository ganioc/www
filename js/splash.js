(function(){
    var isPhoneGapReady = false;
    var durationSplash = 4000;
    var canvas, ctx;

    
    function hideSplash(){
        jq.mobile.changePage("#home", "fade");
    }
    
    
    var splash = {
        
        fadeIn:function(){
            window.setTimeout( hideSplash, durationSplash);
            // some homework here, when displaying splash screen
        }

    };

    // configuration:
    function init(){
        document.addEventListener('deviceready',onDeviceReady,false);
        splash.fadeIn();
    }
    function onDeviceReady(){
        isPhoneGapReady = true;
        console.log('deviceReady is triggered');

        // prepare board canvas init
    //     canvas = document.getElementById('board_canvas');
    //     ctx = canvas.getContext('2d');
    //     ctx.canvas.width = window.innerWidth;
    //     ctx.canvas.height = window.innerHeight - $('#baord-header').height();
    //     ctx.fillStyle = 'black';
    //     ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
//
    }
    

    // expose to external global
    window.splash = splash;

    window.onload = init;
})();
  
