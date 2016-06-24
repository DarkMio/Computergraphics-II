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
define(["jquery", "BufferGeometry", "phong", "planet"],
    (function($,BufferGeometry, Phong, Planet) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(scene) {

            $("#btnSphere").click( function() {
                var sphere = new Phong();
                scene.addMesh(sphere.getMesh());
            });

            $("#btnPlanet").click( function() {
                var planet = new Planet();
                scene.addMesh(planet.getMesh());
            })

        };

        // return the constructor function
        return HtmlController;


    })); // require



            
