define(["util", "vec2", "Scene", "PointDragger"], function(util, vec2, Scene, PointDragger){
    "use strict";

    var Thales = function Thales(radius, p1, p2) {
        this.radius = radius;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = [100, 100];
        this.p4 = [400, 400];
        this.lineStyle = {width: 2, color: "#0000AA"};
    };


    Thales.prototype.draw = function(context) {
        var stuff = this.thales(context);
        context.beginPath();
        context.arc(this.p1[0], this.p1[1], this.radius, 0, 2 * Math.PI, false);
        context.lineWidth = 2;
        context.strokeStyle = "#0000AA";
        context.stroke();


        context.beginPath();
        context.moveTo(this.p1[0], this.p1[1]);
        context.lineTo(this.p2[0], this.p2[1]);
        context.lineTo(stuff[0][0], stuff[0][1]);
        context.moveTo(this.p2[0], this.p2[1]);
        context.lineTo(stuff[1][0], stuff[1][1]);

        context.lineWidth = 1;
        context.strokeStyle = "#000055";
        context.stroke();

    };

    Thales.prototype.isHit = function(context, mousePos) {
        return true;
    };

    Thales.prototype.createDraggers = function() {
        var draggerStyle = {radius: 3, color: "#333"};
        var draggers = [];

        var _thales = this;

        var getP1 = function() {
            return _thales.p1;
        };
        var setP1 = function(drag) {
            if(vec2.pythagoras(_thales.p2, drag.position) < _thales.radius) {
            } else {
                _thales.p1 = drag.position;
            }
        };

        var getP2 = function() {
            return _thales.p2;
        };
        var setP2 = function(drag) {
            if(vec2.pythagoras(_thales.p1, drag.position) < _thales.radius) {
            } else {
                _thales.p2 = drag.position;
            }
        };

        var getRadius = function() {
            return _thales.thales()[0];
        };

        var setRadius = function(drag) {
            var drag_len = vec2.pythagoras(_thales.p1, drag.position);
            var point_len = vec2.pythagoras(_thales.p1, _thales.p2);
            if(drag_len >= point_len) {
                _thales.radius = point_len - 1;
            } else {
                _thales.radius = drag_len;
            }
        };

        draggers.push(new PointDragger(getP1, setP1, draggerStyle));
        draggers.push(new PointDragger(getP2, setP2, draggerStyle));
        draggers.push(new PointDragger(getRadius, setRadius, draggerStyle));
        return draggers;
    };

    Thales.prototype.thales = function(context) {
        var thales_center = [(this.p1[0] + this.p2[0]) / 2, (this.p1[1] + this.p2[1]) / 2];
        var thales_radius = vec2.pythagoras(thales_center, this.p2);

        // var x = intersection(this.p1[0], this.p1[1], this.radius, thales_center[0], thales_center[1], thales_radius);

        var d = vec2.pythagoras(this.p1, thales_center);
        if (d > this.radius + thales_radius) // Circles do not overlap
            return [];
        if (d < Math.abs(this.radius - thales_radius)) // One circle contains the other
            return [];
        if (d == 0 && this.radius == thales_radius) // These are the same circle
            return [];

        // Find distances of dimensions from the first point
        var a = (Math.pow(this.radius, 2) - Math.pow(thales_radius, 2) + Math.pow(d, 2)) / (2 * d);
        var h = Math.sqrt(Math.pow(this.radius, 2) - Math.pow(a, 2));

        // Determine point on the line between centers
        var p = [
            this.p1[0] + a * (thales_center[0] - this.p1[0]) / d,
            this.p1[1] + a * (thales_center[1] - this.p1[1]) / d
        ];

        // Calculate intersection points
        var x = [
            [
                p[0] + h * (thales_center[1] - this.p1[1]) / d,
                p[1] - h * (thales_center[0] - this.p1[0]) / d
            ],
            [
                p[0] - h * (thales_center[1] - this.p1[1]) / d,
                p[1] + h * (thales_center[0] - this.p1[0]) / d
            ]
        ];

        if(context) {
             context.beginPath();
             context.arc(thales_center[0], thales_center[1], thales_radius, 0, 2*Math.PI);
             context.lineWidth = 1;
             context.strokeStyle = "#ccc";
             context.stroke();
             context.beginPath();
             context.arc(thales_center[0], thales_center[1], 2, 0, 2*Math.PI);
             context.lineWidth = 0.5;
             context.strokeStyle = "#f33";
             context.stroke();
        }
        return x;
/*
        // Lets do two circles, the first one is given, the second is the thales circle

        var thales_center = [(this.p1[0] + this.p2[0]) / 2, (this.p1[1] + this.p2[1]) / 2];
        var thales_radius = vec2.pythagoras(thales_center, this.p2);

        // the resulting circles are:
        // 1 base  : (x - p1[0])^2 + (y - p1[1])^2 = radius^2
        // 2 thales: (x - center[0])^2 + (y - center[1])^2 = thales_radius^2
        // which expand:   v -mx      + v nx    +      v -my     + v ny    = base_pow_rad
        // 1 base  : x^2 - 2*p1[0]*x + p1[0]^2 + y^2 - 2*p1[1]*x + p1[1]^2 = radius^2
        // 2 thales: x^2 - 2*center[0]*x + center[0]^2 + y^2 - 2*center[1]*x + center[1]^2 = radius^2


        var mx = - 2 * this.p1[0];
        var nx = Math.pow(this.p1[0], 2);
        var my = - 2 * this.p1[1];
        var ny = Math.pow(this.p1[1], 2);

        var thales_mx = - 2 * thales_center[0];
        var thales_nx = Math.pow(thales_center[0], 2);
        var thales_my = - 2 * thales_center[1];
        var thales_ny = Math.pow(thales_center[1], 2);

        // now multiply all terms of the first with -1 to obtain an equivalent equation for:
        //   1 base     : -x^2 + m*x - n - y^2 + k*y - j = -l
        // + 2 thales   :  x^2 - m*x + n + y^2 - k*y + j =  l
        // ---------------------------------------------------
        //   3 linear eq:  0 - (m2-m1)*x + (n2-n1) - (k2-k1)*y + (j2-j1) = l2-l1
        //                      ^mx         ^nx       ^my         ^ny      ^radius_pow


        var linear_mx = thales_mx - mx;
        var linear_nx = thales_nx - nx;
        var linear_my = thales_my - my;
        var linear_ny = thales_ny - ny;
        var linear_radius_pow = Math.pow(thales_radius, 2) - Math.pow(this.radius, 2);

        // this results then in an equation like that:
        // 3 linear eq: m*x + n - k*y + o = val
        // which we can break down to:
        // 1: x = (val + n + o) / m + k*y

        var linear_k = (linear_radius_pow + linear_nx + linear_ny); // this is (val + n + o) / m
        var linear_y = linear_my / linear_mx;                       // and k*y / m

        // then we substitute this with the very first equation
        // which is now: ((linear_y + linear_k*y) - p1[0])^2 + (y - p1[1])^2 = radius^2                v lin_fac_2          v quad_rad
        // so it might be: (linear_y - linear_k*y)^2 - 2*p1[0]*(linear_y-linear_k*y) + p1[0]^2 + y^2 - 2*p1[1]*y + p[1]^2 = radius^2
        //                  ^quad_fac_1                ^lin_fac_1                      ^fac_1    ^quad_fac_2       ^fac_2
        // quad_fac_1 is: (linear_y - linear_k * y)^2
        // so it will be: linear_k^2 * y^2 - 2*linear_k*linear_y*y + linear_y^2
        //                ^quad_fac_3        ^lin_fac_3              ^fac_3
        var quad_fac_3 = Math.pow(linear_k, 2);
        var quad_fac_2 = 1;
        var lin_fac_1 = 2 * this.p1[0] * (linear_y - linear_k);
        var lin_fac_2 = 2 * this.p1[1];
        var fac_1 = Math.pow(this.p1[0], 2);
        var fac_2 = Math.pow(this.p1[1], 2);
        var fac_3 = Math.pow(linear_y, 2);

        var quad_fac = quad_fac_3 + quad_fac_2;
        var lin_fac = lin_fac_1 + lin_fac_2;
        var fac = fac_1 + fac_2 + fac_3;
        lin_fac = -lin_fac;

        console.log("Factors", quad_fac, lin_fac, fac);

        // now pq formular:

        var ez_lin_fac = lin_fac/quad_fac;
        var ez_fac = fac / quad_fac;

        var a = -ez_lin_fac/2;
        var b = Math.pow(a, 2);
        var d = Math.sqrt(b - ez_fac);

        var q1 = a + d;
        var q2 = a - d;


        context.beginPath();
        context.arc(thales_center[0], thales_center[1], thales_radius, 0, 2*Math.PI);
        context.lineWidth = 1;
        context.strokeStyle = "#ccc";
        context.stroke();
        context.beginPath();
        context.arc(thales_center[0], thales_center[1], 2, 0, 2*Math.PI);
        context.lineWidth = 0.5;
        context.strokeStyle = "#f33";
        context.stroke();
*/
        /*
        var mid_t = [(this.p1[0] + this.p2[0]) / 2, (this.p1[1] + this.p2[1]) / 2];
        var rad_t = Math.pow(vec2.pythagoras(mid_t, this.p2), 2);
        // This results in: n*x + m*y + k = 0 or here: x = m*y + k (with n being divided already)
        var pol_x = - this.p1[0] * 2 + mid_t[0] * 2;
        var pol_y = -(-this.p1[1] * 2 + mid_t[1] * 2) / pol_x;
        var pol_helper_0 = this.p1[0] * this.p1[0] + this.p1[1] * this.p1[1];
        var pol_helper_1 = this.p2[0] * this.p2[0] + this.p2[1] * this.p2[1];
        var pol_k = -(pol_helper_0 - pol_helper_1) / pol_x / 2;

        console.log(pol_x, pol_y, pol_k);
        // Now get y coordinates:
        // x = -m*y - k : (x - p1[0])^2 + (y - p1[1]) ^ 2 = rad_t
        // => ((-m * y - k) - p1[0])^2 + (y - p1[1])^2 = rad_t
        // => (-m * y - (k - p1[0])^2 -> (-m^2 * y^2 - 2*m*(k - p1[0])*y + (k - p1[0])^2

        // (k - p1[0]
        var helper = pol_k - this.p1[0];    // (k - p1[0])

        var y_a = Math.pow(pol_y, 2);       // -m^2 * y^2
        var y_b = 2 * pol_y * helper;       // 2 * m * helper
        var y_c = Math.pow(helper, 2);      // helper ^ 2

        // this is now: (y - p1[1]) ^ 2

        var y_d = 1;                        // y^2
        var y_e = 2 * this.p1[1];           // y * 2 * p1[1]
        var y_f = Math.pow(this.p1[1], 2);  // p1[1] ^ 2
        // and everything behind the =
        var y_k = this.radius;              // radius

        // this is for normal form: m*y^2 + n*y + o = 0
        var y_m = y_a + y_d;
        var y_n = y_b - y_e;
        var y_o = y_c + y_f - Math.pow(y_k, 2);

        console.log(y_o);

        y_n /= y_m;
        y_o /= y_m;
        y_m /= y_m;  // --> results naturally in 1
        console.log(y_m, y_n, y_o);


        // from here we do P/Q Formular to solve two y points:
        // y_0_1 = -P/2 +- sqrt((p/2)^2 - q) :  p = n, q = o, d = (p/2)^2 - q
        var p_half = -y_n / 2;
        var p_half_pow = Math.pow(p_half, 2);

        var d = p_half_pow - y_o;
        // @TODO: if(d < 0) -> no solution, no possible sqrt
        console.log(d);
        var sqrt = Math.sqrt(d);

        var y1 = p_half + sqrt; // upper
        var y2 = p_half - sqrt; // lower

        var x1 = pol_y * y1 + pol_k;
        var x2 = pol_y * y2 + pol_k;


        console.log([x1, y1], [x2, y2]);

        return [mid_t, [x1, y1], [x2, y2]];
        */
    };

    return Thales;
});