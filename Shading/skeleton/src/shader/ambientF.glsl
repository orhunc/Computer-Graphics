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

uniform float lightR;

varying vec3 vNormal;
// main function gets executed for every pixel
void main()
{
  
  //this colors all fragments (pixels) in the same color (RGBA)

  gl_FragColor = vec4(vec3(lightC_R, lightC_G, lightC_B)*lightR, 1.0).rgba;
}
