define(["three"], function(THREE) {
    "use strict";

    var Torus = function Torus() {
        var geometry = new THREE.TorusGeometry( 250, 90, 16, 100 );
        var material = new THREE.LineBasicMaterial();
        var torus = new THREE.Mesh( geometry, material );
        torus.rotation.x = 0.2;
        torus.rotation.y = 0.4;
        return torus;
    };

    return Torus;
});