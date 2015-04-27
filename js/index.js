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
//spark.onload = main;
//spark.src = '/img/spark.png';


function init(){
  document.addEventListener('deviceready',onDeviceReady,false);
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
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.strokeStyle = 'rgb(255,0,0)';
  //ctx.drawImage(spark, 200, 200);

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
        particle.velocity.x = fuzzy(100);
        particle.velocity.y = fuzzy(100);
        particle.image = spark;
        system.particles.push(particle);
    }
}

function gameloop(){
  console.log('into gameloop');
  emit(system, ctx.canvas.width,ctx.canvas.height);

  idRunning = window.setInterval(function() {
                // 1 in 100
                if( isAnimationRunning === false){
                  window.clearInterval(idRunning);
                  console.log('out of tick loop');
                }
                console.log('tick');
                if(Math.random() < 0.1){
                    emit(system, ctx.canvas.width, ctx.canvas.height);
                }
                system.update(1/30);
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                renderCanvasImage(ctx, system.particles);
              }, 1000/10); 
}

