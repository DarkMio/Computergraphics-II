precision mediump float;

// uniform material constants k_a, k_d, k_s, alpha
uniform vec3 phongAmbientMaterial;                          // ambient color  k_a
uniform vec3 phongDiffuseMaterial;                          // difusse color  k_d
uniform vec3 phongSpecularMaterial;                         // specular color k_s
uniform float phongShininessMaterial;                       // phong exponent a

uniform sampler2D dayTexture;
uniform sampler2D nightTexture;
uniform sampler2D cloudTexture;

uniform vec3 ambientLightColor;

uniform vec3 directionalLightColor[1];

// three js only supports int no bool
// if you want a boolean value in the shader, use int

// data from the vertex shader
varying vec4 ecPosition;
varying vec3 ecNormal;
varying vec2 vUv;

varying vec3 viewDir;


uniform vec3 directionalLightDir;
uniform vec3 directionalLightCol;

/**
 * @var position: the position point which this vertex is at
 * @var normal: the normal of that vertex
 * @var viewDirection: direction of the camera looking on that
 */
vec3 phong(vec3 position, vec3 normal, vec3 viewDirection) {
    vec3 dayColor = texture2D(dayTexture, vUv).rgb;   // diffuse
    vec3 nightColor = texture2D(nightTexture, vUv).rgb; // base material color (? ambient)
    vec3 cloudColor = texture2D(cloudTexture, vUv).rgb; // specular

    nightColor = pow(nightColor, vec3(0.6));

    vec3 vColor = nightColor * phongAmbientMaterial;
    vec3 lightPosition = normalize(directionalLightDir - position);
    // E = viewDirection
    vec3 angle = normalize(reflect(directionalLightDir, normal));

    float dotProduct = dot(normal, -directionalLightDir);

    vec3 diffuse = vec3(0, 0, 0);
    if(dotProduct > 0.0) {
        diffuse = dayColor * phongDiffuseMaterial * directionalLightCol * dotProduct; // * directionalLightColor[0] * dotProduct;
    }

    vec3 specular = cloudColor * phongSpecularMaterial * directionalLightCol * pow(max(dot(angle, viewDirection), 0.0), phongShininessMaterial);
    specular = clamp(specular, 0.0, 1.0);

    vColor = vColor * (1.0 - dotProduct) + diffuse * dotProduct + specular;
    return vColor;
}


void main() {
/*


    // get color from different textures
    //vec3 color = texture2D(textureUniform, texCoord).rgb;
   
    // normalize normal after projection
    
    // do we use a perspective or an orthogonal projection matrix?
    //bool usePerspective = projectionMatrix[2][3] != 0.0;
    // for perspective mode, the viewing direction (in eye coords) points
    // from the vertex to the origin (0,0,0) --> use -ecPosition as direction.
    // for orthogonal mode, the viewing direction is simply (0,0,1)
    
    // calculate color using phong illumination
    // depending on GUI checkbox:
    // color from night texture and clouds are added to ambient term (instead of ambient material k_a)
    // color from day texture are added to diffuse term (instead of diffuse material k_d)

    // Note: the texture value might have to get rescaled (gamma corrected)
    //       e.g. color = pow(color, vec3(0.6))*2.0;
    
    // vector from light to current point
    vec3 l = normalize(directionalLightDirection[0]);

    
    // diffuse contribution
    vec3 diffuseCoeff = (daytimeTextureBool == 1 )? dayCol : diffuseMaterial;
    // clouds at day?
    if(cloudsTextureBool == 1) {
        //diffuseCoeff = ...
    }

    // ...

    // final diffuse term for daytime
    //vec3 diffuse =  diffuseCoeff * directionalLightColor[0] * ndotl;

    // ambient part contains lights; modify depending on time of day
    // when ndotl == 1.0 the ambient term should be zero

    vec3 color = vec3(1,0,0); //replace with ambient + diffuse + specular;

    gl_FragColor = vec4(color, 1.0);
*/


    gl_FragColor = vec4(phong(ecPosition.xyz, ecNormal, viewDir), 1.0);
    // gl_FragColor = vec4( vec3(vUv, 0.0), 1.0);
}
