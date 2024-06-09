"use strict";

var gl;
var theta =0.0; 
var thetaLoc;
var direction = true;
var speed = 0.00;
var space_bar = true;


window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var vertices = [
        vec2(0.,  0.), // index 0 K
        vec2(-0.5,  -0.25),
        vec2(-0.5,   0.25),
        vec2(-0.5,   0.),
        vec2( -0.25,  0.25),
        vec2(-0.5,   0.),
        vec2( -0.25,  -0.25),

        vec2(0.,  0.5), // index 7 H
        vec2(-0.25/2,  0.75),
        vec2(-0.25/2,  0.25),
        vec2(-0.25/4,  0.5),
        vec2(0.25/2,  0.25),
        vec2(0.25/4,  0.5),
        vec2(0.25/2,  0.75),
        vec2(-0.25/2,  0.5),
        vec2(0.25/2,  0.5),

        vec2(0.5,  0.25),// index 16 S
        vec2(0.35,  0.20),
        vec2(0.25,  0.25/2),
        vec2(0.40,  0.25/3),
        vec2(0.5,  0.0),
        vec2(0.5,  -0.25/3),
        vec2(0.25,  -0.25),

        vec2(-0.5,  -0.25), // index 23 K 삼각형
        vec2(-0.45,  -0.25/2),
        vec2(-0.5,   0.),
        vec2(-0.45,  -0.25/2),
        vec2( -0.25,  -0.25),
        vec2( -0.5,  0.25),
        vec2( -0.45,  0.25/2),
        vec2(-0.5,   0.),
        vec2( -0.45,  0.25/2),
        vec2( -0.25,  0.25),
        vec2( -0.45,  0.05), //index 33 
        vec2( -0.5,  0.0),
        vec2( -0.45,  -0.05),

        vec2(0.25/2,  0.5), // index 36 H 삼각형
        vec2(-0.25/2,  0.5),
        vec2(0.25/2,  0.75),
        vec2(0.25/2,  0.25),

    ];

  

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0., 0., 0.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    thetaLoc = gl.getUniformLocation(program, "theta");

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );


    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    document.getElementById("Stop").onclick = function(){ // 버튼이 클릭되면 
        direction = !direction; // direction을 반대상태로 만들기 
    }
   document.getElementById("slider").oninput = function(){
     speed = parseFloat(slider.value);  // speed에 slier 게이지의 값을 반환하기 
    }
    document.addEventListener("keyup", function(event) { // 키보드 눌렸을때
        if (event.code === "Space") {
          //console.log("Space bar"); // space bar을 눌렀다면
          space_bar = !space_bar; // space bar의 상태를 반대 상태로 만들기
        }
      });

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    theta +=(direction ? speed : 0.0); // direction이 true면 speed를 theta에 더하기, direction이 false면 0을 넣어서 정지시키기
    gl.uniform1f(thetaLoc,theta);

    if(space_bar){ //space_bar가 True면 이니셜이 채워져 있음
        // K부분
    gl.drawArrays( gl.LINES, 1, 2 );
    gl.drawArrays( gl.LINES, 3, 2 );
    gl.drawArrays( gl.LINES, 5, 2 );

    gl.drawArrays( gl.TRIANGLES, 23, 3 );
    gl.drawArrays( gl.TRIANGLES, 25, 3 );
    gl.drawArrays( gl.TRIANGLES, 28, 3 );
    gl.drawArrays( gl.TRIANGLES, 30, 3 );
    gl.drawArrays( gl.TRIANGLES, 33, 3 );

    // H 부분
    gl.drawArrays( gl.TRIANGLES, 8, 3 );
    gl.drawArrays( gl.TRIANGLES, 11, 3 );
    gl.drawArrays( gl.LINES, 14, 2 );
   
    //S 부분
    gl.drawArrays( gl.LINE_STRIP, 16, 7 );
    gl.drawArrays( gl.TRIANGLES, 16, 3 );
    gl.drawArrays( gl.TRIANGLES, 18, 3 );
    gl.drawArrays( gl.TRIANGLES, 20, 3 );

   

    
}else{// space_bar가 false면 점과 선으로만 이루어진 이니셜로 바뀌게 함
    
    // K
    gl.drawArrays( gl.POINTS, 1, 6);
    gl.drawArrays( gl.LINES, 1, 6);  
    
    // H
    gl.drawArrays( gl.POINTS, 8, 8 ); 
    gl.drawArrays( gl.LINES, 8, 2); 
    gl.drawArrays( gl.LINES, 36, 2); 
    gl.drawArrays( gl.LINES, 38, 2);
    
    // S
    gl.drawArrays( gl.POINTS, 16, 7 ); 
    gl.drawArrays( gl.LINE_STRIP, 16, 7);
    
}

    window.requestAnimFrame(render);
}