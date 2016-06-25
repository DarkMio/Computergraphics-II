/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var Planet = function Planet(nightTexture, dayTexture, cloudTexture, scene) {


            console.log(nightTexture);

            this.root = new THREE.Object3D();

            // load and create required textures
            
            var scope = this;

            // implement ShaderMaterial using the code from
            // the lecture
            
            // hint:
            // texture can be assigned only when it is loaded completely
            // and then can be set like any other uniform variable
            // material.uniforms.<uniform-var-name>.value   = <uniform-value>;

            var directionalLight = scene.children[1];
            var ambientLight = scene.children[0];



            var uniforms = THREE.UniformsUtils.merge( [
                THREE.UniformsLib['lights'], {
                    phongDiffuseMaterial: {type: 'c', value: new THREE.Color(1, 1, 1)},
                    phongSpecularMaterial: {type: 'c', value: new THREE.Color(0.7, 0.7, 0.7)},
                    phongAmbientMaterial: {type: 'c', value: ambientLight.color},
                    phongShininessMaterial: {type: 'f', value: 2.0},
                    directionalLightDir: {type: 'v3', value: directionalLight.position},
                    directionalLightCol: {type: 'c', value: directionalLight.color}
                }
            ]);

            uniforms.nightTexture = {value: nightTexture};
            uniforms.dayTexture = {value: dayTexture};
            uniforms.cloudTexture = {value: cloudTexture};

            var material = new THREE.ShaderMaterial({
                uniforms: uniforms,
                // vertexColors: THREE.VertexColors,
                vertexShader: Shaders.getVertexShader("planet"),
                fragmentShader: Shaders.getFragmentShader("planet"),
                lights: true
            });


            scope.mesh = new THREE.Mesh( new THREE.SphereGeometry(400, 100,100), material );
            scope.root.name = "planet";
            scope.root.add(scope.mesh);




            this.getMesh = function() {
                return this.root;
            };


        }; // constructor

        return Planet;

    })); // define module


