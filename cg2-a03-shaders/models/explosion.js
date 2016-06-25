/* requireJS module definition */
define(["jquery", "three", "shaders"],
    (function($, THREE, Shaders) {

        "use strict";

        var Explosion = function Explosion(explosionTexture) {
            this.root = new THREE.Object3D();

            var scope = this;

            var material = new THREE.ShaderMaterial( {
                uniforms: {
                    explosionTex: {value: explosionTexture},
                    time: {type: 'f', value: 1},
                    weight: {type: 'f', value: 25},
                    freqScale: {type: 'f', value: 0.5},
                    colorScale: {type: 'f', value: 1.}
                },
                vertexShader: Shaders.getVertexShader("explosion"),
                fragmentShader: Shaders.getFragmentShader("explosion")
            });

            scope.mesh = new THREE.Mesh( new THREE.SphereGeometry( 300, 100, 100 ), material );
            scope.root.name = "explosion";
            scope.root.add(scope.mesh);





            this.getMesh = function() {
                return this.root;
            };



        }; // constructor

        return Explosion;

    })); // define module

