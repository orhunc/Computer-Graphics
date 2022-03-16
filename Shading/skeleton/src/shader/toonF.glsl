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
  //this colors all fragments (pixels) in the same color (RGBA)
  vec4 color;
  vec3 vecNormal´normalize(vNormal);
  float intensity = dot(normalize(cameraPosition),vecNormal);
  intensity = clamp(intensity, 0.0,1.0);
  if (intensity > 0.95) color = vec4(0.96, 0.89, 0.98, 1.0);
  else if (intensity>0.70) color = vec4(0.7, 0.54, 0.75, 1.0);
  else if (intensity>0.40) color = vec4(0.4, 0.22, 0.47, 1.0);
  else color = vec4(0.17, 0.03, 0.21, 1.0);

  gl_FragColor = color;


}
