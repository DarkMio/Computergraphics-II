define([], function() {
    "use strict";

    var Mat4x4 = function Mat4x4(m11, m12, m13, m14,
                                 m21, m22, m23, m24,
                                 m31, m32, m33, m34,
                                 m41, m42, m43, m44) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m14 = m14;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m24 = m24;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        this.m34 = m34;
        this.m41 = m41;
        this.m42 = m42;
        this.m43 = m43;
        this.m44 = m44;
        this.determinant = m11 * m22 * m33 * m44
            + m12 * m23 * m34 * m41
            + m13 * m24 * m31 * m42
            + m14 * m21 * m32 * m43
            - m41 * m32 * m23 * m14
            - m42 * m33 * m24 * m11
            - m43 * m34 * m21 * m12
            - m44 * m31 * m22 * m13;
    };

    Mat4x4.prototype.mul = function(otherVector3) {
        if(!otherVector3) {
            throw new Error("Vector is null");
        }
        var x = otherVector3[0];
        var y = otherVector3[1];
        var z = otherVector3[2];
        return [this.m11 * x + this.m12 * y + this.m13 * z,
            this.m21 * x + this.m22 * y + this.m23 * z,
            this.m31 * x + this.m32 * y + this.m33 * z];
    };

    Mat4x4.prototype.matMul = function(otherMat4x4) {
        if(!otherMat4x4) {
            throw new Error("Vector is null");
        }
        var o = otherMat4x4; // lazy people, lazy solutions
        var n11 = this.m11 * o.m11 + this.m12 * o.m21 + this.m13 * o.m31 + this.m14 * o.m41;
        var n12 = this.m11 * o.m12 + this.m12 * o.m22 + this.m13 * o.m32 + this.m14 * o.m42;
        var n13 = this.m11 * o.m13 + this.m12 * o.m23 + this.m13 * o.m33 + this.m14 * o.m43;
        var n14 = this.m11 * o.m14 + this.m12 * o.m24 + this.m13 * o.m34 + this.m14 * o.m44;
        var n21 = this.m21 * o.m11 + this.m22 * o.m21 + this.m23 * o.m31 + this.m24 * o.m41;
        var n22 = this.m21 * o.m12 + this.m22 * o.m22 + this.m23 * o.m32 + this.m24 * o.m42;
        var n23 = this.m21 * o.m13 + this.m22 * o.m23 + this.m23 * o.m33 + this.m24 * o.m43;
        var n24 = this.m21 * o.m14 + this.m22 * o.m24 + this.m23 * o.m34 + this.m24 * o.m44;
        var n31 = this.m31 * o.m11 + this.m32 * o.m21 + this.m33 * o.m31 + this.m34 * o.m41;
        var n32 = this.m31 * o.m12 + this.m32 * o.m22 + this.m33 * o.m32 + this.m34 * o.m42;
        var n33 = this.m31 * o.m13 + this.m32 * o.m23 + this.m33 * o.m33 + this.m34 * o.m43;
        var n34 = this.m31 * o.m14 + this.m32 * o.m24 + this.m33 * o.m34 + this.m34 * o.m44;
        var n41 = this.m41 * o.m11 + this.m42 * o.m21 + this.m43 * o.m31 + this.m44 * o.m41;
        var n42 = this.m41 * o.m12 + this.m42 * o.m22 + this.m43 * o.m32 + this.m44 * o.m42;
        var n43 = this.m41 * o.m13 + this.m42 * o.m23 + this.m43 * o.m33 + this.m44 * o.m43;
        var n44 = this.m41 * o.m14 + this.m42 * o.m24 + this.m43 * o.m34 + this.m44 * o.m44;
        return new Mat4x4(n11, n12, n13, n14,
            n21, n22, n23, n24,
            n31, n32, n33, n34,
            n41, n42, n43, n44);
    };

    Mat4x4.prototype.transpose = function() {
        return new Mat4x4(this.m11, this.m21, this.m31, this.m41,
                          this.m12, this.m22, this.m32, this.m42,
                          this.m13, this.m23, this.m33, this.m43,
                          this.m14, this.m24, this.m34, this.m44)
    };



    return Mat4x4;
});