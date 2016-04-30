/**
 * Created by Mio on 29.04.2016.
 */
define(["util", "vec2", "Scene", "PointDragger", "jquery"],
    (function (util, vec2, Scene, PointDragger, $) {
        "use strict";

        var ParametricCurve = function ParametricCurve(anchor, paramX, paramY, tMin, tMax, segments, lineStyle) {
            if(tMin > tMax) {
                var cache = tMax;
                tMax = tMin;
                tMin = cache;
            }

            this.anchor = anchor;
            this.paramX = paramX;
            this.paramY = paramY;
            this.tMin = tMin || 0;
            this.tMax = tMax || 1;
            this.segments = segments || 1;
            this.lineStyle = lineStyle;
            console.log(this);
        };

        ParametricCurve.prototype.draw = function(context){
            var increment = (this.tMax - this.tMin) / this.segments;
            context.beginPath();
            try {
                var x0 = eval(this.paramX) + this.anchor[0];
                var y0 = eval(this.paramY) + this.anchor[1];
                context.moveTo(x0, y0);
                for (var t = this.tMin; t < this.tMax; t += increment) {
                    var x = eval(this.paramX) + this.anchor[0];
                    var y = eval(this.paramY) + this.anchor[1];
                    context.lineTo(x, y);
                }
            } catch(e) {
                util.spawnAlert("Eval incorrect: " + e);
            }

            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;

            context.stroke();
        };

        ParametricCurve.prototype.isHit = function(context, mousePos){
            var pos = this.anchor;

            // check whether distance between mouse and dragger's center
            // is less or equal ( radius + (line width)/2 )
            var dx = mousePos[0] - pos[0];
            var dy = mousePos[1] - pos[1];
            var r = this.lineStyle.width + this.lineStyle.width * 10;
            return (dx * dx + dy * dy) <= (r * r);
        };

        ParametricCurve.prototype.createDraggers = function(){
            var draggerStyle = {radius: 4, color: this.lineStyle.color, width: 0, fill: true}
            var draggers = [];

            // create closure and callbacks for dragger
            var _curve = this;
            var getAnchor = function () {
                return _curve.anchor;
            };
            var setAnchor = function (dragEvent) {
                _curve.anchor = dragEvent.position;
            };

            draggers.push(new PointDragger(getAnchor, setAnchor, draggerStyle));
            return draggers;
        };
        
        return ParametricCurve;
    })
);