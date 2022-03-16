
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

/*uniform float lightC_R;
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

uniform float magnitude;*/
uniform sampler2D texture;

//varying vec3 vNormal;

varying vec2 uv_interpolate;
//varying vec3 light_dir;
//varying vec3 view_dir;
uniform sampler2D drawing;
uniform sampler2D normalMap;
varying vec3 pos;
varying vec3 nNormal;
// main function gets executed for every pixel
void main(){

float pi = 3.14159265358979;//32384626433832795;
vec3 vec_normal;
float angle;

//mapped normal
vec3 vNormal = texture2D(normalMap, uv_interpolate).rgb; 
vNormal=vNormal*2.0-1.0;
vec_normal=normalize(vNormal);

vec4 vVertex4= modelMatrix * vec4(pos,1.0);
vec3 vVertex=vec3(vVertex4)/vVertex4.w;


vec3 view_dir = normalize(cameraPosition-vVertex);
vec3 n =mat3(modelViewMatrix)*normalize(vec_normal);
vec3 t= mat3(modelViewMatrix)*normalize(vec3(vVertex.xy,0.0));
mat3 TBN = mat3(t,t,t);
vec3 light_position = vec3(2.0,2.0,3.0);
vec3 light_dir = light_position - vVertex;
light_dir = normalize(light_dir);


vec3 ref = normalize(reflect(-light_dir,vec_normal));
float spec = pow(max(dot(view_dir,ref),0.0),50.0);
vec3 specular = vec3(1.0,1.0,1.0)*(0.8*spec);

light_dir = TBN * light_dir;
view_dir = TBN * view_dir;

angle=clamp(dot(vec_normal, light_dir),0.0,1.0);


vec4 tec1 =  texture2D(texture,uv_interpolate);
vec4 tec2 =  texture2D(drawing,uv_interpolate);

//mixed color
vec3 mixC = mix(tec1.rgb,tec2.rgb, tec2.a);
//vec3 diffuseColor = max(diffuse*angle,0.0);
vec3 color =clamp(mixC*0.2+mixC*angle*0.8+specular,0.0,1.0);
gl_FragColor = vec4( color, 1.0 );

   
}
