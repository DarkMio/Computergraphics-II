define(["three"], function(THREE) {
    /**
     * Ellipsoid is described as:
     *   x = a * cos(u) * cos(v)
     *   y = b * cos(u) * sin(v)
     *   z = c * sin(u)
     * @constructor
     */
    var Ellipsoid = function Ellipsoid(heightSegments, widthSegments, height, width, length, color) {
        this.positions = new Float32Array(100 * 100 * 3);
        this.colors = new Float32Array(100 * 100 * 3);
        var _color = new THREE.Color();
        _color.setRGB(1, 0, 0);
        var a = width || 125;
        var b = height || 250;
        var c = length || 500;

        heightSegments |= 100; // y
        widthSegments |= 100; // x
        var index = 0;

        var t_v = Math.PI / (widthSegments - 1);
        var t_u = Math.PI * 2 / (heightSegments - 1);
        for(var y = 0; y < heightSegments; y++) {
            var  v = t_v * y - Math.PI;

            for(var x = 0; x < widthSegments; x++) {
                var u = t_u * x;

                var px = a * Math.sin(u) * Math.sin(v);
                var py = b * Math.cos(u) * Math.sin(v);
                var pz = c * Math.cos(v);

                this.positions[index] = px;
                this.positions[index + 1] = py;
                this.positions[index + 2] = pz;

                this.colors[index] = _color.r;
                this.colors[index + 1] = _color.g;
                this.colors[index + 2] = _color.b;

                index += 3;
            }
        }

        this.getPositions = function() {
            return this.positions;
        };

        this.getColors = function() {
            return this.colors;
        };
    };

    return Ellipsoid;
});