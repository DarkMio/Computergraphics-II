define(["three", "shaders"], function(THREE, Shaders) {
    "use strict";

    var Sphere = function() {
        this.root = new THREE.Object3D();
        var scope = this;

        var uniforms = THREE.UniformsUtils.merge( [
            THREE.UniformsLib['lights'], {
                phongDiffuseMaterial: {type: 'c', value: new THREE.Color(1, 0, 0)},
                phongSpecularMaterial: {type: 'c', value: new THREE.Color(0.7, 0.7, 0.7)},
                phongAmbientMaterial: {type: 'c', value: new THREE.Color(0.2, 0.2, 0.2)},
                phongShininessMaterial: {type: 'f', value: 16.0},
                directionalLightDir: {type: 'v3', value: new THREE.Vector3(-1, 0, -0.4).normalize()},
                directionalLightCol: {type: 'c', value: new THREE.Color(0xAAAAAA)}
            }
        ]);

        console.log(uniforms);
        var material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            // vertexColors: THREE.VertexColors,
            vertexShader: Shaders.getVertexShader("phong"),
            fragmentShader: Shaders.getFragmentShader("phong"),
            lights: true
        });

        scope.mesh = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 32), material);
        scope.mesh.name = "sphere";

        scope.root.add(scope.mesh);

        this.getMesh = function() {
            return this.root;
        }
    };

    return Sphere;
});