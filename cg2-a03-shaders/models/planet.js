/* requireJS module definition */
define(["three", "shaders"],
    (function(THREE, Shaders) {

        "use strict";

        var Planet = function(nightTexture, dayTexture, cloudTexture) {


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

            var uniforms = THREE.UniformsUtils.merge( [
                THREE.UniformsLib['lights'], {
                    phongDiffuseMaterial: {type: 'c', value: new THREE.Color(1, 1, 1)},
                    phongSpecularMaterial: {type: 'c', value: new THREE.Color(0.7, 0.7, 0.7)},
                    phongAmbientMaterial: {type: 'c', value: new THREE.Color(0.4, 0.4, 0.4)},
                    phongShininessMaterial: {type: 'f', value: 1.0},
                    directionalLightDir: {type: 'v3', value: new THREE.Vector3(-1, 0, -0).normalize()},
                    directionalLightCol: {type: 'c', value: new THREE.Color(0xAAAAAA)},
                    // nightTexture: {value: nightTexture}
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
            scope.mesh.name = "planet";

            scope.root.add(scope.mesh);




            this.getMesh = function() {
                return this.root;
            };


        }; // constructor

        return Planet;

    })); // define module


