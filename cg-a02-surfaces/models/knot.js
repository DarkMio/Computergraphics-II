define(["three"], function(THREE) {
    "use strict";

    var Knot = function Knot() {
        var geometry = new THREE.TorusKnotGeometry(250, 100, 100, 16);
        var material = new THREE.MeshNormalMaterial();
        var torus = new THREE.Mesh( geometry, material );
        torus.rotation.x = 0.2;
        torus.rotation.y = 0.4;
        return torus;
    };

    return Knot;
});