define(["three", "ellipsoid", "mat4x4", "transform"], function(THREE, Ellipsoid, Mat4x4, Transform) {
    "use strict";

    var Robot = function Robot(size, color) {
        this.material = new THREE.MeshNormalMaterial();
        this.group = new THREE.Group();

        this.size = size || 1;

        this.group.add(this.build());
        console.log(this.group);
    };

    Robot.prototype.getMesh = function() {
        return this.group;
    };

    Robot.prototype.build = function() {
        return this.buildTorso();
    };

    Robot.prototype.buildHead = function() {
        var headBone = this.buildBone(0, -150 * this.size, "headBone");

        // Copy/Paste from HTML Controller
        var element = new Ellipsoid(32, 32, 50 * this.size, 75 * this.size, 50 * this.size, "#000000");
        var bufferGeometry = new THREE.BufferGeometry();
        bufferGeometry.addAttribute("position", new THREE.BufferAttribute(element.getPositions(), 3));
        bufferGeometry.addAttribute("color", element.getColors());
        bufferGeometry.setIndex(new THREE.BufferAttribute(element.getIndices(), 1));
        bufferGeometry.computeFaceNormals();
        bufferGeometry.computeVertexNormals();
        bufferGeometry.computeBoundingBox();
        var mesh = new THREE.Mesh(bufferGeometry, this.material);
        // Copy/Paste end
        headBone.add(mesh);
        return headBone;
    };

    Robot.prototype.buildTorso = function() {
        var centerBone = this.buildBone(0, 0, "centerBone");
        var upperTorso = this.buildUpperTorso(this.buildNeck(this.buildHead()));
        centerBone.add(upperTorso);
        var lowerTorso = this.buildLowerTorso();
        centerBone.add(lowerTorso);
        this.buildArms(upperTorso);
        this.buildLegs(lowerTorso);
        return centerBone;
    };

    Robot.prototype.buildUpperTorso = function(neck) {
        var upperTorso = this.buildBone(0, -37.5 * this.size, "upperTorsoBone");
        upperTorso.add(neck);
        upperTorso.add(this.buildMesh(new THREE.BoxGeometry(75 * this.size, 100 * this.size, 50 * this.size)));
        return upperTorso;
    };

    Robot.prototype.buildNeck = function(head) {
        var neck = this.buildBone(0, -62.5 * this.size, "neckBone");
        neck.add(head);
        neck.add(this.buildMesh(new THREE.CylinderGeometry(50 * this.size, 50 * this.size, 25 * this.size)));
        return neck;
    };

    Robot.prototype.buildLowerTorso = function() {
        var lowerTorsoBone = this.buildBone(0, 12.5 * this.size, "lowerTorsoBone");
        lowerTorsoBone.add(this.buildMesh(new THREE.BoxGeometry(100 * this.size, 25 * this.size, 40 * this.size)));
        return lowerTorsoBone;
    };

    Robot.prototype.buildArms = function(upperTorso) {
        var rightArm = this.buildBone(37.5 * this.size, -86.25 * this.size, "rightArmBone");
        var leftArm = this.buildBone(-37.5 * this.size, -86.25 * this.size, "leftArmBone");

        rightArm.add(this.buildMesh(new THREE.BoxGeometry(25 * this.size, 25 * this.size, 25 * this.size)));
        leftArm.add(this.buildMesh(new THREE.BoxGeometry(25 * this.size, 25 * this.size, 25 * this.size)));

        var rightArmBed = this.buildArmBed();
        var leftArmBed = this.buildArmBed();

        rightArm.add(rightArmBed);
        leftArm.add(leftArmBed);

        upperTorso.add(rightArm);
        upperTorso.add(leftArm);
    };

    Robot.prototype.buildArmBed = function() {
        var armBedBone = this.buildBone(0, 50 * this.size, "armBedBone");
        armBedBone.add(this.buildMesh(new THREE.CylinderGeometry(25 * this.size, 25 * this.size, 10 * this.size)));
        return armBedBone;
    };

    Robot.prototype.buildLegs = function(lowerTorso) {
        var rightLeg = this.buildBone(25 * this.size, 0, "rightLegBone");
        var leftLeg = this.buildBone(-25 * this.size, 0, "leftLegBone");

        var rightShank = this.buildShank();
        var leftShank = this.buildShank();

        var rightFoot = this.buildFoot();
        var leftFoot = this.buildFoot();

        rightShank.add(rightFoot);
        leftShank.add(leftFoot);

        rightLeg.add(rightShank);
        leftLeg.add(leftShank);

        lowerTorso.add(rightLeg);
        lowerTorso.add(leftLeg);
    };

    Robot.prototype.buildShank = function() {
        var shank = this.buildBone(0, 50 * this.size, "ShankBone");
        shank.add(this.buildMesh(new THREE.CylinderGeometry(25 * this.size, 25 * this.size, 20)));
        return shank;
    };

    Robot.prototype.buildFoot = function() {
        var footBone = this.buildBone(0, 50 * this.size, "FootBone");
        footBone.add(this.buildMesh(new THREE.CylinderGeometry(25 * this.size, 25 * this.size, 15)));
        return footBone;
    };

    Robot.prototype.makeGroup = function(name, elements) {
        var group = new THREE.Object3D();
        group.name = name;
        for(var i = 0; i < elements.length; i++) {
            group.add(elements[i]);
        }
        return group;
    };

    Robot.prototype.buildMesh = function(geometry) {
        return new THREE.Mesh(geometry, this.material);
    };

    Robot.prototype.buildBone = function(x, y, name) {
        var bone = new THREE.Object3D();
        bone.name = name || "";
        bone.position.x += x;
        bone.position.y -= y;
        bone.add(this.buildMesh(new THREE.SphereBufferGeometry(20)));
        return bone;
    };

    return Robot;
});