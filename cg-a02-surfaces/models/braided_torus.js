define(["three"], function(THREE) {
    "use strict";

    var BraidedTorus = function BraidedTorus() {
        var widthSegments = 250;
        var heightSegments = 250;
        this.positions = new Float32Array(widthSegments * heightSegments * 3);
        this.colors = new Float32Array(widthSegments * heightSegments * 3);
        var _color = new THREE.Color();
        _color.setRGB(1, 0, 0);
        var size = 150;

        var a = 0.5;
        var n = 1.25;
        var r = 0.5;
        var R = 2.5;
        var index = 0;



        var t_v = 2 * Math.PI / (widthSegments - 1);
        var t_u = 8 * Math.PI / (heightSegments - 1);
        for(var y = 0; y < heightSegments; y++) {
            var  v = t_v * y;

            for(var x = 0; x < widthSegments; x++) {
                var u = t_u * x;



                var px = size * (r * Math.cos(v) * Math.cos(u) + R * Math.cos(u) * (1 + a * Math.cos(n * u)));
                var py = size * (2.5 * (r * Math.sin(v) + a * Math.sin(n * u)));
                var pz = size * (r * Math.cos(v) * Math.sin(u) + R * Math.sin(u) * (1 + a * Math.cos(n * u)));

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

    return BraidedTorus;
});