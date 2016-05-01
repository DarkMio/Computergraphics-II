define(["util", "vec2", "Scene", "PointDragger"],
    (function (util, vec2, Scene, PointDragger) {
        "use strict";

        var ParametricCurve = function ParametricCurve(anchor, paramX, paramY, tMin, tMax, segments, lineStyle) {
            if(tMin > tMax) {
                var cache = tMax;
                tMax = tMin;
                tMin = cache;
            }

            this.center = anchor;
            this.paramX = paramX;
            this.paramY = paramY;
            this.tMin = tMin || 0;
            this.tMax = tMax || 1;
            this.segments = segments || 1;
            this.lineStyle = lineStyle;
            this.ticks = false;
        };

        ParametricCurve.prototype.draw = function(context){
            var increment = (this.tMax - this.tMin) / this.segments;
            var points = [];
            context.beginPath();
            try {
                for (var i = 0; i < this.segments; i++) {
                    //noinspection JSUnusedLocalSymbols
                    var t = this.tMin + i * increment;
                    var x = eval(this.paramX) + this.center[0];
                    var y = eval(this.paramY) + this.center[1];
                    points.push([x, y]);
                    context.lineTo(x, y);
                }
            } catch(e) {
                util.spawnAlert("Eval incorrect: " + e);
            }

            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;
            context.stroke();

            if(this.ticks) {
                context.beginPath();
                context.lineWidth = 1;
                context.strokeStyle = "#f44336";
                for(var j = 1; j < this.segments-1; j++) {
                    this.drawTicks(context, points[j-1], points[j], points[j+1]);
                }
                context.stroke();
            }
        };

        ParametricCurve.prototype.isHit = function(context, mousePos){
            var pos = this.center;

            // check whether distance between mouse and dragger's center
            // is less or equal ( radius + (line width)/2 )
            var dx = mousePos[0] - pos[0];
            var dy = mousePos[1] - pos[1];
            var r = this.lineStyle.width + this.lineStyle.width * 10;
            return (dx * dx + dy * dy) <= (r * r);
        };

        ParametricCurve.prototype.createDraggers = function(){
            var draggerStyle = {radius: 4, color: this.lineStyle.color, width: 0, fill: true};
            var draggers = [];

            // create closure and callbacks for dragger
            var _curve = this;
            var getAnchor = function () {
                return _curve.center;
            };
            var setAnchor = function (dragEvent) {
                _curve.center = dragEvent.position;
            };

            draggers.push(new PointDragger(getAnchor, setAnchor, draggerStyle));
            return draggers;
        };

        ParametricCurve.prototype.drawTicks = function(context, last, current, next) {
                var d = vec2.sub(next, last);
                d = [-d[1], d[0]];
                d = vec2.mult(d, 0.5);
                var upper = vec2.add(current, d);
                var lower = vec2.sub(current, d);
                context.moveTo(upper[0], upper[1]);
                context.lineTo(lower[0], lower[1]);
        };

        return ParametricCurve;
    })
);