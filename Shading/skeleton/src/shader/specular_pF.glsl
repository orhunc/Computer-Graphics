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

uniform float specularC_R;
uniform float specularC_G;
uniform float specularC_B;

uniform float specularR;

uniform float lightX;
uniform float lightY;
uniform float lightZ;

uniform float magnitude;

varying vec3 vNormal;
varying vec3 vVertex;
// main function gets executed for every pixel
void main(){
vec3 light_position = vec3(vec4(lightX,lightY,lightZ,1.0));// * modelViewMatrix);
vec3 light_dir;
vec3 vec_normal;
float angle;


light_dir = light_position - vVertex;
light_dir = normalize(light_dir);

vec_normal=normalize(vNormal);
vec3 view_dir = normalize(cameraPosition-vVertex);
vec3 ref_dir = normalize(reflect(-light_dir,vec_normal));

//ambient color
vec3 ambient= vec3(lightC_R, lightC_G, lightC_B)*lightR;
//diffuse color
angle=clamp(dot(vec_normal, light_dir),0.0,1.0);
vec3 diffuse = vec3(diffuseC_R,diffuseC_G,diffuseC_B)*(diffuseR*angle);
//specular color
float spec = pow(max(dot(view_dir,ref_dir),0.0),magnitude);
vec3 specular = vec3(specularC_R,specularC_G,specularC_B)*(specularR*spec);

//float diffuse = max(dot(vNormal,light_dir),0.1);
//diffuse = diffuse * (1.0/(1.0+(0.25 * distance * distance)));

//spec_color=clamp(spec_color,0.0,1.0);


gl_FragColor = vec4(specular+diffuse+ambient,1.0);
}
