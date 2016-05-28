define(["three", "util", "parametric"], function(THREE, util, ParametricSurface) {
    var SnailSurface = function SnailSurface(heightSegments, widthSegments, size, color) {
        return new ParametricSurface({
            heightSegments: heightSegments || 250,
            widthSegments: widthSegments || 250,
            size: size || 100,
            uMin: 0,
            uMax: 2 * Math.PI,
            vMin: 0,
            vMax: 2 * Math.PI,
            color: color,
            posX: function(u, v) {
                return u * Math.cos(v) * Math.sin(u)
            },
            posY: function(u, v) {
                return u * Math.cos(u) * Math.cos(v)
            },
            posZ: function(u, v) {
                return -u * Math.sin(v)
            }
        });
    };

    return SnailSurface;
});