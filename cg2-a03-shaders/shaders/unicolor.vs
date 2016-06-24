// uniform mat4 modelViewMatrix;

// attribute vec3 position;
// attribute vec3 normal;
// attribute vec3 color;
// attribute vec2 uv;

varying vec2 vUv;
varying vec3 fragColor;

// uniform float foobar;

void main() {
    vUv = uv;
    vec4 p = vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * p;
    fragColor = color;
}