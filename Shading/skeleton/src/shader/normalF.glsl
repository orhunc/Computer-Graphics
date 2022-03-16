// Ambient defines the precision
precision highp float;

// we have access to the same uniforms as in the vertex shader
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

uniform float lightC_R;
uniform float lightC_G;
uniform float lightC_B;

//uniform vec3 lightC;
uniform float lightR;

varying vec3 vNormal;
// main function gets executed for every pixel
void main()
{
 

  //needs to be normalized per fragment!
  vec3 vNormal2 = normalize(vNormal);
  gl_FragColor = vec4((vNormal2 + vec3(1.0 ,1.0, 1.0))/2.0, 1.0);


}
