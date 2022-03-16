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

varying vec3 vNormal;
varying vec3 vVertex;
uniform sampler2D drawing;
varying vec2 uv_interpolate;
// main function gets executed for every pixel
void main(){

vec3 light_dir;
vec3 vec_normal;
float angle;



light_dir = normalize(vVertex);
vec_normal=normalize(vNormal);

vec4 tec1 =  texture2D(texture,uv_interpolate);
vec4 tec2 =  texture2D(drawing,uv_interpolate);



    //gl_FragColor = vec4( mix( tColor.rgb, tColor2.rgb, tColor2.a ), 1.0 ) * dotProduct;
    
    vec3 mixC = mix(tec1.rgb,tec2.rgb, tec2.a);
    gl_FragColor = vec4( mixC, 1.0 );// * dotProduct;

    //gl_FragColor = texture2D(texture,uv_interpolate);
}
