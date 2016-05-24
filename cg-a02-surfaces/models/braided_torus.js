define(["three"], function(THREE) {
    "use strict";

    var BraidedTorus = function BraidedTorus(heightSegments, widthSegments, size, color) {
        widthSegments |= 250;
        heightSegments |= 250;
        this.positions = new Float32Array(widthSegments * heightSegments * 3);
        this.colors = new Float32Array(widthSegments * heightSegments * 3);
        var _color = new THREE.Color();
        _color.setHex(color);
        size |= 150;

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

        // buffers
        var indices = new THREE.BufferAttribute( new Uint32Array( widthSegments*heightSegments*2*3 ) , 1 );
        // helper variables
        var indexOffset = 0;

        for (var j = 1; j <= heightSegments; j ++ ) {
            
            for (var i = 1; i <= widthSegments; i ++ ) {

                // indices
                var a = ( widthSegments + 1 ) * ( j - 1 ) + ( i - 1 );
                var b = ( heightSegments + 1 ) * j + ( i - 1 );
                var c = ( widthSegments + 1 ) * j + i;
                var d = ( heightSegments + 1 ) * ( j - 1 ) + i;

                // face one
                indices.setX( indexOffset, a ); indexOffset++;
                indices.setX( indexOffset, b ); indexOffset++;
                indices.setX( indexOffset, d ); indexOffset++;

                // face two
                indices.setX( indexOffset, b ); indexOffset++;
                indices.setX( indexOffset, c ); indexOffset++;
                indices.setX( indexOffset, d ); indexOffset++;

            }

        }


        this.indices = indices;

        this.getIndices = function() {
            return this.indices;
        };


        this.getPositions = function() {
            return this.positions;
        };

        this.getColors = function() {
            return this.colors;
        };
    };

    return BraidedTorus;
});