(function(){
    var isPhoneGapReady = false;
    var durationSplash = 4000;
    var canvas, ctx;
  var currentSimu ="";
  var currentSimuName = "";
    
    function hideSplash(){
        jq.mobile.changePage("#home", "fade",false,false);
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

  jq(document).ready(function(){
        canvas = document.getElementById('board_canvas');
        ctx = canvas.getContext('2d');
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight - jq('#baord-header').height();
        ctx.fillStyle = 'black';
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

    jq('#board').on('pageshow',function(event){
      console.log('board in');
      //event.preventDefault();
      jq('#board-header h1').html(currentSimuName);

    }).on('pagehide',function(event){
      console.log('board out');
      //event.preventDefault();
    });

    jq('#simu-list .simu-item').click(
      function(event){
        console.log(jq(this).children('.note').html());
        currentSimu = jq(this).children('.note').html();
        currentSimuName = jq(this).children('h4').html();
        console.log(currentSimuName);
        //event.preventDefault();
      }
    );

  });

})();
  
