//ax-matrix.js

var Matrix4 = function() {
	this.elements = new Float32Array([
		1,0,0,0, 
		0,1,0,0, 
		0,0,1,0, 
		0,0,0,1
	]);
};

Matrix4.prototype.setIdentity = function() {
	return this;
};

/**
 * Eltolás.
 * @param x X-tengely szerint.
 * @param y Y-tengely szerint.
 * @param z Z-tengely szerint.
 * @return Translate mátrix.
 */
Matrix4.prototype.setTranslate = function (x, y, z) {
    console.log('setTranslate...');
	var e = this.elements;
    e[0]  = 1; e[1]  = 0; e[2]  = 0; e[3]  = x;
    e[4]  = 0; e[5]  = 1; e[6]  = 0; e[7]  = y;
    e[8]  = 0; e[9]  = 0; e[10] = 1; e[11] = z;
    e[12] = 0; e[13] = 0; e[14] = 0; e[15] = 1;
    return this;
};

/**
 * Forgatás.
 * @param angle A forgatás mértékének irányszöge. Ha angle > 0 akkor 
 * @param x X-tengely szerint.
 * @param y Y-tengely szerint.
 * @param z Z-tengely szerint.
 * @return Translate mátrix.
 */

Matrix4.prototype.setRotate = function(angle, x, y, z) {	
	var e = this.elements;
	var sin = this.getSin(angle);
	var cos = this.getCos(angle);

	if(x !== 0 && y === 0 && z === 0) {
		if(x < 0) {
			sin *= -1;
		}
		e[0]  = 1; e[1]  = 0;   e[2]  = 0;    e[3]  = 0;
	    e[4]  = 0; e[5]  = cos; e[6]  = -sin; e[7]  = 0;
	    e[8]  = 0; e[9]  = sin; e[10] = cos;  e[11] = 0;
	    e[12] = 0; e[13] = 0;   e[14] = 0;    e[15] = 1;
	} else if(x === 0 && y !== 0 && z === 0) {
		if(y < 0) {
			sin *= -1;	
		}
		e[0]  = cos;  e[1]  = 0; e[2]  = sin; e[3]  = 0;
	    e[4]  = 0;    e[5]  = 1; e[6]  = 0;   e[7]  = 0;
	    e[8]  = -sin; e[9]  = 0; e[10] = cos; e[11] = 0;
	    e[12] = 0;    e[13] = 0; e[14] = 0;   e[15] = 1;
	} else if(x === 0 && y === 0 && z !== 0) {
		if(z < 0) {
			sin *= -1;	
		}
		e[0]  = cos; e[1]  = -sin; e[2]  = 0; e[3]  = 0;
	    e[4]  = sin; e[5]  = cos;  e[6]  = 0; e[7]  = 0;
	    e[8]  = 0;   e[9]  = 0;    e[10] = 1; e[11] = 0;
	    e[12] = 0;   e[13] = 0;    e[14] = 0; e[15] = 1;
	} else {
		console.log('No set rotation axis!');
	}
	return this;
};

/**
 * Türkrözés.
 * @param x X-tengely szerint.
 * @param y Y-tengely szerint.
 * @param z Z-tengely szerint.
 * @return Reflection mátrix.
 */
Matrix4.prototype.setReflection = function(x, y, z) {
	var e = this.elements;
	var c = -1;			
    if(x !== 0 && y === 0 && z === 0) {
		e[0]  = c; e[1]  = 0; e[2]  = 0;  e[3]  = 0;
	    e[4]  = 0; e[5]  = 1; e[6]  = 0;  e[7]  = 0;
	    e[8]  = 0; e[9]  = 0; e[10] = 1; e[11] = 0;
	    e[12] = 0; e[13] = 0; e[14] = 0;  e[15] = 1;		
	} else if(x === 0 && y !== 0 && z === 0) {
		e[0]  = 1; e[1]  = 0; e[2]  = 0;  e[3]  = 0;
	    e[4]  = 0; e[5]  = c; e[6]  = 0;  e[7]  = 0;
	    e[8]  = 0; e[9]  = 0; e[10] = 1; e[11] = 0;
	    e[12] = 0; e[13] = 0; e[14] = 0;  e[15] = 1;		
	} else if(x === 0 && y === 0 && z !== 0) {
		e[0]  = 1; e[1]  = 0; e[2]  = 0;  e[3]  = 0;
	    e[4]  = 0; e[5]  = 1; e[6]  = 0;  e[7]  = 0;
	    e[8]  = 0; e[9]  = 0; e[10] = c; e[11] = 0;
	    e[12] = 0; e[13] = 0; e[14] = 0;  e[15] = 1;
	} else {
		console.log('No set reflection axis!');
	}
	return this;			
};

