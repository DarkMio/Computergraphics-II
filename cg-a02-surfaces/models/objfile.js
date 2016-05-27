define(["three", "util", "objloader"], function(THREE, util, OBJLoader){
    "use strict";
    
    var OBJFile = function(file, scene) {
        var _ref = this;
        this.file = file;
        this.loader = new THREE.OBJLoader();
        console.log(file);
        console.log(this.loader);
        var reader = new FileReader();
        reader.onload = function (e) {
            var output = e.target.result;
            var mesh = _ref.loader.parse(output);
            mesh.scale.set(100, 100, 100);
            mesh.position.y = -100;
            mesh.children[0].material = util.materialSelector();
            scene.scene.add(mesh);
            scene.currentMesh = mesh;
        };
        reader.readAsText(file);
    };

    return OBJFile;
    

});