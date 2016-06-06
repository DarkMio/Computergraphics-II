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
        var headBone = this.buildBone(0, -37.5, "headBone");

        // Copy/Paste from HTML Controller
        var element = new Ellipsoid(32, 32, 25 * this.size, 37.5 * this.size, 25 * this.size, "#000000");
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
        var upperTorso = this.buildBone(0, -50, "upperTorsoBone");
        upperTorso.add(neck);
        upperTorso.add(this.buildMesh(new THREE.BoxGeometry(75 * this.size, 100 * this.size, 50 * this.size)));
        return upperTorso;
    };

    Robot.prototype.buildNeck = function(head) {
        var neck = this.buildBone(0, -62.5, "neckBone");
        neck.add(head);
        neck.add(this.buildMesh(new THREE.CylinderGeometry(25 * this.size, 25 * this.size, 25 * this.size, 32)));
        return neck;
    };

    Robot.prototype.buildLowerTorso = function() {
        var lowerTorsoBone = this.buildBone(0, 12.5, "lowerTorsoBone");
        lowerTorsoBone.add(this.buildMesh(new THREE.BoxGeometry(100 * this.size, 25 * this.size, 40 * this.size)));
        return lowerTorsoBone;
    };

    Robot.prototype.buildArms = function(upperTorso) {
        var rightArm = this.buildUpperArm(50,"right"); // this is different than in the sketch
        var leftArm = this.buildUpperArm(-50, "left");  // because the objects overlap too hard

        upperTorso.add(rightArm);
        upperTorso.add(leftArm);
    };

    Robot.prototype.buildUpperArm = function(x, namePrefix) {
        var armBone = this.buildBone(x, -36.25, namePrefix + "ArmBone");
        armBone.add(this.buildMesh(new THREE.BoxGeometry(25 * this.size, 25 * this.size, 25 * this.size)));
        var upperArm = this.buildMesh(new THREE.CylinderGeometry(10 * this.size, 10 * this.size, 50 * this.size));
        upperArm.position.y -= 25 * this.size;
        armBone.add(upperArm);
        armBone.add(this.buildArmBed(namePrefix));
        return armBone;
    };

    Robot.prototype.buildArmBed = function(name) {
        var armBedBone = this.buildBone(0, 50, name + "ArmBedBone");
        armBedBone.add(this.buildMesh(new THREE.CylinderGeometry(12.5 * this.size, 12.5 * this.size, 10 * this.size, 32)));


        var armBed = this.buildMesh(new THREE.CylinderGeometry(7.5 * this.size, 7.5 * this.size, 25 * this.size, 32));
        armBed.position.y -= 12.5 * this.size;
        armBedBone.add(armBed);

        var hand = this.buildMesh(new THREE.SphereBufferGeometry(7.5 * this.size, 32, 32));
        hand.position.y -= 25 * this.size;
        armBedBone.add(hand);

        return armBedBone;
    };

    Robot.prototype.buildLegs = function(lowerTorso) {
        var rightLeg = this.buildLeg(25, "right");
        var leftLeg = this.buildLeg(-25, "left");

        lowerTorso.add(rightLeg);
        lowerTorso.add(leftLeg);
    };

    Robot.prototype.buildLeg = function(x, namePrefix) {
        var legBone = this.buildBone(x, 0, namePrefix + "LegBone");
        var leg = this.buildMesh(new THREE.CylinderGeometry(12.5 * this.size, 12.5 * this.size,50 * this.size, 32));
        leg.position.y -= 25 * this.size;
        legBone.add(leg);


        var shank = this.buildShank(namePrefix);
        var foot = this.buildFoot(namePrefix);

        shank.add(foot);
        legBone.add(shank);

        return legBone;

    };

    Robot.prototype.buildShank = function(name) {
        var shankBone = this.buildBone(0, 50, name + "ShankBone");
        shankBone.add(this.buildMesh(new THREE.CylinderGeometry(15 * this.size, 15 * this.size, 20 * this.size, 32)));
        var shank = this.buildMesh(new THREE.CylinderGeometry(10 * this.size, 10 * this.size, 50 * this.size));
        shank.position.y -= 25 * this.size;
        shankBone.add(shank);
        return shankBone;
    };

    Robot.prototype.buildFoot = function(name) {
        var footBone = this.buildBone(0, 50, name + "FootBone");
        footBone.add(this.buildMesh(new THREE.CylinderGeometry(12.5 * this.size, 12.5 * this.size, 15 * this.size, 32)));
        var footPlate = this.buildMesh(new THREE.PlaneBufferGeometry(50 * this.size, 50 * this.size));
        footPlate.rotateX(-Math.PI/2);
        footPlate.position.y -= 7.5 * this.size;
        footBone.add(footPlate);
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
        bone.position.x += x * this.size;
        bone.position.y -= y * this.size;
        bone.add(this.buildMesh(new THREE.SphereBufferGeometry(20)));
        return bone;
    };

    return Robot;
});