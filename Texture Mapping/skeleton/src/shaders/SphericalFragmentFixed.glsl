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

uniform sampler2D texture;

varying vec3 vNormal;
varying vec3 vVertex;
uniform sampler2D drawing;
varying vec2 uv_interpolate;
varying float u;
varying vec3 pos;
// main function gets executed for every pixel
void main(){

vec3 light_dir;
vec3 vec_normal;
float angle;

float pi = 3.14159265358979;//32384626433832795;

light_dir = normalize(vVertex);
vec_normal=normalize(vNormal);

float u1 = (pi + atan(pos.z,pos.x))/(2.0*pi);
float v = (atan(sqrt(pow(pos.x,2.0)+pow(pos.z,2.0)),pos.y*-1.0))/pi;
vec2 uv = vec2(u1,v);
vec4 tec1 =  texture2D(texture,uv);
vec4 tec2 =  texture2D(drawing,uv);

    
    vec3 mixC = mix(tec1.rgb,tec2.rgb, tec2.a);
    gl_FragColor = vec4( mixC, 1.0 );// * dotProduct;

}
