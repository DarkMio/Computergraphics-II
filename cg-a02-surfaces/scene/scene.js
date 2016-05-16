/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: scene
 *
 * A Scene is a depth-sorted collection of things to be drawn, 
 * plus a background fill style.
 *
 */



/* requireJS module definition */
define(["three", "util", "shaders", "BufferGeometry", "random", "band"],
    (function(THREE, util, shaders, BufferGeometry, Random, Band) {

        "use strict";

        /*
         * Scene constructor
         */
        var Scene = function(renderer, width, height) {

            // the scope of the object instance
            var scope = this;

            scope.renderer = renderer;
            scope.t = 0.0;

            scope.camera = new THREE.PerspectiveCamera( 66, width / height, 0.1, 2000 );
            scope.camera.position.z = 1000;
            scope.scene = new THREE.Scene();

            // Add a listener for 'keydown' events. By this listener, all key events will be
            // passed to the function 'onDocumentKeyDown'. There's another event type 'keypress'.
            document.addEventListener("keydown", onDocumentKeyDown, false);


            function onDocumentKeyDown(event){
                // Get the key code of the pressed key
                var keyCode = event.which;

                if(keyCode == 38){ // Cursor down
                    scope.currentMesh.rotation.x += 0.05;
                } else if(keyCode == 40){ // Cursor left
                    scope.currentMesh.rotation.x += -0.05;
                } else if(keyCode == 37){ // Cursor right
                    scope.currentMesh.rotation.y += 0.05;
                } else if(keyCode == 39){ // Cursor up
                    scope.currentMesh.rotation.y += -0.05;
                } else if(keyCode == 87) { // w
                    scope.currentMesh.position.z += 10;
                } else if(keyCode == 83) { // s
                    scope.currentMesh.position.z -= 10;
                } else if(keyCode == 65) { // a
                    scope.currentMesh.position.x -= 10;
                } else if(keyCode == 68) { // d
                    scope.currentMesh.position.x += 10;
                }
            }

            this.addBufferGeometry = function(bufferGeometry) {
                scope.currentMesh = bufferGeometry.getMesh();
                scope.scene.add( scope.currentMesh );

            };

            /*
             * drawing the scene
             */
            this.draw = function() {
                requestAnimFrame( scope.draw );
                if($("#checkAnimate").is(":checked")) {
                    scope.currentMesh.rotation.x += 0.003;
                    scope.currentMesh.rotation.y += 0.003;
                    scope.currentMesh.rotation.z += 0.003;
                }

                scope.renderer.render(scope.scene, scope.camera);
            };
        };


        // this module only exports the constructor for Scene objects
        return Scene;

    })); // define

    
