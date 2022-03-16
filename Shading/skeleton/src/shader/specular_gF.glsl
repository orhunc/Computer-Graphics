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


uniform float specularC_R;
uniform float specularC_G;
uniform float specularC_B;

uniform float specularR;

uniform float diffuseC_R;
uniform float diffuseC_G;
uniform float diffuseC_B;

uniform float diffuseR;
uniform float lightX;
uniform float lightY;
uniform float lightZ;

uniform float magnitude;

varying vec3 vNormal;
varying vec3 vVertex;

varying vec3 color;
// main function gets executed for every pixel
void main(){
//interpolated color
gl_FragColor = vec4(color,1.0);
//gl_FragColor = vec4(vec3(lightC_R, lightC_G, lightC_B)*lightR + vec3(diffuseC_R,diffuseC_G,diffuseC_B)*(diffuseR*angle),diffuseR);
}
