"use strict";

var gl;
var theta = [0,0,0];
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = 0;

var space_bar = 0;

var x = [0,0,0];
var y=0;
var z=0;

var modelViewMatrix;
var modelViewMatrixLoc;
var translationMatrix = mat4();
var scaleMatrix = mat4();

var eye = vec3(1, 1, 1);  // 카메라 위치
var at = vec3(0, 0, 0);   // 타겟 위치
var up = vec3(1, 0, 0);   // 위쪽 벡터
var viewMatrix = mat4();
 
var pMatrix = mat4();
var mvMatrix = mat4();
var viewMatrixLoc =0;

var vertices;

var rot_x=true;
var rot_y=true;
var rot_z=true;
var rot_xyz = true;

var move =0;
var count=0;
var time =0;

var a ,b;
      a = Math.random()*0.01;
      b=Math.random()*0.01;
var sc_d=true;
var sc_u = true;
var scX = [0.9,0.9,0.9]
var scY =0;
var scZ=0;
var scX_U = [1.1,1.1,1.1]

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

     vertices = [
      
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

        vec2(-0.5,  -0.25), // index 23 
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

        vec2(0.25/2,  0.5), // index 36
        vec2(-0.25/2,  0.5),
        vec2(0.25/2,  0.75),
        vec2(0.25/2,  0.25),
        

        /*vec4(0.,  0.,0.,1), // index 0 K
        vec4(-0.5,  -0.25,0.,1),
        vec4(-0.5,   0.25,0.,1),
        vec4(-0.5,   0.,0.,1),
        vec4( -0.25,  0.25,0.,1),
        vec4(-0.5,   0.,0.,1),
        vec4( -0.25,  -0.25,0.,1),

        vec4(0.,  0.5,0.,1), // index 7 H
        vec4(-0.25/2,  0.75,0.,1),
        vec4(-0.25/2,  0.25,0.,1),
        vec4(-0.25/4,  0.5,0.,1),
        vec4(0.25/2,  0.25,0.,1),
        vec4(0.25/4,  0.5,0.,1),
        vec4(0.25/2,  0.75,0.,1),
        vec4(-0.25/2,  0.5,0.,1),
        vec4(0.25/2,  0.5,0.,1),

        vec4(0.5,  0.25,0.,1),// index 16 S
        vec4(0.35,  0.20,0.,1),
        vec4(0.25,  0.25/2,0.,1),
        vec4(0.40,  0.25/3,0.,1),
        vec4(0.5,  0.0,0.,1),
        vec4(0.5,  -0.25/3,0.,1),
        vec4(0.25,  -0.25,0.,1),

        vec4(-0.5,  -0.25,0.,1), // index 23 
        vec4(-0.45,  -0.25/2,0.,1),
        vec4(-0.5,   0.,0.,1),
        vec4(-0.45,  -0.25/2,0.,1),
        vec4( -0.25,  -0.25,0.,1),
        vec4( -0.5,  0.25,0.,1),
        vec4( -0.45,  0.25/2,0.,1),
        vec4(-0.5,   0.,0.,1),
        vec4( -0.45,  0.25/2,0.,1),
        vec4( -0.25,  0.25,0.,1),
        
        vec4( -0.45,  0.05,0.,1), //index 33
        vec4( -0.5,  0.0,0.,1),
        vec4( -0.45,  -0.05,0.,1),

        vec4(0.25/2,  0.5,0.,1), // index 36
        vec4(-0.25/2,  0.5,0.,1),
        vec4(0.25/2,  0.75,0.,1),
        vec4(0.25/2,  0.25,0.,1),
      */
    ]
 
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 85., 0.23, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    modelViewMatrix = mat4();
    modelViewMatrixLoc = gl.getUniformLocation(program,"modelViewMatrix");





    gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(modelViewMatrix));
   
   viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
   gl.uniformMatrix4fv(viewMatrixLoc, false, flatten(viewMatrix));
    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );


    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    document.addEventListener("keyup", function(event) { // 키보드 눌렸을때
        if (event.code === "Space") {
          //console.log("Space bar"); // space bar을 눌렀다면
          space_bar +=  1; // space bar의 상태를 반대 상태로 만들기
        }
      });

      document.getElementById("Rotaion X").onclick = function(){
        rot_x = !rot_x;
        rot_y = true;
        rot_z = true;
        console.log(rot_x);
    }
    document.getElementById("Rotaion Y").onclick = function(){
      rot_y = !rot_y;
      rot_x = true;
      rot_z = true;
      console.log(rot_y);
  }
  document.getElementById("Rotaion Z").onclick = function(){
    rot_z = !rot_z;
    rot_x = true;
    rot_y =true;
    console.log(rot_z);
}
document.getElementById("Rotaion XYZ").onclick = function(){
  rot_xyz = !rot_xyz;
  console.log(rot_xyz);
}
document.getElementById("Translation").onclick = function(){
  move +=1;
  console.log(move);
}
document.getElementById("Scale Down").onclick = function(){
  sc_d=!sc_d;
  console.log(move);
}
document.getElementById("Scale Up").onclick = function(){
  sc_u =!sc_u;
  console.log(move);
}

    render();
};


