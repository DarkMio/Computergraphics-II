/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: ParametricSurface
 *
 */

/* requireJS module definition */
define(["three"],
    (function(THREE) {

        "use strict";

        var ParametricSurface = function (heightSegments, widthSegments, size,
                                          posX, posY, posZ,
                                          uMin, uMax, vMin, vMax,
                                          color) {
            console.log(posX);
            heightSegments |= 100;
            widthSegments |= 100;
            size |= 100;

            this.positions = new Float32Array(heightSegments * widthSegments * 3);
            this.colors = new Float32Array(heightSegments * widthSegments * 3);

            var _color = new THREE.Color();
            _color.setHex(color);
            var index = 0;

            var t_u = (uMax - uMin) / widthSegments;
            var t_v = (vMax - vMin) / heightSegments;
            for(var y = 0; y < heightSegments; y++) {
                var v = t_v * y + vMin;

                for (var x = 0; x < widthSegments; x++) {
                    var u = t_u * x + uMin;

                    // console.log(posX);

                    var px = size * eval(posX);
                    var py = size * eval(posY);
                    var pz = size * eval(posZ);

                    this.positions[index] = px;
                    this.positions[index + 1] = py;
                    this.positions[index + 2] = pz;

                    // console.log("[" + px + ", " + py + ", " + pz +"]");
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

        return ParametricSurface;
    }));

