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

uniform float specularC_R;
uniform float specularC_G;
uniform float specularC_B;

uniform float specularR;

uniform float lightX;
uniform float lightY;
uniform float lightZ;

uniform float magnitude;



varying vec3 color;

// main function gets executed for every vertex
void main()
{
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
//color gets calculated per vertex
vec3 vVertex= vec3(modelViewMatrix * vec4(position,1.0));
vec3 vNormal =normalize(normalMatrix * normal); 
vec3 light_position = vec3(vec4(lightX,lightY,lightZ,1.0));// * modelViewMatrix);
vec3 light_dir;


light_dir = light_position - vVertex;
light_dir = normalize(light_dir);

vec3 view_dir = normalize(cameraPosition-vVertex);
vec3 ref_dir = normalize(reflect(-light_dir,vNormal));
//ambient color
vec3 ambient= vec3(lightC_R, lightC_G, lightC_B)*(lightR*0.6); //ambinet color is too dominant 

//diffuse color
float angle=clamp(dot(vNormal, light_dir),0.0,1.0);
vec3 diffuse = vec3(diffuseC_R,diffuseC_G,diffuseC_B)*(diffuseR*angle);
//specular color
float spec = pow(max(dot(view_dir,ref_dir),0.0),magnitude);
vec3 specular = vec3(specularC_R,specularC_G,specularC_B)*(specularR*spec);
//color is the combination of the 3 colors
color= specular+diffuse+ambient;
}