function render() {
    gl.enable(gl.DEPTH_TEST);
       gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
       
       //theta[xAxis] +=2.0;
       //theta[yAxis] +=2.0;
       //theta[zAxis] +=2.0;
      
      

      if(!rot_x){
        rot_y = true;
        rot_z = true;
        theta[xAxis] +=1.0;
        modelViewMatrix = rotateX(theta[xAxis]);
      }

      if(!rot_y){
        rot_x = true;
        rot_z = true;
        theta[yAxis] +=1.0;
        modelViewMatrix = rotateY(theta[yAxis]);
      }

      if(!rot_z){
        rot_x = true;
        rot_y = true;
        theta[zAxis] +=1.0;
        modelViewMatrix = rotateZ(theta[zAxis]);   
      }
      
      if(!rot_xyz){
        rot_x = true;
        rot_y = true;
        rot_z = true;

        theta[xAxis]+=1.0;
        theta[yAxis] +=1.0;
        theta[zAxis] +=1.0;
        modelViewMatrix = rotateX(theta[xAxis]);
        modelViewMatrix = rotateY(theta[yAxis]);
        modelViewMatrix = rotateZ(theta[zAxis]);
        modelViewMatrix = mult(modelViewMatrix, rotateY(theta[yAxis]));
        modelViewMatrix = mult(modelViewMatrix, rotateY(theta[zAxis]));
      }


    if(move % 3 == 1){
      x[0] = a;
      x[1] = b;
      //x[2] = a;
      translationMatrix = translate(x,y,z);
      modelViewMatrix = mult(modelViewMatrix, translationMatrix);
    }else if(move % 3 ==  2){
      x[0] = -a;
      x[1] = -b;
     // x[2] = -a;
      translationMatrix = translate(x,y,z);
      modelViewMatrix = mult(modelViewMatrix, translationMatrix);
    }else if(move % 3 ==0){
       move ==0;
    }

    if(!sc_d){
      scaleMatrix = scalem(scX,scY,scZ,);
   modelViewMatrix = mult(modelViewMatrix, scaleMatrix);
   sc_d = true;
   if(!rot_x){
    modelViewMatrix = mult(modelViewMatrix, rotateX(theta[xAxis]));
   }
    }

    
   if(!sc_u){
      scaleMatrix = scalem(scX_U,scY,scZ,);
   modelViewMatrix = mult(modelViewMatrix, scaleMatrix);
   sc_u = true;
   if(!rot_x){
    modelViewMatrix = mult(modelViewMatrix, rotateX(theta[xAxis]));
   }
    }
    //modelViewMatrix = mult(modelViewMatrix, rotateY(theta[zAxis]));

    
    
     gl.drawArrays( gl.LINES, 1, 2 );
     gl.drawArrays( gl.LINES, 3, 2 );
     gl.drawArrays( gl.LINES, 5, 2 );
 
    
     gl.drawArrays( gl.TRIANGLES, 8, 3 );
     gl.drawArrays( gl.TRIANGLES, 11, 3 );
     gl.drawArrays( gl.LINES, 14, 2 );
     
 
     gl.drawArrays( gl.LINE_STRIP, 16, 7 );
     gl.drawArrays( gl.TRIANGLES, 16, 3 );
     gl.drawArrays( gl.TRIANGLES, 18, 3 );
     gl.drawArrays( gl.TRIANGLES, 20, 3 );
 
     gl.drawArrays( gl.TRIANGLES, 23, 3 );
     gl.drawArrays( gl.TRIANGLES, 25, 3 );
     gl.drawArrays( gl.TRIANGLES, 28, 3 );
     gl.drawArrays( gl.TRIANGLES, 30, 3 );
 
     
     gl.drawArrays( gl.TRIANGLES, 33, 3 );
gl.uniformMatrix4fv(modelViewMatrixLoc,false,flatten(modelViewMatrix));
    requestAnimationFrame(render);

}

