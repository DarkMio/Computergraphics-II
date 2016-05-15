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
define(["jquery", "BufferGeometry", "random", "band", "cube", "knot", "torus", "ellipsoid", "wave_sphere", "snail_surface"],
    (function($,BufferGeometry, Random, Band, Cube, Knot, Torus, Ellipsoid, WaveSphere, SnailSurface) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(scene) {


            $("#random").show();
            $("#band").hide();

            $("#btnRandom").click( (function() {
                $("#random").show();
                $("#band").hide();
            }));

            $("#btnBand").click( (function() {
                $("#random").hide();
                $("#band").show();
            }));

            $("#btnNewRandom").click( (function() {

                var numPoints = parseInt($("#numItems").attr("value"));
                var random = new Random(numPoints);
                var bufferGeometryRandom = new BufferGeometry();
                bufferGeometryRandom.addAttribute("position", random.getPositions());
                bufferGeometryRandom.addAttribute("color", random.getColors());

                scene.addBufferGeometry(bufferGeometryRandom);
            }));


            $("#btnNewBand").click( (function() {

                var config = {
                    segments : parseInt($("#numSegments").attr("value")),
                    radius : parseInt($("#radius").attr("value")),
                    height : parseInt($("#height").attr("value"))
                };


                var band = new Band(config);
                var bufferGeometryBand = new BufferGeometry();
                bufferGeometryBand.addAttribute("position", band.getPositions());
                bufferGeometryBand.addAttribute("color", band.getColors());

                scene.addBufferGeometry(bufferGeometryBand);
            }));
            
            $("#btnEllipsoid").click(function() {
                var ellip = new Ellipsoid();
                var bufferedGeometryEllip = new BufferGeometry();
                bufferedGeometryEllip.addAttribute("position", ellip.getPositions());
                bufferedGeometryEllip.addAttribute("color", ellip.getPositions());

                scene.addBufferGeometry(bufferedGeometryEllip);
            });

            $("#btnCube").click(function() {
                var cube = new Cube();
                scene.scene.add(cube);
                scene.currentMesh = cube;
                scene.draw();
            });

            $("#btnKnot").click(function () {
                var knot = new Knot();
                scene.scene.add(knot);
                scene.currentMesh = knot;
                scene.draw();
            });

            $("#btnTorus").click(function() {
                var torus = new Torus();
                scene.scene.add(torus);
                scene.currentMesh = torus;
                scene.draw();
            });

            $("#btnWaveSphere").click(function() {
                var wvsphere = new WaveSphere();
                var bufferGeo = new BufferGeometry();
                bufferGeo.addAttribute("position", wvsphere.getPositions());
                bufferGeo.addAttribute("color", wvsphere.getPositions());

                scene.addBufferGeometry(bufferGeo);
            });

            $("#btnSnailSurface").click(function() {
                var ssurface = new SnailSurface();
                var bufferGeo = new BufferGeometry();
                bufferGeo.addAttribute("position", ssurface.getPositions());
                bufferGeo.addAttribute("color", ssurface.getPositions());

                scene.addBufferGeometry(bufferGeo);
            })


        };

        // return the constructor function
        return HtmlController;


    })); // require



            