Matrix4.prototype.concatenationMultiple = function() {
	if(arguments !== null && arguments.length !== 0 && arguments.length >= 2) {
		var f, s;
		var i = 0;
		f = arguments[i];	
		while(i !== (arguments.length - 1)) {
			var next = i + 1;			
			s = arguments[next];
			f = this.concatenation2(f, s);
			i++;
		}
		return f;
	}
	return null;
};

Matrix4.prototype.concatenation2 = function(f, s) {
	r = null;	//result	
	if(f !== null && s !== null) {		
		r = new Float32Array(16);

		r[0] = ((f[0] * s[0]) + (f[1] * s[4]) + (f[2] * s[8]) + (f[3] * s[12]));
		r[1] = ((f[0] * s[1]) + (f[1] * s[5]) + (f[2] * s[9]) + (f[3] * s[13]));
		r[2] = ((f[0] * s[2]) + (f[1] * s[6]) + (f[2] * s[10]) + (f[3] * s[14]));
		r[3] = ((f[0] * s[3]) + (f[1] * s[7]) + (f[2] * s[11]) + (f[3] * s[15]));

		r[4] = ((f[4] * s[0]) + (f[5] * s[4]) + (f[6] * s[8]) + (f[7] * s[12]));
		r[5] = ((f[4] * s[1]) + (f[5] * s[5]) + (f[6] * s[9]) + (f[7] * s[13]));
		r[6] = ((f[4] * s[2]) + (f[5] * s[6]) + (f[6] * s[10]) + (f[7] * s[14]));
		r[7] = ((f[4] * s[3]) + (f[5] * s[7]) + (f[6] * s[11]) + (f[7] * s[15]));
		
		r[8] = ((f[8] * s[0]) + (f[9] * s[4]) + (f[10] * s[8]) + (f[11] * s[12]));
		r[9] = ((f[8] * s[1]) + (f[9] * s[5]) + (f[10] * s[9]) + (f[11] * s[13]));
		r[10] = ((f[8] * s[2]) + (f[9] * s[6]) + (f[10] * s[10]) + (f[11] * s[14]));
		r[11] = ((f[8] * s[3]) + (f[9] * s[7]) + (f[10] * s[11]) + (f[11] * s[15]));

		r[12] = ((f[12] * s[0]) + (f[13] * s[4]) + (f[14] * s[8]) + (f[15] * s[12]));
		r[13] = ((f[12] * s[1]) + (f[13] * s[5]) + (f[14] * s[8]) + (f[15] * s[13]));
		r[14] = ((f[12] * s[2]) + (f[13] * s[6]) + (f[14] * s[10]) + (f[15] * s[14]));
		r[15] = ((f[12] * s[3]) + (f[13] * s[7]) + (f[14] * s[11]) + (f[15] * s[15]));
	}	
	return r;
};

Matrix4.prototype.getSin = function(angle) {
	if(angle != null)
		return Math.sin(this.getRadian(angle));
	return 0;
};

Matrix4.prototype.getCos = function(angle) {
	if(angle != null)
		return Math.cos(this.getRadian(angle));
	return 0;
};

Matrix4.prototype.getRadian = function(angle) {
	if(angle != null)
		return Math.PI * angle / 180;
	return 0;
};