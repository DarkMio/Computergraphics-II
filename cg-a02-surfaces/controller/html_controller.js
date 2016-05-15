/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */


/* requireJS module definition */
define(["jquery", "BufferGeometry", "random", "band", "cube", "knot", "torus", "ellipsoid", "wave_sphere", "snail_surface", "braided_torus"],
    (function($,BufferGeometry, Random, Band, Cube, Knot, Torus, Ellipsoid, WaveSphere, SnailSurface, BraidedTorus) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(scene) {
            var valueCollector = function() {
                return {
                    segmentsWidth : parseInt($("#fieldSegmentsWidth").val()),
                    segmentsHeight : parseInt($("#fieldSegmentsHeight").val()),
                    size :  parseInt($("#fieldSize").val()),
                    color : eval("0x" + $("#fieldColor").val().substr(1)),
                    enableColor : $("#boxColor").is(":checked")
                }
            };

            var sceneBuilder = function(callback) {
                var values = valueCollector();
                var element = callback(values);
                var bufferGeometry = new BufferGeometry();
                bufferGeometry.addAttribute("position", element.getPositions());
                if(values.enableColor) {
                    bufferGeometry.addAttribute("color", element.getColors())
                } else {
                    bufferGeometry.addAttribute("color", element.getPositions());
                }

                scene.addBufferGeometry(bufferGeometry);
            };

            $("#btnNewRandom").click(function() {
                sceneBuilder(function(values) {
                    return new Random(values.segmentsWidth);
                });
            });

            $("#btnNewBand").click(function() {
                sceneBuilder(function(values) {
                    var config = {
                        segments : values.segmentsWidth || 1000,
                        radius : values.segmentsHeight || 300,
                        height : values.size || 100
                    };
                    return new Band(config, values.color);
                });
            });
            
            $("#btnEllipsoid").click(function() {
                sceneBuilder(function(values) {
                    return new Ellipsoid(values.heightSegments,
                                         values.widthSegments,
                                         125, 250, 500,
                                         values.color);
                });
            });

            $("#btnCube").click(function() {
                var cube = new Cube();
                scene.scene.add(cube);
                scene.currentMesh = cube;
            });

            $("#btnKnot").click(function () {
                var knot = new Knot();
                scene.scene.add(knot);
                scene.currentMesh = knot;
            });

            $("#btnTorus").click(function() {
                var torus = new Torus();
                scene.scene.add(torus);
                scene.currentMesh = torus;
            });

            $("#btnWaveSphere").click(function() {
                sceneBuilder(function(values) {
                    return new WaveSphere(values.segmentsHeight, values.segmentsWidth, values.size, values.color);
                });
            });

            $("#btnSnailSurface").click(function() {
                sceneBuilder(function(values) {
                    return new SnailSurface(values.segmentsHeight, values.segmentsWidth, values.size, values.color);
                });
            });

            $("#btnBraidedTorus").click(function() {
                sceneBuilder(function(values) {
                    return new BraidedTorus(values.segmentsHeight, values.segmentsWidth, values.size, values.color);
                });
            });
        };

        // return the constructor function
        return HtmlController;


    })); // require



            
