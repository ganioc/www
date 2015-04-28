
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var isPhoneGapReady = false;
var isAnimationRunning = false;
var canvas = null; //document.getElementById("Canvas01");
var ctx = null;    //canvas.getContext("2d");
var system = new ParticleSystem();
var idRunning = null;
var spark = new Image();
var spark_g = new Image();
//spark.onload = main;
//spark.src = '/img/spark.png';
var start = null;

function accelerationf(force){
  return function(particle,td){
    particle.velocity.iadd(force.muls(td));
  };
}

function help(){
    var p=2;
    p = Math.cos();
    Math.sin();
}

var gravity =  accelerationf(new Vec2(0,-10));


function init(){
  document.addEventListener('deviceready',onDeviceReady,false);
  system.forces.push(gravity);
}

function onDeviceReady(){
  isPhoneGapReady = true;
  console.log('deviceReady is triggered.');
  //var pElement = document.getElementById('field-ready');
  //pElement.setAttribute('style','display:block;');
}


window.onload = init;

$(document).ready(function(){

  canvas = document.getElementById('grid');
  ctx = canvas.getContext('2d');


  console.log('jquery ready');
  console.log(window.innerWidth);
  console.log(window.innerHeight);

  $('#fire-canvas').click(function(){
    console.log('In canvas fire');
    console.log('page width:' + window.innerWidth);
    console.log('page height:' + window.innerHeight);
    console.log('header height:' + $('#canvas-header').height());
    console.log('header height:' + $('#canvas-footer').height());

    //canvas.width(window.innerWidth);
    //canvas.height(window.innerHeight - $('#canvas-header').height() - $('#canvas-footer').height());

    console.log('canvas width:' + ctx.canvas.width);
    console.log('canvas height:' + ctx.canvas.height);

  });

  $('#btn-canvas').click(function(){
    console.log('In canvas btn');
    console.log('page width:' + window.innerWidth);
    console.log('page height:' + window.innerHeight);
    console.log('header height:' + $('#canvas-header').height());
    console.log('header height:' + $('#canvas-footer').height());
    

  });

  $('#canvas').on('pageshow',function(event){
    console.log('into pageshow-----------------');
    resizeCanvas();
    isAnimationRunning = true;

    //emit(system,ctx.canvas.width, ctx.canvas.height);
    //ctx.drawImage(spark,100,100);
    spark= new Image();
    spark_g = new Image();
    spark_g.src = 'img/spark_g.png';
    spark.src = 'img/spark.png';
    spark.onload = gameloop;

  }).on('pagehide',function(event){
    console.log('leave page---------');
    isAnimationRunning = false;
  });


});

function resizeCanvas(){
  console.log('into resizeCanvas');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - $('#canvas-header').height() - $('#canvas-footer').height()-8;  

  console.log('page width:' + window.innerWidth);
  console.log('page height:' + window.innerHeight);
  console.log('canvas width:' + ctx.canvas.width);
  console.log('canvas height:' + ctx.canvas.height);

  drawCanvas();
}

function drawCanvas(){
  ctx.fillStyle = 'rgba(0,0,0, 1)';
  ctx.strokeStyle = 'rgb(255,0,0)';
  //ctx.drawImage(spark, 200, 200);
    Math.cos(1);

  // ctx.fillRect(10, 10, 50, 50);

  // ctx.beginPath();
  // ctx.moveTo(0.5,0.5);
  // ctx.lineTo(100,200);
  // ctx.lineTo(ctx.canvas.width,ctx.canvas.height-0.5);

  // ctx.strokeRect(0.5,0.5,ctx.canvas.width-0.5,ctx.canvas.height-1);

  
  // ctx.stroke();
}

/////////////////////
// animation system
/////////////////////

function emit(system, width, height){
  var position =  new Vec2(Math.random()*width, Math.random()*height);
  for(var i = 0; i < 100; i++) {
    var particle = new Particle(position.copy());
    var speed = fuzzy(30);
    var direction = fuzzy(Math.PI*2);
    particle.velocity.x = speed*Math.cos(direction);//fuzzy(50);
    particle.velocity.y = speed*Math.sin(direction);//fuzzy(50);
    //particle.angularVelocity = Math.PI*50;
    if(Math.random()<0.8){
      particle.image = spark;
    }
    else{
      particle.image = spark_g;
    }
    particle.maxAge = fuzzy(1,4);
    system.particles.push(particle);
  }
}

function gameloop(){
  window.requestAnimationFrame(lowerloop);
  console.log('into gameloop');
}

function lowerloop(timestamp){
  if(!start){
    start = timestamp;
  }
  var progress = timestamp - start;
  start = timestamp;

  if( isAnimationRunning === false){
    console.log('out of tick loop');
  }
  else{
    //console.log('tick');
    //console.log(progress/1000000);
    var td = progress/1000;// us to second
    console.log(td);
    if(Math.random() < 0.01){
      emit(system, ctx.canvas.width, ctx.canvas.height);
    }
    system.update(td);

    // draw background
    ctx.fillStyle= 'rgba(0,0,0,0.2)';
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.globalCompositeOperation = 'lighter';

    // draw particles
    renderCanvasImage(ctx, system.particles,6);

    ctx.globalCompositeOperatoin = 'source-over';
    
    window.requestAnimationFrame(lowerloop);
  }

}
