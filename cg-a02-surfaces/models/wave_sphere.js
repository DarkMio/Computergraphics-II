define(["three"], function(THREE) {
    "use strict";

    var WaveSphere = function WaveSphere() {
        this.positions = new Float32Array(250 * 250 * 3);
        this.colors = new Float32Array(250 * 250 * 3);
        var _color = new THREE.Color();
        _color.setRGB(1, 0, 0);
        var a = 50;

        var index = 0;

        var widthSegments = 250;
        var heightSegments = 250;

        var t_v = 2 * Math.PI / (widthSegments - 1);
        var t_u = 14.5 / (heightSegments - 1);
        for(var y = 0; y < heightSegments; y++) {
            var  v = t_v * y;

            for(var x = 0; x < widthSegments; x++) {
                var u = t_u * x;

                var px = a * u * Math.cos(Math.cos(u)) * Math.cos(v);
                var py = a * u * Math.cos(Math.cos(u)) * Math.sin(v);
                var pz = a * u * Math.sin(Math.cos(u));

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

    return WaveSphere;
});