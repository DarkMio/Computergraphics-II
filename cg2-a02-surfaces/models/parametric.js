/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: ParametricSurface
 *
 */

/* requireJS module definition */
define(["three", "util"],
    (function(THREE, util) {

        "use strict";

        /**
         * Config should contain:
         * * heightSegments
         * * widthSegments
         * * uMin, uMax
         * * vMin, vMax
         * * size
         * * color
         * * posX, posY, posZ
         * @param config
         * @constructor
         */
        var ParametricSurface = function (config) {
            var heightSegments = config.heightSegments;
            var widthSegments = config.widthSegments;
            var size = config.size;
            this.positions = new Float32Array(heightSegments * widthSegments * 3);
            this.colors = new Float32Array(heightSegments * widthSegments * 3);
            var _color = new THREE.Color();
            _color.setHex(config.color);

            var index = 0;
            var t_u = (config.uMax - config.uMin) / (widthSegments - 1);
            var t_v = (config.vMax - config.vMin) / (heightSegments - 1);
            for(var y = 0; y <= heightSegments; y++) {
                var v = t_v * y + config.vMin;

                for (var x = 0; x <= widthSegments; x++) {
                    var u = t_u * x + config.uMin;

                    var px = size * config["posX"](u, v);
                    var py = size * config["posY"](u, v);
                    var pz = size * config["posZ"](u, v);

                    this.positions[index] = px;
                    this.positions[index + 1] = py;
                    this.positions[index + 2] = pz;

                    this.colors[index] = _color.r;
                    this.colors[index + 1] = _color.g;
                    this.colors[index + 2] = _color.b;

                    index += 3;
                }
            }

            this.indices = util.calculateIndices(widthSegments, heightSegments);
        };

        ParametricSurface.prototype.getIndices = function() {
            return this.indices;
        };

        ParametricSurface.prototype.getPositions = function() {
            return this.positions;
        };

        ParametricSurface.prototype.getColors = function() {
            return this.colors;
        };

        return ParametricSurface;
    }));

