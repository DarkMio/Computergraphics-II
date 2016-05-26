/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: Random
 *
 * Generates a random set of points
 * inspired by http://threejs.org/examples/#webgl_interactive_buffergeometry
 */

/* requireJS module definition */
define(["three", "util"],
    (function(THREE, util) {

        "use strict";

        /**
         *
         * @param scene  - reference to the scene
         * @constructor
         */
        var Band = function (config, color) {
            console.log(color);
            var segments = config.segments || 100;
            var radius = config.radius || 300;
            var height = config.height || 100;
            this.positions = new Float32Array( 2 * segments * 3);
            this.colors = new Float32Array( 2 * segments * 3 );

            var _color = new THREE.Color();
            _color.setHex(color || "ff0000");

            var t0 = Math.PI * 2 / segments;

            var offset = 0;
            for(var i=0; i <= segments; i++) {
                // X and Z coordinates are on a circle around the origin
                var t = i*t0;
                var x = Math.sin(t) * radius;
                var z = Math.cos(t) * radius;

                // Y coordinates are simply -height/2 and +height/2
                var y0 = height/2;
                var y1 = -height/2;

                // add two points for each position on the circle
                // IMPORTANT: push each float value separately!
                this.colors[offset] = _color.r;
                this.positions[offset] = x;     offset++;
                this.colors[offset] = _color.g;
                this.positions[offset]   = y0;  offset++;
                this.colors[offset] = _color.b;
                this.positions[offset] = z;     offset++;

                this.colors[offset] = _color.r;
                this.positions[offset] = x;     offset++;
                this.colors[offset] = _color.g;
                this.positions[offset] = y1;    offset++;
                this.colors[offset] = _color.b;
                this.positions[offset] = z;     offset++;
            }

            var indices = new Uint32Array( segments*2*3 );
            // helper variables
            var indexOffset = 0;

            for (var j = 0; j < segments * 2; j += 2 ) {
                var mod = segments * 2;
                var a = j;
                var b = (j+1) % mod;
                var c = (j+2) % mod;
                var d = (j+3) % mod;
                // face one
                indices[ indexOffset] = a; indexOffset++;
                indices[ indexOffset] = b; indexOffset++;
                indices[ indexOffset] = c; indexOffset++;
                // face two
                indices[ indexOffset] = b; indexOffset++;
                indices[ indexOffset] = d; indexOffset++;
                indices[ indexOffset] = c; indexOffset++;
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

        return Band;
    }));
    
