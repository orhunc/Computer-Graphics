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

varying vec3 vNormal;
varying vec3 vVertex;

uniform sampler2D texture;
uniform sampler2D drawing;
varying vec2 uv_interpolate;
varying float u;
varying vec3 pos;
// main function gets executed for every vertex
void main()
{
  float pi = 3.14159265358979;//32384626433832795;
  vVertex= vec3(modelMatrix * vec4(position,1.0));
  vNormal =normalMatrix * normal; 
 
  pos=position;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
