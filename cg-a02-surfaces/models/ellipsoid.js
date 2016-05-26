define(["three"], function(THREE) {
    /**
     * Ellipsoid is described as:
     *   x = a * cos(u) * cos(v)
     *   y = b * cos(u) * sin(v)
     *   z = c * sin(u)
     * @constructor
     */
    var Ellipsoid = function Ellipsoid(heightSegments, widthSegments, height, width, length, color) {
        heightSegments = heightSegments || 100;
        widthSegments = widthSegments || 100;
        this.positions = new Float32Array(heightSegments * widthSegments * 3);
        this.colors = new Float32Array(heightSegments * widthSegments * 3);
        var _color = new THREE.Color();
        _color.setHex(color);
        width = width || 125;
        height = height || 250;
        length = length || 500;

        var index = 0;
        var t_v = Math.PI / (widthSegments - 1);
        var t_u = Math.PI * 2 / (heightSegments - 1);
        for(var y = 0; y <= heightSegments; y++) {
            var  v = t_v * y - Math.PI;

            for(var x = 0; x <= widthSegments; x++) {
                var u = t_u * x;
                var px = width * Math.sin(u) * Math.sin(v);
                var py = height * Math.cos(u) * Math.sin(v);
                var pz = length * Math.cos(v);

                this.positions[index] = px;
                this.positions[index + 1] = py;
                this.positions[index + 2] = pz;

                this.colors[index] = _color.r;
                this.colors[index + 1] = _color.g;
                this.colors[index + 2] = _color.b;

                index += 3;
            }
        }

        var indices = new Uint32Array( widthSegments*heightSegments*2*3 );
        // helper variables
        var indexOffset = 0;
        var mod = this.positions.length / 3;



        for (var j = 0; j <= heightSegments; j ++ ) {

            for (var i = 0; i <= widthSegments; i ++ ) {

                // indices
                var a = ( widthSegments + 1 ) * ( j - 1 ) + ( i - 1 );
                var b = ( widthSegments + 1 ) * j + ( i - 1 );
                var c = ( widthSegments + 1 ) * j + i;
                var d = ( widthSegments + 1 ) * ( j - 1 ) + i;

                // face one
                indices[indexOffset] = a ; indexOffset++;
                indices[indexOffset ] = b; indexOffset++;
                indices[indexOffset ] = d; indexOffset++;

                // face two
                indices[indexOffset ] = b; indexOffset++;
                indices[indexOffset ] = c; indexOffset++;
                indices[indexOffset ] = d; indexOffset++;

            }

        }

        for(var x = 0; x < indices.length; x++) {
            indices[x] = indices[x] % mod;
        }

        this.indices = indices;



        console.log("Positions");
        console.log(this.positions);
        console.log(this.positions.length);
        console.log("Indices");
        console.log(this.indices);
        console.log(this.indices.length);

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

    return Ellipsoid;
});