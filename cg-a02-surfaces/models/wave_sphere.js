define(["three", "util", "parametric"], function(THREE, util, ParametricSurface) {
    "use strict";

    var WaveSphere = function WaveSphere(heightSegments, widthSegments, size, color) {
        return new ParametricSurface({
            heightSegments: heightSegments || 250,
            widthSegments: widthSegments || 250,
            size: size || 50,
            uMin: 0,
            uMax: 14.5,
            vMin: 0,
            vMax: 2 * Math.PI,
            color: color,
            posX: function(u, v) {
                return  u * Math.cos(Math.cos(u)) * Math.cos(v)
            },
            posY: function(u, v) {
                return u * Math.cos(Math.cos(u)) * Math.sin(v)
            },
            posZ: function(u, v) {
                return u * Math.sin(Math.cos(u))
            }
        });
    };

    return WaveSphere;
});