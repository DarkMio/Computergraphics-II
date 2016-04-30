define(["util", "vec2", "Scene", "PointDragger"],
    (function (util, vec2, Scene, PointDragger) {
    
        var AdaptiveCurve = function AdaptiveCurve(p0, p1, p2, p3, segments, lineStyle) {
            this.p0 = p0;
            this.p1 = p1;
            this.p2 = p2;
            this.p3 = p3;
            this.segments = segments || 10;
            this.showDraggers = true;
            this.lineStyle = lineStyle;
            this.ticks = false;
        };

        AdaptiveCurve.prototype.draw = function(context) {
            var points = [];
            var increment = 1 / this.segments;
            context.beginPath();
            if(this.showDraggers) {
                context.moveTo(this.p1[0], this.p1[1]);
                context.lineTo(this.p0[0], this.p0[1]);
            } else {
                context.moveTo(this.p0[0], this.p0[1]);
            }
            for(var i = 0; i < this.segments + 1; i++) {
                var t = increment * i;
                var point = this.casteljau([this.p0, this.p1, this.p2, this.p3], t, context);
                points.push(point);
            }
            if(this.showDraggers) {
                context.lineTo(this.p2[0], this.p2[1]);
            }
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;
            context.stroke();
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

        AdaptiveCurve.prototype.isHit = function() {
            return true;
        };

        AdaptiveCurve.prototype.createDraggers = function() {
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

        AdaptiveCurve.prototype.casteljau = function(points, t, context) {
            if(points.length == 1) {
                context.lineTo(points[0][0], points[0][1]);
                return [points[0][0], points[0][1]];
            } else {
                var newPoints = [];
                for(var i = 0; i < points.length - 1; i++) {
                    var x = (1-t) * points[i][0] + t * points[i+1][0];
                    var y = (1-t) * points[i][1] + t * points[i+1][1];
                    newPoints.push([x, y]);
                }
                return this.casteljau(newPoints, t, context);
            }
        };

        AdaptiveCurve.prototype.drawTicks = function(context, last, current, next) {
            var d = vec2.sub(next, last);
            d = [-d[1], d[0]];
            d = vec2.mult(d, 0.5);
            var upper = vec2.add(current, d);
            var lower = vec2.sub(current, d);
            context.moveTo(upper[0], upper[1]);
            context.lineTo(lower[0], lower[1]);
        };

        return AdaptiveCurve;
    })
);