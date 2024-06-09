var gl = null,
    canvas = null,
    glProgram = null,
    fragmentShader = null,
    vertexShader = null;

var vertexPositionAttribute = null,
    trianglesVerticeBuffer = null,
    vertexColorAttribute = null,
    trianglesColorBuffer = null,
    triangleVerticesIndexBuffer = null;

var angle = 0;
var mvMatrix = mat4();
var pMatrix = mat4();

var y= 0, z=0;

var num=0;

var lightPosition = vec4(1.0,1.0,1.0,1.0);
var lightAmbient = vec4(0.2,0.2,0.2,1.0);
var lightDiffuse = vec4(1.0,1.0,1.0,1.0);
var lightSpecular = vec4(1.0,1.0,1.0,1.0);

var dif_1=0.5

var materialAmbiet = vec4(1.0,0.0,1.0,1.0);
var materialDiffuse = vec4(0.5,0.8,0.0,1.0);
var materialSpecular = vec4(1.0,0.8,0.0,1.0);
var materialShininess = 50.0;

var ambientProduct = mult(lightAmbient, materialAmbiet);
var diffuseProduct = mult(lightDiffuse, materialDiffuse);
var specularProduct = mult(lightSpecular,materialSpecular);

var capture = false;
var start = [];
var pos = [5,0,0];

//이니셜의 초기 상태는 정면
var angleX = 90
var angleY = 180;
var angleZ = 90;


var X = false;
var Y = false;
var Z = false;

var rot_x = false;
var rot_y =  false;
var rot_z =  false;
var theta = [0,0,0];

var front1 = false;
var up1 = false;
var up2 = false;
var down1 = false;
var down2 = false;
var side1 =false;
var side2 =false;
var side3 =false;

function initWebGL() {

    
    canvas = document.getElementById("my-canvas");
    var element = document.getElementById("my-canvas");
    try{
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }catch(e){

    }

    if(gl){
       element.addEventListener("mousedown", function(e) {
    capture = true;
    start = [e.pageX, e.pageY];
});

element.addEventListener("mouseup", function(e) {
    capture = false;
});

element.addEventListener("mousemove", function(e) {
    if (capture) {
        var x = (e.pageX - start[0]);
        var y = (e.pageY - start[1]);
      //  start[0] = e.pageX;
        //start[1] = e.pageY;

        if(X){
            angleX += 0.01*y + 0.01*x;
        }
        if(Y){
            angleY += 0.01*x +  0.01*y;
        }
        if(Z){
            angleZ += 0.01*y +0.01*x ;
        }
        console.log(angleX);
        console.log(angleY);
        //angleY += 0.1*y;
        
        //angleZ += 0.1*x*y;
    }
});
        initShaders();
        setupBuffers();
        getMatrixUniforms(); 
        (function animLoop(){
            setupWebGL();
           // setupDynamicBuffers();
            setMatrixUniforms();
            drawScene();
            requestAnimationFrame(animLoop, canvas);
        })();

    
    }else{
        alert("Error: Your browser does not appear to" + "support WebGL.");
    }

    document.getElementById("X Mode").onclick = function(){
       X= !X;
       Y = false;
       Z = false;
    }
    
    document.getElementById("Y Mode").onclick = function(){
        Y= !Y;
        X = false;
        Z = false;
     }

     document.getElementById("Z Mode").onclick = function(){
        Z= !Z;
        X = false;
        Y = false;
     }
     document.getElementById("Rotate X").onclick = function(){
        rot_x = !rot_x;
     }
     
     document.getElementById("Rotate Y").onclick = function(){
        rot_y = !rot_y;
     }
     document.getElementById("Rotate Z").onclick = function(){
        rot_z = !rot_z;
     }

     document.getElementById("Front 1").onclick = function(){
        front1 = !front1;
     }

     document.getElementById("up 1").onclick = function(){
        up1 = !up1;
     }

     document.getElementById("up 2").onclick = function(){
        up2 = !up2;
     }
     document.getElementById("down 1").onclick = function(){
        down1 = !down1;
     }
     document.getElementById("down 2").onclick = function(){
        down2 = !down2;
     }
     document.getElementById("side 1").onclick = function(){
        side1 = !side1;
     }
     document.getElementById("side 2").onclick = function(){
        side2 = !side2;
     }
     document.getElementById("side 3").onclick = function(){
        side3 = !side3;
     }
}

