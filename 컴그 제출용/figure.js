"use strict";

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
];



var torsoId = 0; // 토르소 몸통 전체
var headId  = 1; //
var head1Id = 1; // 양옆
var head2Id = 10; // 고개 위아래
var leftUpperArmId = 2; // 왼쪽 긴팔
var leftLowerArmId = 3; // 왼존 짧은팔
var rightUpperArmId = 4; // 오른쪽 긴팔
var rightLowerArmId = 5; //  오른쪽 짧은팔
var leftUpperLegId = 6; // 왼쪽 긴다리
var leftLowerLegId = 7; // 왼쪽 짧은다리
var rightUpperLegId = 8; // 오른쪽 긴다리
var rightLowerLegId = 9; // 오른쪽 짧은다리 
var UpperTailId = 11; // 위꼬리
var LowerTailId = 12; // 아래꼬리
var leftlowerlegId2 = 13;
var rightlowerlegId2 =14; 
var CapId = 15;


var torsoHeight = 5.0;
var torsoWidth = 1.0;
var upperArmHeight = 3.0;
var lowerArmHeight = 2.0;
var upperArmWidth  = 0.5;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.5;
var lowerLegWidth  = 0.5;
var lowerLegHeight = 2.0;
var upperLegHeight = 3.0;
var headHeight = 1.5;
var headWidth = 1.0;
var tailWidth = 1.0;
var tailHeight = 3.0;

var numNodes = 14;
var numAngles = 16;
var angle = 0;

var theta = [0, 0, -180, -90, -180, -90, 180, 90, 180, 90, 0,90,180,0,0,0,0];

var numVertices = 24;

var stack = [];

var figure = [];

var near = 0.3;
var far = 3.0;
var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);


for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];

var sbar = true;

//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child){ // 
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}


function initNodes(Id) {

    var m = mat4();

    switch(Id) {

    case torsoId:

    m = rotate(theta[torsoId], 0, 1, 0 );
    figure[torsoId] = createNode( m, torso, null, headId );
    break;

    case headId:
    case head1Id:
    case head2Id:


    m = translate(0.0, torsoHeight+0.5*headHeight, 0.0);
	m = mult(m, rotate(theta[head1Id], 1, 0, 0))
	m = mult(m, rotate(theta[head2Id], 0, 1, 0));
    m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[headId] = createNode( m, head, leftUpperArmId, CapId);
    break;

   

    case leftUpperArmId:

    m = translate(-(1.5*torsoWidth+upperArmWidth), 0.9*torsoHeight, 0.0);
	m = mult(m, rotate(theta[leftUpperArmId], 1, 0, 0));
    figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;

    case rightUpperArmId:

    m = translate(1.5*torsoWidth+upperArmWidth, 0.9*torsoHeight, 0.0);
	m = mult(m, rotate(theta[rightUpperArmId], 1, 0, 0));
    figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;

    case leftUpperLegId:

    m = translate(-(0.8*torsoWidth+upperLegWidth), 0*upperLegHeight, 0.0);
	m = mult(m , rotate(theta[leftUpperLegId], 1, 0, 0));
    figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:
    m = translate(0.8*torsoWidth+upperLegWidth, 0*upperLegHeight, 0.0);
	m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
    figure[rightUpperLegId] = createNode( m, rightUpperLeg,  UpperTailId, rightLowerLegId );
    break;

    case leftLowerArmId:

    m = translate(0.0, 1.2*upperArmHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerArmId], 1, 0, 0));
    figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;

    case rightLowerArmId:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerArmId], 1, 0, 0));
    figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;

    case leftLowerLegId:
    case leftlowerlegId2:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerLegId], 1, 0, 0));
    m = mult(m, rotate(theta[leftlowerlegId2], 0, 0, 1));
    figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
    break;

    case rightLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
    figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
    break;

        
    case UpperTailId:
        m = translate( -0, 0, 0.0);
        m = mult(m, rotate(theta[UpperTailId], 1, 0, 0));
        figure[UpperTailId] = createNode(m, UpperTail, null, LowerTailId);
        break;
     

    case LowerTailId:
    //m = translate(0, 1.4*tailHeight, -1.8*torsoWidth);
    //theta[LowerTailId] = 30
    m = translate(0, -0.5*tailHeight, 0);
    m = mult(m, rotate(theta[LowerTailId], 0, 0, 1));
    figure[LowerTailId] = createNode( m, LowerTail, null, null );
    
    case CapId:
        m = translate(0.0, 0.0, 0.0);
        m = mult(m, rotate(theta[CapId], 0, 1, 0))
        m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
        figure[CapId] = createNode( m, Cap, null, null);
        break;

    }

}

