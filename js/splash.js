(function(){
    var isPhoneGapReady = false;
    var durationSplash = 4000;
    var canvas, ctx;
    var currentSimu ="";
    var currentSimuName = "";
    var isAnimationRunning = false;
    var start = false;
    var currentGameLoop = null;
    var system; // this is the particlesystem
    
    function hideSplash(){
        jq.mobile.changePage("#home", "fade",false,false);
    }
    
    
    var splash = {
        
        fadeIn:function(){
            window.setTimeout( hideSplash, durationSplash);
            // some homework here, when displaying splash screen
        },
        createGameLoop:function(simu){
            var handler;
            if(simu === 'golden_fire')
            {
                handler = splash.golden_fire();
            }
            else if(simu === 'water_ripple'){
                handler = splash.water_ripple();
            }
            else if(simu === 'tracking_trace'){
                handler = splash.tracking_trace();
            }
            else{
                console.log('wrong func name');
            }
            return function(timestamp){
                if(!start){
                    start = timestamp;
                }
                var progress = timestamp -start;
                start = timestamp;
                if(isAnimationRunning === false){
                    console.log('out of tick loop');
                    ctx.fillStyle ='black';
                    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
                }
                else{
                    var td = progress/1000; // in seconds
                    //console.log(td);
                    //console.log('into gf');
                    //ctx.fillStyle = 'red';
                    handler(td);
                    window.requestAnimationFrame(currentGameLoop);
                }
            };
        },
        golden_fire:function(){
            var MAX_PARTICLES = 100000;
            var NFIELDS = 5;//x,y,vx,vy,age
            var PARTICLES_LENGTH = MAX_PARTICLES * NFIELDS;

            var particles = new Float32Array(PARTICLES_LENGTH);
            var particles_i = 0;

            var MAX_AGE = 6;
            var gravity = 20;
            var drag = 0.99;
            var r = 120;
            var g = 55;
            var b = 10;
            var PARTICLE_NUM = 250;
            var emitX = 0, emitY = 0;
            emitX = ctx.canvas.width/2;
            emitY = ctx.canvas.height/3;

            function getXy(event){
                emitX = event.clientX;
                emitY = event.clientY - jq('#board-canvas').offset().top;
                console.log(emitX + ' ' + emitY);
            }
            //
            jq('#board-canvas').click(function(event){
                event.preventDefault();
                console.log('board-canvas clicked');
                getXy(event);
                //event.preventDefault();
            });
            jq('#board-canvas').on('touchstart',function(event){
                event.preventDefault();
                console.log('board-canvas touched');
                console.log(event);
                console.log(event.originalEvent.changedTouches[0]);
                getXy(event.originalEvent.changedTouches[0]);
                //event.preventDefault();
            });
            
            //
            function emit(x, y){
                for(var i=0; i< PARTICLE_NUM; i++){
                    particles_i = (particles_i + NFIELDS)% PARTICLES_LENGTH;
                    particles[particles_i] = x;
                    particles[particles_i + 1] = y;
                    var alpha = fuzzy(Math.PI),
                        radius = Math.random()*150,
                        vx = Math.cos(alpha) * radius,
                        vy = Math.tan(alpha) * radius,
                        age = Math.random();
                    particles[particles_i + 2] = vx;
                    particles[particles_i + 3] = vy;
                    particles[particles_i + 4] = age;
                }
            }
            
            return function(td){
                //console.log(td + 'golden_fire');
                emit(emitX,emitY);

                ctx.fillStyle = 'rgba(0,0,0,0.4)';
                ctx.fillRect(0,0, ctx.canvas.width, ctx.canvas.height);
                var imgdata = ctx.getImageData(0,0,ctx.canvas.width, ctx.canvas.height);
                var data = imgdata.data;

                for(var i=0; i< PARTICLES_LENGTH;i+= NFIELDS){
                    if( (particles[i+4] += td) > MAX_AGE){
                        continue;
                    }
                    // Math.ceil
                    var x = ~~(particles[i]= (particles[i]+
                                              (particles[i+2]*=drag)*td));
                    var y = ~~(particles[i+1] = (particles[i+1]+
                                                 (particles[i+3]=(particles[i+3] + gravity*td)*drag)*td));
                    // check bounds
                    if( x<0||x>=ctx.canvas.width||y<0||y>=ctx.canvas.height){
                        continue;
                    }
                    //calculate offset, 4 is rgba size
                    var offset = (x + y*ctx.canvas.width) * 4;

                    // set pixel
                    data[offset] += r;
                    data[offset +1] +=g;
                    data[offset +2] +=b;
                    // data[offset+4] += r;
                    // data[offset +5] +=g;
                    // data[offset +6] +=b;
                }//end of for

                ctx.putImageData(imgdata, 0, 0);
            };                
        },
        
        water_ripple:function(){
            return function(td){
                console.log(td + 'water_ripple');
            };
        },
        tracking_trace:function(){
            return function(td){
                console.log(td + 'tracking_trace');
            };
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
        console.log('into document ready');
        console.log('header height is :' + jq('#home-header').height());
        canvas = document.getElementById('board-canvas');
        ctx = canvas.getContext('2d');
        ctx.canvas.width = window.innerWidth;

        ctx.fillStyle = 'black';
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);

        jq('#board').on('pageshow',function(event){
            ctx.canvas.height = window.innerHeight - jq('#board-header').outerHeight()- jq('#board-footer').outerHeight() - 4;
            console.log('board in->');
            console.log(jq('#board-header').height());
            console.log(jq('#board-footer').height());
            isAnimationRunning = true;
            //start the sim here, based on SimuName
            //ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
            start = false;
            console.log(currentSimu);
            currentGameLoop = splash.createGameLoop(currentSimu);
            window.requestAnimationFrame(currentGameLoop);

        }).on('pagehide',function(event){
            console.log('board out');
            //event.preventDefault();
            //end the sim, or pause the sim, for simplicity
            // I will end the sim
            currentGameLoop = null;
            isAnimationRunning = false;

        });

        // or I insert a button press callback
        
        

        jq('#simu-list .simu-item').click(
            function(event){
                console.log(jq(this).children('.note').html());
                currentSimu = jq(this).children('.note').html().replace(/\s+/g,'');
                currentSimuName = jq(this).children('h4').html();
                console.log(currentSimuName);
                //event.preventDefault();

                // change board title according to simu name
                jq('#board-header h1').html(currentSimuName);

                
            }
        );

    });

})();