function setupWebGL()
{
    gl.clearColor(0.9,0.9,0.9,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0,0,canvas.width, canvas.height);
    //gl.viewport(0, canvas.height/2.0, canvas.width/2.0, canvas.height/2.0);
  
    
    pMatrix = perspective(70, canvas.width/canvas.height, 0.0, 10.0);
    var translation = [0.0, -1.0, -7.0];
    mvMatrix= translate(translation,y,z);
   mvMatrix = mult( mvMatrix,rotate(angleX,[1.0,0.0,0.0]));
   mvMatrix = mult( mvMatrix,rotate(angleY,[0.0,1.0,0.0]));
   mvMatrix = mult( mvMatrix,rotate(angleZ,[0.0,0.0,1.0]));
    if(X){
         pos[0] += 0.001*angleX;
    }
  
     
     if(rot_x){
    if(rot_y)rot_y = !rot_y;
        if(rot_z)rot_z = !rot_z;
        mvMatrix = translate(translation,y,z)
        mvMatrix = mult(mvMatrix,rotate(angleX,[1.0,0.0,0.0]));
        mvMatrix = mult(mvMatrix,rotate(angleY,[0.0,1.0,0.0]));
        mvMatrix = mult(mvMatrix,rotate(angleZ,[0.0,0.0,1.0]));
        angleX +=1;
     }
     if(rot_y){
       
        if(rot_x)rot_x = !rot_x;
        if(rot_z)rot_z = !rot_z;
        mvMatrix = translate(translation,y,z)
        mvMatrix = mult(mvMatrix,rotate(angleX,[1.0,0.0,0.0]));
        mvMatrix = mult(mvMatrix,rotate(angleY,[0.0,1.0,0.0]));
        mvMatrix = mult(mvMatrix,rotate(angleZ,[0.0,0.0,1.0]));
        angleY +=1;
    
     }
     if(rot_z){
       
        if(rot_x)rot_x = !rot_x;
        if(rot_y)rot_y = !rot_y;
        mvMatrix = translate(translation,y,z)
        mvMatrix = mult(mvMatrix,rotate(pos,[1.0,0.0,0.0]));
        mvMatrix = mult(mvMatrix,rotate(angleY,[0.0,1.0,0.0]));
        mvMatrix = mult(mvMatrix,rotate(angleZ,[0.0,0.0,1.0]));
        
     }


}

function initShaders(){
    // 셰이서 소를 가져옴
    var FragmentShader_source = document.getElementById('Fragment_shader').innerHTML;
    var VertexShader_source = document.getElementById('Vertex_shader').innerHTML;

    vertexShader = makeShader(VertexShader_source, gl.VERTEX_SHADER);
    fragmentShader = makeShader(FragmentShader_source, gl.FRAGMENT_SHADER);

    glProgram = gl.createProgram();

    gl.attachShader(glProgram,vertexShader);
    gl.attachShader(glProgram, fragmentShader );
    gl.linkProgram(glProgram);

    if(!gl.getProgramParameter(glProgram, gl.LINK_STATUS)){
        alert("Unable to initialize the shader program.");
    }

    gl.useProgram(glProgram);

}

