// helper lib, provides exercise dependent prewritten Code
import * as helper from './helper';
import ImageWidget from './imageWidget';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Earth from './textures/earth.jpg'; 
import Colors from './textures/colors.jpg'; 
import Disturb from './textures/disturb.jpg'; 
import Checker from './textures/checker.jpg'; 
import Terracotta from './textures/terracotta.jpg'; 
import Plastic from './textures/plastic.jpg'; 
import Wood from './textures/wood.jpg'; 
import Lava from './textures/lava.jpg'; 
import Rock from './textures/rock.jpg'; 
import Enviroment from './textures/enviroment.jpg'; 

//normal maps
import uniform_normal from './textures/uniform_normals.jpg'; 
import p_normal from './textures/plastic_normals.jpg'; 
import r_normal from './textures/rock_normals.jpg'; 
import t_normal from './textures/terracotta_normals.jpg'; 
import wood_normal from './textures/wood_ceiling_normals.jpg'; 
import lava_normal from './textures/lava_normals.jpg'; 

import UVattribute_Vertex  from './shaders/UV-Vertex.glsl';
import UVattribute_Fragment from './shaders/UV-Fragment.glsl';
import Spherical_Vertex from './shaders/SphericalVertex.glsl';
import Spherical_Fragment from './shaders/SphericalFragment.glsl';
import FixedSpherical_Vertex from './shaders/SphericalVertexFixed.glsl';
import FixedSpherical_Fragment from './shaders/SphericalFragmentFixed.glsl';


import Environment_Vertex from './shaders/EnvironmentVertex.glsl';
import Environment_Fragment from './shaders/EnvironmentFragment.glsl';

import Normal_Vertex from './shaders/NormalVertex.glsl';
import Normal_Fragment from './shaders/NormalFragment.glsl';



// local from us provided global utilities
import * as utils from './lib/utils';
import RenderWidget from './lib/rendererWidget';
import { Application, createWindow } from './lib/window';
import { FileWatcherEventKind } from 'typescript';
import { EquirectangularReflectionMapping, MathUtils } from 'three';

var mesh: THREE.Mesh;
var material: THREE.RawShaderMaterial;
var uniforms : { [uniform: string] : THREE.IUniform};
var tex = Earth; //current texture
var current_VertexS = UVattribute_Vertex;
var current_fragmentS = UVattribute_Fragment;
var textures= [Checker,Earth,Colors,Disturb,Lava,Plastic,Rock,Terracotta,Wood,Enviroment];
var geometry;
var normal = uniform_normal;
var m =new THREE.Matrix4();

