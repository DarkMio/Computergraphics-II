/**
 * Created by Fabby on 18.04.2016.
 */
/**
 * Created by Fabby on 18.04.2016.
 */

define(["util", "vec2", "Scene", "PointDragger"],
    (function (util, vec2, Scene, PointDragger) {

        var Point = function Point(center, radius, style){

            this.style = style || {width: "2", color: "#0000AA"};
            this.center = center || [20, 10];
            this.radius = radius || 10;

        };

        Point.prototype.draw = function (context){

            context.beginPath();
            context.arc(this.center[0], this.center[1], this.radius, 0, 2*Math.PI, false);
            context.strokeStyle = this.style.color;
            context.lineWidth = this.style.width;
            context.fillStyle = this.style.color;
            context.fill();
            // trigger the actual drawing
            context.stroke();
        };

        Point.prototype.isHit = function(context, mousePos){
            var pos = this.center;
            var dx = mousePos[0] - pos[0];
            var dy = mousePos[1] - pos[1];
            var r = 5;
            return (dx * dx + dy * dy) <= (r * r);
        };

        Point.prototype.createDraggers = function() {

            var draggerStyle = {radius: 4, color: this.style.color, width: 0, fill: true}
            var draggers = [];

            var _point = this;
            var getCenter = function (){
                return _point.center;
            }
            var setCenter = function (dragEvent){
                _point.center = dragEvent.position;
            }

            draggers.push(new PointDragger(getCenter, setCenter, draggerStyle));

            return draggers;
        }

        return Point;
    })


);