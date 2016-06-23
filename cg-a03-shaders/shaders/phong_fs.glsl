uniform vec3 phongAmbientMaterial;                          // ambient color  k_a
uniform vec3 phongDiffuseMaterial;                          // difusse color  k_d
uniform vec3 phongSpecularMaterial;                         // specular color k_s
uniform float phongShininessMaterial;                       // phong exponent a

uniform vec3 directionalLightDir;
uniform vec3 directionalLightCol;

varying vec4 ecPosition;
varying vec3 ecNormal;
varying vec3 viewDir;

/**
 * @var position: the position point which this vertex is at
 * @var normal: the normal of that vertex
 * @var viewDirection: direction of the camera looking on that
 */
vec3 phong(vec3 position, vec3 normal, vec3 viewDirection) {
    vec3 vColor = phongAmbientMaterial;
    vec3 lightPosition = normalize(directionalLightDir - position);
    // E = viewDirection
    vec3 angle = normalize(reflect(directionalLightDir, normal));

    float dotProduct = dot(normal, -directionalLightDir);

    vec3 diffuse = vec3(0, 0, 0);
    if(dotProduct > 0.0) {
        diffuse = phongDiffuseMaterial * directionalLightCol * dotProduct; // * directionalLightColor[0] * dotProduct;
    }

    vec3 specular = phongSpecularMaterial * directionalLightCol * pow(max(dot(angle, viewDirection), 0.0), phongShininessMaterial);
    specular = clamp(specular, 0.0, 1.0);

    vColor = vColor + diffuse + specular;


    return vColor;
}

void main() {
    gl_FragColor = vec4(phong(ecPosition.xyz, ecNormal, viewDir), 1.0);
}