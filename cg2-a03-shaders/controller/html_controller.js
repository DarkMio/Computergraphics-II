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
define(["jquery", "BufferGeometry", "phong", "planet", "explosion", "three"],
    (function($,BufferGeometry, Phong, Planet, Explosion, THREE) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(scene) {

            var scope = this;

            $("#btnSphere").click( function() {
                var sphere = new Phong();
                scene.addMesh(sphere.getMesh());
            });

            $("#btnPlanet").click( function() {
                function closure() {
                    var night = null;
                    var day = null;
                    var cloud = null;

                    var scope = this;
                    function register(name, value) {
                        if(name == "night") {
                            night = value;
                        } else if(name == "day") {
                            day = value;
                        } else if(name == "cloud") {
                            cloud = value;
                        }
                        if(day && night && cloud)  {
                            scene.addMesh(new Planet(night, day, cloud, scene.scene).getMesh());
                            night = null;
                            day = null;
                            cloud = null;
                        }
                    }

                    return register;
                }

                var loaderRegister = closure();


                var loader = new THREE.TextureLoader();
                loader.load("textures/earth_month04.jpg", function(texture) {
                    loaderRegister("day", texture);
                });

                loader.load("textures/earth_at_night_2048.jpg", function(texture) {
                    loaderRegister("night", texture);
                });

                loader.load("textures/earth_clouds_2048.jpg", function(texture) {
                    loaderRegister("cloud", texture);
                });
            });

            $('#btnExplosion').click(function() {
                var loader = new THREE.TextureLoader();
                loader.load("textures/explosion.png", function(texture) {
                    scene.addMesh(new Explosion(texture).getMesh());
                    scope.setExplosionFilds();

                });

            });

            this.setExplosionFilds = function() {
                if(scene.currentMesh.name === "explosion") {
                    var uniforms = scene.currentMesh.children[0].material.uniforms;
                    $("#fieldFrequency").val(uniforms.freqScale.value);
                    $("#fieldColorScale").val(uniforms.colorScale.value);
                    $("#fieldWeight").val(uniforms.weight.value);
                }
            };

            var changeListener = function() {
                console.log("???");
                var freqScale = $("#fieldFrequency").val();
                var colorScale = $("#fieldColorScale").val();
                var weight = $("#fieldWeight").val();

                if(scene.currentMesh.name === "explosion") {
                    var uniforms = scene.currentMesh.children[0].material.uniforms;
                    uniforms.freqScale.value = parseFloat(freqScale);
                    uniforms.colorScale.value = parseFloat(colorScale);
                    uniforms.weight.value = parseFloat(weight);
                    console.log(parseFloat(freqScale), freqScale)
                }
            };

            $("#fieldFrequency").on('input', changeListener);
            $("#fieldColorScale").on('input', changeListener);
            $("#fieldWeight").on('input', changeListener);



        };

        // return the constructor function
        return HtmlController;


    })); // require



            
