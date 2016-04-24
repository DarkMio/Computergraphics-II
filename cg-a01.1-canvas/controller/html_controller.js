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
define(["jquery", "Line", "Circle", "Point", "Rectangle", "KdTree", "kdutil"],
    (function($, Line, Circle, Point, Rectangle, KdTree, KdUtil) {
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

            /*
             * event handler for "new line button".
             */
            $("#btnNewLine").click( (function() {

                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };

                var line = new Line( [randomX(),randomY()],
                    [randomX(),randomY()],
                    style );
                scene.addObjects([line]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(line); // this will also redraw

            }));

            $("#btnNewCircle").click( (function() {
                console.log("Is it me, you're looking for?");
                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };

                var circle = new Circle( [randomX(),randomY()], randomX()/3,
                    style);
                scene.addObjects([circle]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(circle); // this will also redraw

            }));

            $("#btnNewPnt").click( (function() {

                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };

                var point = new Point( [randomX(),randomY()], randomX()/10, style );
                scene.addObjects([point]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(point); // this will also redraw
            }));
            $('#btnNewRekt').click( (function(){
                console.log("Rekt called");
                var style = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };

                var rekt = new Rectangle ([randomX(), randomY()], [randomX(), randomY()],style);
                scene.addObjects([rekt]);
                sceneController.deselect();
                sceneController.select(rekt);
            }));

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
                console.log("nearest neighbor linear: ", pointList[minIdx].center);

                console.time("kd search");
                var kdNearestNeighbor = kdTree.findNearestNeighbor(kdTree.root, queryPoint, 10000000, kdTree.root, 0);
                console.timeEnd("kd search");
                console.log("nearest neighbor kd: ", kdNearestNeighbor.point.center);

                sceneController.select(pointList[minIdx]);
                sceneController.select(kdNearestNeighbor.point);

            }));

            var hollaAtChoDolla = function(){
                var obj = sceneController.getSelectedObject();
                if (obj.constructor.name == "Circle" || obj.constructor.name == "Point"){
                    obj.radius = $('#fieldRadius').val();
                }
                obj.style.color = $('#fieldColor').val();
                sceneController.scene.draw(sceneController.context);
            };
            var xD = function(){
                var obj = sceneController.getSelectedObject();
                var pos = obj.center || obj.p0 || obj.point0;
                var style = obj.style || obj.style;
                var radius = obj.radius;
                $('#fieldPosX').val(pos[0]);
                $('#fieldPosY').val(pos[1]);
                $('#fieldColor').val(style.color);
                $('#fieldLineWidth').val(style.width);
                if (obj.constructor.name == "Circle" || obj.constructor.name == "Point") {
                    $('#fieldRadius').val(radius).show();
                } else {
                    $('#fieldRadius').hide();
                }
            };


            sceneController.onObjChange(xD);
            sceneController.onSelection(xD);
            $('#fieldRadius').change(hollaAtChoDolla);
            $('#fieldColor').change(hollaAtChoDolla);


        };

        // return the constructor function
        return HtmlController;


    })); // require




