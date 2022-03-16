import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


// local from us provided global utilities
import * as utils from './lib/utils';
import RenderWidget from './lib/rendererWidget';
import { Application, createWindow } from './lib/window';
// helper lib, provides exercise dependent prewritten Code
import * as helper from './helper';
import { PerspectiveCamera } from 'three';
import { CameraHelper } from 'three';
import type { ThisExpression } from 'typescript';
import { createTeddyBear } from './teddy';

document.title='Cameras';
var tmpx=0;
var tmpy=0;
var tmpz=0;
var dif=0;
var near = 1;
var far = 5;
var fov = 40;



function main(){
//helpfer functions for the tasks:
//callback function for changes in gui
function callback(changed: utils.KeyValuePair<helper.Settings>){
    //changing the camera parameters
    if(changed.key=='far'){
        far=changed.value;
        helper.setupCamera(camera, scene, near, far, fov);
        WorldCamera.updateProjectionMatrix();
        camHelper.update();
        updateBear();
    } 
    if(changed.key=='fov'){
        fov=changed.value;
        helper.setupCamera(camera, scene, near, far, fov);
        WorldCamera.updateProjectionMatrix();
        camHelper.update();
        updateBear();
    }
    if(changed.key=='near'){
        near=changed.value;
        helper.setupCamera(camera, scene, near, far, fov);
        WorldCamera.updateProjectionMatrix();
        camHelper.update();
        updateBear();
    }
    //plane clipping
    if(changed.key=='planeX0'){
        adjustPlanes(1,1, changed.value);
    }

    if(changed.key=='planeX1'){
        adjustPlanes(1,-1,changed.value);
    }

    if(changed.key=='planeY0'){
        adjustPlanes(2,1,changed.value);
    }

    if(changed.key=='planeY1'){
        adjustPlanes(2,-1,changed.value);
    }

    if(changed.key=='planeZ0'){
        adjustPlanes(3,1,changed.value);
    }

    if(changed.key=='planeZ1'){
        adjustPlanes(3,-1,changed.value);
    }


    //transformations of the bear
    if(changed.key=='rotateX'){
        
        dif=changed.value-tmpx;
        teddy.rotateX(dif);
        tmpx=changed.value;
        updateBear();
    }
    if(changed.key=='rotateY'){

        dif=changed.value-tmpy;
        teddy.rotateY(dif);
        
        tmpy=changed.value;
        updateBear();
    }
    if(changed.key=='rotateZ'){
        dif=changed.value-tmpz;
        teddy.rotateZ(dif);
        updateBear();
        tmpz=changed.value;
    }
    if(changed.key=='translateX'){
    
        teddy.position.setComponent(0,changed.value);
        updateBear();
    }
    if(changed.key=='translateY'){
        teddy.position.setComponent(1,changed.value);
        updateBear();
    }
    if(changed.key=='translateZ'){
        teddy.position.setComponent(2,changed.value);
        updateBear();
    }

}

//task 4:function for updating canonical view
function updateBear(){
    // var childNode: THREE.Object3D;
    WorldCamera.updateMatrix();
    WorldCamera.updateProjectionMatrix();
    WorldCamera.updateMatrixWorld();

    teddy2.updateMatrix();
    teddy2.updateMatrixWorld();
    var newteddy = helper.createTeddyBear();
    // newteddy.copy(teddy);
      
    //newteddy should have the same position as the other bear
    newteddy.position.set(teddy.position.x,teddy.position.y, teddy.position.z);

    //newteddy should have the same rotations
    newteddy.rotateX(tmpx);
    newteddy.rotateY(tmpy);
    newteddy.rotateZ(tmpz);
     
 
    newteddy.updateMatrix();
    newteddy.updateMatrixWorld();

    camera.updateMatrix();
    camera.updateMatrixWorld();
 
    newteddy.traverse(function(children){
            
            
            if(children instanceof THREE.Mesh) {
            children.updateMatrixWorld();

            //merge empty vertices
            children.geometry.mergeVertices();
            children.geometry.verticesNeedUpdate = true;

            //set the local transformation matrix equal to the global transformation matrix
           // children.matrix=children.matrixWorld;
            for (var i = 0; i < children.geometry.vertices.length; i++) {
                var tempVertex = new THREE.Vector4;
                //convert the vertices to Vector4 by adding 1
                tempVertex.set(children.geometry.vertices[i].x,children.geometry.vertices[i].y,children.geometry.vertices[i].z,1);
                tempVertex.applyMatrix4(children.matrixWorld);
                tempVertex.applyMatrix4(camera.matrixWorldInverse);
                tempVertex.applyMatrix4(camera.projectionMatrix);
               // tempVertex.applyMatrix4(children.matrix);
                tempVertex.divideScalar(tempVertex.w);
                //flip on z axis
                tempVertex.z *= -1;

                children.geometry.vertices[i].set(tempVertex.x,tempVertex.y,tempVertex.z);
                children.geometry.verticesNeedUpdate = true;
               }
                //children.traverse(function(child){
                //  if (child instanceof THREE.Object3D) {
            //});
        }  
    //}
    });
 
     //replace the teddy in canonical view
     scene2.remove(teddy2);
     teddy2.copy(newteddy);
     scene2.add(teddy2);
 
 }


//task 5 
function adjustPlanes(a: number, direction: number,yes: boolean){ //a is {1,2,3} for representing x,y,z - direction stand for 1 or -1 - yes states if the blane should be added or removed
var index=-1;
var vector = new THREE.Vector3(direction*1, 0,0);
var plane=new THREE.Plane(vector,1);
    switch(a){
        case 1: //x
        vector = new THREE.Vector3(direction*1, 0,0);
        plane=new THREE.Plane(vector,1);
        if (yes){                               //if true - then the plane needs to be added
        planes.push(plane);                     //planes is a global variable containing planes
        }
        else{                                   // if not, the plane already exists, it needs to be removed
           index= planes.findIndex(element => element.normal.x === vector.x);
           console.log(index);
           if(index>-1){
               planes.splice(index,1);
           }
           
        }
        break;

        case 2: //y
        vector = new THREE.Vector3(0,direction*1,0);
        plane=new THREE.Plane(vector,1);
        if (yes){
            planes.push(plane);
            
            }
            else{
                index= planes.findIndex(element => element.normal.y === vector.y);
           console.log(index);
           if(index>-1){
               planes.splice(index,1);
           }
               
            }
            break;

        case 3: //z
        vector = new THREE.Vector3(0,0,direction*1);
        plane=new THREE.Plane(vector,1);
        if (yes){
            planes.push(plane);
            }
            else{
                index= planes.findIndex(element => element.normal.z === vector.z);
           console.log(index);
           if(index>-1){
               planes.splice(index,1);
           }
               
            }
            break;
    }
    renderer2.clippingPlanes=planes;            //update the planes

}
   
    //create settings and add the callback
    var settings= new helper.Settings();
    settings.addCallback(callback);
    //create the gui
    var gui=helper.createGUI(settings);
    gui.open();
    var root = Application("Cameras");

    // define the (complex) layout, that will be filled later:
    root.setLayout([
        ["renderer",'renderer2', 'renderer3']
  
    ]);
    root.setLayoutColumns(["33%",'33%','33%']);
    root.setLayoutRows(["100%",'100%','100%']);
  
  var rendererDiv = createWindow("renderer");
  var rendererDiv2= createWindow('renderer2');
  var rendererDiv3=createWindow('renderer3');
  // add it to the root application
  root.appendChild(rendererDiv);
  root.appendChild(rendererDiv2);
  root.appendChild(rendererDiv3);
  
  // create renderer
  var renderer = new THREE.WebGLRenderer({
      antialias: true,  // to enable anti-alias and get smoother output
  });
  var renderer2 = new THREE.WebGLRenderer({
    antialias: true,  // to enable anti-alias and get smoother output
});
var renderer3 = new THREE.WebGLRenderer({
    antialias: true,  // to enable anti-alias and get smoother output
});


//initialising the planes
var planes=[];
var vec = new THREE.Vector3(1, 0,0);
var plane=new THREE.Plane(vec,1);
planes.push(plane);

vec = new THREE.Vector3(-1, 0,0);
plane=new THREE.Plane(vec,1);
planes.push(plane);

vec = new THREE.Vector3(0,1 ,0);
plane=new THREE.Plane(vec,1);
planes.push(plane);

vec = new THREE.Vector3(0, -1,0);
plane=new THREE.Plane(vec,1);
planes.push(plane);

vec = new THREE.Vector3(0, 0,1);
plane=new THREE.Plane(vec,1);
planes.push(plane);

 vec = new THREE.Vector3(0, 0,-1);
 plane=new THREE.Plane(vec,1);
planes.push(plane);
renderer2.clippingPlanes=planes;

//creating the scene  
var scene = new THREE.Scene();
var color=new THREE.Color('white');
scene.background=color;
  
var scene2= new THREE.Scene();
scene2.background=color;
  
var teddy=helper.createTeddyBear();
scene.add(teddy);
console.log(teddy);


// create screen camera
var camera = new THREE.PerspectiveCamera();
//create world camera
var WorldCamera = new THREE.PerspectiveCamera();
var camHelper = new THREE.CameraHelper(camera);
scene.add(camHelper);
scene.add(camera);
camHelper.update();
helper.setupCamera(WorldCamera, scene, 1, 20, 50);
helper.setupCamera(camera, scene, near, far, fov);

scene.add(camera);
scene.add(WorldCamera);
//creating the teddy for the middle scene
var teddy2 : THREE.Object3D;
  
  // create the first teddy for middle scene
teddy2=helper.createTeddyBear();
scene2.add(teddy2);

var canonicalCam = helper.createCanonicalCamera();
helper.setupCube(scene2);
scene2.add(canonicalCam);
canonicalCam.lookAt(scene2.position);



// create controls
var controls = new OrbitControls(camera, rendererDiv3); //left window
var controls2=new OrbitControls(canonicalCam, rendererDiv2);
var controls3=new OrbitControls(WorldCamera, rendererDiv);//right window

// user ./helper.ts for setting up the controls
helper.setupControls(controls);
helper.setupControls(controls2);
helper.setupControls(controls3);

controls3.addEventListener("change", (event)=>{
    camera.updateProjectionMatrix();
    camera.updateMatrix();
    camera.updateMatrixWorld();
    camHelper.update();
    updateBear();

});
controls.addEventListener("change", (event)=>{
    camera.updateProjectionMatrix();
    camera.updateMatrix();
    camera.updateMatrixWorld();
    camHelper.update();
    updateBear();

});

// fill the Window (renderDiv). In RenderWidget happens all the magic.
// It handles resizes, adds the fps widget and most important defines the main animate loop.
// You dont need to touch this, but if feel free to overwrite RenderWidget.animate
var wid1 = new RenderWidget(rendererDiv, renderer, WorldCamera, scene, controls);//right scene
var wid2 = new RenderWidget(rendererDiv2, renderer2, canonicalCam, scene2, controls2);
var wid3 = new RenderWidget(rendererDiv3, renderer3, camera, scene, controls3);//left scene
// start the draw loop (this call is async)
wid1.animate();
wid2.animate();
wid3.animate();


}

// call main entrypoint
main();
