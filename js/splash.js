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
            else if(simu === 'rainbow_band'){
                handler = splash.rainbow_band();
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

            jq('#board-setting').attr('href','#golden-firework-setting');
            
            //
            function emit(x, y){
                for(var i=0; i< PARTICLE_NUM; i++){
                    particles_i = (particles_i + NFIELDS)% PARTICLES_LENGTH;
                    particles[particles_i] = x;
                    particles[particles_i + 1] = y;
                    var alpha = fuzzy(Math.PI),
                        radius = Math.random()*500,
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
                }//end of for

                ctx.putImageData(imgdata, 0, 0);
            };                
        },
        
        rainbow_band:function(){
            var NFIELDS = 5; // x,y, vx, vy,age,

            var MAX_PARTICLES = 9; // to decide the band number
            
            var HEIGHT = Math.floor(ctx.canvas.height/ MAX_PARTICLES);
            HEIGHT = (HEIGHT%2 === 0)?HEIGHT:(HEIGHT -1);
            console.log('HEIGHT is:' + HEIGHT);
            //var SPEED = 2; //Math.floor(HEIGHT/SPEED_NUM);
            var RAINBOW_SPEED = 80;
            var RAINBOW_DELTA = 0;
            var thresh = -HEIGHT;
            var PARTICLES_LENGTH = (MAX_PARTICLES + 2);

            function Particle(){
                var x,y,vx,vy,color;
            }
            var particles = [];
            for(var i =0; i< PARTICLES_LENGTH; i++){
                particles.push(new Particle());
            }
            var particles_i = 0 ;
            var bEmit = true;
            
            jq('#board-setting').attr('href','#water-ripple-setting');

            function Monkey(option){
                this.x = option.x||ctx.canvas.width/2;
                this.y = option.y||0;
                this.width = option.width||10;
                this.height = option.height||20;
                this.size = 1;
                this.color = 'white';
                this.speed = option.speed||300;
                this.xspeed = 0;
                this.state = 'crouch';// fall, crouch, jump ... state
                this.crouch_i = option.crouch_i||0;
            };
            // Monkey.prototype.width = 10;
            // Monkey.prototype.height = 20;
            Monkey.prototype.update = function(td){
                
                if(this.state === 'crouch'){
                    //console.log('::' + y_temp);
                    this.y += particles[this.crouch_i].vy * td;
                    //console.log(':' + y_temp);
                    if( particles[this.crouch_i].y + HEIGHT >= ctx.canvas.height){
                        this.state = 'jump';
                        if(this.x < (ctx.canvas.width/2 - 5)){
                            this.xspeed = 20;
                        }
                        else if( this.x > (ctx.canvas.width/2 + 5)){
                            this.xpeed = -20;
                        }
                        else{
                            this.xpeed = 0;
                        }
                    }
                }
                else if( this.state === 'jump'){
                    this.y = this.y - this.speed * td;
                    this.x = this.x + this.xspeed * td;

                    var _y = this.y,
                        _height = this.height;
                    

                    
                    if( this.y < ctx.canvas.height/2){
                        var _index = _.findIndex(particles,function(c){
                            var distance = _y + _height - c.y - HEIGHT/2;
                            //console.log('dist:' + distance);
                            if(Math.abs(distance) < HEIGHT/4){
                                return true;
                            }
                            else return false;
                        });

                        if(_index !== -1 && Math.random()>0.9){
                            this.crouch_i = _index;
                            this.state = 'crouch';
                        }
                        
                    }
                    else if( this.y <0){
                        console.log('into <0');
                        var index = _.findIndex(particles, function(c){
                            if(c.y <=0){
                                return true;
                            }else{
                                return false;
                            }
                        });
                        if(index != -1){
                            console.log('not -1');
                            this.crouch_i = index;
                            this.state = 'crouch';
                        }
                        else{
                            console.log('is -1');
                            this.crouch_i = 0;
                            this.state = 'crouch';
                        }
                    }
                    
                }

                // this.my = y_temp;
            };
            
            Monkey.prototype.draw = function(){
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x,this.y,this.width*this.size,this.height*this.size);
                
            };

            var monkey1 = null;
            //window.setTimeout();

            // to generate the color in emit
            var createColor = function(){
                var tick = 0;
                var COLOR_SPACING = 5;
                var COLOR_STEP = 0xff/COLOR_SPACING;
                
                var color_list = new Array();
                var color_list_index=0;

                for(var i =0; i< COLOR_SPACING;i ++){
                    for( var j=0; j< COLOR_SPACING; j++){
                        for( var k=0; k< COLOR_SPACING; k++){
                            var r = i*COLOR_STEP;
                            var g = j*COLOR_STEP;
                            var b = k*COLOR_STEP;
                            color_list[color_list_index] = r<<16|b<<8|g;
                            color_list_index += 1;
                        }
                    }
                }
                color_list_index = ~~(Math.random()*color_list.length) -1;
                
                return function (){
                    tick += 1;
                    if( true ){
                        color_list_index += 1;
                        if(color_list_index >= color_list.length){
                            color_list_index = 0;
                        }
                    }
                    return color_list[color_list_index];
                };
            };// endof createColor

            var color = createColor();
            
            function emit(td,delta){
                //console.log(angle.toString(16));
                particles[particles_i].x = 40;     //x
                particles[particles_i].y = -HEIGHT + delta;
                particles[particles_i].vx = 0;   //vx
                particles[particles_i].vy = RAINBOW_SPEED;  //vy
                particles[particles_i].color = color(); //
                
                particles_i = (particles_i + 1)%PARTICLES_LENGTH;
            }

            return function(td){
                ctx.fillStyle = 'rgba(0,0,0,1)';
                ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

                thresh += RAINBOW_SPEED * td;
                if( thresh >= 1){
                    //bEmit = true;
                    emit(td, thresh);
                    thresh = -HEIGHT;
                    //RAINBOW_DELTA = thresh;
                    if(!monkey1){
                        monkey1 = new Monkey({
                            x:particles[0].x + Math.random()* ctx.canvas.width/2,
                            y:particles[0].y + HEIGHT/2 -20,
                            crouch_i:0,
                            width:10,
                            height:20,
                            speed: 300

                        });
                    }
                }
                
                for(var i=0;i < PARTICLES_LENGTH;i++){
                    var x = particles[i].x;
                    var y = particles[i].y;

                    var color = particles[i].color;

                    if(particles[i].vy> 0){
                        var str = color.toString(16);
                        if(str.length === 2){
                            str = '0000' + str;
                        }
                        else if(str.length === 4){
                            str = '00' + str;
                        }
                        
                        ctx.fillStyle = '#' + str; //
                        ctx.fillRect(x, y, ctx.canvas.width - x*2, HEIGHT);
                        
                        particles[i].y = particles[i].y + RAINBOW_SPEED*td;
                        
                    }
                }// end of for
                if(monkey1){
                    monkey1.update(td);
                    monkey1.draw();
                }

            };
        },
        tracking_trace:function(){
            return function(td){
                return 0;
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
            ctx.canvas.height = window.innerHeight - jq('#board-header').outerHeight()- jq('#board-footer').outerHeight() ;
            console.log('board in->');
            // console.log(jq('#board-header').height());
            // console.log(jq('#board-footer').height());
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

