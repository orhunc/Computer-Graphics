// helper lib, provides exercise dependent prewritten Code
import * as helper from './helper';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as utils from './lib/utils';
import RenderWidget from './lib/rendererWidget';
import { Application, createWindow } from './lib/window';

// load shaders
import basicVertexShader from './shader/basic.v.glsl';
import basicFragmentShader from './shader/basic.f.glsl';
import ambientVShader from './shader/ambientV.glsl';
import ambientFShader from './shader/ambientF.glsl';
import normalVShader from './shader/normalV.glsl';
import normalFShader from './shader/normalF.glsl';
import toonVShader from './shader/toonV.glsl';
import toonFShader from './shader/toonF.glsl';
import lambertVShader from './shader/lambertV.glsl';
import lambertFShader from './shader/lambertF.glsl';
import specular_pVShader from './shader/specular_pV.glsl';
import specular_pFShader from './shader/specular_pF.glsl';
import specular_gVShader from './shader/specular_gV.glsl';
import specular_gFShader from './shader/specular_gF.glsl';
import blinnphongVShader from './shader/billphongV.glsl';
import blinnphongFShader from './shader/billphongF.glsl';
import { Color, Scene, Vector3 } from 'three';
import { isModifier } from 'typescript';


document.title='Shading';
var model0: THREE.Mesh;
var model1: THREE.Mesh;
var model2: THREE.Mesh;
var model3: THREE.Mesh;
var material: THREE.RawShaderMaterial;
var tmp: THREE.Mesh;
var light: THREE.Mesh;
var current_vertexS= basicVertexShader;
var current_fragmentS = basicFragmentShader;

function removeChildren(scene: THREE.Scene){
  for (let i=0; i<scene.children.length;  ){
    if (scene.children[i].type=='Mesh'){
    scene.remove(scene.children[i]);
    }
    else {
      i++;
    }
  }
  //re-add the light to the scene
  scene.add(light);
}
function updateScene(material: THREE.Material, scene: THREE.Scene){
  tmp= new THREE.Mesh(model0.geometry,material);
    model0 = tmp;
    tmp= new THREE.Mesh(model1.geometry,material);
    model1 = tmp;
    model1.rotateX(3.141592/2);
    model1.translateX(-4);
    model1.translateZ(-1.5);

    tmp= new THREE.Mesh(model2.geometry,material);
    model2 = tmp;
    model2.scale.set(1, 0.5, 1);
    model2.rotateX(3.141592/2);
    model2.translateX(-4);
    model2.translateZ(1.5);

    tmp= new THREE.Mesh(model3.geometry,material);
    model3 = tmp;
    model3.translateX(4);

    scene.add(model0);
    scene.add(model1);
    scene.add(model2);
    scene.add(model3);

}

