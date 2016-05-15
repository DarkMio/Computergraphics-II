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
define(["jquery", "BufferGeometry", "random", "band", "cube", "knot", "torus"],
    (function($,BufferGeometry, Random, Band, Cube, Knot, Torus) {
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

            $("#btnCube").click(function() {
                var cube = new Cube();
                scene.scene.add(cube);
                scene.draw();
            });

            $("#btnKnot").click(function () {
                var knot = new Knot();
                scene.scene.add(knot);
                scene.draw();
            });

            $("#btnTorus").click(function() {
                var torus = new Torus();
                scene.scene.add(torus);
                scene.draw();
            })


        };

        // return the constructor function
        return HtmlController;


    })); // require



            
