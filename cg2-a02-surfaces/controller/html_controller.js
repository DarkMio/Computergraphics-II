/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */


/* requireJS module definition */
define(["jquery", "BufferGeometry", "random", "band", "parametric", "cube", "knot", "torus", "ellipsoid",
    "wave_sphere", "snail_surface", "braided_torus", "util", "inputfiletext", "objfile", "robot", "tween"],
    (function($,BufferGeometry, Random, Band, ParametricSurface, Cube, Knot, Torus, Ellipsoid, WaveSphere, SnailSurface, BraidedTorus, util, inputFileText, OBJFile, Robot, TWEEN) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(scene) {

            var sceneBuilder = function(callback) {
                var values = util.valueCollector();
                var element = callback(values);
                if(element == undefined || element == null) {
                    console.log("An error occurred while generating the mesh");
                    return;
                }
                var bufferGeometry = new THREE.BufferGeometry();
                bufferGeometry.addAttribute("position", new THREE.BufferAttribute(element.getPositions(), 3));
                bufferGeometry.addAttribute("color", element.getColors());
                if(element.constructor.name === "Random") {
                    scene.addBufferPoints(bufferGeometry);
                } else {
                    bufferGeometry.setIndex(new THREE.BufferAttribute(element.getIndices(), 1));
                    scene.addBufferGeometry(bufferGeometry);
                }
            };

            $("#btnNewRandom").click(function() {
                sceneBuilder(function(values) {
                    return new Random(values.segmentsWidth);
                });
            });

            $("#btnNewBand").click(function() {
                sceneBuilder(function(values) {
                    var config = {
                        segments : values.segmentsWidth || 1000,
                        radius : values.segmentsHeight || 300,
                        height : values.size || 100
                    };
                    return new Band(config, values.color);
                })
            });
            
            $("#btnEllipsoid").click(function() {
                sceneBuilder(function(values) {
                    return new Ellipsoid(values.segmentsWidth, values.segmentsHeight, 125, 250, 500, values.color);
                })
            });

            $("#btnCube").click(function() {
                var cube = new Cube();
                scene.scene.add(cube);
                scene.currentMesh = cube;
            });

            $("#btnKnot").click(function () {
                var knot = new Knot();
                scene.scene.add(knot);
                scene.currentMesh = knot;
            });

            $("#btnTorus").click(function() {
                var torus = new Torus();
                scene.scene.add(torus);
                scene.currentMesh = torus;
            });

            $("#btnWaveSphere").click(function() {
                sceneBuilder(function(values) {
                    return new WaveSphere(values.segmentsHeight, values.segmentsWidth, values.size, values.color);
                });
            });

            $("#btnSnailSurface").click(function() {
                sceneBuilder(function(values) {
                    return new SnailSurface(values.segmentsHeight, values.segmentsWidth, values.size, values.color);
                })
            });

            $("#btnBraidedTorus").click(function() {
                sceneBuilder(function(values) {
                    return new BraidedTorus(values.segmentsHeight, values.segmentsWidth, values.size, values.color);
                })
            });
            
            $("#btnNewParametric").click(function() {
                sceneBuilder(function(values) {
                    var posX = $("#fieldParamX").val();
                    var posY = $("#fieldParamY").val();
                    var posZ = $("#fieldParamZ").val();
                    var uMin = parseFloat($("#fieldUMin").val()) || 0;
                    var uMax = parseFloat($("#fieldUMax").val()) || 2 * Math.PI;
                    var vMin = parseFloat($("#fieldVMin").val()) || 0;
                    var vMax = parseFloat($("#fieldVMax").val()) || 2 * Math.PI;

                    try{
                        var size = values.size || 200; // to emulate object environment
                        $.each([uMin, uMax], function(u_index, u) {
                            $.each([vMin, vMax], function(v_index, v) {
                                // test against each upper and lower bound individually
                                var result;
                                result = size * eval(posX);
                                result = size * eval(posY);
                                result = size * eval(posZ);
                            });
                        });
                        return new ParametricSurface({
                            heightSegments: values.heightSegments || 100,
                            widthSegments: values.widthSegments || 100,
                            posX: function(u, v){return eval(posX)},
                            posY: function(u, v){return eval(posY)},
                            posZ: function(u, v){return eval(posZ)},
                            vMin: vMin,
                            vMax: vMax,
                            uMin: uMin,
                            uMax: uMax,
                            size: values.size || 200,
                            color: values.color
                        });
                    } catch (err) {
                        util.fatalError(err);
                        return null;
                    }
                })
            });

            $('#fieldColor').change(function() {
                var children = util.sceneSelector(scene);
                if(!children) {
                    return;
                }

                children[0].material.color.setHex(eval("0x" + $("#fieldColor").val().substr(1)));
            });

            $('#choose-file').inputFileText({text: 'OBJ File'}).change(function(e) {
                var file = e.target.files[0];
                new OBJFile(file, scene);
            });

            $("#selectionMaterials").change(function() {
                var children = util.sceneSelector(scene);
                if(!children) {
                    return;
                }
                children[0].material = util.materialSelector();
            });

            $("#checkWireframe").change(function() {
                var children = util.sceneSelector(scene);
                if(!children) {
                    return;
                }

                children[0].material.wireframe = this.checked;
            });

            $("#checkPoints").change(function() {
                var children = util.sceneSelector(scene);
                if(!children || children.length < 2) {
                    return;
                }
                children[1].visible = this.checked;
            });


            $("#btnRobot").click(function() {
                scene.addMesh(new Robot(3, null).getMesh());
            });

            $("#btnMusic").click(function() {
                if(!this.audio) {
                    var loader = new THREE.AudioLoader();
                    this.audio = new THREE.Audio(scene.audioListener);
                    var a = this.audio;
                    scene.scene.add(a);
                    loader.load("data/audio/vaporware.mp3", function (audioBuffer) {
                        a.setBuffer(audioBuffer);
                        a.play();
                    });
                    return;
                }

                if(this.audio.isPlaying) {
                    this.audio.pause();
                } else {
                    this.audio.play();
                }
            });

            $("#btnVarDump").click(function() {
                var get = function(x) {return scene.scene.getObjectByName(x, true)};
                var log = function(x, name) {console.log(name + " x: " + x.rotation._x + " y: " + x.rotation._y + " z: " + x.rotation._z)};

                var leg = get("leftArmBone");
                var shank = leg.children[3];
                log(leg, "Upper Arm");
                log(shank, "ArmBed");
            });

            $("#btnCycleAnimation").click(function() {
                var get = function(x) {return scene.scene.getObjectByName(x, true)};
                if(!this.i) {
                    this.i = 0;
                }

                var rightLegFrame = [-0.56548, -0.34557, 0.15707, 0.377699, 0.37699, 0.09424, -0.37699, -0.84822, ];
                var rightShankFrame = [0.15707, 0.25132, 0.12566, -0.03141, 0.4084, 0.879645, 1.50796, 0.94247, ];
                var rightFootFrame = [0, 0, -0.31415, -0.25132, -0.84822, 0.06283, -0.47123, 0.09424, ];

                var rightUpperArmFrame = [1.16238, 0.75398, 0.21991, -0.25132, -0.81681, -0.25132, -0.12566, 0.47123];
                var rightArmBedFrame = [-1.22522, -0.65973, -0.12566, -1.06814, -0.78539, -1.06814, -0.47123, -0.65973];

                var rightLeg = get("rightLegBone");
                var rightShank = get("rightShankBone");
                var rightFoot = get("rightFootBone");

                var leftLeg = get("leftLegBone");
                var leftShank = get("leftShankBone");
                var leftFoot = get("leftFootBone");


                var rightArm = get("rightArmBone");
                var rightArmBed = get("rightArmBedBone");

                var leftArm = get("leftArmBone");
                var leftArmBed = get("leftArmBedBone");

                rightLeg.rotation.x = rightLegFrame[this.i % 8];
                rightShank.rotation.x = rightShankFrame[this.i % 8];
                rightFoot.rotation.x = rightFootFrame[this.i % 8];

                leftLeg.rotation.x = rightLegFrame[(this.i + 4) % 8];
                leftShank.rotation.x = rightShankFrame[(this.i + 4) % 8];
                leftFoot.rotation.x = rightFootFrame[(this.i + 4) % 8];

                rightArm.rotation.x = rightUpperArmFrame[this.i % 8];
                rightArmBed.rotation.x = rightArmBedFrame[this.i % 8];

                leftArm.rotation.x = rightUpperArmFrame[(this.i + 4) % 8];
                leftArmBed.rotation.x = rightArmBedFrame[(this.i + 4) % 8];

                this.i++;
            });
            
            $("#btnPlayAnimation").click(function() {
                if(this.running) {
                    return;
                } else {
                    this.running = true;
                }
                var get = function(x) {return scene.scene.getObjectByName(x, true)};

                var hardWireThisShit = function(frames, object, isLeft) {
                    var j = isLeft ? Math.floor(frames.length / 2) : 0; // jumps the framecount up
                    var i;
                    var tweens = [];
                    for(i = 0; i < frames.length; i++) {
                        tweens.push(new TWEEN.Tween(object.rotation).to({x: frames[(i + j + 1) % 8]}, 500));
                    }
                    for(i = 0; i < frames.length; i++) {
                        tweens[i].chain(tweens[(i+1) % 8]);
                    }

                    var tween = tweens[0];
                    tween.onUpdate(function() {
                        object.rotation.x = this.x;
                    });

                    tween.start();
                };

                var rightLegFrame = [-0.56548, -0.34557, 0.15707, 0.377699, 0.37699, 0.09424, -0.37699, -0.84822];
                var rightShankFrame = [0.15707, 0.25132, 0.12566, -0.03141, 0.4084, 0.879645, 1.50796, 0.94247];
                var rightFootFrame = [0, 0, -0.31415, -0.25132, -0.84822, 0.06283, -0.47123, 0.09424];

                var rightUpperArmFrame = [1.16238, 0.75398, 0.21991, -0.25132, -0.81681, -0.25132, -0.12566, 0.47123];
                var rightArmBedFrame = [-1.22522, -0.65973, -0.12566, -1.06814, -0.78539, -1.06814, -0.47123, -0.65973];

                var rightLeg = get("rightLegBone");
                var rightShank = get("rightShankBone");
                var rightFoot = get("rightFootBone");

                var leftLeg = get("leftLegBone");
                var leftShank = get("leftShankBone");
                var leftFoot = get("leftFootBone");


                var rightArm = get("rightArmBone");
                var rightArmBed = get("rightArmBedBone");

                var leftArm = get("leftArmBone");
                var leftArmBed = get("leftArmBedBone");


                hardWireThisShit(rightLegFrame, rightLeg, false);
                hardWireThisShit(rightShankFrame, rightShank, false);
                hardWireThisShit(rightFootFrame, rightFoot, false);

                hardWireThisShit(rightLegFrame, leftLeg, true);
                hardWireThisShit(rightShankFrame, leftShank, true);
                hardWireThisShit(rightFootFrame, leftFoot, true);


                hardWireThisShit(rightUpperArmFrame, rightArm, false);
                hardWireThisShit(rightArmBedFrame, rightArmBed, false);

                hardWireThisShit(rightUpperArmFrame, leftArm, true);
                hardWireThisShit(rightArmBedFrame, leftArmBed, true);


                var head = get("headBone");
                var headRight = new TWEEN.Tween(head.rotation).to({y: Math.PI/4}, 2000);
                var headLeft = new TWEEN.Tween(head.rotation).to({y: -Math.PI/4}, 2000);
                headRight.chain(headLeft);
                headLeft.chain(headRight);
                headRight.onUpdate(function(){
                    head.rotation.y = this.y;
                });
                headRight.start();
            });

            $("#btnScaleArm").click(function() {
                var get = function(x) {return scene.scene.getObjectByName(x, true)};

                var arm = get("rightUpperArm");
                arm.scale.x += 0.5;
                // arm.scale.y += 0.5;
                arm.scale.z += 0.5;
            });
        };




        // return the constructor function
        return HtmlController;


    })); // require



            
