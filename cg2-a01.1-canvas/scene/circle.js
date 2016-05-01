/**
 * Created by Mio on 15.04.2016.
 */
define(["util", "vec2", "Scene", "PointDragger"],
    (function(util, vec2, scene, PointDragger) {
        "use strict";

        var Circle = function Circle(anchor, radius, lineStyle) {
            /*
            console.log(
                "I should be generating a circle anchored at (" + center[0] + ", " + center[1] + ") with a radius of " + radius
            );
            */
            this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};
            this.center = anchor || [50, 50];
            this.radius = radius || [25, 25];
        };

        Circle.prototype.draw = function(context) {
            context.beginPath();
            // Oh look, it has a builtin.
            context.arc(this.center[0], this.center[1], vec2.pythagoras(this.radius, this.center), 0, 2 * Math.PI, false);
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;
            context.stroke();  // Draw it.
        };

        Circle.prototype.isHit = function(context, mousePos) {
            var mouseDistance = vec2.pythagoras(mousePos, this.center); // how far is the mouse?
            var radius = vec2.pythagoras(this.radius, this.center); // how long is the radius?
            var margin = this.lineStyle.width + 2; // add a bit for convenience
            return radius - margin <= mouseDistance && radius + margin > mouseDistance; // pos within radius ± margin
        };

        Circle.prototype.createDraggers = function() {
            var draggerStyle = {radius: 4, color: this.lineStyle.color, width: 0, fill: true};
            var draggers = [];

            var _line = this;
            var getAnchor = function() {
                return _line.center;
            };
            var getRadius = function() {
                return _line.radius;
            };
            var setAnchor = function(drag) {
                // movement delta to update the radius draggers appropriately
                var delta = [_line.center[0] - drag.position[0], _line.center[1] - drag.position[1]];
                _line.radius = [_line.radius[0] - delta[0], _line.radius[1] - delta[1]];
                _line.center = drag.position ;
            };
            var setRadius = function(drag) {
                _line.radius = drag.position;
            };

            draggers.push(new PointDragger(getAnchor, setAnchor, draggerStyle));
            draggers.push(new PointDragger(getRadius, setRadius, draggerStyle));
            return draggers;
        };

        Circle.prototype.setRadius = function(radius) {
            if(radius <= 0) return; // truncate all empty requests.
            var scale = radius / vec2.pythagoras(this.center, this.radius);
            var localRadius = [this.radius[0] - this.center[0], this.radius[1] - this.center[1]];
            var newRadius = [localRadius[0] * scale, localRadius[1] * scale];
            this.radius = [this.center[0] + newRadius[0], this.center[1] + newRadius[1]];
        };

        return Circle;
    })
);