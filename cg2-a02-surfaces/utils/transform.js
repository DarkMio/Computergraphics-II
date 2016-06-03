define(["mat4x4"], function(Mat4x4) {
    "use strict";

    var Transform = function Transform(m, i) {
        this.m = m || new Mat4x4(1, 0, 0, 0,
                                 0, 1, 0, 0,
                                 0, 0, 1, 0,
                                 0, 0, 0, 1
        );

        this.i = i || new Mat4x4(1, 0, 0, 0,
                                 0, 1, 0, 0,
                                 0, 0, 1, 0,
                                 0, 0, 0, 1
        );
    };

    Transform.prototype.translate = function(vector3) {
        var tMatW = this.m.m11 * vector3[0] + this.m.m12 * vector3[1] + this.m.m13 * vector3[2] + this.m.m14;
        var tMatX = this.m.m21 * vector3[0] + this.m.m22 * vector3[1] + this.m.m23 * vector3[2] + this.m.m24;
        var tMatY = this.m.m31 * vector3[0] + this.m.m32 * vector3[1] + this.m.m33 * vector3[2] + this.m.m34;
        var tMatZ = this.m.m41 * vector3[0] + this.m.m42 * vector3[1] + this.m.m43 * vector3[2] + this.m.m44;
        var tMat = new Mat4x4(this.m.m11, this.m.m12, this.m.m13, tMatW,
            this.m.m21, this.m.m22, this.m.m23, tMatX,
            this.m.m31, this.m.m32, this.m.m33, tMatY,
            this.m.m41, this.m.m42, this.m.m43, tMatZ
        );
        var i_normal = [vector3[0] * -1, vector3[1] * -1, vector3[2] * -1];
        var iMatW = this.i.m11 * i_normal.x + this.i.m12 * i_normal.y + this.i.m13 * i_normal.z + this.i.m14;
        var iMatX = this.i.m21 * i_normal.x + this.i.m22 * i_normal.y + this.i.m23 * i_normal.z + this.i.m24;
        var iMatY = this.i.m31 * i_normal.x + this.i.m32 * i_normal.y + this.i.m33 * i_normal.z + this.i.m34;
        var iMatZ = this.i.m41 * i_normal.x + this.i.m42 * i_normal.y + this.i.m43 * i_normal.z + this.i.m44;
        var iMat = new Mat4x4(this.i.m11, this.i.m12, this.i.m13, iMatW,
                              this.i.m21, this.i.m22, this.i.m23, iMatX,
                              this.i.m31, this.i.m32, this.i.m33, iMatY,
                              this.i.m41, this.i.m42, this.i.m43, iMatZ
        );
        this.m = tMat;
        this.i = iMat;
    };

    Transform.prototype.scale = function(vector3) {
        var tMat = new Mat4x4(this.m.m11 * vector3[0], this.m.m12 * vector3[1], this.m.m13 * vector3[2], this.m.m14,
                              this.m.m21 * vector3[0], this.m.m22 * vector3[1], this.m.m23 * vector3[2], this.m.m24,
                              this.m.m31 * vector3[0], this.m.m32 * vector3[1], this.m.m33 * vector3[2], this.m.m34,
                              this.m.m41 * vector3[0], this.m.m42 * vector3[1], this.m.m43 * vector3[2], this.m.m44
        );
        var iMat = new Mat4x4(this.i.m11 * 1 / vector3[0], this.i.m12 * 1 / vector3[1], this.i.m13 * 1 / vector3[2], this.i.m14,
                              this.i.m21 * 1 / vector3[0], this.i.m22 * 1 / vector3[1], this.i.m23 * 1 / vector3[2], this.i.m24,
                              this.i.m31 * 1 / vector3[0], this.i.m32 * 1 / vector3[1], this.i.m33 * 1 / vector3[2], this.i.m34,
                              this.i.m41 * 1 / vector3[0], this.i.m42 * 1 / vector3[1], this.i.m43 * 1 / vector3[2], this.i.m44
        );
        this.m = tMat;
        this.i = iMat;
    };

    Transform.prototype.rotateX = function(angle) {
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var tMat = new Mat4x4(this.m.m11, this.m.m12 * cos + this.m.m13 * sin, this.m.m12 * -sin + this.m.m13 * cos, this.m.m14,
                              this.m.m21, this.m.m22 * cos + this.m.m23 * sin, this.m.m22 * -sin + this.m.m23 * cos, this.m.m24,
                              this.m.m31, this.m.m32 * cos + this.m.m33 * sin, this.m.m32 * -sin + this.m.m33 * cos, this.m.m34,
                              this.m.m41, this.m.m42 * cos + this.m.m43 * sin, this.m.m42 * -sin + this.m.m43 * cos, this.m.m44);
        var iMat = new Mat4x4(this.i.m11, this.i.m12 * cos + this.i.m13 * -sin, this.i.m12 * sin + this.i.m13 * cos, this.i.m14,
                              this.i.m21, this.i.m22 * cos + this.i.m23 * -sin, this.i.m22 * sin + this.i.m23 * cos, this.i.m24,
                              this.i.m31, this.i.m32 * cos + this.i.m33 * -sin, this.i.m32 * sin + this.i.m33 * cos, this.i.m34,
                              this.i.m41, this.i.m42 * cos + this.i.m43 * -sin, this.i.m42 * sin + this.i.m43 * cos, this.i.m44);
        this.m = tMat;
        this.i = iMat;
    };

    Transform.prototype.rotateY = function(angle) {
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var tMat = new Mat4x4(this.m.m11 * cos + this.m.m13 * -sin, this.m.m12, this.m.m11 * sin + this.m.m13 * cos, this.m.m14,
            this.m.m21 * cos + this.m.m23 * -sin, this.m.m22, this.m.m21 * sin + this.m.m23 * cos, this.m.m24,
            this.m.m31 * cos + this.m.m33 * -sin, this.m.m32, this.m.m31 * sin + this.m.m33 * cos, this.m.m34,
            this.m.m41 * cos + this.m.m43 * -sin, this.m.m42, this.m.m41 * sin + this.m.m43 * cos, this.m.m44);
        var iMat = new Mat4x4(this.i.m11 * cos + this.i.m13 * sin, this.i.m12, this.i.m11 * -sin + this.i.m13 * cos, this.i.m14,
                              this.i.m21 * cos + this.i.m23 * sin, this.i.m22, this.i.m21 * -sin + this.i.m23 * cos, this.i.m24,
                              this.i.m31 * cos + this.i.m33 * sin, this.i.m32, this.i.m31 * -sin + this.i.m33 * cos, this.i.m34,
                              this.i.m41 * cos + this.i.m43 * sin, this.i.m42, this.i.m41 * -sin + this.i.m43 * cos, this.i.m44);
        this.m = tMat;
        this.i = iMat;
    };

    Transform.prototype.rotateZ = function(angle) {
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var tMat = new Mat4x4(this.m.m11 * cos + this.m.m12 * sin, this.m.m11 * -sin + this.m.m12 * cos, this.m.m13, this.m.m14,
                              this.m.m21 * cos + this.m.m22 * sin, this.m.m21 * -sin + this.m.m22 * cos, this.m.m23, this.m.m24,
                              this.m.m31 * cos + this.m.m32 * sin, this.m.m31 * -sin + this.m.m32 * cos, this.m.m33, this.m.m34,
                              this.m.m41 * cos + this.m.m42 * sin, this.m.m41 * -sin + this.m.m42 * cos, this.m.m43, this.m.m44);

        var iMat = new Mat4x4(this.i.m11 * cos + this.i.m12 * -sin, this.i.m11 * sin + this.i.m12 * cos, this.i.m13, this.i.m14,
                              this.i.m21 * cos + this.i.m22 * -sin, this.i.m21 * sin + this.i.m22 * cos, this.i.m23, this.i.m24,
                              this.i.m31 * cos + this.i.m32 * -sin, this.i.m31 * sin + this.i.m32 * cos, this.i.m33, this.i.m34,
                              this.i.m41 * cos + this.i.m42 * -sin, this.i.m41 * sin + this.i.m42 * cos, this.i.m43, this.i.m44);
        this.m = tMat;
        this.i = iMat;
    };



    return new Transform;
});