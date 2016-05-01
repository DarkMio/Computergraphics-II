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

            this.controls = [];
        };

        AdaptiveCurve.prototype.draw = function(context) {
            this.controls = [];
            context.beginPath();
            context.moveTo(this.p1[0], this.p1[1]);
            context.lineTo(this.p0[0], this.p0[1]);
            context.stroke();
            this.recursive(this.p0, this.p1, this.p2, this.p3, 1, [], context);
            context.beginPath();
            context.lineTo(this.p3[0], this.p3[1]);
            context.lineTo(this.p2[0], this.p2[1]);
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;
            context.stroke();

            /*
            if(this.ticks) {
                context.beginPath();
                context.lineWidth = 1;
                context.strokeStyle = "#f44336";
                for(var j = 1; j < points.length - 1; j++) {
                    this.drawTicks(context, points[j-1], points[j], points[j+1]);
                }
                context.stroke();
            }
            */

            /*
            var points = [];
            context.beginPath();
            if(this.showDraggers) {

                context.moveTo(this.p1[0], this.p1[1]);
                context.lineTo(this.p0[0], this.p0[1]);
            } else {
                context.moveTo(this.p0[0], this.p0[1]);
            }
            var increment = 1 / this.segments;
            for(var i = 0; i < this.segments + 1; i++) {
                var t = increment * i;
                var point = this.casteljau(this.p0, this.p1, this.p2, this.p3, t);
                points.push(point);
                context.lineTo(point[0], point[1]);
            }
            context.lineTo(this.p3[0], this.p3[1]);
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

            */
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

        AdaptiveCurve.prototype.drawTicks = function(context, last, current, next) {
            var d = vec2.sub(next, last);
            d = [-d[1], d[0]];
            d = vec2.mult(d, 0.5);
            var upper = vec2.add(current, d);
            var lower = vec2.sub(current, d);
            context.moveTo(upper[0], upper[1]);
            context.lineTo(lower[0], lower[1]);
        };

        AdaptiveCurve.prototype.recursive = function(p0, p1, p2, p3, depth, array, context) {
            var a0, a1, a2, b0, b1, c0;
            a0 = vec2.add(vec2.mult(p0, 0.5), vec2.mult(p1, 0.5));
            a1 = vec2.add(vec2.mult(p1, 0.5), vec2.mult(p2, 0.5));
            a2 = vec2.add(vec2.mult(p2, 0.5), vec2.mult(p3, 0.5));

            b0 = vec2.add(vec2.mult(a0, 0.5), vec2.mult(a1, 0.5));
            b1 = vec2.add(vec2.mult(a1, 0.5), vec2.mult(a2, 0.5));

            c0 = vec2.add(vec2.mult(b0, 0.5), vec2.mult(b1, 0.5));
            if(this.ticks) {
                context.lineWidth = 1;
                context.strokeStyle = "#f44336";


                context.beginPath();
                context.moveTo(a0[0], a0[1]);
                context.lineTo(a1[0], a1[1]);
                context.lineTo(a2[0], a2[1]);
                context.strokeStyle = "#43f436";
                context.stroke();

                context.beginPath();
                context.moveTo(b0[0], b0[1]);
                context.lineTo(b1[0], b1[1]);
                context.strokeStyle = "#f44336";
                context.stroke();

                context.fillStyle = "#f44336";
                context.fillRect(a0[0] - 2, a0[1] - 2, 4, 4);
                context.fillRect(a1[0] - 2, a1[1] - 2, 4, 4);
                context.fillRect(a2[0] - 2, a2[1] - 2, 4, 4);
                context.fillRect(b0[0] - 2, b0[1] - 2, 4, 4);
                context.fillRect(b1[0] - 2, b1[1] - 2, 4, 4);

                context.fillStyle = "#4336f4";
                context.fillRect(c0[0] - 2, c0[1] - 2, 4, 4);
            }

            if(depth == 0) {
                /*
                array.push(p0);
                array.push(c0);
                array.push(p3);

                this.controls.push(a0);
                this.controls.push(a1);
                this.controls.push(a2);
                this.controls.push(b0);
                this.controls.push(b1);
                this.controls.push(c0);


                return array;
*/
                context.beginPath();
                context.moveTo(p0[0], p0[1]);
                context.lineTo(c0[0], c0[1]);
                context.lineTo(p3[0], p3[1]);
                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;
                context.stroke();
            } else {
                array = this.recursive(p0, a0, b0, c0, depth-1, array, context);
                return this.recursive(c0, b1, a2, p3, depth-1, array, context);
            }
        };

        AdaptiveCurve.prototype.casteljau = function(p0, p1, p2, p3, t) {
            var a0, a1, a2, b0, b1, c0;
            a0 = vec2.add(vec2.mult(p0, 1 - t), vec2.mult(p1, t));
            a1 = vec2.add(vec2.mult(p1, 1 - t), vec2.mult(p2, t));
            a2 = vec2.add(vec2.mult(p2, 1 - t), vec2.mult(p3, t));

            b0 = vec2.add(vec2.mult(a0, 1 - t), vec2.mult(a1, t));
            b1 = vec2.add(vec2.mult(a1, 1 - t), vec2.mult(a2, t));

            c0 = vec2.add(vec2.mult(b0, 1 - t), vec2.mult(b1, t));
            return c0;
        };

        return AdaptiveCurve;
    })
);