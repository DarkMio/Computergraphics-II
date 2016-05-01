define(["util", "vec2", "Scene", "PointDragger"],
    (function (util, vec2, Scene, PointDragger) {
    
        var AdaptiveCurve = function AdaptiveCurve(p0, p1, p2, p3, depth, lineStyle) {
            this.p0 = p0;
            this.p1 = p1;
            this.p2 = p2;
            this.p3 = p3;
            this.segments = depth || 2; // actual search depth, but handy for html controller
            this.showDraggers = true;
            this.lineStyle = lineStyle;
            this.ticks = false;
        };

        AdaptiveCurve.prototype.draw = function(context) {
            if(this.showDraggers || this.ticks) {
                context.beginPath();
                context.moveTo(this.p1[0], this.p1[1]);
                context.lineTo(this.p0[0], this.p0[1]);
                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;
                context.stroke();
            }

            // actual drawing
            this.recursiveCastlejau(this.p0, this.p1, this.p2, this.p3, this.segments, context);

            if(this.showDraggers || this.ticks) {
                context.beginPath();
                context.lineTo(this.p3[0], this.p3[1]);
                context.lineTo(this.p2[0], this.p2[1]);
                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;
                context.stroke();
            }

            this.showDraggers = false;
        };

        AdaptiveCurve.prototype.isHit = function(context, mousePos) {
            // just abbreviate around the main control points.
            var p0d = vec2.pythagoras(this.p0, mousePos);
            var p3d = vec2.pythagoras(this.p3, mousePos);
            return (p0d < 10 || p3d < 10);
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

        /**
         * Draws a recursive bezier curve after de-Casteljau algorithm
         * @param p0 control anchor point
         * @param p1 control point of anchor p0
         * @param p2 control point of anchor p3
         * @param p3 control anchor point
         * @param depth complexity  2*n^2-1
         * @param context 2d context to draw on
         */
        AdaptiveCurve.prototype.recursiveCastlejau = function(p0, p1, p2, p3, depth, context) {
            var a0, a1, a2, b0, b1, c0;
            a0 = vec2.add(vec2.mult(p0, 0.5), vec2.mult(p1, 0.5));
            a1 = vec2.add(vec2.mult(p1, 0.5), vec2.mult(p2, 0.5));
            a2 = vec2.add(vec2.mult(p2, 0.5), vec2.mult(p3, 0.5));

            b0 = vec2.add(vec2.mult(a0, 0.5), vec2.mult(a1, 0.5));
            b1 = vec2.add(vec2.mult(a1, 0.5), vec2.mult(a2, 0.5));

            c0 = vec2.add(vec2.mult(b0, 0.5), vec2.mult(b1, 0.5));
            if(this.ticks) { // shows debug drawings of subdivision
                context.lineWidth = 0.5;

                // outer lines
                context.beginPath();
                context.moveTo(a0[0], a0[1]);
                context.lineTo(a1[0], a1[1]);
                context.lineTo(a2[0], a2[1]);
                context.strokeStyle = "#00B24A";
                context.stroke();

                //outer points
                context.fillStyle = "#00B24A";
                context.fillRect(a0[0] - 2, a0[1] - 2, 4, 4);
                context.fillRect(a1[0] - 2, a1[1] - 2, 4, 4);
                context.fillRect(a2[0] - 2, a2[1] - 2, 4, 4);

                // inner lines
                context.beginPath();
                context.moveTo(b0[0], b0[1]);
                context.lineTo(b1[0], b1[1]);
                context.strokeStyle = "#f44336";
                context.stroke();

                // inner points
                context.fillStyle = "#f44336";
                context.fillRect(b0[0] - 2, b0[1] - 2, 4, 4);
                context.fillRect(b1[0] - 2, b1[1] - 2, 4, 4);

                // actual hits
                context.fillStyle = "#CC5714";
                context.fillRect(c0[0] - 3, c0[1] - 3, 6, 6);
            }

            if(depth == 0) { // we hit rock bottom, lets draw some lines
                context.beginPath();
                context.moveTo(p0[0], p0[1]);
                context.lineTo(c0[0], c0[1]);
                context.lineTo(p3[0], p3[1]);
                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;
                context.stroke();
            } else { // first left, then right
                array = this.recursiveCastlejau(p0, a0, b0, c0, depth-1, context);
                return this.recursiveCastlejau(c0, b1, a2, p3, depth-1, context);
            }
        };

        return AdaptiveCurve;
    })
);