function makeShader(src,type)
{
    var shader = gl.createShader(type);
    gl.shaderSource(shader,src);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        alert("Erroe compiling shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}

function setupBuffers()
{


    var triangleVertices = [ 
      
        0.25,-1.5,1.0, // 0
        0.25,-1.0,1.0, // 1
        0.25,-1.5,-1,  // 2
        0.25,-1.0,-1.0, // 3
        -0.25,-1.5,1.0, // 4 
        -0.25,-1.0,1.0, // 5
        -0.25,-1.5,-1, // 6
        -0.25,-1.0,-1.0, // 7
        
        0.25,-0.75,1.0, //8
        0.25,-0.25,1.0, // 9
        0.25,-1.2,0, // 10
        0.25,-0.75,-1, //11
        0.25,-0.25,-1, //12
        0.25,-0.75,0, //13

        -0.25,-0.75,1.0, //14
        -0.25,-0.25,1.0, // 15
        -0.25,-1.2,0, // 16
        -0.25,-0.75,-1, //17
        -0.25,-0.25,-1, //18
        -0.25,-0.75,0, //19

        0.25,0.0,1.0, // 20
        0.25,0.5,1.0, // 21
        0.25,1.0,1.0, // 22
        0.25,1.5,1.0, // 23
        0.25,0.5,0.25, // 24
        0.25,1.0,0.25, // 25
        0.25,0.0,-1.0, // 26
        0.25,0.5,-1.0, // 27
        0.25,1.0,-1.0, // 28
        0.25,1.5,-1.0, // 29
        0.25,0.5,-0.25, // 30
        0.25,1.0,-0.25, // 31

        -0.25,0.0,1.0, // 32
        -0.25,0.5,1.0, // 33
        -0.25,1.0,1.0, // 34
        -0.25,1.5,1.0, // 35
        -0.25,0.5,0.25, // 36
        -0.25,1.0,0.25, // 37
        -0.25,0.0,-1.0, // 38
        -0.25,0.5,-1.0, // 39
        -0.25,1.0,-1.0, // 40
        -0.25,1.5,-1.0, // 41
        -0.25,0.5,-0.25, // 42
        -0.25,1.0,-0.25, // 43

        0.25,1.75,1.0, //44
        0.25,3.25,1.0, // 45
        0.25,3.25,0.5, // 46
        0.25,2.25,0.5, // 47
        0.25,2.25,0.25, //48
        0.25,3.25,0.25, // 49
        0.25,1.75,-0.25, //50 
        0.25,2.75,-0.25, //51
        0.25,1.75,-0.5, //52
        0.25,1.75,-1.0, //53
        0.25,2.75,-0.5, // 54
        0.25,3.25,-1.0,  //55

        -0.25,1.75,1.0, //56
        -0.25,3.25,1.0, // 57
        -0.25,3.25,0.5, // 58
        -0.25,2.25,0.5, // 59
        -0.25,2.25,0.25, //60
        -0.25,3.25,0.25, // 61
        -0.25,1.75,-0.25, //62 
        -0.25,2.75,-0.25, //63
        -0.25,1.75,-0.5, //64
        -0.25,1.75,-1.0, //65
        -0.25,2.75,-0.5, // 66
        -0.25,3.25,-1.0,  //67



    ];

    trianglesVerticeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);	

    var triangleVertexIndices = [ 
        // k
        0,1,2,
        1,2,3,
        4,5,6,
        5,6,7,
        0,1,4,
        4,5,1,
        2,3,6,
        6,7,3,
        0,4,6,
        6,2,0,
        1,5,7,
        7,3,1,
        1,5,3,
        8,9,10,
        9,10,13,
        10,11,13,
        11,12,13,
        14,15,16,
        15,16,19,
        16,17,19,
        17,18,19,
        8,9,14,
        9,14,15,
        11,12,17,
        12,17,18,
        9,10,15,
        10,15,16,
        10,12,16,
        12,16,18,

        //H
        20,26,27,
        20,21,27,
        24,25,30,
        30,31,25,
        22,28,29,
        22,23,29,
        32,38,39,
        32,33,39,
        36,37,42,
        42,43,37,
        34,40,41,
        34,35,41,
        20,32,26,
        26,38,32,
        20,32,21,
        21,33,32,
        26,38,27,
        27,39,38,
        30,42,31,
        31,43,42,
        24,36,25,
        25,37,36,
        34,22,28,
        28,40,34,
        28,40,29,
        29,41,40,
        34,22,23,
        23,35,34,

        //S
        44,45,47, // 56,57,59
        45,47,46, // 57,59,58,
        44,47,48, // 56,59,60,
        44,48,50, // 56,60,62
        48,49,50, // 60,61,62,
        50,51,49, //62, 63,61
        49,51,55, // 61,63,67
        51,54,55, // 63,66,67
        52,53,54, // 64,65,66
        53,54,55, // 65, 66, 67

        56,57,59,
        57,59,58,
        56,59,60,
        56,60,62,
        60,61,62,
        62,63,61,
        61,63,67,
        63,66,67,
        64,65,66,
        65,66,67,

        45,57,46,
        46,58,57,
        44,56,45,
        45,57,56,
        44,56,50,
        50,62,56,
        59,47,60,
        60,48,47,
        60,48,49,
        49,61,60,
        49,61,55,
        55,67,61,
        51,63,54,
        54,66,63,
        52,64,54,
        54,66,64,
        52,64,53,
        53,65,64
    ];
    triangleVerticesIndexBuffer = gl.createBuffer();
    triangleVerticesIndexBuffer.number_vertex_points = triangleVertexIndices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleVerticesIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleVertexIndices), gl.STATIC_DRAW);		
}


