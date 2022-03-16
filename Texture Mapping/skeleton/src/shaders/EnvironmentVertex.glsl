
// Ambient These uniforms and attributes are provided by threejs.
// If you want to add your own, look at https://threejs.org/docs/#api/en/materials/ShaderMaterial #Custom attributes and uniforms

// defines the precision
precision highp float;

// = object.matrixWorld
uniform mat4 modelMatrix;

// = camera.matrixWorldInverse * object.matrixWorld
uniform mat4 modelViewMatrix;

// = camera.projectionMatrix
uniform mat4 projectionMatrix;

// = camera.matrixWorldInverse
uniform mat4 viewMatrix;

// = inverse transpose of modelViewMatrix
uniform mat3 normalMatrix;

// = camera position in world space
uniform vec3 cameraPosition;

// default vertex attributes provided by Geometry and BufferGeometry
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

/*uniform float lightC_R;
uniform float lightC_G;
uniform float lightC_B;

uniform float lightR;


uniform float specularC_R;
uniform float specularC_G;
uniform float specularC_B;

uniform float specularR;

uniform float lightX;
uniform float lightY;
uniform float lightZ;

uniform float magnitude;*/

varying vec4 vNormal;
varying vec3 vVertex;
varying vec3 pos;
uniform sampler2D texture;
uniform sampler2D drawing;
uniform mat4 matrix;

// main function gets executed for every vertex
void main()
{
vec4 vVertex4= modelMatrix * vec4(position,1.0);
vVertex=vec3(vVertex4)/vVertex4.w;
  pos=position;
  vNormal = matrix*vec4(position,1.0);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
