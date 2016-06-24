#define MAX_POINT_LIGHTS 1
#define MAX_DIR_LIGHTS 1


uniform vec3 phongAmbientMaterial;                          // ambient color  k_a
uniform vec3 phongDiffuseMaterial;                          // difusse color  k_d
uniform vec3 phongSpecularMaterial;                         // specular color k_s
uniform float phongShininessMaterial;                       // phong exponent a

uniform vec3 directionalLightDir;
uniform vec3 directionalLightCol;

varying vec4 ecPosition;
varying vec3 ecNormal;
varying vec3 viewDir;

void main() {

    ecPosition = modelViewMatrix * vec4(position, 1.0);
    ecNormal = normalize(normalMatrix * normal);

    bool useOrthographic = projectionMatrix[2][3] == 0.0;     // if the projection matrix is 0 / -1 decides orthographic or not
    viewDir = useOrthographic ? vec3(0, 0, 1) : normalize(-ecPosition.xyz);

    gl_Position = projectionMatrix * ecPosition;

}
