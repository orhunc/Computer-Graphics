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

uniform float diffuseC_R;
uniform float diffuseC_G;
uniform float diffuseC_B;

uniform float diffuseR;

uniform float lightX;
uniform float lightY;
uniform float lightZ;


varying vec3 vNormal;
varying vec3 vVertex;
// main function gets executed for every pixel
void main(){
vec3 light_position = vec3(vec4(lightX,lightY,lightZ,1.0));// * modelViewMatrix);
vec3 tmp_light;
vec3 vec_normal;
float angle;

tmp_light = light_position - vVertex;
tmp_light = normalize(tmp_light);

//needs to be normalized per fragment!!
vec_normal=normalize(vNormal);

//float diffuse = max(dot(vNormal,tmp_light),0.1);
//diffuse = diffuse * (1.0/(1.0+(0.25 * distance * distance)));

angle=clamp(dot(vec_normal, tmp_light),0.0,1.0);
//diffuse + ambient
gl_FragColor = vec4(vec3(diffuseC_R,diffuseC_G,diffuseC_B)*(diffuseR*angle)+vec3(lightC_R, lightC_G, lightC_B)*lightR,1.0);

}
