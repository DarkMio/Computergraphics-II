define(["three", "parametric"], function(THREE, ParametricSurface) {
    /**
     * Ellipsoid is described as:
     *   x = a * cos(u) * cos(v)
     *   y = b * cos(u) * sin(v)
     *   z = c * sin(u)
     * @constructor
     */
    var Ellipsoid = function Ellipsoid(heightSegments, widthSegments, height, width, length, color) {
        return new ParametricSurface({
            heightSegments: heightSegments || 250,
            widthSegments: widthSegments || 250,
            size: 1,
            dimensions: [height, width, length],
            uMin: 0,
            uMax: 14.5,
            vMin: 0,
            vMax: 2 * Math.PI,
            color: color,
            posX: function(u, v) {
                return this.dimensions[0] * Math.sin(u) * Math.sin(v)
            },
            posY: function(u, v) {
                return this.dimensions[1] * Math.cos(u) * Math.sin(v)
            },
            posZ: function(u, v) {
                return this.dimensions[2] * Math.cos(v)
            }
        });
    };

    return Ellipsoid;
});