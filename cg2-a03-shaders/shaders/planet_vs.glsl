precision mediump float;

varying vec4 ecPosition;
varying vec3 ecNormal;
varying vec2 vUv;
varying vec3 viewDir;


void main() {
    ecPosition = modelViewMatrix * vec4(position, 1.0);
    ecNormal = normalize(normalMatrix * normal);

    bool useOrthographic = projectionMatrix[2][3] == 0.0;     // if the projection matrix is 0 / -1 decides orthographic or not
    viewDir = useOrthographic ? vec3(0, 0, 1) : normalize(-ecPosition.xyz);

    gl_Position = projectionMatrix * ecPosition;

    vUv = uv;
}

