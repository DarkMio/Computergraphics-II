precision highp float;

const vec4 c_color1 = vec4(1.0, 0.0, 0.0, 1.0);
const vec4 c_color2 = vec4(0.0, 1.0, 0.0, 1.0);

varying vec3 fragColor;
varying vec2 vUv;

void main() {
    //gl_FragColor = c_color1;

    // gl_FragColor = vec4(fragColor, 1.0);

    if(mod(gl_FragCoord.x, 25.0) >= 12.5) {
        gl_FragColor = c_color1;
    } else {
        gl_FragColor = c_color2;
    }
}