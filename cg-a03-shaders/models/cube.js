define(["three"], function(THREE) {
    "use strict";
    
    var Cube = function Cube(config){
        var geometry = new THREE.BoxGeometry(500, 500, 500);
        var material = new THREE.MeshNormalMaterial();
        var cube = new THREE.Mesh(geometry, material);
        cube.rotation.x = 2;
        cube.rotation.z = 0.5;
        return cube;
    };

    return Cube;
});