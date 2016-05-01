/**
 * Created by Mio on 16.04.2016.
 */
/**
 * Created by Mio on 16.04.2016.
 */
define(["util", "vec2", "Scene", "PointDragger"],
    (function(util, vec2, scene, PointDragger) {
        "use strict";

        var Star = function Star(anchor, innerRadius, outerRadius, lineStyle) {
            this.spikes = 5;
            this.center = anchor;
            this.innerRadius = innerRadius;
            this.outerRadius = outerRadius;
            this.lineStyle = lineStyle;
        };

        Star.prototype.draw = function(context) {
            var rotation = Math.PI / 2 * 3;
            var step = Math.PI / this.spikes;
            var x = this.center[0];
            var y = this.center[1];

            context.beginPath();
            context.moveTo(x, y - this.outerRadius);

            var flipFlop = [this.outerRadius, this.innerRadius];
            for(var i = 0; i < this.spikes; i++) {
                for(var j = 0; j < 2; j++) {
                    x = this.center[0] + Math.cos(rotation) * flipFlop[j];
                    y = this.center[1] + Math.sin(rotation) * flipFlop[j];
                    context.lineTo(x, y);
                    rotation += step;
                }
            }

            context.lineTo(this.center[0], this.center[1] - this.outerRadius);
            context.closePath();
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;
            context.stroke();
        };

        Star.prototype.isHit = function(context, pos) { // rectangle approximation #effort
            var local = [Math.abs(this.center[0] - pos[0]), Math.abs(this.center[1] - pos[1])];
            var max = Math.max(this.outerRadius, this.innerRadius);
            return local[1] < max && local[0] < max;
        };

        Star.prototype.createDraggers = function() {
            var draggerStyle = {radius: 4, color: this.lineStyle.color, width: 0, fill: true};
            var draggers = [];

            // create closure and callbacks for dragger
            var _star = this;
            var getAnchor = function () {
                return _star.center;
            };
            var setAnchor = function (dragEvent) {
                _star.center =  dragEvent.position;

                // var distInner = dragEvent.position[1] - _star.innerRadius[1];
                // _star.innerRadius = [dragEvent.position[1], (dragEvent.position[1] - distInner)];
            };
            
            var getInnerRadius = function() {
                return [_star.center[0], _star.center[1] + _star.innerRadius];
            };

            var setInnerRadius = function(dragEvent) {
                _star.innerRadius = Math.abs(dragEvent.position[1] - _star.center[1]);
            };

            var getOuterRadius = function() {
                return [_star.center[0], _star.center[1] - _star.outerRadius];
            };

            var setOuterRadius = function(dragEvent) {
                _star.outerRadius = Math.abs(dragEvent.position[1] - _star.center[1]);
            };

            draggers.push(new PointDragger(getAnchor, setAnchor, draggerStyle));
            draggers.push(new PointDragger(getInnerRadius, setInnerRadius, draggerStyle));
            draggers.push(new PointDragger(getOuterRadius, setOuterRadius, draggerStyle));

            return draggers;
        };

        return Star;
    })
);