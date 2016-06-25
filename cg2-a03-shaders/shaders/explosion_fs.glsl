varying float noise;
uniform float weight;
uniform sampler2D explosionTex;
uniform float colorScale;

void main() {
    // the magic numbers are as following:
    //                         vvvv -> shifts the explosion color more towards black in general
    vec2 tPos = vec2( 0, 1. - (1.25 - 2.5 / (weight) * noise ) );
    //                                ^^^ -> divisor to norminate the scale again
    vec4 color = texture2D( explosionTex, tPos );
    gl_FragColor = vec4( color.rgb * colorScale, 1.0 );
}