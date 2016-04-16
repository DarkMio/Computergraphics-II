/**
 * Created by Mio on 15.04.2016.
 */
define(["util", "vec2", "Scene", "PointDragger"],
    (function(util, vec2, Scene, PointDragger){
        "use strict";


        var Point = function Point(anchor, radius, lineStyle) {
            this.anchor = anchor;
            this.radius = radius;
            this.lineStyle = lineStyle;
        };

        Point.prototype.pythagoras = function(a, b) { // whateffs, throw it in the proto
            // a^2 + b^2 = c^2
            var aSquared = Math.pow(a[0] - b[0], 2);
            var bSquared = Math.pow(a[1] - b[1], 2);
            return Math.sqrt(aSquared + bSquared);
        };

        Point.prototype.draw = function(context) {
            context.beginPath();
            // Oh look, it has a builtin.
            context.arc(this.anchor[0], this.anchor[1], this.radius, 0, 2 * Math.PI, true);
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;
            context.fillStyle = this.lineStyle.color;
            context.fill();
            context.stroke();  // Draw it.
        };

        Point.prototype.isHit = function(context, mousePos) {
            var distance = this.pythagoras(mousePos, this.anchor);
            return distance <= this.radius;
        };

        Point.prototype.createDraggers = function() {
            var draggerStyle = {radius: 4, color: '#222', width: 0, fill: true};

            var _point = this;
            var getPos = function() {
                return _point.anchor;
            };
            var setPos = function(drag) {
                _point.anchor = drag.position;
            };
            return [new PointDragger(getPos, setPos, draggerStyle)];
        };

        Point.prototype.setRadius = function(radius) {
            this.radius = radius;
        };

        return Point;
    })
);