function main(){
var settings = new helper.Settings();
settings.addCallback(callback);


var gui = helper.createGUI(settings);
gui.open();

var root = Application("Texture");

    // define the (complex) layout, that will be filled later:
    root.setLayout([
        ["renderer",'renderer2']
  
    ]);
    root.setLayoutColumns(["50%",'50%']);
    root.setLayoutRows(["100%",'100%']);
  
  var rendererDiv = createWindow("renderer");
  var rendererDiv2= createWindow('renderer2');
;
  // add it to the root application
  root.appendChild(rendererDiv);
  root.appendChild(rendererDiv2);
  
  
  // create renderer
  var renderer = new THREE.WebGLRenderer({
      antialias: true,  // to enable anti-alias and get smoother output
  });
  var renderer2 = new THREE.WebGLRenderer({
    antialias: true,  // to enable anti-alias and get smoother output
});

var scene = new THREE.Scene();
var sceneleft = new THREE.Scene();

var camera= new THREE.PerspectiveCamera();
helper.setupCamera(camera, scene);
scene.add(camera);

var controls = new OrbitControls(camera, rendererDiv2);

helper.setupControls(controls);


var wid1 = new RenderWidget(rendererDiv2,renderer2,camera,scene,controls);
var wid_texture = new ImageWidget(rendererDiv);
wid_texture.enableDrawing();

//update the drawing canvas everytime the event 'updated' occurs
wid_texture.DrawingCanvas.addEventListener('updated',uniformsupdate,false);

//event listener for clear image
document.addEventListener('pen',function clear(){
  wid_texture.clearDrawing();
},false);

console.log(wid_texture.drawingDisabled);

//initilize texture with "Earth"
wid_texture.setImage(tex);



uniforms = {
  'texture':{value: new THREE.TextureLoader().load(tex)},
  'drawing':{value: new THREE.CanvasTexture(wid_texture.getDrawingCanvas())},
  'normalMap':{value: new THREE.TextureLoader().load(normal)}
}
material= new THREE.RawShaderMaterial({
  uniforms:uniforms,
  vertexShader:current_VertexS,
  fragmentShader:current_fragmentS

});

//code from https://threejs.org/docs/#api/en/core/BufferGeometry
var geometry_quad = new THREE.BufferGeometry();
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
const quad_vertices = new Float32Array( [
	-1.0, -1.0,  0.0,
	 1.0, -1.0,  0.0,
	 1.0,  1.0,  0.0,

	 1.0,  1.0,  0.0,
	-1.0,  1.0,  0.0,
	-1.0, -1.0,  0.0
] );
const quad_normal = new Float32Array( [
	0.0, 1.0,  0.0,
	0.0, 1.0,  0.0,
	0.0, 1.0,  0.0,

	1.0, 0.0,  0.0,
	1.0, 0.0,  0.0,
	1.0, 0.0,  0.0
] );
const quad_uvs = new Float32Array([
  0.0, 0.0,
  1.0, 0.0,
  1.0, 1.0,

  1.0, 1.0,
  0.0, 1.0,
  0.0, 0.0
  ]);
 
// itemSize = 3 because there are 3 values (components) per vertex
geometry_quad.setAttribute( 'position', new THREE.BufferAttribute( quad_vertices, 3 ) );
geometry_quad.setAttribute( 'normal', new THREE.BufferAttribute( quad_normal, 3 ) );
geometry_quad.setAttribute('uv',new THREE.BufferAttribute( quad_uvs, 2 ));
//geometry_quad.scale(0.5,0.5,0.5);
geometry=geometry_quad;
mesh = new THREE.Mesh(geometry,material);
//mesh.matrixWorld
scene.add(mesh);
console.log(scene.children);
wid1.animate();

function callback(changed: utils.KeyValuePair<helper.Settings>){
if(changed.key == 'texture'){
    var index= textures.findIndex(element => element.toString().split('/')[2].slice(0,-4) == changed.value.toString().toLowerCase());
    console.log(textures[9].toString().split('/')[2].slice(0,-4));
    tex=textures[index];

console.log(changed.value);
}

if(changed.key ==  'geometry'){

  switch(changed.value){
    case 'Box':
      geometry = helper.createBox();
      break;
    case 'Sphere':
      geometry = helper.createSphere();
      break;
    case 'Knot':
      geometry = helper.createKnot();
      break;  

    case 'Quad':
      geometry= geometry_quad;
      break;

    case 'Bunny':
      if(settings.shader != 'UV attribute'){
      geometry = helper.createBunny();
      }
      break;
  }

}

if(changed.key == 'shader'){
  switch(changed.value){
    case 'UV attribute':
      current_VertexS = UVattribute_Vertex;
      current_fragmentS = UVattribute_Fragment;
      break;
      
      case 'Spherical':
        current_VertexS = Spherical_Vertex;
        current_fragmentS = Spherical_Fragment;
        break;

      case 'Spherical (fixed)':
        current_VertexS = FixedSpherical_Vertex;
        current_fragmentS = FixedSpherical_Fragment;
        break;

      case 'Environment Mapping':
        
          current_VertexS = Environment_Vertex;
          current_fragmentS = Environment_Fragment;
          break;
          
      case 'Normal Map':
          current_VertexS = Normal_Vertex;
          current_fragmentS = Normal_Fragment;
          break;
      
  }
}

if(changed.key=='normalmap'){
  switch(changed.value){
    case 'Uniform':
      normal=uniform_normal;
      break;
    case 'Plastic':
      normal=p_normal;
      break;
    case 'Lava':
      normal=lava_normal;
      break;
    case 'Terracotta':
      normal=t_normal;
      break;
    case 'Rock':
      normal=r_normal;
      break;
    case 'Wood':
      normal=wood_normal;
      break;
  }
}
if(settings.enviroment){
  var background = new THREE.TextureLoader().load(tex);
  background.mapping=EquirectangularReflectionMapping;
  scene.background=background;
}
else{scene.background=new THREE.Color( 0x000000 );}
//update image, uniforms and create new object
wid_texture.setImage(tex);
//trnaspose(inverse(modelMatrix))
m.getInverse(mesh.matrixWorld).transpose();
uniforms = {
  'texture':{value: new THREE.TextureLoader().load(tex)},
  'drawing':{value: new THREE.CanvasTexture(wid_texture.getDrawingCanvas())},
  'normalMap':{value: new THREE.TextureLoader().load(normal)},
  'matrix':{value:  m}
}
material= new THREE.RawShaderMaterial({
  uniforms:uniforms,
  vertexShader:current_VertexS,
  fragmentShader:current_fragmentS

});
//update mesh
mesh.geometry=geometry;
mesh.material=material;
}


function uniformsupdate(){
  
uniforms.drawing.value=new THREE.CanvasTexture(wid_texture.getDrawingCanvas());

material= new THREE.RawShaderMaterial({
  uniforms:uniforms,
  vertexShader:current_VertexS,
  fragmentShader:current_fragmentS

})
mesh.material=material;

}
}

// call main entrypoint
main();
