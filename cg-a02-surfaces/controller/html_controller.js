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
define(["jquery", "BufferGeometry", "random", "band", "parametric", "cube", "knot", "torus", "ellipsoid", "wave_sphere", "snail_surface", "braided_torus", "util"],
    (function($,BufferGeometry, Random, Band, ParametricSurface, Cube, Knot, Torus, Ellipsoid, WaveSphere, SnailSurface, BraidedTorus, util) {
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
                    console.log("An error occurred while generating the mesh");
                    return;
                }
                var bufferGeometry = new THREE.BufferGeometry();
                bufferGeometry.addAttribute("position", new THREE.BufferAttribute(element.getPositions(), 3));
                if(values.enableColor) {
                    bufferGeometry.addAttribute("color", element.getColors())
                } else {
                    bufferGeometry.addAttribute("color", element.getPositions());
                }
                if(element.constructor.name === "Random") {
                    scene.addBufferPoints(bufferGeometry);
                } else {
                    bufferGeometry.setIndex(new THREE.BufferAttribute(element.getIndices(), 1));
                    scene.addBufferGeometry(bufferGeometry);
                }
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
                })
            });
            
            $("#btnEllipsoid").click(function() {
                sceneBuilder(function(values) {
                    return new Ellipsoid(values.segmentsWidth, values.segmentsHeight, 125, 250, 500, values.color);
                })
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
                })
            });

            $("#btnBraidedTorus").click(function() {
                sceneBuilder(function(values) {
                    return new BraidedTorus(values.segmentsHeight, values.segmentsWidth, values.size, values.color);
                })
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
                        var size = values.size || 200; // to emulate object environment
                        $.each([uMin, uMax], function(u_index, u) {
                            $.each([vMin, vMax], function(v_index, v) {
                                // test against each upper and lower bound individually
                                var result;
                                result = size * eval(posX);
                                result = size * eval(posY);
                                result = size * eval(posZ);
                            });
                        });
                        return new ParametricSurface({
                            heightSegments: values.heightSegments || 100,
                            widthSegments: values.widthSegments || 100,
                            posX: function(u, v){return eval(posX)},
                            posY: function(u, v){return eval(posY)},
                            posZ: function(u, v){return eval(posZ)},
                            vMin: vMin,
                            vMax: vMax,
                            uMin: uMin,
                            uMax: uMax,
                            size: values.size || 200,
                            color: values.color
                        });
                    } catch (err) {
                        util.fatalError(err);
                        return null;
                    }
                })
            });

            $("#checkWireframe").change(function() {
                if(!scene.currentMesh) { // if the scene is empty, we cant do jack shit anyway
                    return;
                }

                var children = scene.currentMesh.children;
                if(!children) {
                    return;
                }
                children[0].material.wireframe = this.checked;
            });

            $("#checkNormal").change(function() {
                if(!scene.currentMesh) {
                    return;
                }
                var children = scene.currentMesh.children;
                if(!children) {
                    return;
                }
                if(this.checked) {
                    this.oldMaterial = children[0].material;
                }
                if(this.checked) {
                    children[0].material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});
                } else {
                    children[0].material = this.oldMaterial;
                }
            })
        };

        // return the constructor function
        return HtmlController;


    })); // require



            
