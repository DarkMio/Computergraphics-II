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
define(["three", "util", "shaders", "BufferGeometry"],
    (function(THREE, util, shaders, BufferGeometry) {

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

            setupLightning();

            // Add a listener for 'keydown' events. By this listener, all key events will be
            // passed to the function 'onDocumentKeyDown'. There's another event type 'keypress'.
            document.addEventListener("keydown", onDocumentKeyDown, false);

            scope.audioListener = new THREE.AudioListener();
            scope.camera.add(scope.audioListener);

            scope.start = Date.now();


            /**
             * Sets up some nice lights in the given scene.
             */
            function setupLightning() {
                scope.lightRotation = -Math.PI/2;
                var ambient = new THREE.AmbientLight(0xAAAAAA);
                var direct = new THREE.DirectionalLight(0xDDDDDD, 1.0);
                direct.name = "directLight";
                direct.position.set(Math.sin(scope.lightRotation), 0, Math.cos(scope.lightRotation)).normalize();
                scope.scene.add(ambient);
                scope.scene.add(direct);

                scope.light = direct;

                /*
                var main = new THREE.PointLight(0xFFFFFF, 0.8, 1500);
                main.position.z = 1000;


                var secondary = new THREE.PointLight(0xC9163C, 0.3, 1000);
                secondary.position.y = 500;
                secondary.position.z = 50;

                var tertiary = new THREE.PointLight(0xF3FF73, 0.3, 1000);
                secondary.position.y = -500;
                secondary.position.z = -50;

                var ambient = new THREE.AmbientLight( 0xAAAAAA );

                scene.add(ambient);
                scene.add(main);
                scene.add(secondary);
                scene.add(tertiary);
                */
            }

            function onDocumentKeyDown(event){
                if(!scope.currentMesh) {
                    return;
                }
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
                bufferGeometry.computeFaceNormals();
                bufferGeometry.computeVertexNormals();
                bufferGeometry.computeBoundingBox();
                var mesh = new THREE.Mesh(bufferGeometry, util.materialSelector());
                var points =  new THREE.Points(bufferGeometry, new THREE.PointsMaterial({
                    color: 0xAA3300,
                    size: 2
                }));
                points.visible = $("#checkPoints").is(":checked");
                var group = new THREE.Object3D();
                group.add(mesh);
                group.add(points);
                scope.currentMesh = group;
                scope.scene.add(scope.currentMesh);
            };

            this.addBufferPoints = function(bufferGeometry) {
                bufferGeometry.computeBoundingBox();
                scope.currentMesh = new THREE.Points(bufferGeometry, new THREE.PointsMaterial({
                    color: 0xAA3300,
                    size: 15
                }));
                scope.scene.add(scope.currentMesh);
            };

            this.addMesh = function(mesh) {
                scope.currentMesh = mesh;
                scope.scene.add(scope.currentMesh);
            };

            /*
             * drawing the scene
             */
            this.draw = function() {
                requestAnimFrame( scope.draw );
                
                
                
                if($("#checkAnimate").is(":checked") && scope.currentMesh) {
                    // scope.currentMesh.rotation.x += 0.003;
                    scope.currentMesh.rotation.y -= 0.003;
                    // scope.currentMesh.rotation.z += 0.003;

                }

                if($("#checkLightAnimate").is(":checked") && scope.currentMesh) {
                    var rot = scope.lightRotation;
                    scope.lightRotation = (rot + 0.01) % (2 * Math.PI);
                    scope.light.position.set(Math.sin(rot), 0, Math.cos(rot)).normalize();
                    if(scope.currentMesh.name == "planet") {
                        var uni = scope.currentMesh.children[0].material.uniforms;
                        // uni.directionalLightCol.value = scope.light.color;
                        uni.directionalLightDir.value = scope.light.position;
                        // console.log(obj);
                    }
                }

                if(scope.currentMesh && scope.currentMesh.name === "explosion") {
                    scope.currentMesh.children[0].material.uniforms['time'].value = .00035 * (Date.now() - scope.start);

                }

                scope.renderer.render(scope.scene, scope.camera);
            };
        };


        // this module only exports the constructor for Scene objects
        return Scene;

    })
); // define

    
