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

uniform float lightC_R;
uniform float lightC_G;
uniform float lightC_B;

uniform float lightR;

uniform float diffuseC_R;
uniform float diffuseC_G;
uniform float diffuseC_B;

uniform float diffuseR;

varying vec3 vNormal;
varying vec3 vVertex;

// main function gets executed for every vertex
void main()
{
  vVertex= vec3(modelMatrix * vec4(position,1.0));
  vNormal =normalMatrix * normal; 
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
