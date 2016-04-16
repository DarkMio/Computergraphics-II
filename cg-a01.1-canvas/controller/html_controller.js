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
define(["jquery", "Line", "Circle", "Point"],
    (function($, Line, Circle, Point) {
        "use strict";


        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(context,scene,sceneController) {

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
                var cont = this;
                var color = $("#boxEnableColor").is(":checked") ? $("#fieldColor").val() : randomColor();
                var posX = $("#boxEnablePosX").is(":checked") ? $("#fieldPosX").val() : randomX();
                var posY = $("#boxEnablePosY").is(":checked") ? $("#fieldPosY").val() : randomY();
                var radius = $("#boxEnableRadius").is(":checked") ? $("#fieldRadius").val() : false;
                var lineWidth = $("#boxEnableLineWidth").is(":checked") ? $("#fieldLineWidth").val() : randomWidth();
                var data = [color || 10, [posX || 25, posY || 25], radius, Math.max(lineWidth, 1)];
                console.log(data);
                // today I'm lazy, tomorrow I'll hate me
                return data;
            };

            var is = function(type, obj) {
                var clas = obj.constructor.name;
                return obj !== undefined && obj !== null && clas === type;
            };

            var sceneBuilder = function(callback) { // ewghhh.
                var payload = collectData();
                var style = {
                    width: payload[3],
                    color: payload[0]
                };
                var drawable = callback(style, payload[1], payload[2]);
                scene.addObjects([drawable]);
                sceneController.deselect();
                sceneController.select(drawable);
            };

            // Searches a random point within an anchors radius and returns a new position.
            var jumpPointRadius = function(anchor, radius) {
                // Do pythagoras to find a vector in sight
                var x = radius * Math.random();
                var radiusX = Math.random() > 0.5 ? x : -x;
                radiusX = anchor[0] - radiusX;
                var radiusY = Math.sqrt(radius * radius - x * x);
                radiusY = Math.random() > 0.5 ? radiusY : -radiusY;
                radiusY = anchor[1] - radiusY;
                return [radiusX, radiusY];
            };
            /*
             * event handler for "new line button".
             */
            $("#btnNewLine").click(
                (function() {
                    sceneBuilder(function (style, position, radius) {
                        radius = radius || Math.min(randomX(), randomY());
                        var randomRadius = jumpPointRadius(position, radius);
                        return new Line(position, randomRadius, style);
                    });
                })
            );

            $("#btnNewCircle").click(
                (function() {
                    sceneBuilder(function (style, position, radius) {
                        radius = radius || Math.min(randomX(), randomY());
                        var randomRadius = jumpPointRadius(position, radius);
                        return new Circle(position, randomRadius, style);
                    });
                })
            );
            
            $("#btnNewPoint").click(
                (function() {
                    sceneBuilder(function (style, position, radius) {
                        radius = radius || Math.min(randomX(), randomY());
                        return new Point(position, radius / 6, style);
                    });
                })
            );

            var selectorHelper = function() {
                var obj = sceneController.getSelectedObject();
                var posX, posY, width;
                if(is("Line", obj)) {
                    posX = obj.p0[0];
                    posY = obj.p0[1];
                    width = obj.lineStyle.width;
                } else if(is("Circle", obj)) {
                    posX = obj.anchor[0];
                    posY = obj.anchor[1];
                    width = obj.lineStyle.width;
                } else if(is("Point", obj)) {
                    posX = obj.anchor[0];
                    posY = obj.anchor[1];
                    width = obj.lineStyle.width;
                } else {
                    console.error("Callback for selection encountered an unknown object. Good job, mate. It is: " + obj.constructor.name);
                    return;
                }
                $("#fieldPosX").val(posX);
                $("#fieldPosY").val(posY);
                $("#fieldLineWidth").val(width);
            };

            sceneController.onSelection(selectorHelper);
            sceneController.onObjChange(selectorHelper);
        };


        // return the constructor function
        return HtmlController;


    })); // require



            
