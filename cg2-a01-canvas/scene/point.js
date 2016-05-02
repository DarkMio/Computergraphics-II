/**
 * Created by Mio on 15.04.2016.
 */
define(["util", "vec2", "Scene", "PointDragger"],
    (function(util, vec2, Scene, PointDragger){
        "use strict";


        var Point = function Point(anchor, radius, lineStyle) {
            this.center = anchor;
            this.radius = radius;
            this.lineStyle = lineStyle;
        };

        Point.prototype.draw = function(context) {
            context.beginPath();
            // Oh look, it has a builtin.
            context.arc(this.center[0], this.center[1], this.radius, 0, 2 * Math.PI, true);
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;
            context.fillStyle = this.lineStyle.color;
            context.fill();
            context.stroke();  // Draw it.
        };

        Point.prototype.isHit = function(context, mousePos) {
            var distance = vec2.pythagoras(mousePos, this.center);
            return distance <= this.radius;
        };

        Point.prototype.createDraggers = function() {
            var draggerStyle = {radius: 4, color: '#222', width: 0, fill: true};

            var _point = this;
            var getPos = function() {
                return _point.center;
            };
            var setPos = function(drag) {
                _point.center = drag.position;
            };
            return [new PointDragger(getPos, setPos, draggerStyle)];
        };

        Point.prototype.setRadius = function(radius) {
            this.radius = radius;
        };

        return Point;
    })
);
