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
define(["jquery", "BufferGeometry", "random", "band", "parametric", "cube", "knot", "torus", "ellipsoid", "wave_sphere", "snail_surface", "braided_torus"],
    (function($,BufferGeometry, Random, Band, ParametricSurface, Cube, Knot, Torus, Ellipsoid, WaveSphere, SnailSurface, BraidedTorus) {
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
                if(element == undefined || element == null) {
                    return;
                }
                var bufferGeometry = new THREE.BufferGeometry();
                bufferGeometry.addAttribute("position", new THREE.BufferAttribute(element.getPositions(), 3));
                if(values.enableColor) {
                    bufferGeometry.addAttribute("color", element.getColors())
                } else {
                    bufferGeometry.addAttribute("color", element.getPositions());
                }

                bufferGeometry.setIndex(new THREE.BufferAttribute(element.getIndices(), 1));

                scene.addBufferGeometry(bufferGeometry);
            };

            $("#btnParametric").click();

            $("#btnNewRandom").click(function() {
                sceneBuilder(function(values) {
                    return new Random(values.segmentsWidth);
                });
            });

            $("#btnNewBand").click(function() {
                var values = valueCollector();
                var config = {
                    segments : values.segmentsWidth || 1000,
                    radius : values.segmentsHeight || 300,
                    height : values.size || 100
                };
                var element = new Band(config, values.color);
                if(element == undefined || element == null) {
                    return;
                }
                var bufferGeometry = new THREE.BufferGeometry();
                bufferGeometry.addAttribute("position", new THREE.BufferAttribute(element.getPositions(), 3));
                if(values.enableColor) {
                    bufferGeometry.addAttribute("color", element.getColors())
                } else {
                    bufferGeometry.addAttribute("color", element.getPositions());
                }

                bufferGeometry.setIndex(new THREE.BufferAttribute(element.getIndices(), 1));

                scene.addBufferGeometry(bufferGeometry);
                console.log("Ping.");
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
                var values = valueCollector();
                var element =  new SnailSurface(values.segmentsHeight, values.segmentsWidth, values.size, values.color);
                if(element == undefined || element == null) {
                    return;
                }
                var bufferGeometry = new THREE.BufferGeometry();
                bufferGeometry.addAttribute("position", new THREE.BufferAttribute(element.getPositions(), 3));
                if(values.enableColor) {
                    bufferGeometry.addAttribute("color", element.getColors())
                } else {
                    bufferGeometry.addAttribute("color", element.getPositions());
                }

                bufferGeometry.setIndex(new THREE.BufferAttribute(element.getIndices(), 1));

                scene.addBufferGeometry(bufferGeometry);
                console.log("Ping.");
            });

            $("#btnBraidedTorus").click(function() {
                var values = valueCollector();
                var element = new BraidedTorus(values.segmentsHeight, values.segmentsWidth, values.size, values.color);
                if(element == undefined || element == null) {
                    return;
                }
                var bufferGeometry = new THREE.BufferGeometry();
                bufferGeometry.addAttribute("position", new THREE.BufferAttribute(element.getPositions(), 3));
                if(values.enableColor) {
                    bufferGeometry.addAttribute("color", element.getColors())
                } else {
                    bufferGeometry.addAttribute("color", element.getPositions());
                }

                bufferGeometry.setIndex(new THREE.BufferAttribute(element.getIndices(), 1));

                scene.addBufferGeometry(bufferGeometry);
                console.log("Ping.");
            });
            
            $("#btnNewParametric").click(function() {
                sceneBuilder(function(values) {
                    var posX = $("#fieldParamX").val();
                    var posY = $("#fieldParamY").val();
                    var posZ = $("#fieldParamZ").val();
                    var uMin = parseFloat($("#fieldUMin").val()) || 0;
                    var uMax = parseFloat($("#fieldUMax").val()) || 2 * Math.PI;
                    var vMin = parseFloat($("#fieldVMin").val()) || 0;
                    var vMax = parseFloat($("#fieldVMax").val()) || 2 * Math.PI;

                    try{
                        var size = values.size; // to emulate object environment
                        $.each([uMin, uMax], function(u_index, u) {
                            $.each([vMin, vMax], function(v_index, v) {
                                // test against each upper and lower bound individually
                                var result;
                                result = size * eval(posX);
                                result = size * eval(posY);
                                result = size * eval(posZ);
                            });
                        });
                        return new ParametricSurface(values.segmentsHeight, values.segmentsWidth, values.size,
                            posX, posY, posZ, uMin, uMax, vMin, vMax, values.color);
                    } catch (Error) {
                        return null;
                    }
                })
            })
        };

        // return the constructor function
        return HtmlController;


    })); // require



            
