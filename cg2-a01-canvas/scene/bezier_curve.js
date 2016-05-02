define(["util", "vec2", "Scene", "PointDragger"],
    (function (util, vec2, Scene, PointDragger) {
        "use strict";

        var BezierCurve = function BezierCurve(p0, p1, p2, p3, segments, lineStyle) {
            this.p0 = p0;
            this.p1 = p1;
            this.p2 = p2;
            this.p3 = p3;
            this.segments = segments || 10;
            this.showDraggers = true;
            this.lineStyle = lineStyle;
            this.ticks = false;
        };

        BezierCurve.prototype.draw = function(context) {
            var increment = 1 / this.segments;
            var points = [];
            context.beginPath();
            if(this.showDraggers) {
                context.moveTo(this.p1[0], this.p1[1]);
                context.lineTo(this.p0[0], this.p0[1]);
            } else {
                context.moveTo(this.p0[0], this.p0[1]);
            }

            for(var i = 0; i <= this.segments; i++) {
                var t = increment * i;
                var part = this.controlPolygon(t);
                points.push(part);
                context.lineTo(part[0], part[1]);
            }
            context.lineTo(this.p3[0], this.p3[1]);

            if(this.showDraggers) {
                context.lineTo(this.p2[0], this.p2[1]);
            }

            // set drawing style
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;

            // actually start drawing
            context.stroke();
            this.showDraggers = false; // well, we've shown them once, now dispose them.

            if(this.ticks) {
                context.beginPath();
                context.lineWidth = 1;
                context.strokeStyle = "#f44336";
                for(var j = 1; j < points.length - 1; j++) {
                    this.drawTicks(context, points[j-1], points[j], points[j+1]);
                }
                context.stroke();
            }
        };

        BezierCurve.prototype.isHit = function(context, mousePos) {
            // just abbreviate around the main control points.
            var p0d = vec2.pythagoras(this.p0, mousePos);
            var p3d = vec2.pythagoras(this.p3, mousePos);
            return (p0d < 10 || p3d < 10);
        };

        BezierCurve.prototype.createDraggers = function() {
            var draggerStyle = {radius: 4, color: this.lineStyle.color, width: 0, fill: true};
            var draggers = [];

            // create closure and callbacks for dragger
            var _curve = this;
            var getP0 = function () {
                return _curve.p0;
            };
            var getP1 = function () {
                return _curve.p1;
            };
            var getP2 = function() {
                return _curve.p2;
            };
            var getP3 = function() {
                return _curve.p3;
            };
            var setP0 = function (dragEvent) {
                var absX = _curve.p0[0] - _curve.p1[0];
                var absY = _curve.p0[1] - _curve.p1[1];
                _curve.p0 = dragEvent.position;
                _curve.p1 = [dragEvent.position[0] - absX, dragEvent.position[1] - absY]
            };
            var setP1 = function (dragEvent) {
                _curve.p1 = dragEvent.position;
            };
            var setP2 = function (dragEvent) {
                _curve.p2 = dragEvent.position;
            };
            var setP3 = function (dragEvent) {
                var absX = _curve.p3[0] - _curve.p2[0];
                var absY = _curve.p3[1] - _curve.p2[1];
                _curve.p3 = dragEvent.position;
                _curve.p2 = [dragEvent.position[0] - absX, dragEvent.position[1] - absY]
            };
            draggers.push(new PointDragger(getP0, setP0, draggerStyle));
            draggers.push(new PointDragger(getP1, setP1, draggerStyle));
            draggers.push(new PointDragger(getP2, setP2, draggerStyle));
            draggers.push(new PointDragger(getP3, setP3, draggerStyle));
            return draggers;
        };

        BezierCurve.prototype.controlPolygon = function(t) {
            var _c = this;
            var func = function(dim) { // actual bezier theorem
                return Math.pow(1 - t, 3) * _c.p0[dim] +
                    3 * Math.pow(1 - t, 2) * t * _c.p1[dim] +
                    3 * (1 - t) * Math.pow(t, 2) * _c.p2[dim] +
                    Math.pow(t, 3) * _c.p3[dim]
            };
            return [func(0), func(1)];
        };

        BezierCurve.prototype.drawTicks = function(context, last, current, next) {
            var d = vec2.sub(next, last);
            d = [-d[1], d[0]];
            var upper = vec2.add(current, d);
            var lower = vec2.sub(current, d);
            // and now normalize it
            var len = vec2.pythagoras(upper, lower);
            d = vec2.mult(d, 1 / len * 2 * 10);
            upper = vec2.add(current, d);
            lower = vec2.sub(current, d);
            context.moveTo(upper[0], upper[1]);
            context.lineTo(lower[0], lower[1]);
        };

        return BezierCurve;
    })
);