define(["three", "util", "parametric"], function(THREE, util, ParametricSurface) {
    "use strict";

    var BraidedTorus = function BraidedTorus(heightSegments, widthSegments, size, color) {
        return new ParametricSurface({
            heightSegments: heightSegments || 250,
            widthSegments: widthSegments || 250,
            size: 100,
            uMin: 0,
            uMax: 8 * Math.PI ,
            vMin: 0,
            vMax: 2 * Math.PI,
            color: color,
            posX: function(u, v) { // uhm, deal with magic numbers.
                return 0.5 * Math.cos(v) * Math.cos(u) + 2.5 * Math.cos(u) * (1 + 0.5 * Math.cos(1.25 * u))
            },
            posY: function(u, v) {
                return 2.5 * (0.5* Math.sin(v) + 0.5 * Math.sin(1.25 * u))
            },
            posZ: function(u, v) {
                return 0.5 * Math.cos(v) * Math.sin(u) + 2.5 * Math.sin(u) * (1 + 0.5 * Math.cos(1.25 * u))
            }
        });
    };

    return BraidedTorus;
});