function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( 3*torsoWidth, torsoHeight,3*torsoWidth));
    //instanceMatrix = mult(instanceMatrix, scale4( 3*torsoWidth, torsoHeight,3* torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(1.5*upperArmWidth, 1.5*upperArmHeight, 1.5*upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.7 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(1.5*lowerArmWidth,1.5* lowerArmHeight, 1.5*lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(1.5*upperArmWidth, 1.5*upperArmHeight, 1.5*upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.7 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(1.5*lowerArmWidth,1.5* lowerArmHeight, 1.5*lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function  leftUpperLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.45 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(3*upperLegWidth,1.5* upperLegHeight, 2*upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, -0.5) );
	instanceMatrix = mult(instanceMatrix, scale4(2*lowerLegWidth, 1.5*lowerLegHeight, 2*lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.45 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(2*upperLegWidth,1.5* upperLegHeight, 2*upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function rightLowerLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, -0.5) );
	instanceMatrix = mult(instanceMatrix, scale4(2*lowerLegWidth, 1.5*lowerLegHeight, 2*lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function UpperTail() {
    instanceMatrix = mult(modelViewMatrix, translate(0, 0, -1.3*torsoWidth) );
	instanceMatrix = mult(instanceMatrix, scale4(2*tailWidth, 0.5*tailHeight, tailWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function LowerTail() {

    instanceMatrix = mult(modelViewMatrix, translate(0, 0 ,-1.3*torsoWidth) );
	instanceMatrix = mult(instanceMatrix, scale4(tailWidth, 1*tailHeight, tailWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function Cap() {

    instanceMatrix = mult(modelViewMatrix, translate(0, 0.5*torsoHeight ,0) );
	instanceMatrix = mult(instanceMatrix, scale4(3*headWidth,0.5*headHeight, 3*headWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}



function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     pointsArray.push(vertices[b]);
     pointsArray.push(vertices[c]);
     pointsArray.push(vertices[d]);
}


function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {
    
    canvas = document.getElementById( "gl-canvas" );
    aspect =  canvas.width/canvas.height;
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");
    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
    modelViewMatrix = mat4();


    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

    cube();

    vBuffer = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    for(i=0; i<numNodes; i++) initNodes(i);
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
          sbar = !sbar;
          console.log('sBar:',sbar) ;
        }
      }); 
    render();
}
var radius = 25.0;
var theta1  = 0.0;
var phi = 0.0;
var MUT= 1;
var MLT = 1;
var MAL = 1;
var MAR = -1;
var MLL = 1;
var MRL = -1;
var RC = 1;


function MoverUpperTail(){
    if( theta[UpperTailId] == 90) MUT = -1;
    else if( theta[UpperTailId] == 30) MUT = 1;
    theta[UpperTailId] += MUT*0.5;
        initNodes(UpperTailId);
    }


function MoveLowerTail(){
    if( theta[LowerTailId] == 90) MLT = -1;
    else if( theta[LowerTailId] == 30) MLT = 1;
    theta[LowerTailId] += MLT*0.5;
        initNodes(LowerTailId);
}

function MoveArm(){
    if(theta[leftUpperArmId] == -130 ) MAL = -1;
    if(theta[leftUpperArmId] == -230 ) MAL = 1;
theta[leftUpperArmId] +=0.5*MAL;
theta[leftLowerArmId] +=0.5*MAL;
//console.log(theta[leftUpperArmId]);
initNodes(leftUpperArmId);
initNodes(leftLowerArmId);
if(theta[rightUpperArmId] == -230 ) MAR = 1;
if(theta[rightUpperArmId] == -130 ) MAR = -1;

theta[rightUpperArmId] +=0.5*MAR;
theta[rightLowerArmId] +=0.5*MAR;
//console.log(theta[rightUpperArmId]);
initNodes(rightUpperArmId);


}

function MoveLeg(){
    if(theta[leftUpperLegId] ==230) MLL =-1;
    else if(theta[leftUpperLegId] == 130) MLL =1;
    theta[leftUpperLegId] +=MLL*0.5;
    //console.log(theta[leftUpperLegId]);
    initNodes(leftUpperLegId);

    theta[leftLowerLegId] += MLL*0.5; 
    initNodes(leftLowerLegId);

    if(theta[rightUpperLegId] ==130) MRL =1;
    if(theta[rightUpperLegId] ==230) MRL =-1;
   // console.log(theta[rightUpperLegId]);
    theta[rightUpperLegId] +=MRL*0.5;

    theta[rightLowerLegId] += MRL*0.5;
    initNodes(rightLowerLegId);
    initNodes(rightUpperLegId);
}

function RotCap(){
    theta[CapId]+=0.5;
    initNodes(CapId);
}


var render = function() {

        gl.clear( gl.COLOR_BUFFER_BIT );
        traverse(torsoId);

if(sbar){

    //eye = vec3(radius*Math.sin(theta1)*Math.cos(phi),radius*Math.sin(theta1)*Math.sin(phi), radius*Math.cos(theta1));
    eye = vec3(radius*Math.cos(theta1),radius*Math.sin(theta1)*Math.sin(phi), radius*Math.sin(theta1)*Math.cos(phi));
    theta1 +=0.01;
        //console.log(theta1);
        //theta1 = 5.209999999999933;
}else{
    
} 
       MoverUpperTail();
       //MoveLowerTail();
       MoveArm();
       MoveLeg();
       //RotCap();
         //eye = vec3(10.0,10.0,7.0);
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(70, aspect, 0,10 );


    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );
        requestAnimFrame(render);

}