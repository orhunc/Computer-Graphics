// put your imports here
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


// local from us provided global utilities
import * as utils from './lib/utils';
import RenderWidget from './lib/rendererWidget';
import { Application, createWindow } from './lib/window';

// helper lib, provides exercise dependent prewritten Code
import * as helper from './helper';
import { Color, Mesh, Vector3 } from 'three';

 //z axis
 /*if(axis==3){
  alpha=Math.acos(array[0]);
  alpha=alpha+0.05;
  cos=Math.cos(direction*alpha);
  sin=Math.sin(direction*alpha);
  matrix_new.set(cos,-sin,array[8],array[12],
                sin,cos,array[9],array[13],
                array[2],array[6],array[10],array[14],
                array[3],array[7],array[11],array[15],);
}*/

  document.title='Robot';

  

function main(){
  // setup/layout root Application.
  // Its the body HTMLElement with some additional functions.
  var root = Application("Robot");
  // define the (complex) layout, that will be filled later:
  root.setLayout([
      ["renderer"]

  ]);
  // 1fr means 1 fraction, so 2fr 1fr means
  // the first column has 2/3 width and the second 1/3 width of the application
 
  root.setLayoutColumns(["100%"]);
  // you can use percentages as well, but (100/3)% is difficult to realize without fr.
  root.setLayoutRows(["100%"]);

var rendererDiv = createWindow("renderer");
// add it to the root application
root.appendChild(rendererDiv);

// create renderer
var renderer = new THREE.WebGLRenderer({
    antialias: true,  // to enable anti-alias and get smoother output
});

// create scene
var scene = new THREE.Scene();
// user ./helper.ts for building the scene

  //creating the robot parts
  var geometry = new THREE.BoxGeometry(0.3,0.4,0.1);
  var material = new THREE.MeshBasicMaterial( { color: 0xaaddbb } );
  
  var coordinate=new THREE.AxesHelper();
  
  
  var body = new THREE.Mesh( geometry, material );
  body.matrixAutoUpdate =false;

  var geo = new THREE.SphereGeometry(0.12, 15, 15);
  var head = new THREE.Mesh( geo, material ); 
  head.matrixAutoUpdate =false;

  geometry = new THREE.BoxGeometry(0.25,0.1,0.1);
  var leftarm = new THREE.Mesh( geometry, material ); 
  leftarm.matrixAutoUpdate =false;

  geometry = new THREE.BoxGeometry(0.25,0.1,0.1);
  var rightarm = new THREE.Mesh( geometry, material );
  rightarm.matrixAutoUpdate =false;

  geometry = new THREE.BoxGeometry(0.1,0.5,0.1);
  var leftleg =new THREE.Mesh( geometry, material );
  leftleg.matrixAutoUpdate =false;

  geometry = new THREE.BoxGeometry(0.1,0.5,0.1);
  var rightleg = new THREE.Mesh( geometry, material );
  rightleg.matrixAutoUpdate =false;

  geometry = new THREE.BoxGeometry(0.1,0.1,0.18);
  var leftfoot = new THREE.Mesh( geometry, material );
  leftfoot.matrixAutoUpdate =false;

  geometry = new THREE.BoxGeometry(0.1,0.1,0.18);
  var rightfoot = new THREE.Mesh( geometry, material );
  rightfoot.matrixAutoUpdate =false;
  

  body.add(head);
  body.add(rightarm);
  body.add(rightleg);
  body.add(leftleg);
  body.add(leftarm);

  leftleg.add(leftfoot);
  rightleg.add(rightfoot);
  
  scene.add(body);
  head.geometry.translate(0,0.10,0);
  leftarm.geometry.translate(-0.1,0,0);
  rightarm.geometry.translate(0.1,0,0);
  rightleg.geometry.translate(0,-0.28,0);
  leftleg.geometry.translate(0,-0.28,0);
 // rightfoot.geometry.translate(0,-0.19,0);
  //leftfoot.geometry.translate(0,-0.19,0);

  head.matrix.set(1, 0, 0, 0,
                 0, 1, 0, 0.25,
                  0, 0, 1, 0,
                   0, 0, 0, 1);

  leftarm.matrix.set(1, 0, 0, -0.2,
               0, 1, 0, 0.1,
               0, 0, 1, 0,
               0, 0, 0, 1);

  rightarm.matrix.set(1, 0, 0, 0.2,
      0, 1, 0, 0.1,
      0, 0, 1, 0,
      0, 0, 0, 1);

  rightleg.matrix.set(1, 0, 0, 0.1,
    0, 1, 0, -0.2,
    0, 0, 1, 0,
    0, 0, 0, 1); 

  leftleg.matrix.set(1, 0, 0, -0.1,
  0, 1, 0, -0.2,
  0, 0, 1, 0,
  0, 0, 0, 1);

  leftfoot.matrix.set(1, 0, 0, 0,
    0, 1, 0, -0.49,
    0, 0, 1, 0.04,
    0, 0, 0, 1);

  rightfoot.matrix.set(1, 0, 0, 0,
      0, 1, 0, -0.49,
      0, 0, 1, 0.04,
      0, 0, 0, 1);

  
      
  console.log(leftfoot.matrix.toArray());
  console.log(leftfoot.geometry.vertices);
  console.log(leftleg.position);
  console.log(leftleg.children);

//body = helper.setupGeometry(scene);
helper.setupLight(scene);



document.onkeydown=select;
//help variables
var selected: THREE.Mesh;
var before: THREE.Mesh;
var axis=false;
var sin=Math.sin(0.02);
var cos=Math.cos(0.02);


function getRotation(axis, direction){
  //rotation in axis x
  var array=[];
  var matrix_new = new THREE.Matrix4();
  array=matrix_new.toArray();
  var alpha=0.05;
  cos=Math.cos(direction*alpha);
  sin=Math.sin(direction*alpha);
  //x axis
  if(axis==1){

    
    matrix_new.set(array[0],array[4],array[8],array[12],
                  array[1],cos,-sin,array[13],
                  array[2],sin,cos,array[14],
                  array[3],array[7],array[11],array[15],);
  }
  //y axis
  if(axis==2){
  
    matrix_new.set(cos,array[4],-sin,array[12],
                  array[1],array[5],array[9],array[13],
                  sin,array[6],cos,array[14],
                  array[3],array[7],array[11],array[15],);
  }
 
  return matrix_new;
  
}

function getTranslationBack(array){
  var matrix_new = new THREE.Matrix4();
  matrix_new.set(array[0],array[4],array[8],-array[12],
    array[1],array[5],array[9],-array[13],
    array[2],array[6],array[10],-array[14],
    array[3],array[7],array[11],array[15]);
    /*tmp_translation.set(1,1,1,-array[12],
      1,1,1,-5,
      1,1,1,-array[14],
      1,1,1,array[15]);*/

    return matrix_new;
}

function select(k:KeyboardEvent){
  var index=0;
  var tmp=-1;
  
var tmp_translation = new THREE.Matrix4();
var tmp_rotation = new THREE.Matrix4();
var tmp_matrix = new THREE.Matrix4();
var arr=[];
  k = k || window.event;
  
  
  if(selected!=null && selected.id!=scene.id ){
  var children = selected.children;
  var parent = selected.parent;
  //if axis was on, remove the axis from the array of children!!!!
  if(axis){
    tmp=children.indexOf(coordinate);
    if(tmp>-1){
    children.splice(tmp);
    }
  }
  switch(k.key){
  case 's':
    if(children==[] || children[0]==null){
      console.log('fck');
      break;
    }
    before=selected;
    selected=children[0];
    break;
  

  case 'w':
    if(selected.id==body.id){
      console.log('fck');
      break;
    }
    before=selected;
    selected=parent;
    break;

  case 'a':
    if(parent==null || parent.id ==scene.id){
      break;}//body is the only child!

      //index of current selected in the array of parents' children
      index= parent.children.indexOf(selected); 
      if(index<1){
        console.log('fck');
        break;}//selected is the first child

      before=selected;
      selected=parent.children[index-1]; 
      break;

  case 'd':
    if(parent==null || parent.id ==scene.id){
      break;}//body is the only child!
      
      //index of current selected in the array of parents' children
      index= parent.children.indexOf(selected); 
      if(index>parent.children.length-2){
        console.log('fck');
        break;}//selected is the last child

      before=selected;
      selected=parent.children[index+1]; 
      break;
  //if selected already has a value then put the axis
  case 'c':
    axis=!axis;
    
      if(axis){
        
      selected.add(coordinate);
      }
      else{
      selected.remove(coordinate);
      }
      return;
      
  case "ArrowLeft":
    arr=selected.matrix.toArray();
    console.log(arr);
    console.log(tmp_translation);
    tmp_translation= getTranslationBack(arr);
    console.log(tmp_translation);
    tmp_rotation=getRotation(2,1);
    tmp_matrix.multiplyMatrices(selected.matrix,tmp_rotation);
   // tmp_matrix.multiplyMatrices(tmp_matrix,tmp_translation);

    console.log(tmp_matrix);
    selected.matrix=tmp_matrix;
      console.log(selected.matrix);
      break;   

  case "ArrowRight":
    console.log('he');
    arr=selected.matrix.toArray();
    console.log(arr);
    console.log(tmp_translation);
    tmp_translation=getTranslationBack(arr);
    console.log(tmp_translation);
    tmp_rotation=getRotation(2,-1);
    tmp_matrix.multiplyMatrices(selected.matrix,tmp_rotation);
   // tmp_matrix.multiplyMatrices(tmp_matrix,tmp_translation);

    console.log(tmp_matrix);
    selected.matrix=tmp_matrix;
      console.log(selected.matrix);
      break;   
      
  case "ArrowUp":
    console.log('he');
    arr=selected.matrix.toArray();
    console.log(arr);
    console.log(tmp_translation);
    tmp_translation=getTranslationBack(arr);
    console.log(tmp_translation);
    tmp_rotation=getRotation(1,-1);
    tmp_matrix.multiplyMatrices(selected.matrix,tmp_rotation);
   // tmp_matrix.multiplyMatrices(tmp_matrix,tmp_translation);

    console.log(tmp_matrix);
    selected.matrix=tmp_matrix;
      console.log(selected.matrix);
      break;   
      
  case "ArrowDown":
    console.log('he');
    arr=selected.matrix.toArray();
    console.log(arr);
    console.log(tmp_translation);
    tmp_translation=getTranslationBack(arr);
    console.log(tmp_translation);
    tmp_rotation=getRotation(1,1);
    tmp_matrix.multiplyMatrices(selected.matrix,tmp_rotation);
   // tmp_matrix.multiplyMatrices(tmp_matrix,tmp_translation);

    console.log(tmp_matrix);
    selected.matrix=tmp_matrix;
      console.log(selected.matrix);
      break;   
    case 'r':
      body.matrix.set(1, 0, 0, 0,
        0, 1, 0, 0,
         0, 0, 1, 0,
          0, 0, 0, 1);
      head.matrix.set(1, 0, 0, 0,
        0, 1, 0, 0.25,
         0, 0, 1, 0,
          0, 0, 0, 1);

leftarm.matrix.set(1, 0, 0, -0.2,
      0, 1, 0, 0.1,
      0, 0, 1, 0,
      0, 0, 0, 1);

rightarm.matrix.set(1, 0, 0, 0.2,
0, 1, 0, 0.1,
0, 0, 1, 0,
0, 0, 0, 1);

rightleg.matrix.set(1, 0, 0, 0.1,
0, 1, 0, -0.2,
0, 0, 1, 0,
0, 0, 0, 1); 

leftleg.matrix.set(1, 0, 0, -0.1,
0, 1, 0, -0.2,
0, 0, 1, 0,
0, 0, 0, 1);

leftfoot.matrix.set(1, 0, 0, 0,
0, 1, 0, -0.49,
0, 0, 1, 0.04,
0, 0, 0, 1);

rightfoot.matrix.set(1, 0, 0, 0,
0, 1, 0, -0.49,
0, 0, 1, 0.04,
0, 0, 0, 1);
break;
    default:
      console.log('default');
      return;
  }
  //removing the axis from it - if it was there
  if (axis){
    coordinate.parent.remove(coordinate);
    selected.add(coordinate);
  }
  //setting the part selected before to its original color
  if(before!=null){
   before.material = new THREE.MeshBasicMaterial( { color: 0xaaddbb } ); 
  }
   selected.material = new THREE.MeshBasicMaterial( { color: 0xff99aa } );
   return;
  }

//if nothing was selected yet, initialize with body
else if (k.key=='s'/*||k.key=='w'||k.key=='a'||k.key=='d'*/){
  selected=body;
  console.log('fuck');
  selected.material = new THREE.MeshBasicMaterial( { color: 0xff99aa } );
  if (axis){
    coordinate.parent.remove(coordinate);
    selected.add(coordinate);
  }
  return;
  
  }
//if selected is scene t(casue nothing has been selected yet - then put the axis to scene
else if(k.key=='c'){
  //turning on and off the axis
  
  axis=!axis; 
  if(axis){
    scene.add(coordinate);
  }
  else{
    scene.remove(coordinate);
  }
  }


}


// create camera
var camera = new THREE.PerspectiveCamera();
// user ./helper.ts for setting up the camera
helper.setupCamera(camera, scene);

// create controls
var controls = new OrbitControls(camera, rendererDiv);
// user ./helper.ts for setting up the controls
helper.setupControls(controls);

// fill the Window (renderDiv). In RenderWidget happens all the magic.
// It handles resizes, adds the fps widget and most important defines the main animate loop.
// You dont need to touch this, but if feel free to overwrite RenderWidget.animate
var wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);
// start the draw loop (this call is async)
wid.animate();
}

// call main entrypoint
main();