function getMatrixUniforms(){
    
    glProgram.pMatrixUniform = gl.getUniformLocation(glProgram, "uPMatrix");
    glProgram.mvMatrixUniform = gl.getUniformLocation(glProgram, "uMVMatrix");
     gl.uniform4fv(gl.getUniformLocation(glProgram, "lightPosition"),flatten(lightPosition));
 gl.uniform4fv(gl.getUniformLocation(glProgram, "ambientProduct"),flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(glProgram, "diffuseProduct"),flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(glProgram, "specularProduct"),flatten(specularProduct));
   
    gl.uniform1f(gl.getUniformLocation(glProgram, "shininess"),materialShininess);
}

function setMatrixUniforms(){
if(front1){
    mvMatrix = lookAt([5,0,0],[1,0,0],[0,0,1]);
}
if(up1){
    mvMatrix = lookAt([-3,-1,3],[0,0,0],[0,0,1]);
}
if(up2){
    mvMatrix = lookAt([3,-1,3],[0,0,0],[0,0,1]);
}
if(down1){
    mvMatrix = lookAt([-3,-1,-5],[0,0,0],[0,0,1]);
}
if(down2){
     mvMatrix = lookAt([3,-1,-3],[0,0,0],[0,0,1]);
}
if(side1){
    mvMatrix = lookAt([2,5,0],[1,0,0],[0,0,1]);
}
if(side2){
    mvMatrix = lookAt([-2,5,0],[1,0,0],[0,0,1]);
}
if(side3){
    mvMatrix = lookAt([1.5,5,0],[1,0,0],[0,0,1]);
}     
   //아래mvMatrix = lookAt([-3,-1,-5],[0,0,0],[0,0,1]);
   //아래 mvMatrix = lookAt([-3,-1,-3],[0,0,0],[0,0,1]);
    // 옆면1 mvMatrix = lookAt([2,5,0],[1,0,0],[0,0,1]);
    // 옆면2 mvMatrix = lookAt([-2,5,0],[1,0,0],[0,0,1]);
    // 옆면3 mvMatrix = lookAt([1.5,5,0],[1,0,0],[0,0,1]);
    // 옆면4 mvMatrix = lookAt([2,-5,0],[1,0,0],[0,0,1]);
    gl.uniformMatrix4fv(glProgram.pMatrixUniform, false, flatten(pMatrix));
    gl.uniformMatrix4fv(glProgram.mvMatrixUniform,false, flatten(mvMatrix));
   
}

function drawScene()
{
    vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesVerticeBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0,0);

    vertexColorAttribute = gl.getAttribLocation(glProgram, 'aVertexColor');
    gl.enableVertexAttribArray(vertexColorAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglesColorBuffer);
    gl.vertexAttribPointer(vertexColorAttribute, 3, gl.FLOAT, false, 0,0);

    //gl.drawArrays(gl.TRIANGLES,0,num);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleVerticesIndexBuffer);  
	gl.drawElements(gl.TRIANGLES, triangleVerticesIndexBuffer.number_vertex_points, gl.UNSIGNED_SHORT, 0);
}