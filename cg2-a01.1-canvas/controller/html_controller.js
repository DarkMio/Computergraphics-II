/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */


/* requireJS module definition */
define(["jquery", "Line", "Circle", "Point", "Star", "KdTree", "kdutil", "ParametricCurve", "BezierCurve", "AdaptiveCurve", "util"],
    (function($, Line, Circle, Point, Star, KdTree, KdUtil, ParametricCurve, BezierCurve, AdaptiveCurve, util) {
        "use strict";


        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(context,scene,sceneController) {

            var kdTree;
            var pointList = [];

            // generate random X coordinate within the canvas
            var randomX = function() {
                return Math.floor(Math.random()*(context.canvas.width-10))+5;
            };

            // generate random Y coordinate within the canvas
            var randomY = function() {
                return Math.floor(Math.random()*(context.canvas.height-10))+5;
            };

            // generate a random line width
            var randomWidth = function() {
                return Math.floor(Math.random()*3)+1;
            };

            // generate random color in hex notation
            var randomColor = function() {

                // convert a byte (0...255) to a 2-digit hex string
                var toHex2 = function(byte) {
                    var s = byte.toString(16); // convert to hex string
                    if(s.length == 1) s = "0"+s; // pad with leading 0
                    return s;
                };

                var r = Math.floor(Math.random()*25.9)*10;
                var g = Math.floor(Math.random()*25.9)*10;
                var b = Math.floor(Math.random()*25.9)*10;

                // convert to hex notation
                return "#"+toHex2(r)+toHex2(g)+toHex2(b);
            };

            /**
             *  Collect data from input fields
             *  @return : [color, [posX, posY], radius, lineWidth]
             */
            var collectData = function() {
                var color = $("#boxEnableColor").is(":checked") ? $("#fieldColor").val() : randomColor();
                var posX = $("#boxEnablePosX").is(":checked") ? $("#fieldPosX").val() : randomX();
                var posY = $("#boxEnablePosY").is(":checked") ? $("#fieldPosY").val() : randomY();
                var radius = $("#boxEnableRadius").is(":checked") ? $("#fieldRadius").val() : false;
                var lineWidth = $("#boxEnableLineWidth").is(":checked") ? $("#fieldLineWidth").val() : randomWidth();
                // today I'm lazy, tomorrow I'll hate me
                return [color || '#0000A0', [posX || 25, posY || 25], radius, Math.max(lineWidth, 1)];
            };

            /**
             * Identify the object with its constructor. Fast, efficient ans less ugly
             * @param type Comparison type
             * @param obj obj to compare type to
             * @returns {boolean}
             */
            var is = function(type, obj) {
                var className = obj.constructor.name;
                return obj !== undefined && obj !== null && className === type;
            };

            var sceneBuilder = function(callback) { // ewghhh.
                var payload = collectData();
                var style = {
                    width: payload[3],
                    color: payload[0]
                };
                var drawable = callback(style, payload[1], payload[2]);
                if(drawable != null && drawable != undefined) { // be something before we'll add you
                    scene.addObjects([drawable]);
                    sceneController.deselect();
                    sceneController.select(drawable);
                } else {
                    console.error("SceneBuilder could not complete its task: No object found");
                }
            };

            /**
             * Searches a random point within an anchors radius and returns a new position.
             * @param anchor Original center of object
             * @param radius of how far away a new point should be found
             * @return *[] [x, y] of found position
             */
             var jumpPointRadius = function(anchor, radius) {
                // Do pythagoras to find a vector in sight
                // start with a random x length
                var x = radius * Math.random();
                // Random +/- of x
                var radiusX = Math.random() > 0.5 ? x : -x;
                radiusX = anchor[0] - radiusX;
                // Do c^2 - a^2 = b^2
                var radiusY = Math.sqrt(radius * radius - x * x);
                radiusY = Math.random() > 0.5 ? radiusY : -radiusY;
                radiusY = anchor[1] - radiusY;
                return [radiusX, radiusY];
            };

            /**
             * Tab Controller
             */
            $('.tabs .tab-links a').on('click', function(e)  {
                var currentAttrValue = $(this).attr('href');
                if(currentAttrValue == '#tab3') {
                    $('#position').hide();
                } else {
                    $('#position').show();
                }
                // Show/Hide Tabs
                $('.tabs ' + currentAttrValue).show().siblings().hide();

                // Change/remove current tab to active
                $(this).parent('li').addClass('active').siblings().removeClass('active');

                e.preventDefault();
            });

            /**
             * event handler for "new line button".
             */
            $("#btnNewLine").click(
                (function() {
                    sceneBuilder(function (style, position, radius) {
                        var lineRadius;
                        if(radius <= 0) {
                            lineRadius = [randomX(), randomY()];
                        } else {
                            lineRadius = jumpPointRadius(position, radius);
                        }
                        return new Line(position, lineRadius, style);
                    });
                })
            );

            /**
             * Event handler for "new circle"
             */
            $("#btnNewCircle").click(
                (function() {
                    sceneBuilder(function (style, position, radius) {
                        radius = radius || Math.min(randomX(), randomY());
                        var randomRadius = jumpPointRadius(position, radius);
                        return new Circle(position, randomRadius, style);
                    });
                })
            );

            /**
             * Event handler for "new point"
             */
            $("#btnNewPoint").click(
                (function() {
                    sceneBuilder(function (style, position, radius) {
                        radius = radius || Math.min(randomX(), randomY());
                        return new Point(position, radius / 6, style);
                    });
                })
            );

            /**
             * Event handler for "new point"
             */
            $("#btnNewStar").click(
                (function() {
                    sceneBuilder(function (style, position, radius) {
                        return new Star(position, randomY() / 3, randomY() / 3, style);
                    });
                })
            );

            /**
             * KDTree things
             */

            $("#btnNewPointList").click( (function() {

                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };

                var numPoints = parseInt($("#numPoints").attr("value"));;
                for(var i=0; i<numPoints; ++i) {
                    var point = new Point([randomX(), randomY()], 5,
                        style);
                    scene.addObjects([point]);
                    pointList.push(point);
                }

                // deselect all objects, then select the newly created object
                sceneController.deselect();

            }));

            $("#visKdTree").click( (function() {

                var showTree = $("#visKdTree").attr("checked");
                if(showTree && kdTree) {
                    KdUtil.visualizeKdTree(sceneController, scene, kdTree.root, 0, 0, 600, true);
                }

            }));

            $("#btnBuildKdTree").click( (function() {

                kdTree = new KdTree(pointList);

            }));

            /**
             * creates a random query point and
             * runs linear search and kd-nearest-neighbor search
             */
            $("#btnQueryKdTree").click( (function() {

                var style = {
                    width: 2,
                    color: "#ff0000"
                };
                var queryPoint = new Point([randomX(), randomY()], 2,
                    style);
                scene.addObjects([queryPoint]);
                sceneController.select(queryPoint);

                console.log("query point: ", queryPoint.center);

                console.time("linear search");
                var minIdx = KdUtil.linearSearch(pointList, queryPoint);
                console.timeEnd("linear search");

                console.time("kd search");
                var kdNearestNeighbor = kdTree.findNearestNeighbor(kdTree.root, queryPoint, kdTree.root, 10000000, 0);
                console.timeEnd("kd search");

                sceneController.select(pointList[minIdx]);
                sceneController.select(kdNearestNeighbor.point);

            }));

            /**
             * Curves Tab Event Listener:
             */
            $("#btnNewParametricCurve").click(
                (function() {
                    sceneBuilder(function (style, position, radius) {
                        var paramX = $('#parameterX').val();
                        var paramY = $('#parameterY').val();
                        var tMin = parseFloat($('#tMin').val()) || 0;
                        var tMax = parseFloat($('#tMax').val()) || 100;
                        var segments = parseInt($('#segments').val()) || 10;
                        try {
                            if(paramX == "" || paramY == "") {
                                throw new Error("ParamX or ParamY is empty.");
                            }
                            var flipFlop = [tMin, tMax];
                            for(var i = 0; i < flipFlop.length; i++) { // test against min/max
                                var t = flipFlop[i];
                                eval(paramX);
                                eval(paramY);
                            }
                        } catch(e) {
                            util.spawnAlert("Cannot create Parametric Curve: " + e);
                            return;
                        }
                        return new ParametricCurve([randomX(), randomY()], paramX, paramY, tMin, tMax, segments, style);
                    })
                })
            );

            $("#btnNewBezierCurve").click(function() {
                sceneBuilder(function (style, position, radius) {
                    var segments = parseInt($('#segments').val());
                    return new BezierCurve([296, 127], [414, 44], [371, 353], [334, 289], 10000, style);
                });
            });

            $("#btnNewCasteljauCurve").click(function() {
                sceneBuilder(function(style, position, radius) {
                    var segments = parseInt($('#segments').val());
                    return new AdaptiveCurve([296, 127], [414, 44], [371, 353], [334, 289], 10000, style);

                });
            });

            $("#btnToggleTicks").click(function() {
                var obj = sceneController.getSelectedObject();
                if(is("BezierCurve", obj) || is("ParametricCurve", obj) || is("AdaptiveCurve", obj)) {
                    console.log("Toggled!");
                    obj.ticks = !obj.ticks;
                    sceneController.scene.draw(sceneController.context); // force redraw
                }
            });


            /**
             * Overrides values of a selected object in the canvas
             */
            var valueOverride = function() {
                var obj = sceneController.getSelectedObject();
                if($('#boxEnableColor').is(':checked')) {
                    obj.lineStyle['color'] = $('#fieldColor').val();
                }
                if($('#boxEnableLineWidth').is(':checked')) {
                    obj.lineStyle['width'] = $('#fieldLineWidth').val();
                }
                if(is("Circle", obj) || is("Point", obj)) {
                    obj.setRadius($('#fieldRadius').val());
                }
                sceneController.scene.draw(sceneController.context); // force redraw
            };

            /**
             * Handles input fields based on the selected object
             * @TODO: Cleanup. All objs should have a 'center' rather than an 'anchor' by now.
             */
            var selectorHelper = function() {
                var obj = sceneController.getSelectedObject();
                var pos, width;
                if(is("Line", obj)) {
                    pos = obj.p0;
                    width = obj.lineStyle.width;

                    $('#radius').hide();    // hide
                    $('#fieldRadius').val(''); // and hide radius field
                } else if(is("Circle", obj)) {
                    pos = obj.center;
                    width = obj.lineStyle.width;
                    $('#radius').show();
                } else if(is("Point", obj)) {
                    pos = obj.center;
                    width = obj.lineStyle.width;
                    $('#radius').show();
                } else if(is("Star", obj)) {
                    pos = obj.center;
                    width = obj.lineStyle.width;
                    $('#radius').hide();
                } else if(is("ParametricCurve", obj)) {
                    pos = obj.anchor;
                    width = obj.lineStyle.width;
                    $('#radius').hide();
                } else if(is("BezierCurve", obj)) {
                    pos = obj.p0;
                    width = obj.lineStyle.width;
                    obj.showDraggers = true;
                } else if(is("AdaptiveCurve", obj)) {
                    pos = obj.p0;
                    width = obj.lineStyle.width;
                    obj.showDraggers = true;
                } else { // Encountered invalid object
                    console.error("Callback for selection encountered an unknown object. Good job, mate. It is: " + obj.constructor.name);
                    return;
                }
                $("#fieldPosX").val(pos[0]);
                $("#fieldPosY").val(pos[1]);
                $("#fieldLineWidth").val(width);
            };

            // Change Listener for Canvas Selection
            sceneController.onSelection(selectorHelper);
            sceneController.onObjChange(selectorHelper);

            // Change Listener for Field Changes
            $("#fieldRadius").change(valueOverride);
            $('#fieldColor').change(valueOverride);
            $('#fieldLineWidth').change(valueOverride);
        };
        
        // return the constructor function
        return HtmlController;
    })
); // require