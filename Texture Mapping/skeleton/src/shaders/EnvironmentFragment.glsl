
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
varying vec3 vVertex;
varying vec4 vNormal;
varying vec3 pos;
uniform sampler2D drawing;

// main function gets executed for every pixel
void main(){

vec3 light_dir;
vec3 vec_normal;
float angle;
float pi = 3.14159265358979;//32384626433832795;




vec_normal=normalize(vec3(vNormal.xyz));
vec3 view_dir = normalize(cameraPosition-vVertex);
//reflection
vec3 ref_dir = 2.0*dot(view_dir, vec_normal)*vec_normal -view_dir;


float u = (pi + atan(ref_dir.z,ref_dir.x))/(2.0*pi);
float v = (atan(sqrt(pow(ref_dir.x,2.0)+pow(ref_dir.z,2.0)),-1.0*ref_dir.y))/pi;
//float u = ref_dir.x/m +0.5;//(1.0+(1.0/pi)*atan(ref_dir.x/ref_dir.z))/2.0;
//float v = ref_dir.y/m +0.5;//(ref_dir.y+1.0)/2.0;//(atan(sqrt(pow(position.x,2.0)+pow(position.z,2.0)),position.y*-1.0))/pi;
vec2 uv_interpolate=vec2(u,v); //u and v flipped

vec4 tec1 =  texture2D(texture,uv_interpolate);
vec4 tec2 =  texture2D(drawing,uv_interpolate);

float dotProduct = 1.0;//max( dot( vec_normal, light_dir ), 0.0 ) + 0.2;

    //gl_FragColor = vec4( mix( tColor.rgb, tColor2.rgb, tColor2.a ), 1.0 ) * dotProduct;
    
    vec3 mixC = mix(tec1.rgb,tec2.rgb, tec2.a);
    gl_FragColor = vec4( mixC, 1.0 );// * dotProduct;

    //gl_FragColor = texture2D(texture,uv_interpolate);
}
