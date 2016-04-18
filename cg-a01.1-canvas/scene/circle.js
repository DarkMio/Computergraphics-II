/**
 * Created by Fabby on 18.04.2016.
 */

define(["util", "vec2", "Scene", "PointDragger"],
    (function (util, vec2, Scene, PointDragger) {

        var Circle = function Circle(center, radius, style){

            this.style = style || {width: "2", color: "#0000AA"};
            this.center = center || [20, 10];
            this.radius = radius || 10;

        };

        Circle.prototype.draw = function (context){

            context.beginPath();
            context.arc(this.center[0], this.center[1], this.radius, 0, 2*Math.PI, false);
            context.strokeStyle = this.style.color;
            context.lineWidth = this.style.width;
            context.stroke();
        };

        Circle.prototype.isHit = function(context, mousePos){
            var pos = this.center;
            var dx = mousePos[0] - pos[0];
            var dy = mousePos[1] - pos[1];
            var r = this.radius;
            return (dx * dx + dy * dy) <= (r * r);
        };

        Circle.prototype.createDraggers = function() {

            var draggerStyle = {radius: 4, color: this.style.color, width: 0, fill: true}
            var draggers = [];

            var _circle = this;
            var getCenter = function (){
                return _circle.center;
            };
            var getRadius = function (){
                var radius = _circle.center;
                return [radius[0], radius[1] - _circle.radius];
            };
            var setCenter = function (dragEvent){
                _circle.center = dragEvent.position;
            };
            var setRadius = function(dragEvent) {
                var pos = dragEvent.position;
                _circle.radius = Math.abs(_circle.center[1] - pos[1]);
            };

            draggers.push(new PointDragger(getCenter, setCenter, draggerStyle));
            draggers.push(new PointDragger(getRadius, setRadius, draggerStyle));

            return draggers;
        };

        return Circle;
    })


);