function main(){
var settings= new helper.Settings();
settings.addCallback(callback);
var gui = helper.createGUI(settings);
gui.open();
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera();
helper.setupCamera(camera, scene);
scene.add(camera);

var root = Application("Shading");

  root.setLayout([
      ["renderer"]

  ]);

  root.setLayoutColumns(["100%"]);
  root.setLayoutRows(["100%"]);

var rendererDiv = createWindow("renderer");
root.appendChild(rendererDiv);
var renderer = new THREE.WebGLRenderer({
    antialias: true,  // to enable anti-alias and get smoother output
});
var controls = new OrbitControls(camera, rendererDiv);
helper.setupControls(controls);

var wid = new RenderWidget(rendererDiv, renderer, camera, scene, controls);

//application
var output= helper.setupGeometry(scene);

model0=output.model0;
model1=output.model1;
model2=output.model2;
model3=output.model3;


light = new THREE.Mesh(new THREE.SphereGeometry(0.1,10,10),new THREE.MeshBasicMaterial());
light.position.set(settings.lightX,settings.lightY,settings.lightZ);

scene.add(light);

var uniforms : { [uniform: string] : THREE.IUniform};

uniforms = {
  "lightC_R" : {value: 104.0/255},
  "lightC_G" : {value: 13.0/255},
  "lightC_B" : {value: 13.0/255},
  "lightR" : {value: 0.5},
  "diffuseC_R" : {value: 205/255},
  "diffuseC_G" : {value: 25/255},
  "diffuseC_B" : {value: 25/255},
  'diffuseR':{value: 1.0},
  "specularC_R" : {value: (settings.specular_color[0]/255).toFixed(2)},
    "specularC_G" : {value: (settings.specular_color[1]/255).toFixed(2)},
    "specularC_B" : {value: (settings.specular_color[2]/255).toFixed(2)},
    "specularR":{value: settings.specular_reflectance.toFixed(2)},
    "magnitude":{value:settings.magnitude.toFixed(2)},
  "lightX":{value:1.0},
  "lightY":{value:1.0},
  "lightZ":{value:1.0}
    }


function callback (changed: utils.KeyValuePair<helper.Settings>){
  var new_mat: THREE.RawShaderMaterial;
  removeChildren(scene);

  //update shaders
  if(changed.key=='shader'){
    
    console.log(scene.children);
    switch (changed.value){
      case 'Basic':
        current_vertexS = basicVertexShader;
        current_fragmentS=basicFragmentShader;
      break;
      case 'Ambient':
          current_vertexS = ambientVShader;
          current_fragmentS = ambientFShader; 
      break;  

      case 'Normal':
        current_vertexS = normalVShader;
        current_fragmentS = normalFShader; 
        break;

      case 'Toon':
          current_vertexS = toonVShader;
          current_fragmentS = toonFShader; 
          break;
      
      case 'Lambert':
        current_vertexS = lambertVShader;
        current_fragmentS = lambertFShader;
        break;

      case 'Phong':
        current_vertexS = specular_pVShader;
        current_fragmentS = specular_pFShader;
        break;

      case 'Gouraud':
          current_vertexS = specular_gVShader;
          current_fragmentS = specular_gFShader;
          break;
          
      case 'Blinn-Phong':
        current_vertexS = blinnphongVShader;
          current_fragmentS = blinnphongFShader;
          break;
    }

  }

  //update light position
  if(changed.key=='lightX'||changed.key=='lightY'||changed.key=='lightZ'){
    light.position.set(settings.lightX,settings.lightY,settings.lightZ);
  }

  //update uniforms
  uniforms = {
    "lightC_R" : {value: (settings.ambient_color[0]/255).toFixed(2)},
    "lightC_G" : {value: (settings.ambient_color[1]/255).toFixed(2)},
    "lightC_B" : {value: (settings.ambient_color[2]/255).toFixed(2)},
    "lightR": {value: settings.ambient_reflectance.toFixed(2)},
    "diffuseC_R" : {value: (settings.diffuse_color[0]/255).toFixed(2)},
    "diffuseC_G" : {value: (settings.diffuse_color[1]/255).toFixed(2)},
    "diffuseC_B" : {value: (settings.diffuse_color[2]/255).toFixed(2)},
    "diffuseR":{value: settings.diffuse_reflectance.toFixed(2)},
    "specularC_R" : {value: (settings.specular_color[0]/255).toFixed(2)},
    "specularC_G" : {value: (settings.specular_color[1]/255).toFixed(2)},
    "specularC_B" : {value: (settings.specular_color[2]/255).toFixed(2)},
    "specularR":{value: settings.specular_reflectance.toFixed(2)},
    "magnitude":{value:settings.magnitude.toFixed(2)},
    "lightX":{value:settings.lightX},
  "lightY":{value:settings.lightY},
  "lightZ":{value:settings.lightZ}
      }

  new_mat =new THREE.RawShaderMaterial({
    uniforms:uniforms,
    fragmentShader : current_fragmentS,
    vertexShader: current_vertexS
  });
  updateScene(new_mat,scene);
  }
// start the draw loop (this call is async)
wid.animate();
}

// call main entrypoint
main();
