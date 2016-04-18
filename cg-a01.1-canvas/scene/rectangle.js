/**
 * Created by Fabby on 18.04.2016.
 */
define(["util", "vec2", "Scene", "PointDragger"],
    (function (util, vec2, Scene, PointDragger) {

        var Rectangle = function (point0, point1, style) {

            this.point0 = point0 || [20, 20];
            this.point1 = point1 || [50, 50];
            this.style = style || {width: "2", color: "#0000AA"};
            console.log("Inited Rectangle");
        };

        Rectangle.prototype.draw = function (context){
            var len = [Math.abs(this.point0[0] - this.point1[0]), Math.abs(this.point0[1] - this.point1[1])];

            context.beginPath();
            context.moveTo(this.point0[0], this.point0[1]);
            context.lineTo(this.point0[0], this.point1[1]);
            context.lineTo(this.point1[0], this.point1[1]);
            context.lineTo(this.point1[0], this.point0[1]);
            context.closePath();
            context.strokeStyle = this.style.color;
            context.lineWidth = this.style.width;

            context.stroke();
        };

        Rectangle.prototype.isHit = function (context, mousePos) {
            var min = [Math.min(this.point0[0], this.point1[0]), Math.min(this.point0[1], this.point1[1])];
            var max = [Math.max(this.point0[0], this.point1[0]), Math.max(this.point0[1], this.point1[1])];
            return mousePos[0] > min[0] && mousePos[1] > min[0] && mousePos[0] < max[0] && mousePos[1] < max[1];
        };

        Rectangle.prototype.createDraggers = function () {
            var draggerStyle = {radius: 4, color: this.style.color, width: 0, fill: true};
            var draggers = [];

            var _rekt = this;

            var getPoint0 = function() {
                return _rekt.point0;
            };
            var getPoint1 = function() {
                return _rekt.point1;
            };
            var setPoint0 = function(dragEvent) {
                _rekt.point0 = dragEvent.position;
            };
            var setPoint1 = function(dragEvent) {
                _rekt.point1 = dragEvent.position;
            };
            draggers.push(new PointDragger(getPoint0, setPoint0, draggerStyle));
            draggers.push(new PointDragger(getPoint1, setPoint1, draggerStyle));
            return draggers;
        };

        return Rectangle;
    })
);