(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var Random = Package.random.Random;
var check = Package.check.check;
var Match = Package.check.Match;
var SHA256 = Package.sha.SHA256;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var BigInteger, SRP;

var require = meteorInstall({"node_modules":{"meteor":{"srp":{"biginteger.js":function module(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/srp/biginteger.js                                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/// METEOR WRAPPER
BigInteger = function () {
  /// BEGIN jsbn.js

  /*
   * Copyright (c) 2003-2005  Tom Wu
   * All Rights Reserved.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND, 
   * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY 
   * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  
   *
   * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
   * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
   * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
   * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
   * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * In addition, the following condition applies:
   *
   * All redistributions must retain an intact copy of this copyright notice
   * and disclaimer.
   */
  // Basic JavaScript BN library - subset useful for RSA encryption.
  // Bits per digit
  var dbits; // JavaScript engine analysis

  var canary = 0xdeadbeefcafe;
  var j_lm = (canary & 0xffffff) == 0xefcafe; // (public) Constructor

  function BigInteger(a, b, c) {
    if (a != null) if ("number" == typeof a) this.fromNumber(a, b, c);else if (b == null && "string" != typeof a) this.fromString(a, 256);else this.fromString(a, b);
  } // return new, unset BigInteger


  function nbi() {
    return new BigInteger(null);
  } // am: Compute w_j += (x*this_i), propagate carries,
  // c is initial carry, returns final carry.
  // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
  // We need to select the fastest one that works in this environment.
  // am1: use a single mult and divide to get the high bits,
  // max digit bits should be 26 because
  // max internal value = 2*dvalue^2-2*dvalue (< 2^53)


  function am1(i, x, w, j, c, n) {
    while (--n >= 0) {
      var v = x * this[i++] + w[j] + c;
      c = Math.floor(v / 0x4000000);
      w[j++] = v & 0x3ffffff;
    }

    return c;
  } // am2 avoids a big mult-and-extract completely.
  // Max digit bits should be <= 30 because we do bitwise ops
  // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)


  function am2(i, x, w, j, c, n) {
    var xl = x & 0x7fff,
        xh = x >> 15;

    while (--n >= 0) {
      var l = this[i] & 0x7fff;
      var h = this[i++] >> 15;
      var m = xh * l + h * xl;
      l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
      c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
      w[j++] = l & 0x3fffffff;
    }

    return c;
  } // Alternately, set max digit bits to 28 since some
  // browsers slow down when dealing with 32-bit numbers.


  function am3(i, x, w, j, c, n) {
    var xl = x & 0x3fff,
        xh = x >> 14;

    while (--n >= 0) {
      var l = this[i] & 0x3fff;
      var h = this[i++] >> 14;
      var m = xh * l + h * xl;
      l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
      c = (l >> 28) + (m >> 14) + xh * h;
      w[j++] = l & 0xfffffff;
    }

    return c;
  }
  /* XXX METEOR XXX
  if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
    BigInteger.prototype.am = am2;
    dbits = 30;
  }
  else if(j_lm && (navigator.appName != "Netscape")) {
    BigInteger.prototype.am = am1;
    dbits = 26;
  }
  else 
  */


  {
    // Mozilla/Netscape seems to prefer am3
    BigInteger.prototype.am = am3;
    dbits = 28;
  }
  BigInteger.prototype.DB = dbits;
  BigInteger.prototype.DM = (1 << dbits) - 1;
  BigInteger.prototype.DV = 1 << dbits;
  var BI_FP = 52;
  BigInteger.prototype.FV = Math.pow(2, BI_FP);
  BigInteger.prototype.F1 = BI_FP - dbits;
  BigInteger.prototype.F2 = 2 * dbits - BI_FP; // Digit conversions

  var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
  var BI_RC = new Array();
  var rr, vv;
  rr = "0".charCodeAt(0);

  for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;

  rr = "a".charCodeAt(0);

  for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

  rr = "A".charCodeAt(0);

  for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

  function int2char(n) {
    return BI_RM.charAt(n);
  }

  function intAt(s, i) {
    var c = BI_RC[s.charCodeAt(i)];
    return c == null ? -1 : c;
  } // (protected) copy this to r


  function bnpCopyTo(r) {
    for (var i = this.t - 1; i >= 0; --i) r[i] = this[i];

    r.t = this.t;
    r.s = this.s;
  } // (protected) set from integer value x, -DV <= x < DV


  function bnpFromInt(x) {
    this.t = 1;
    this.s = x < 0 ? -1 : 0;
    if (x > 0) this[0] = x;else if (x < -1) this[0] = x + DV;else this.t = 0;
  } // return bigint initialized to value


  function nbv(i) {
    var r = nbi();
    r.fromInt(i);
    return r;
  } // (protected) set from string and radix


  function bnpFromString(s, b) {
    var k;
    if (b == 16) k = 4;else if (b == 8) k = 3;else if (b == 256) k = 8; // byte array
    else if (b == 2) k = 1;else if (b == 32) k = 5;else if (b == 4) k = 2;else {
        this.fromRadix(s, b);
        return;
      }
    this.t = 0;
    this.s = 0;
    var i = s.length,
        mi = false,
        sh = 0;

    while (--i >= 0) {
      var x = k == 8 ? s[i] & 0xff : intAt(s, i);

      if (x < 0) {
        if (s.charAt(i) == "-") mi = true;
        continue;
      }

      mi = false;
      if (sh == 0) this[this.t++] = x;else if (sh + k > this.DB) {
        this[this.t - 1] |= (x & (1 << this.DB - sh) - 1) << sh;
        this[this.t++] = x >> this.DB - sh;
      } else this[this.t - 1] |= x << sh;
      sh += k;
      if (sh >= this.DB) sh -= this.DB;
    }

    if (k == 8 && (s[0] & 0x80) != 0) {
      this.s = -1;
      if (sh > 0) this[this.t - 1] |= (1 << this.DB - sh) - 1 << sh;
    }

    this.clamp();
    if (mi) BigInteger.ZERO.subTo(this, this);
  } // (protected) clamp off excess high words


  function bnpClamp() {
    var c = this.s & this.DM;

    while (this.t > 0 && this[this.t - 1] == c) --this.t;
  } // (public) return string representation in given radix


  function bnToString(b) {
    if (this.s < 0) return "-" + this.negate().toString(b);
    var k;
    if (b == 16) k = 4;else if (b == 8) k = 3;else if (b == 2) k = 1;else if (b == 32) k = 5;else if (b == 4) k = 2;else return this.toRadix(b);
    var km = (1 << k) - 1,
        d,
        m = false,
        r = "",
        i = this.t;
    var p = this.DB - i * this.DB % k;

    if (i-- > 0) {
      if (p < this.DB && (d = this[i] >> p) > 0) {
        m = true;
        r = int2char(d);
      }

      while (i >= 0) {
        if (p < k) {
          d = (this[i] & (1 << p) - 1) << k - p;
          d |= this[--i] >> (p += this.DB - k);
        } else {
          d = this[i] >> (p -= k) & km;

          if (p <= 0) {
            p += this.DB;
            --i;
          }
        }

        if (d > 0) m = true;
        if (m) r += int2char(d);
      }
    }

    return m ? r : "0";
  } // (public) -this


  function bnNegate() {
    var r = nbi();
    BigInteger.ZERO.subTo(this, r);
    return r;
  } // (public) |this|


  function bnAbs() {
    return this.s < 0 ? this.negate() : this;
  } // (public) return + if this > a, - if this < a, 0 if equal


  function bnCompareTo(a) {
    var r = this.s - a.s;
    if (r != 0) return r;
    var i = this.t;
    r = i - a.t;
    if (r != 0) return r;

    while (--i >= 0) if ((r = this[i] - a[i]) != 0) return r;

    return 0;
  } // returns bit length of the integer x


  function nbits(x) {
    var r = 1,
        t;

    if ((t = x >>> 16) != 0) {
      x = t;
      r += 16;
    }

    if ((t = x >> 8) != 0) {
      x = t;
      r += 8;
    }

    if ((t = x >> 4) != 0) {
      x = t;
      r += 4;
    }

    if ((t = x >> 2) != 0) {
      x = t;
      r += 2;
    }

    if ((t = x >> 1) != 0) {
      x = t;
      r += 1;
    }

    return r;
  } // (public) return the number of bits in "this"


  function bnBitLength() {
    if (this.t <= 0) return 0;
    return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ this.s & this.DM);
  } // (protected) r = this << n*DB


  function bnpDLShiftTo(n, r) {
    var i;

    for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i];

    for (i = n - 1; i >= 0; --i) r[i] = 0;

    r.t = this.t + n;
    r.s = this.s;
  } // (protected) r = this >> n*DB


  function bnpDRShiftTo(n, r) {
    for (var i = n; i < this.t; ++i) r[i - n] = this[i];

    r.t = Math.max(this.t - n, 0);
    r.s = this.s;
  } // (protected) r = this << n


  function bnpLShiftTo(n, r) {
    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << cbs) - 1;
    var ds = Math.floor(n / this.DB),
        c = this.s << bs & this.DM,
        i;

    for (i = this.t - 1; i >= 0; --i) {
      r[i + ds + 1] = this[i] >> cbs | c;
      c = (this[i] & bm) << bs;
    }

    for (i = ds - 1; i >= 0; --i) r[i] = 0;

    r[ds] = c;
    r.t = this.t + ds + 1;
    r.s = this.s;
    r.clamp();
  } // (protected) r = this >> n


  function bnpRShiftTo(n, r) {
    r.s = this.s;
    var ds = Math.floor(n / this.DB);

    if (ds >= this.t) {
      r.t = 0;
      return;
    }

    var bs = n % this.DB;
    var cbs = this.DB - bs;
    var bm = (1 << bs) - 1;
    r[0] = this[ds] >> bs;

    for (var i = ds + 1; i < this.t; ++i) {
      r[i - ds - 1] |= (this[i] & bm) << cbs;
      r[i - ds] = this[i] >> bs;
    }

    if (bs > 0) r[this.t - ds - 1] |= (this.s & bm) << cbs;
    r.t = this.t - ds;
    r.clamp();
  } // (protected) r = this - a


  function bnpSubTo(a, r) {
    var i = 0,
        c = 0,
        m = Math.min(a.t, this.t);

    while (i < m) {
      c += this[i] - a[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }

    if (a.t < this.t) {
      c -= a.s;

      while (i < this.t) {
        c += this[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }

      c += this.s;
    } else {
      c += this.s;

      while (i < a.t) {
        c -= a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }

      c -= a.s;
    }

    r.s = c < 0 ? -1 : 0;
    if (c < -1) r[i++] = this.DV + c;else if (c > 0) r[i++] = c;
    r.t = i;
    r.clamp();
  } // (protected) r = this * a, r != this,a (HAC 14.12)
  // "this" should be the larger one if appropriate.


  function bnpMultiplyTo(a, r) {
    var x = this.abs(),
        y = a.abs();
    var i = x.t;
    r.t = i + y.t;

    while (--i >= 0) r[i] = 0;

    for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);

    r.s = 0;
    r.clamp();
    if (this.s != a.s) BigInteger.ZERO.subTo(r, r);
  } // (protected) r = this^2, r != this (HAC 14.16)


  function bnpSquareTo(r) {
    var x = this.abs();
    var i = r.t = 2 * x.t;

    while (--i >= 0) r[i] = 0;

    for (i = 0; i < x.t - 1; ++i) {
      var c = x.am(i, x[i], r, 2 * i, 0, 1);

      if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
        r[i + x.t] -= x.DV;
        r[i + x.t + 1] = 1;
      }
    }

    if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
    r.s = 0;
    r.clamp();
  } // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
  // r != q, this != m.  q or r may be null.


  function bnpDivRemTo(m, q, r) {
    var pm = m.abs();
    if (pm.t <= 0) return;
    var pt = this.abs();

    if (pt.t < pm.t) {
      if (q != null) q.fromInt(0);
      if (r != null) this.copyTo(r);
      return;
    }

    if (r == null) r = nbi();
    var y = nbi(),
        ts = this.s,
        ms = m.s;
    var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus

    if (nsh > 0) {
      pm.lShiftTo(nsh, y);
      pt.lShiftTo(nsh, r);
    } else {
      pm.copyTo(y);
      pt.copyTo(r);
    }

    var ys = y.t;
    var y0 = y[ys - 1];
    if (y0 == 0) return;
    var yt = y0 * (1 << this.F1) + (ys > 1 ? y[ys - 2] >> this.F2 : 0);
    var d1 = this.FV / yt,
        d2 = (1 << this.F1) / yt,
        e = 1 << this.F2;
    var i = r.t,
        j = i - ys,
        t = q == null ? nbi() : q;
    y.dlShiftTo(j, t);

    if (r.compareTo(t) >= 0) {
      r[r.t++] = 1;
      r.subTo(t, r);
    }

    BigInteger.ONE.dlShiftTo(ys, t);
    t.subTo(y, y); // "negative" y so we can replace sub with am later

    while (y.t < ys) y[y.t++] = 0;

    while (--j >= 0) {
      // Estimate quotient digit
      var qd = r[--i] == y0 ? this.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);

      if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
        // Try it out
        y.dlShiftTo(j, t);
        r.subTo(t, r);

        while (r[i] < --qd) r.subTo(t, r);
      }
    }

    if (q != null) {
      r.drShiftTo(ys, q);
      if (ts != ms) BigInteger.ZERO.subTo(q, q);
    }

    r.t = ys;
    r.clamp();
    if (nsh > 0) r.rShiftTo(nsh, r); // Denormalize remainder

    if (ts < 0) BigInteger.ZERO.subTo(r, r);
  } // (public) this mod a


  function bnMod(a) {
    var r = nbi();
    this.abs().divRemTo(a, null, r);
    if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r);
    return r;
  } // Modular reduction using "classic" algorithm


  function Classic(m) {
    this.m = m;
  }

  function cConvert(x) {
    if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);else return x;
  }

  function cRevert(x) {
    return x;
  }

  function cReduce(x) {
    x.divRemTo(this.m, null, x);
  }

  function cMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
  }

  function cSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
  }

  Classic.prototype.convert = cConvert;
  Classic.prototype.revert = cRevert;
  Classic.prototype.reduce = cReduce;
  Classic.prototype.mulTo = cMulTo;
  Classic.prototype.sqrTo = cSqrTo; // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
  // justification:
  //         xy == 1 (mod m)
  //         xy =  1+km
  //   xy(2-xy) = (1+km)(1-km)
  // x[y(2-xy)] = 1-k^2m^2
  // x[y(2-xy)] == 1 (mod m^2)
  // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
  // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
  // JS multiply "overflows" differently from C/C++, so care is needed here.

  function bnpInvDigit() {
    if (this.t < 1) return 0;
    var x = this[0];
    if ((x & 1) == 0) return 0;
    var y = x & 3; // y == 1/x mod 2^2

    y = y * (2 - (x & 0xf) * y) & 0xf; // y == 1/x mod 2^4

    y = y * (2 - (x & 0xff) * y) & 0xff; // y == 1/x mod 2^8

    y = y * (2 - ((x & 0xffff) * y & 0xffff)) & 0xffff; // y == 1/x mod 2^16
    // last step - calculate inverse mod DV directly;
    // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints

    y = y * (2 - x * y % this.DV) % this.DV; // y == 1/x mod 2^dbits
    // we really want the negative inverse, and -DV < y < DV

    return y > 0 ? this.DV - y : -y;
  } // Montgomery reduction


  function Montgomery(m) {
    this.m = m;
    this.mp = m.invDigit();
    this.mpl = this.mp & 0x7fff;
    this.mph = this.mp >> 15;
    this.um = (1 << m.DB - 15) - 1;
    this.mt2 = 2 * m.t;
  } // xR mod m


  function montConvert(x) {
    var r = nbi();
    x.abs().dlShiftTo(this.m.t, r);
    r.divRemTo(this.m, null, r);
    if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r);
    return r;
  } // x/R mod m


  function montRevert(x) {
    var r = nbi();
    x.copyTo(r);
    this.reduce(r);
    return r;
  } // x = x/R mod m (HAC 14.32)


  function montReduce(x) {
    while (x.t <= this.mt2) // pad x so am has enough room later
    x[x.t++] = 0;

    for (var i = 0; i < this.m.t; ++i) {
      // faster way of calculating u0 = x[i]*mp mod DV
      var j = x[i] & 0x7fff;
      var u0 = j * this.mpl + ((j * this.mph + (x[i] >> 15) * this.mpl & this.um) << 15) & x.DM; // use am to combine the multiply-shift-add into one call

      j = i + this.m.t;
      x[j] += this.m.am(0, u0, x, i, 0, this.m.t); // propagate carry

      while (x[j] >= x.DV) {
        x[j] -= x.DV;
        x[++j]++;
      }
    }

    x.clamp();
    x.drShiftTo(this.m.t, x);
    if (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
  } // r = "x^2/R mod m"; x != r


  function montSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
  } // r = "xy/R mod m"; x,y != r


  function montMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
  }

  Montgomery.prototype.convert = montConvert;
  Montgomery.prototype.revert = montRevert;
  Montgomery.prototype.reduce = montReduce;
  Montgomery.prototype.mulTo = montMulTo;
  Montgomery.prototype.sqrTo = montSqrTo; // (protected) true iff this is even

  function bnpIsEven() {
    return (this.t > 0 ? this[0] & 1 : this.s) == 0;
  } // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)


  function bnpExp(e, z) {
    if (e > 0xffffffff || e < 1) return BigInteger.ONE;
    var r = nbi(),
        r2 = nbi(),
        g = z.convert(this),
        i = nbits(e) - 1;
    g.copyTo(r);

    while (--i >= 0) {
      z.sqrTo(r, r2);
      if ((e & 1 << i) > 0) z.mulTo(r2, g, r);else {
        var t = r;
        r = r2;
        r2 = t;
      }
    }

    return z.revert(r);
  } // (public) this^e % m, 0 <= e < 2^32


  function bnModPowInt(e, m) {
    var z;
    if (e < 256 || m.isEven()) z = new Classic(m);else z = new Montgomery(m);
    return this.exp(e, z);
  } // protected


  BigInteger.prototype.copyTo = bnpCopyTo;
  BigInteger.prototype.fromInt = bnpFromInt;
  BigInteger.prototype.fromString = bnpFromString;
  BigInteger.prototype.clamp = bnpClamp;
  BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
  BigInteger.prototype.drShiftTo = bnpDRShiftTo;
  BigInteger.prototype.lShiftTo = bnpLShiftTo;
  BigInteger.prototype.rShiftTo = bnpRShiftTo;
  BigInteger.prototype.subTo = bnpSubTo;
  BigInteger.prototype.multiplyTo = bnpMultiplyTo;
  BigInteger.prototype.squareTo = bnpSquareTo;
  BigInteger.prototype.divRemTo = bnpDivRemTo;
  BigInteger.prototype.invDigit = bnpInvDigit;
  BigInteger.prototype.isEven = bnpIsEven;
  BigInteger.prototype.exp = bnpExp; // public

  BigInteger.prototype.toString = bnToString;
  BigInteger.prototype.negate = bnNegate;
  BigInteger.prototype.abs = bnAbs;
  BigInteger.prototype.compareTo = bnCompareTo;
  BigInteger.prototype.bitLength = bnBitLength;
  BigInteger.prototype.mod = bnMod;
  BigInteger.prototype.modPowInt = bnModPowInt; // "constants"

  BigInteger.ZERO = nbv(0);
  BigInteger.ONE = nbv(1); /// BEGIN jsbn2.js

  /*
   * Copyright (c) 2003-2005  Tom Wu
   * All Rights Reserved.
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND, 
   * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY 
   * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.  
   *
   * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,
   * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER
   * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF
   * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT
   * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * In addition, the following condition applies:
   *
   * All redistributions must retain an intact copy of this copyright notice
   * and disclaimer.
   */
  // Extended JavaScript BN functions, required for RSA private ops.
  // (public)

  function bnClone() {
    var r = nbi();
    this.copyTo(r);
    return r;
  } // (public) return value as integer


  function bnIntValue() {
    if (this.s < 0) {
      if (this.t == 1) return this[0] - this.DV;else if (this.t == 0) return -1;
    } else if (this.t == 1) return this[0];else if (this.t == 0) return 0; // assumes 16 < DB < 32


    return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
  } // (public) return value as byte


  function bnByteValue() {
    return this.t == 0 ? this.s : this[0] << 24 >> 24;
  } // (public) return value as short (assumes DB>=16)


  function bnShortValue() {
    return this.t == 0 ? this.s : this[0] << 16 >> 16;
  } // (protected) return x s.t. r^x < DV


  function bnpChunkSize(r) {
    return Math.floor(Math.LN2 * this.DB / Math.log(r));
  } // (public) 0 if this == 0, 1 if this > 0


  function bnSigNum() {
    if (this.s < 0) return -1;else if (this.t <= 0 || this.t == 1 && this[0] <= 0) return 0;else return 1;
  } // (protected) convert to radix string


  function bnpToRadix(b) {
    if (b == null) b = 10;
    if (this.signum() == 0 || b < 2 || b > 36) return "0";
    var cs = this.chunkSize(b);
    var a = Math.pow(b, cs);
    var d = nbv(a),
        y = nbi(),
        z = nbi(),
        r = "";
    this.divRemTo(d, y, z);

    while (y.signum() > 0) {
      r = (a + z.intValue()).toString(b).substr(1) + r;
      y.divRemTo(d, y, z);
    }

    return z.intValue().toString(b) + r;
  } // (protected) convert from radix string


  function bnpFromRadix(s, b) {
    this.fromInt(0);
    if (b == null) b = 10;
    var cs = this.chunkSize(b);
    var d = Math.pow(b, cs),
        mi = false,
        j = 0,
        w = 0;

    for (var i = 0; i < s.length; ++i) {
      var x = intAt(s, i);

      if (x < 0) {
        if (s.charAt(i) == "-" && this.signum() == 0) mi = true;
        continue;
      }

      w = b * w + x;

      if (++j >= cs) {
        this.dMultiply(d);
        this.dAddOffset(w, 0);
        j = 0;
        w = 0;
      }
    }

    if (j > 0) {
      this.dMultiply(Math.pow(b, j));
      this.dAddOffset(w, 0);
    }

    if (mi) BigInteger.ZERO.subTo(this, this);
  } // (protected) alternate constructor


  function bnpFromNumber(a, b, c) {
    if ("number" == typeof b) {
      // new BigInteger(int,int,RNG)
      if (a < 2) this.fromInt(1);else {
        this.fromNumber(a, c);
        if (!this.testBit(a - 1)) // force MSB set
          this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
        if (this.isEven()) this.dAddOffset(1, 0); // force odd

        while (!this.isProbablePrime(b)) {
          this.dAddOffset(2, 0);
          if (this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
        }
      }
    } else {
      // new BigInteger(int,RNG)
      var x = new Array(),
          t = a & 7;
      x.length = (a >> 3) + 1;
      b.nextBytes(x);
      if (t > 0) x[0] &= (1 << t) - 1;else x[0] = 0;
      this.fromString(x, 256);
    }
  } // (public) convert to bigendian byte array


  function bnToByteArray() {
    var i = this.t,
        r = new Array();
    r[0] = this.s;
    var p = this.DB - i * this.DB % 8,
        d,
        k = 0;

    if (i-- > 0) {
      if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p) r[k++] = d | this.s << this.DB - p;

      while (i >= 0) {
        if (p < 8) {
          d = (this[i] & (1 << p) - 1) << 8 - p;
          d |= this[--i] >> (p += this.DB - 8);
        } else {
          d = this[i] >> (p -= 8) & 0xff;

          if (p <= 0) {
            p += this.DB;
            --i;
          }
        }

        if ((d & 0x80) != 0) d |= -256;
        if (k == 0 && (this.s & 0x80) != (d & 0x80)) ++k;
        if (k > 0 || d != this.s) r[k++] = d;
      }
    }

    return r;
  }

  function bnEquals(a) {
    return this.compareTo(a) == 0;
  }

  function bnMin(a) {
    return this.compareTo(a) < 0 ? this : a;
  }

  function bnMax(a) {
    return this.compareTo(a) > 0 ? this : a;
  } // (protected) r = this op a (bitwise)


  function bnpBitwiseTo(a, op, r) {
    var i,
        f,
        m = Math.min(a.t, this.t);

    for (i = 0; i < m; ++i) r[i] = op(this[i], a[i]);

    if (a.t < this.t) {
      f = a.s & this.DM;

      for (i = m; i < this.t; ++i) r[i] = op(this[i], f);

      r.t = this.t;
    } else {
      f = this.s & this.DM;

      for (i = m; i < a.t; ++i) r[i] = op(f, a[i]);

      r.t = a.t;
    }

    r.s = op(this.s, a.s);
    r.clamp();
  } // (public) this & a


  function op_and(x, y) {
    return x & y;
  }

  function bnAnd(a) {
    var r = nbi();
    this.bitwiseTo(a, op_and, r);
    return r;
  } // (public) this | a


  function op_or(x, y) {
    return x | y;
  }

  function bnOr(a) {
    var r = nbi();
    this.bitwiseTo(a, op_or, r);
    return r;
  } // (public) this ^ a


  function op_xor(x, y) {
    return x ^ y;
  }

  function bnXor(a) {
    var r = nbi();
    this.bitwiseTo(a, op_xor, r);
    return r;
  } // (public) this & ~a


  function op_andnot(x, y) {
    return x & ~y;
  }

  function bnAndNot(a) {
    var r = nbi();
    this.bitwiseTo(a, op_andnot, r);
    return r;
  } // (public) ~this


  function bnNot() {
    var r = nbi();

    for (var i = 0; i < this.t; ++i) r[i] = this.DM & ~this[i];

    r.t = this.t;
    r.s = ~this.s;
    return r;
  } // (public) this << n


  function bnShiftLeft(n) {
    var r = nbi();
    if (n < 0) this.rShiftTo(-n, r);else this.lShiftTo(n, r);
    return r;
  } // (public) this >> n


  function bnShiftRight(n) {
    var r = nbi();
    if (n < 0) this.lShiftTo(-n, r);else this.rShiftTo(n, r);
    return r;
  } // return index of lowest 1-bit in x, x < 2^31


  function lbit(x) {
    if (x == 0) return -1;
    var r = 0;

    if ((x & 0xffff) == 0) {
      x >>= 16;
      r += 16;
    }

    if ((x & 0xff) == 0) {
      x >>= 8;
      r += 8;
    }

    if ((x & 0xf) == 0) {
      x >>= 4;
      r += 4;
    }

    if ((x & 3) == 0) {
      x >>= 2;
      r += 2;
    }

    if ((x & 1) == 0) ++r;
    return r;
  } // (public) returns index of lowest 1-bit (or -1 if none)


  function bnGetLowestSetBit() {
    for (var i = 0; i < this.t; ++i) if (this[i] != 0) return i * this.DB + lbit(this[i]);

    if (this.s < 0) return this.t * this.DB;
    return -1;
  } // return number of 1 bits in x


  function cbit(x) {
    var r = 0;

    while (x != 0) {
      x &= x - 1;
      ++r;
    }

    return r;
  } // (public) return number of set bits


  function bnBitCount() {
    var r = 0,
        x = this.s & this.DM;

    for (var i = 0; i < this.t; ++i) r += cbit(this[i] ^ x);

    return r;
  } // (public) true iff nth bit is set


  function bnTestBit(n) {
    var j = Math.floor(n / this.DB);
    if (j >= this.t) return this.s != 0;
    return (this[j] & 1 << n % this.DB) != 0;
  } // (protected) this op (1<<n)


  function bnpChangeBit(n, op) {
    var r = BigInteger.ONE.shiftLeft(n);
    this.bitwiseTo(r, op, r);
    return r;
  } // (public) this | (1<<n)


  function bnSetBit(n) {
    return this.changeBit(n, op_or);
  } // (public) this & ~(1<<n)


  function bnClearBit(n) {
    return this.changeBit(n, op_andnot);
  } // (public) this ^ (1<<n)


  function bnFlipBit(n) {
    return this.changeBit(n, op_xor);
  } // (protected) r = this + a


  function bnpAddTo(a, r) {
    var i = 0,
        c = 0,
        m = Math.min(a.t, this.t);

    while (i < m) {
      c += this[i] + a[i];
      r[i++] = c & this.DM;
      c >>= this.DB;
    }

    if (a.t < this.t) {
      c += a.s;

      while (i < this.t) {
        c += this[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }

      c += this.s;
    } else {
      c += this.s;

      while (i < a.t) {
        c += a[i];
        r[i++] = c & this.DM;
        c >>= this.DB;
      }

      c += a.s;
    }

    r.s = c < 0 ? -1 : 0;
    if (c > 0) r[i++] = c;else if (c < -1) r[i++] = this.DV + c;
    r.t = i;
    r.clamp();
  } // (public) this + a


  function bnAdd(a) {
    var r = nbi();
    this.addTo(a, r);
    return r;
  } // (public) this - a


  function bnSubtract(a) {
    var r = nbi();
    this.subTo(a, r);
    return r;
  } // (public) this * a


  function bnMultiply(a) {
    var r = nbi();
    this.multiplyTo(a, r);
    return r;
  } // (public) this / a


  function bnDivide(a) {
    var r = nbi();
    this.divRemTo(a, r, null);
    return r;
  } // (public) this % a


  function bnRemainder(a) {
    var r = nbi();
    this.divRemTo(a, null, r);
    return r;
  } // (public) [this/a,this%a]


  function bnDivideAndRemainder(a) {
    var q = nbi(),
        r = nbi();
    this.divRemTo(a, q, r);
    return new Array(q, r);
  } // (protected) this *= n, this >= 0, 1 < n < DV


  function bnpDMultiply(n) {
    this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
    ++this.t;
    this.clamp();
  } // (protected) this += n << w words, this >= 0


  function bnpDAddOffset(n, w) {
    while (this.t <= w) this[this.t++] = 0;

    this[w] += n;

    while (this[w] >= this.DV) {
      this[w] -= this.DV;
      if (++w >= this.t) this[this.t++] = 0;
      ++this[w];
    }
  } // A "null" reducer


  function NullExp() {}

  function nNop(x) {
    return x;
  }

  function nMulTo(x, y, r) {
    x.multiplyTo(y, r);
  }

  function nSqrTo(x, r) {
    x.squareTo(r);
  }

  NullExp.prototype.convert = nNop;
  NullExp.prototype.revert = nNop;
  NullExp.prototype.mulTo = nMulTo;
  NullExp.prototype.sqrTo = nSqrTo; // (public) this^e

  function bnPow(e) {
    return this.exp(e, new NullExp());
  } // (protected) r = lower n words of "this * a", a.t <= n
  // "this" should be the larger one if appropriate.


  function bnpMultiplyLowerTo(a, n, r) {
    var i = Math.min(this.t + a.t, n);
    r.s = 0; // assumes a,this >= 0

    r.t = i;

    while (i > 0) r[--i] = 0;

    var j;

    for (j = r.t - this.t; i < j; ++i) r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);

    for (j = Math.min(a.t, n); i < j; ++i) this.am(0, a[i], r, i, 0, n - i);

    r.clamp();
  } // (protected) r = "this * a" without lower n words, n > 0
  // "this" should be the larger one if appropriate.


  function bnpMultiplyUpperTo(a, n, r) {
    --n;
    var i = r.t = this.t + a.t - n;
    r.s = 0; // assumes a,this >= 0

    while (--i >= 0) r[i] = 0;

    for (i = Math.max(n - this.t, 0); i < a.t; ++i) r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);

    r.clamp();
    r.drShiftTo(1, r);
  } // Barrett modular reduction


  function Barrett(m) {
    // setup Barrett
    this.r2 = nbi();
    this.q3 = nbi();
    BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
    this.mu = this.r2.divide(m);
    this.m = m;
  }

  function barrettConvert(x) {
    if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m);else if (x.compareTo(this.m) < 0) return x;else {
      var r = nbi();
      x.copyTo(r);
      this.reduce(r);
      return r;
    }
  }

  function barrettRevert(x) {
    return x;
  } // x = x mod m (HAC 14.42)


  function barrettReduce(x) {
    x.drShiftTo(this.m.t - 1, this.r2);

    if (x.t > this.m.t + 1) {
      x.t = this.m.t + 1;
      x.clamp();
    }

    this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
    this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);

    while (x.compareTo(this.r2) < 0) x.dAddOffset(1, this.m.t + 1);

    x.subTo(this.r2, x);

    while (x.compareTo(this.m) >= 0) x.subTo(this.m, x);
  } // r = x^2 mod m; x != r


  function barrettSqrTo(x, r) {
    x.squareTo(r);
    this.reduce(r);
  } // r = x*y mod m; x,y != r


  function barrettMulTo(x, y, r) {
    x.multiplyTo(y, r);
    this.reduce(r);
  }

  Barrett.prototype.convert = barrettConvert;
  Barrett.prototype.revert = barrettRevert;
  Barrett.prototype.reduce = barrettReduce;
  Barrett.prototype.mulTo = barrettMulTo;
  Barrett.prototype.sqrTo = barrettSqrTo; // (public) this^e % m (HAC 14.85)

  function bnModPow(e, m) {
    var i = e.bitLength(),
        k,
        r = nbv(1),
        z;
    if (i <= 0) return r;else if (i < 18) k = 1;else if (i < 48) k = 3;else if (i < 144) k = 4;else if (i < 768) k = 5;else k = 6;
    if (i < 8) z = new Classic(m);else if (m.isEven()) z = new Barrett(m);else z = new Montgomery(m); // precomputation

    var g = new Array(),
        n = 3,
        k1 = k - 1,
        km = (1 << k) - 1;
    g[1] = z.convert(this);

    if (k > 1) {
      var g2 = nbi();
      z.sqrTo(g[1], g2);

      while (n <= km) {
        g[n] = nbi();
        z.mulTo(g2, g[n - 2], g[n]);
        n += 2;
      }
    }

    var j = e.t - 1,
        w,
        is1 = true,
        r2 = nbi(),
        t;
    i = nbits(e[j]) - 1;

    while (j >= 0) {
      if (i >= k1) w = e[j] >> i - k1 & km;else {
        w = (e[j] & (1 << i + 1) - 1) << k1 - i;
        if (j > 0) w |= e[j - 1] >> this.DB + i - k1;
      }
      n = k;

      while ((w & 1) == 0) {
        w >>= 1;
        --n;
      }

      if ((i -= n) < 0) {
        i += this.DB;
        --j;
      }

      if (is1) {
        // ret == 1, don't bother squaring or multiplying it
        g[w].copyTo(r);
        is1 = false;
      } else {
        while (n > 1) {
          z.sqrTo(r, r2);
          z.sqrTo(r2, r);
          n -= 2;
        }

        if (n > 0) z.sqrTo(r, r2);else {
          t = r;
          r = r2;
          r2 = t;
        }
        z.mulTo(r2, g[w], r);
      }

      while (j >= 0 && (e[j] & 1 << i) == 0) {
        z.sqrTo(r, r2);
        t = r;
        r = r2;
        r2 = t;

        if (--i < 0) {
          i = this.DB - 1;
          --j;
        }
      }
    }

    return z.revert(r);
  } // (public) gcd(this,a) (HAC 14.54)


  function bnGCD(a) {
    var x = this.s < 0 ? this.negate() : this.clone();
    var y = a.s < 0 ? a.negate() : a.clone();

    if (x.compareTo(y) < 0) {
      var t = x;
      x = y;
      y = t;
    }

    var i = x.getLowestSetBit(),
        g = y.getLowestSetBit();
    if (g < 0) return x;
    if (i < g) g = i;

    if (g > 0) {
      x.rShiftTo(g, x);
      y.rShiftTo(g, y);
    }

    while (x.signum() > 0) {
      if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x);
      if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y);

      if (x.compareTo(y) >= 0) {
        x.subTo(y, x);
        x.rShiftTo(1, x);
      } else {
        y.subTo(x, y);
        y.rShiftTo(1, y);
      }
    }

    if (g > 0) y.lShiftTo(g, y);
    return y;
  } // (protected) this % n, n < 2^26


  function bnpModInt(n) {
    if (n <= 0) return 0;
    var d = this.DV % n,
        r = this.s < 0 ? n - 1 : 0;
    if (this.t > 0) if (d == 0) r = this[0] % n;else for (var i = this.t - 1; i >= 0; --i) r = (d * r + this[i]) % n;
    return r;
  } // (public) 1/this % m (HAC 14.61)


  function bnModInverse(m) {
    var ac = m.isEven();
    if (this.isEven() && ac || m.signum() == 0) return BigInteger.ZERO;
    var u = m.clone(),
        v = this.clone();
    var a = nbv(1),
        b = nbv(0),
        c = nbv(0),
        d = nbv(1);

    while (u.signum() != 0) {
      while (u.isEven()) {
        u.rShiftTo(1, u);

        if (ac) {
          if (!a.isEven() || !b.isEven()) {
            a.addTo(this, a);
            b.subTo(m, b);
          }

          a.rShiftTo(1, a);
        } else if (!b.isEven()) b.subTo(m, b);

        b.rShiftTo(1, b);
      }

      while (v.isEven()) {
        v.rShiftTo(1, v);

        if (ac) {
          if (!c.isEven() || !d.isEven()) {
            c.addTo(this, c);
            d.subTo(m, d);
          }

          c.rShiftTo(1, c);
        } else if (!d.isEven()) d.subTo(m, d);

        d.rShiftTo(1, d);
      }

      if (u.compareTo(v) >= 0) {
        u.subTo(v, u);
        if (ac) a.subTo(c, a);
        b.subTo(d, b);
      } else {
        v.subTo(u, v);
        if (ac) c.subTo(a, c);
        d.subTo(b, d);
      }
    }

    if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
    if (d.compareTo(m) >= 0) return d.subtract(m);
    if (d.signum() < 0) d.addTo(m, d);else return d;
    if (d.signum() < 0) return d.add(m);else return d;
  }

  var lowprimes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509];
  var lplim = (1 << 26) / lowprimes[lowprimes.length - 1]; // (public) test primality with certainty >= 1-.5^t

  function bnIsProbablePrime(t) {
    var i,
        x = this.abs();

    if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
      for (i = 0; i < lowprimes.length; ++i) if (x[0] == lowprimes[i]) return true;

      return false;
    }

    if (x.isEven()) return false;
    i = 1;

    while (i < lowprimes.length) {
      var m = lowprimes[i],
          j = i + 1;

      while (j < lowprimes.length && m < lplim) m *= lowprimes[j++];

      m = x.modInt(m);

      while (i < j) if (m % lowprimes[i++] == 0) return false;
    }

    return x.millerRabin(t);
  } // (protected) true if probably prime (HAC 4.24, Miller-Rabin)


  function bnpMillerRabin(t) {
    var n1 = this.subtract(BigInteger.ONE);
    var k = n1.getLowestSetBit();
    if (k <= 0) return false;
    var r = n1.shiftRight(k);
    t = t + 1 >> 1;
    if (t > lowprimes.length) t = lowprimes.length;
    var a = nbi();

    for (var i = 0; i < t; ++i) {
      a.fromInt(lowprimes[i]);
      var y = a.modPow(r, this);

      if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
        var j = 1;

        while (j++ < k && y.compareTo(n1) != 0) {
          y = y.modPowInt(2, this);
          if (y.compareTo(BigInteger.ONE) == 0) return false;
        }

        if (y.compareTo(n1) != 0) return false;
      }
    }

    return true;
  } // protected


  BigInteger.prototype.chunkSize = bnpChunkSize;
  BigInteger.prototype.toRadix = bnpToRadix;
  BigInteger.prototype.fromRadix = bnpFromRadix;
  BigInteger.prototype.fromNumber = bnpFromNumber;
  BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
  BigInteger.prototype.changeBit = bnpChangeBit;
  BigInteger.prototype.addTo = bnpAddTo;
  BigInteger.prototype.dMultiply = bnpDMultiply;
  BigInteger.prototype.dAddOffset = bnpDAddOffset;
  BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
  BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
  BigInteger.prototype.modInt = bnpModInt;
  BigInteger.prototype.millerRabin = bnpMillerRabin; // public

  BigInteger.prototype.clone = bnClone;
  BigInteger.prototype.intValue = bnIntValue;
  BigInteger.prototype.byteValue = bnByteValue;
  BigInteger.prototype.shortValue = bnShortValue;
  BigInteger.prototype.signum = bnSigNum;
  BigInteger.prototype.toByteArray = bnToByteArray;
  BigInteger.prototype.equals = bnEquals;
  BigInteger.prototype.min = bnMin;
  BigInteger.prototype.max = bnMax;
  BigInteger.prototype.and = bnAnd;
  BigInteger.prototype.or = bnOr;
  BigInteger.prototype.xor = bnXor;
  BigInteger.prototype.andNot = bnAndNot;
  BigInteger.prototype.not = bnNot;
  BigInteger.prototype.shiftLeft = bnShiftLeft;
  BigInteger.prototype.shiftRight = bnShiftRight;
  BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
  BigInteger.prototype.bitCount = bnBitCount;
  BigInteger.prototype.testBit = bnTestBit;
  BigInteger.prototype.setBit = bnSetBit;
  BigInteger.prototype.clearBit = bnClearBit;
  BigInteger.prototype.flipBit = bnFlipBit;
  BigInteger.prototype.add = bnAdd;
  BigInteger.prototype.subtract = bnSubtract;
  BigInteger.prototype.multiply = bnMultiply;
  BigInteger.prototype.divide = bnDivide;
  BigInteger.prototype.remainder = bnRemainder;
  BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
  BigInteger.prototype.modPow = bnModPow;
  BigInteger.prototype.modInverse = bnModInverse;
  BigInteger.prototype.pow = bnPow;
  BigInteger.prototype.gcd = bnGCD;
  BigInteger.prototype.isProbablePrime = bnIsProbablePrime; // BigInteger interfaces not implemented in jsbn:
  // BigInteger(int signum, byte[] magnitude)
  // double doubleValue()
  // float floatValue()
  // int hashCode()
  // long longValue()
  // static BigInteger valueOf(long val)
  /// METEOR WRAPPER

  return BigInteger;
}();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"srp.js":function module(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/srp/srp.js                                                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let _objectSpread;

module.link("@babel/runtime/helpers/objectSpread2", {
  default(v) {
    _objectSpread = v;
  }

}, 0);
// This package contains just enough of the original SRP code to
// support the backwards-compatibility upgrade path.
//
// An SRP (and possibly also accounts-srp) package should eventually be
// available in Atmosphere so that users can continue to use SRP if they
// want to.
SRP = {};
/**
 * Generate a new SRP verifier. Password is the plaintext password.
 *
 * options is optional and can include:
 * - identity: String. The SRP username to user. Mostly this is passed
 *   in for testing.  Random UUID if not provided.
 * - hashedIdentityAndPassword: combined identity and password, already hashed, for the SRP to bcrypt upgrade path.
 * - salt: String. A salt to use.  Mostly this is passed in for
 *   testing.  Random UUID if not provided.
 * - SRP parameters (see _defaults and paramsFromOptions below)
 */

SRP.generateVerifier = function (password, options) {
  var params = paramsFromOptions(options);
  var salt = options && options.salt || Random.secret();
  var identity;
  var hashedIdentityAndPassword = options && options.hashedIdentityAndPassword;

  if (!hashedIdentityAndPassword) {
    identity = options && options.identity || Random.secret();
    hashedIdentityAndPassword = params.hash(identity + ":" + password);
  }

  var x = params.hash(salt + hashedIdentityAndPassword);
  var xi = new BigInteger(x, 16);
  var v = params.g.modPow(xi, params.N);
  return {
    identity: identity,
    salt: salt,
    verifier: v.toString(16)
  };
}; // For use with check().


SRP.matchVerifier = {
  identity: String,
  salt: String,
  verifier: String
};
/**
 * Default parameter values for SRP.
 *
 */

var _defaults = {
  hash: function (x) {
    return SHA256(x).toLowerCase();
  },
  N: new BigInteger("EEAF0AB9ADB38DD69C33F80AFA8FC5E86072618775FF3C0B9EA2314C9C256576D674DF7496EA81D3383B4813D692C6E0E0D5D8E250B98BE48E495C1D6089DAD15DC7D7B46154D6B6CE8EF4AD69B15D4982559B297BCF1885C529F566660E57EC68EDBC3C05726CC02FD4CBF4976EAA9AFD5138FE8376435B9FC61D2FC0EB06E3", 16),
  g: new BigInteger("2")
};
_defaults.k = new BigInteger(_defaults.hash(_defaults.N.toString(16) + _defaults.g.toString(16)), 16);
/**
 * Process an options hash to create SRP parameters.
 *
 * Options can include:
 * - hash: Function. Defaults to SHA256.
 * - N: String or BigInteger. Defaults to 1024 bit value from RFC 5054
 * - g: String or BigInteger. Defaults to 2.
 * - k: String or BigInteger. Defaults to hash(N, g)
 */

var paramsFromOptions = function (options) {
  if (!options) // fast path
    return _defaults;

  var ret = _objectSpread({}, _defaults);

  ['N', 'g', 'k'].forEach(function (p) {
    if (options[p]) {
      if (typeof options[p] === "string") ret[p] = new BigInteger(options[p], 16);else if (options[p] instanceof BigInteger) ret[p] = options[p];else throw new Error("Invalid parameter: " + p);
    }
  });
  if (options.hash) ret.hash = function (x) {
    return options.hash(x).toLowerCase();
  };

  if (!options.k && (options.N || options.g || options.hash)) {
    ret.k = ret.hash(ret.N.toString(16) + ret.g.toString(16));
  }

  return ret;
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

require("/node_modules/meteor/srp/biginteger.js");
require("/node_modules/meteor/srp/srp.js");

/* Exports */
Package._define("srp", {
  SRP: SRP
});

})();

//# sourceURL=meteor://💻app/packages/srp.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3JwL2JpZ2ludGVnZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3NycC9zcnAuanMiXSwibmFtZXMiOlsiQmlnSW50ZWdlciIsImRiaXRzIiwiY2FuYXJ5Iiwial9sbSIsImEiLCJiIiwiYyIsImZyb21OdW1iZXIiLCJmcm9tU3RyaW5nIiwibmJpIiwiYW0xIiwiaSIsIngiLCJ3IiwiaiIsIm4iLCJ2IiwiTWF0aCIsImZsb29yIiwiYW0yIiwieGwiLCJ4aCIsImwiLCJoIiwibSIsImFtMyIsInByb3RvdHlwZSIsImFtIiwiREIiLCJETSIsIkRWIiwiQklfRlAiLCJGViIsInBvdyIsIkYxIiwiRjIiLCJCSV9STSIsIkJJX1JDIiwiQXJyYXkiLCJyciIsInZ2IiwiY2hhckNvZGVBdCIsImludDJjaGFyIiwiY2hhckF0IiwiaW50QXQiLCJzIiwiYm5wQ29weVRvIiwiciIsInQiLCJibnBGcm9tSW50IiwibmJ2IiwiZnJvbUludCIsImJucEZyb21TdHJpbmciLCJrIiwiZnJvbVJhZGl4IiwibGVuZ3RoIiwibWkiLCJzaCIsImNsYW1wIiwiWkVSTyIsInN1YlRvIiwiYm5wQ2xhbXAiLCJiblRvU3RyaW5nIiwibmVnYXRlIiwidG9TdHJpbmciLCJ0b1JhZGl4Iiwia20iLCJkIiwicCIsImJuTmVnYXRlIiwiYm5BYnMiLCJibkNvbXBhcmVUbyIsIm5iaXRzIiwiYm5CaXRMZW5ndGgiLCJibnBETFNoaWZ0VG8iLCJibnBEUlNoaWZ0VG8iLCJtYXgiLCJibnBMU2hpZnRUbyIsImJzIiwiY2JzIiwiYm0iLCJkcyIsImJucFJTaGlmdFRvIiwiYm5wU3ViVG8iLCJtaW4iLCJibnBNdWx0aXBseVRvIiwiYWJzIiwieSIsImJucFNxdWFyZVRvIiwiYm5wRGl2UmVtVG8iLCJxIiwicG0iLCJwdCIsImNvcHlUbyIsInRzIiwibXMiLCJuc2giLCJsU2hpZnRUbyIsInlzIiwieTAiLCJ5dCIsImQxIiwiZDIiLCJlIiwiZGxTaGlmdFRvIiwiY29tcGFyZVRvIiwiT05FIiwicWQiLCJkclNoaWZ0VG8iLCJyU2hpZnRUbyIsImJuTW9kIiwiZGl2UmVtVG8iLCJDbGFzc2ljIiwiY0NvbnZlcnQiLCJtb2QiLCJjUmV2ZXJ0IiwiY1JlZHVjZSIsImNNdWxUbyIsIm11bHRpcGx5VG8iLCJyZWR1Y2UiLCJjU3FyVG8iLCJzcXVhcmVUbyIsImNvbnZlcnQiLCJyZXZlcnQiLCJtdWxUbyIsInNxclRvIiwiYm5wSW52RGlnaXQiLCJNb250Z29tZXJ5IiwibXAiLCJpbnZEaWdpdCIsIm1wbCIsIm1waCIsInVtIiwibXQyIiwibW9udENvbnZlcnQiLCJtb250UmV2ZXJ0IiwibW9udFJlZHVjZSIsInUwIiwibW9udFNxclRvIiwibW9udE11bFRvIiwiYm5wSXNFdmVuIiwiYm5wRXhwIiwieiIsInIyIiwiZyIsImJuTW9kUG93SW50IiwiaXNFdmVuIiwiZXhwIiwiYml0TGVuZ3RoIiwibW9kUG93SW50IiwiYm5DbG9uZSIsImJuSW50VmFsdWUiLCJibkJ5dGVWYWx1ZSIsImJuU2hvcnRWYWx1ZSIsImJucENodW5rU2l6ZSIsIkxOMiIsImxvZyIsImJuU2lnTnVtIiwiYm5wVG9SYWRpeCIsInNpZ251bSIsImNzIiwiY2h1bmtTaXplIiwiaW50VmFsdWUiLCJzdWJzdHIiLCJibnBGcm9tUmFkaXgiLCJkTXVsdGlwbHkiLCJkQWRkT2Zmc2V0IiwiYm5wRnJvbU51bWJlciIsInRlc3RCaXQiLCJiaXR3aXNlVG8iLCJzaGlmdExlZnQiLCJvcF9vciIsImlzUHJvYmFibGVQcmltZSIsIm5leHRCeXRlcyIsImJuVG9CeXRlQXJyYXkiLCJibkVxdWFscyIsImJuTWluIiwiYm5NYXgiLCJibnBCaXR3aXNlVG8iLCJvcCIsImYiLCJvcF9hbmQiLCJibkFuZCIsImJuT3IiLCJvcF94b3IiLCJiblhvciIsIm9wX2FuZG5vdCIsImJuQW5kTm90IiwiYm5Ob3QiLCJiblNoaWZ0TGVmdCIsImJuU2hpZnRSaWdodCIsImxiaXQiLCJibkdldExvd2VzdFNldEJpdCIsImNiaXQiLCJibkJpdENvdW50IiwiYm5UZXN0Qml0IiwiYm5wQ2hhbmdlQml0IiwiYm5TZXRCaXQiLCJjaGFuZ2VCaXQiLCJibkNsZWFyQml0IiwiYm5GbGlwQml0IiwiYm5wQWRkVG8iLCJibkFkZCIsImFkZFRvIiwiYm5TdWJ0cmFjdCIsImJuTXVsdGlwbHkiLCJibkRpdmlkZSIsImJuUmVtYWluZGVyIiwiYm5EaXZpZGVBbmRSZW1haW5kZXIiLCJibnBETXVsdGlwbHkiLCJibnBEQWRkT2Zmc2V0IiwiTnVsbEV4cCIsIm5Ob3AiLCJuTXVsVG8iLCJuU3FyVG8iLCJiblBvdyIsImJucE11bHRpcGx5TG93ZXJUbyIsImJucE11bHRpcGx5VXBwZXJUbyIsIkJhcnJldHQiLCJxMyIsIm11IiwiZGl2aWRlIiwiYmFycmV0dENvbnZlcnQiLCJiYXJyZXR0UmV2ZXJ0IiwiYmFycmV0dFJlZHVjZSIsIm11bHRpcGx5VXBwZXJUbyIsIm11bHRpcGx5TG93ZXJUbyIsImJhcnJldHRTcXJUbyIsImJhcnJldHRNdWxUbyIsImJuTW9kUG93IiwiazEiLCJnMiIsImlzMSIsImJuR0NEIiwiY2xvbmUiLCJnZXRMb3dlc3RTZXRCaXQiLCJibnBNb2RJbnQiLCJibk1vZEludmVyc2UiLCJhYyIsInUiLCJzdWJ0cmFjdCIsImFkZCIsImxvd3ByaW1lcyIsImxwbGltIiwiYm5Jc1Byb2JhYmxlUHJpbWUiLCJtb2RJbnQiLCJtaWxsZXJSYWJpbiIsImJucE1pbGxlclJhYmluIiwibjEiLCJzaGlmdFJpZ2h0IiwibW9kUG93IiwiYnl0ZVZhbHVlIiwic2hvcnRWYWx1ZSIsInRvQnl0ZUFycmF5IiwiZXF1YWxzIiwiYW5kIiwib3IiLCJ4b3IiLCJhbmROb3QiLCJub3QiLCJiaXRDb3VudCIsInNldEJpdCIsImNsZWFyQml0IiwiZmxpcEJpdCIsIm11bHRpcGx5IiwicmVtYWluZGVyIiwiZGl2aWRlQW5kUmVtYWluZGVyIiwibW9kSW52ZXJzZSIsImdjZCIsIl9vYmplY3RTcHJlYWQiLCJtb2R1bGUiLCJsaW5rIiwiZGVmYXVsdCIsIlNSUCIsImdlbmVyYXRlVmVyaWZpZXIiLCJwYXNzd29yZCIsIm9wdGlvbnMiLCJwYXJhbXMiLCJwYXJhbXNGcm9tT3B0aW9ucyIsInNhbHQiLCJSYW5kb20iLCJzZWNyZXQiLCJpZGVudGl0eSIsImhhc2hlZElkZW50aXR5QW5kUGFzc3dvcmQiLCJoYXNoIiwieGkiLCJOIiwidmVyaWZpZXIiLCJtYXRjaFZlcmlmaWVyIiwiU3RyaW5nIiwiX2RlZmF1bHRzIiwiU0hBMjU2IiwidG9Mb3dlckNhc2UiLCJyZXQiLCJmb3JFYWNoIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBQSxVQUFVLEdBQUksWUFBWTtBQUcxQjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK0JBO0FBRUE7QUFDQSxNQUFJQyxLQUFKLENBdkMwQixDQXlDMUI7O0FBQ0EsTUFBSUMsTUFBTSxHQUFHLGNBQWI7QUFDQSxNQUFJQyxJQUFJLEdBQUksQ0FBQ0QsTUFBTSxHQUFDLFFBQVIsS0FBbUIsUUFBL0IsQ0EzQzBCLENBNkMxQjs7QUFDQSxXQUFTRixVQUFULENBQW9CSSxDQUFwQixFQUFzQkMsQ0FBdEIsRUFBd0JDLENBQXhCLEVBQTJCO0FBQ3pCLFFBQUdGLENBQUMsSUFBSSxJQUFSLEVBQ0UsSUFBRyxZQUFZLE9BQU9BLENBQXRCLEVBQXlCLEtBQUtHLFVBQUwsQ0FBZ0JILENBQWhCLEVBQWtCQyxDQUFsQixFQUFvQkMsQ0FBcEIsRUFBekIsS0FDSyxJQUFHRCxDQUFDLElBQUksSUFBTCxJQUFhLFlBQVksT0FBT0QsQ0FBbkMsRUFBc0MsS0FBS0ksVUFBTCxDQUFnQkosQ0FBaEIsRUFBa0IsR0FBbEIsRUFBdEMsS0FDQSxLQUFLSSxVQUFMLENBQWdCSixDQUFoQixFQUFrQkMsQ0FBbEI7QUFDUixHQW5EeUIsQ0FxRDFCOzs7QUFDQSxXQUFTSSxHQUFULEdBQWU7QUFBRSxXQUFPLElBQUlULFVBQUosQ0FBZSxJQUFmLENBQVA7QUFBOEIsR0F0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RUFBaUMsRUFBakMsRUFBb0MsRUFBcEMsRUFBdUMsRUFBdkMsRUFBMEMsRUFBMUMsRUFBNkMsRUFBN0MsRUFBZ0QsRUFBaEQsRUFBbUQsRUFBbkQsRUFBc0QsRUFBdEQsRUFBeUQsRUFBekQsRUFBNEQsRUFBNUQsRUFBK0QsRUFBL0QsRUFBa0UsRUFBbEUsRUFBcUUsRUFBckUsRUFBd0UsR0FBeEUsRUFBNEUsR0FBNUUsRUFBZ0YsR0FBaEYsRUFBb0YsR0FBcEYsRUFBd0YsR0FBeEYsRUFBNEYsR0FBNUYsRUFBZ0csR0FBaEcsRUFBb0csR0FBcEcsRUFBd0csR0FBeEcsRUFBNEcsR0FBNUcsRUFBZ0gsR0FBaEgsRUFBb0gsR0FBcEgsRUFBd0gsR0FBeEgsRUFBNEgsR0FBNUgsRUFBZ0ksR0FBaEksRUFBb0ksR0FBcEksRUFBd0ksR0FBeEksRUFBNEksR0FBNUksRUFBZ0osR0FBaEosRUFBb0osR0FBcEosRUFBd0osR0FBeEosRUFBNEosR0FBNUosRUFBZ0ssR0FBaEssRUFBb0ssR0FBcEssRUFBd0ssR0FBeEssRUFBNEssR0FBNUssRUFBZ0wsR0FBaEwsRUFBb0wsR0FBcEwsRUFBd0wsR0FBeEwsRUFBNEwsR0FBNUwsRUFBZ00sR0FBaE0sRUFBb00sR0FBcE0sRUFBd00sR0FBeE0sRUFBNE0sR0FBNU0sRUFBZ04sR0FBaE4sRUFBb04sR0FBcE4sRUFBd04sR0FBeE4sRUFBNE4sR0FBNU4sRUFBZ08sR0FBaE8sRUFBb08sR0FBcE8sRUFBd08sR0FBeE8sRUFBNE8sR0FBNU8sRUFBZ1AsR0FBaFAsRUFBb1AsR0FBcFAsRUFBd1AsR0FBeFAsRUFBNFAsR0FBNVAsRUFBZ1EsR0FBaFEsRUFBb1EsR0FBcFEsRUFBd1EsR0FBeFEsRUFBNFEsR0FBNVEsRUFBZ1IsR0FBaFIsRUFBb1IsR0FBcFIsRUFBd1IsR0FBeFIsRUFBNFIsR0FBNVIsRUFBZ1MsR0FBaFMsRUFBb1MsR0FBcFMsRUFBd1MsR0FBeFMsRUFBNFMsR0FBNVMsRUFBZ1QsR0FBaFQsRUFBb1QsR0FBcFQsRUFBd1QsR0FBeFQsRUFBNFQsR0FBNVQs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LENBQUNQLENBQUosQ0FBTTlOLFFBQU4sQ0FBZSxFQUFmLElBQXFCcU8sR0FBRyxDQUFDckosQ0FBSixDQUFNaEYsUUFBTixDQUFlLEVBQWYsQ0FBOUIsQ0FBUjtBQUNEOztBQUVELFNBQU9xTyxHQUFQO0FBQ0QsQ0F6QkQsQyIsImZpbGUiOiIvcGFja2FnZXMvc3JwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIE1FVEVPUiBXUkFQUEVSXG5CaWdJbnRlZ2VyID0gKGZ1bmN0aW9uICgpIHtcblxuXG4vLy8gQkVHSU4ganNibi5qc1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDAzLTIwMDUgIFRvbSBXdVxuICogQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmdcbiAqIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuICogXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4gKiB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4gKiBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG9cbiAqIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0b1xuICogdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlXG4gKiBpbmNsdWRlZCBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUy1JU1wiIEFORCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBcbiAqIEVYUFJFU1MsIElNUExJRUQgT1IgT1RIRVJXSVNFLCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OLCBBTlkgXG4gKiBXQVJSQU5UWSBPRiBNRVJDSEFOVEFCSUxJVFkgT1IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBcbiAqXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUT00gV1UgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgSU5DSURFTlRBTCxcbiAqIElORElSRUNUIE9SIENPTlNFUVVFTlRJQUwgREFNQUdFUyBPRiBBTlkgS0lORCwgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUlxuICogUkVTVUxUSU5HIEZST00gTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBPUiBOT1QgQURWSVNFRCBPRlxuICogVEhFIFBPU1NJQklMSVRZIE9GIERBTUFHRSwgQU5EIE9OIEFOWSBUSEVPUlkgT0YgTElBQklMSVRZLCBBUklTSU5HIE9VVFxuICogT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBVU0UgT1IgUEVSRk9STUFOQ0UgT0YgVEhJUyBTT0ZUV0FSRS5cbiAqXG4gKiBJbiBhZGRpdGlvbiwgdGhlIGZvbGxvd2luZyBjb25kaXRpb24gYXBwbGllczpcbiAqXG4gKiBBbGwgcmVkaXN0cmlidXRpb25zIG11c3QgcmV0YWluIGFuIGludGFjdCBjb3B5IG9mIHRoaXMgY29weXJpZ2h0IG5vdGljZVxuICogYW5kIGRpc2NsYWltZXIuXG4gKi9cblxuLy8gQmFzaWMgSmF2YVNjcmlwdCBCTiBsaWJyYXJ5IC0gc3Vic2V0IHVzZWZ1bCBmb3IgUlNBIGVuY3J5cHRpb24uXG5cbi8vIEJpdHMgcGVyIGRpZ2l0XG52YXIgZGJpdHM7XG5cbi8vIEphdmFTY3JpcHQgZW5naW5lIGFuYWx5c2lzXG52YXIgY2FuYXJ5ID0gMHhkZWFkYmVlZmNhZmU7XG52YXIgal9sbSA9ICgoY2FuYXJ5JjB4ZmZmZmZmKT09MHhlZmNhZmUpO1xuXG4vLyAocHVibGljKSBDb25zdHJ1Y3RvclxuZnVuY3Rpb24gQmlnSW50ZWdlcihhLGIsYykge1xuICBpZihhICE9IG51bGwpXG4gICAgaWYoXCJudW1iZXJcIiA9PSB0eXBlb2YgYSkgdGhpcy5mcm9tTnVtYmVyKGEsYixjKTtcbiAgICBlbHNlIGlmKGIgPT0gbnVsbCAmJiBcInN0cmluZ1wiICE9IHR5cGVvZiBhKSB0aGlzLmZyb21TdHJpbmcoYSwyNTYpO1xuICAgIGVsc2UgdGhpcy5mcm9tU3RyaW5nKGEsYik7XG59XG5cbi8vIHJldHVybiBuZXcsIHVuc2V0IEJpZ0ludGVnZXJcbmZ1bmN0aW9uIG5iaSgpIHsgcmV0dXJuIG5ldyBCaWdJbnRlZ2VyKG51bGwpOyB9XG5cbi8vIGFtOiBDb21wdXRlIHdfaiArPSAoeCp0aGlzX2kpLCBwcm9wYWdhdGUgY2Fycmllcyxcbi8vIGMgaXMgaW5pdGlhbCBjYXJyeSwgcmV0dXJucyBmaW5hbCBjYXJyeS5cbi8vIGMgPCAzKmR2YWx1ZSwgeCA8IDIqZHZhbHVlLCB0aGlzX2kgPCBkdmFsdWVcbi8vIFdlIG5lZWQgdG8gc2VsZWN0IHRoZSBmYXN0ZXN0IG9uZSB0aGF0IHdvcmtzIGluIHRoaXMgZW52aXJvbm1lbnQuXG5cbi8vIGFtMTogdXNlIGEgc2luZ2xlIG11bHQgYW5kIGRpdmlkZSB0byBnZXQgdGhlIGhpZ2ggYml0cyxcbi8vIG1heCBkaWdpdCBiaXRzIHNob3VsZCBiZSAyNiBiZWNhdXNlXG4vLyBtYXggaW50ZXJuYWwgdmFsdWUgPSAyKmR2YWx1ZV4yLTIqZHZhbHVlICg8IDJeNTMpXG5mdW5jdGlvbiBhbTEoaSx4LHcsaixjLG4pIHtcbiAgd2hpbGUoLS1uID49IDApIHtcbiAgICB2YXIgdiA9IHgqdGhpc1tpKytdK3dbal0rYztcbiAgICBjID0gTWF0aC5mbG9vcih2LzB4NDAwMDAwMCk7XG4gICAgd1tqKytdID0gdiYweDNmZmZmZmY7XG4gIH1cbiAgcmV0dXJuIGM7XG59XG4vLyBhbTIgYXZvaWRzIGEgYmlnIG11bHQtYW5kLWV4dHJhY3QgY29tcGxldGVseS5cbi8vIE1heCBkaWdpdCBiaXRzIHNob3VsZCBiZSA8PSAzMCBiZWNhdXNlIHdlIGRvIGJpdHdpc2Ugb3BzXG4vLyBvbiB2YWx1ZXMgdXAgdG8gMipoZHZhbHVlXjItaGR2YWx1ZS0xICg8IDJeMzEpXG5mdW5jdGlvbiBhbTIoaSx4LHcsaixjLG4pIHtcbiAgdmFyIHhsID0geCYweDdmZmYsIHhoID0geD4+MTU7XG4gIHdoaWxlKC0tbiA+PSAwKSB7XG4gICAgdmFyIGwgPSB0aGlzW2ldJjB4N2ZmZjtcbiAgICB2YXIgaCA9IHRoaXNbaSsrXT4+MTU7XG4gICAgdmFyIG0gPSB4aCpsK2gqeGw7XG4gICAgbCA9IHhsKmwrKChtJjB4N2ZmZik8PDE1KSt3W2pdKyhjJjB4M2ZmZmZmZmYpO1xuICAgIGMgPSAobD4+PjMwKSsobT4+PjE1KSt4aCpoKyhjPj4+MzApO1xuICAgIHdbaisrXSA9IGwmMHgzZmZmZmZmZjtcbiAgfVxuICByZXR1cm4gYztcbn1cbi8vIEFsdGVybmF0ZWx5LCBzZXQgbWF4IGRpZ2l0IGJpdHMgdG8gMjggc2luY2Ugc29tZVxuLy8gYnJvd3NlcnMgc2xvdyBkb3duIHdoZW4gZGVhbGluZyB3aXRoIDMyLWJpdCBudW1iZXJzLlxuZnVuY3Rpb24gYW0zKGkseCx3LGosYyxuKSB7XG4gIHZhciB4bCA9IHgmMHgzZmZmLCB4aCA9IHg+PjE0O1xuICB3aGlsZSgtLW4gPj0gMCkge1xuICAgIHZhciBsID0gdGhpc1tpXSYweDNmZmY7XG4gICAgdmFyIGggPSB0aGlzW2krK10+PjE0O1xuICAgIHZhciBtID0geGgqbCtoKnhsO1xuICAgIGwgPSB4bCpsKygobSYweDNmZmYpPDwxNCkrd1tqXStjO1xuICAgIGMgPSAobD4+MjgpKyhtPj4xNCkreGgqaDtcbiAgICB3W2orK10gPSBsJjB4ZmZmZmZmZjtcbiAgfVxuICByZXR1cm4gYztcbn1cblxuLyogWFhYIE1FVEVPUiBYWFhcbmlmKGpfbG0gJiYgKG5hdmlnYXRvci5hcHBOYW1lID09IFwiTWljcm9zb2Z0IEludGVybmV0IEV4cGxvcmVyXCIpKSB7XG4gIEJpZ0ludGVnZXIucHJvdG90eXBlLmFtID0gYW0yO1xuICBkYml0cyA9IDMwO1xufVxuZWxzZSBpZihqX2xtICYmIChuYXZpZ2F0b3IuYXBwTmFtZSAhPSBcIk5ldHNjYXBlXCIpKSB7XG4gIEJpZ0ludGVnZXIucHJvdG90eXBlLmFtID0gYW0xO1xuICBkYml0cyA9IDI2O1xufVxuZWxzZSBcbiovXG5cbnsgLy8gTW96aWxsYS9OZXRzY2FwZSBzZWVtcyB0byBwcmVmZXIgYW0zXG4gIEJpZ0ludGVnZXIucHJvdG90eXBlLmFtID0gYW0zO1xuICBkYml0cyA9IDI4O1xufVxuXG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5EQiA9IGRiaXRzO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuRE0gPSAoKDE8PGRiaXRzKS0xKTtcbkJpZ0ludGVnZXIucHJvdG90eXBlLkRWID0gKDE8PGRiaXRzKTtcblxudmFyIEJJX0ZQID0gNTI7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5GViA9IE1hdGgucG93KDIsQklfRlApO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuRjEgPSBCSV9GUC1kYml0cztcbkJpZ0ludGVnZXIucHJvdG90eXBlLkYyID0gMipkYml0cy1CSV9GUDtcblxuLy8gRGlnaXQgY29udmVyc2lvbnNcbnZhciBCSV9STSA9IFwiMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCI7XG52YXIgQklfUkMgPSBuZXcgQXJyYXkoKTtcbnZhciBycix2djtcbnJyID0gXCIwXCIuY2hhckNvZGVBdCgwKTtcbmZvcih2diA9IDA7IHZ2IDw9IDk7ICsrdnYpIEJJX1JDW3JyKytdID0gdnY7XG5yciA9IFwiYVwiLmNoYXJDb2RlQXQoMCk7XG5mb3IodnYgPSAxMDsgdnYgPCAzNjsgKyt2dikgQklfUkNbcnIrK10gPSB2djtcbnJyID0gXCJBXCIuY2hhckNvZGVBdCgwKTtcbmZvcih2diA9IDEwOyB2diA8IDM2OyArK3Z2KSBCSV9SQ1tycisrXSA9IHZ2O1xuXG5mdW5jdGlvbiBpbnQyY2hhcihuKSB7IHJldHVybiBCSV9STS5jaGFyQXQobik7IH1cbmZ1bmN0aW9uIGludEF0KHMsaSkge1xuICB2YXIgYyA9IEJJX1JDW3MuY2hhckNvZGVBdChpKV07XG4gIHJldHVybiAoYz09bnVsbCk/LTE6Yztcbn1cblxuLy8gKHByb3RlY3RlZCkgY29weSB0aGlzIHRvIHJcbmZ1bmN0aW9uIGJucENvcHlUbyhyKSB7XG4gIGZvcih2YXIgaSA9IHRoaXMudC0xOyBpID49IDA7IC0taSkgcltpXSA9IHRoaXNbaV07XG4gIHIudCA9IHRoaXMudDtcbiAgci5zID0gdGhpcy5zO1xufVxuXG4vLyAocHJvdGVjdGVkKSBzZXQgZnJvbSBpbnRlZ2VyIHZhbHVlIHgsIC1EViA8PSB4IDwgRFZcbmZ1bmN0aW9uIGJucEZyb21JbnQoeCkge1xuICB0aGlzLnQgPSAxO1xuICB0aGlzLnMgPSAoeDwwKT8tMTowO1xuICBpZih4ID4gMCkgdGhpc1swXSA9IHg7XG4gIGVsc2UgaWYoeCA8IC0xKSB0aGlzWzBdID0geCtEVjtcbiAgZWxzZSB0aGlzLnQgPSAwO1xufVxuXG4vLyByZXR1cm4gYmlnaW50IGluaXRpYWxpemVkIHRvIHZhbHVlXG5mdW5jdGlvbiBuYnYoaSkgeyB2YXIgciA9IG5iaSgpOyByLmZyb21JbnQoaSk7IHJldHVybiByOyB9XG5cbi8vIChwcm90ZWN0ZWQpIHNldCBmcm9tIHN0cmluZyBhbmQgcmFkaXhcbmZ1bmN0aW9uIGJucEZyb21TdHJpbmcocyxiKSB7XG4gIHZhciBrO1xuICBpZihiID09IDE2KSBrID0gNDtcbiAgZWxzZSBpZihiID09IDgpIGsgPSAzO1xuICBlbHNlIGlmKGIgPT0gMjU2KSBrID0gODsgLy8gYnl0ZSBhcnJheVxuICBlbHNlIGlmKGIgPT0gMikgayA9IDE7XG4gIGVsc2UgaWYoYiA9PSAzMikgayA9IDU7XG4gIGVsc2UgaWYoYiA9PSA0KSBrID0gMjtcbiAgZWxzZSB7IHRoaXMuZnJvbVJhZGl4KHMsYik7IHJldHVybjsgfVxuICB0aGlzLnQgPSAwO1xuICB0aGlzLnMgPSAwO1xuICB2YXIgaSA9IHMubGVuZ3RoLCBtaSA9IGZhbHNlLCBzaCA9IDA7XG4gIHdoaWxlKC0taSA+PSAwKSB7XG4gICAgdmFyIHggPSAoaz09OCk/c1tpXSYweGZmOmludEF0KHMsaSk7XG4gICAgaWYoeCA8IDApIHtcbiAgICAgIGlmKHMuY2hhckF0KGkpID09IFwiLVwiKSBtaSA9IHRydWU7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgbWkgPSBmYWxzZTtcbiAgICBpZihzaCA9PSAwKVxuICAgICAgdGhpc1t0aGlzLnQrK10gPSB4O1xuICAgIGVsc2UgaWYoc2grayA+IHRoaXMuREIpIHtcbiAgICAgIHRoaXNbdGhpcy50LTFdIHw9ICh4JigoMTw8KHRoaXMuREItc2gpKS0xKSk8PHNoO1xuICAgICAgdGhpc1t0aGlzLnQrK10gPSAoeD4+KHRoaXMuREItc2gpKTtcbiAgICB9XG4gICAgZWxzZVxuICAgICAgdGhpc1t0aGlzLnQtMV0gfD0geDw8c2g7XG4gICAgc2ggKz0gaztcbiAgICBpZihzaCA+PSB0aGlzLkRCKSBzaCAtPSB0aGlzLkRCO1xuICB9XG4gIGlmKGsgPT0gOCAmJiAoc1swXSYweDgwKSAhPSAwKSB7XG4gICAgdGhpcy5zID0gLTE7XG4gICAgaWYoc2ggPiAwKSB0aGlzW3RoaXMudC0xXSB8PSAoKDE8PCh0aGlzLkRCLXNoKSktMSk8PHNoO1xuICB9XG4gIHRoaXMuY2xhbXAoKTtcbiAgaWYobWkpIEJpZ0ludGVnZXIuWkVSTy5zdWJUbyh0aGlzLHRoaXMpO1xufVxuXG4vLyAocHJvdGVjdGVkKSBjbGFtcCBvZmYgZXhjZXNzIGhpZ2ggd29yZHNcbmZ1bmN0aW9uIGJucENsYW1wKCkge1xuICB2YXIgYyA9IHRoaXMucyZ0aGlzLkRNO1xuICB3aGlsZSh0aGlzLnQgPiAwICYmIHRoaXNbdGhpcy50LTFdID09IGMpIC0tdGhpcy50O1xufVxuXG4vLyAocHVibGljKSByZXR1cm4gc3RyaW5nIHJlcHJlc2VudGF0aW9uIGluIGdpdmVuIHJhZGl4XG5mdW5jdGlvbiBiblRvU3RyaW5nKGIpIHtcbiAgaWYodGhpcy5zIDwgMCkgcmV0dXJuIFwiLVwiK3RoaXMubmVnYXRlKCkudG9TdHJpbmcoYik7XG4gIHZhciBrO1xuICBpZihiID09IDE2KSBrID0gNDtcbiAgZWxzZSBpZihiID09IDgpIGsgPSAzO1xuICBlbHNlIGlmKGIgPT0gMikgayA9IDE7XG4gIGVsc2UgaWYoYiA9PSAzMikgayA9IDU7XG4gIGVsc2UgaWYoYiA9PSA0KSBrID0gMjtcbiAgZWxzZSByZXR1cm4gdGhpcy50b1JhZGl4KGIpO1xuICB2YXIga20gPSAoMTw8ayktMSwgZCwgbSA9IGZhbHNlLCByID0gXCJcIiwgaSA9IHRoaXMudDtcbiAgdmFyIHAgPSB0aGlzLkRCLShpKnRoaXMuREIpJWs7XG4gIGlmKGktLSA+IDApIHtcbiAgICBpZihwIDwgdGhpcy5EQiAmJiAoZCA9IHRoaXNbaV0+PnApID4gMCkgeyBtID0gdHJ1ZTsgciA9IGludDJjaGFyKGQpOyB9XG4gICAgd2hpbGUoaSA+PSAwKSB7XG4gICAgICBpZihwIDwgaykge1xuICAgICAgICBkID0gKHRoaXNbaV0mKCgxPDxwKS0xKSk8PChrLXApO1xuICAgICAgICBkIHw9IHRoaXNbLS1pXT4+KHArPXRoaXMuREItayk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgZCA9ICh0aGlzW2ldPj4ocC09aykpJmttO1xuICAgICAgICBpZihwIDw9IDApIHsgcCArPSB0aGlzLkRCOyAtLWk7IH1cbiAgICAgIH1cbiAgICAgIGlmKGQgPiAwKSBtID0gdHJ1ZTtcbiAgICAgIGlmKG0pIHIgKz0gaW50MmNoYXIoZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBtP3I6XCIwXCI7XG59XG5cbi8vIChwdWJsaWMpIC10aGlzXG5mdW5jdGlvbiBibk5lZ2F0ZSgpIHsgdmFyIHIgPSBuYmkoKTsgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHRoaXMscik7IHJldHVybiByOyB9XG5cbi8vIChwdWJsaWMpIHx0aGlzfFxuZnVuY3Rpb24gYm5BYnMoKSB7IHJldHVybiAodGhpcy5zPDApP3RoaXMubmVnYXRlKCk6dGhpczsgfVxuXG4vLyAocHVibGljKSByZXR1cm4gKyBpZiB0aGlzID4gYSwgLSBpZiB0aGlzIDwgYSwgMCBpZiBlcXVhbFxuZnVuY3Rpb24gYm5Db21wYXJlVG8oYSkge1xuICB2YXIgciA9IHRoaXMucy1hLnM7XG4gIGlmKHIgIT0gMCkgcmV0dXJuIHI7XG4gIHZhciBpID0gdGhpcy50O1xuICByID0gaS1hLnQ7XG4gIGlmKHIgIT0gMCkgcmV0dXJuIHI7XG4gIHdoaWxlKC0taSA+PSAwKSBpZigocj10aGlzW2ldLWFbaV0pICE9IDApIHJldHVybiByO1xuICByZXR1cm4gMDtcbn1cblxuLy8gcmV0dXJucyBiaXQgbGVuZ3RoIG9mIHRoZSBpbnRlZ2VyIHhcbmZ1bmN0aW9uIG5iaXRzKHgpIHtcbiAgdmFyIHIgPSAxLCB0O1xuICBpZigodD14Pj4+MTYpICE9IDApIHsgeCA9IHQ7IHIgKz0gMTY7IH1cbiAgaWYoKHQ9eD4+OCkgIT0gMCkgeyB4ID0gdDsgciArPSA4OyB9XG4gIGlmKCh0PXg+PjQpICE9IDApIHsgeCA9IHQ7IHIgKz0gNDsgfVxuICBpZigodD14Pj4yKSAhPSAwKSB7IHggPSB0OyByICs9IDI7IH1cbiAgaWYoKHQ9eD4+MSkgIT0gMCkgeyB4ID0gdDsgciArPSAxOyB9XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSByZXR1cm4gdGhlIG51bWJlciBvZiBiaXRzIGluIFwidGhpc1wiXG5mdW5jdGlvbiBibkJpdExlbmd0aCgpIHtcbiAgaWYodGhpcy50IDw9IDApIHJldHVybiAwO1xuICByZXR1cm4gdGhpcy5EQioodGhpcy50LTEpK25iaXRzKHRoaXNbdGhpcy50LTFdXih0aGlzLnMmdGhpcy5ETSkpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyA8PCBuKkRCXG5mdW5jdGlvbiBibnBETFNoaWZ0VG8obixyKSB7XG4gIHZhciBpO1xuICBmb3IoaSA9IHRoaXMudC0xOyBpID49IDA7IC0taSkgcltpK25dID0gdGhpc1tpXTtcbiAgZm9yKGkgPSBuLTE7IGkgPj0gMDsgLS1pKSByW2ldID0gMDtcbiAgci50ID0gdGhpcy50K247XG4gIHIucyA9IHRoaXMucztcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgPj4gbipEQlxuZnVuY3Rpb24gYm5wRFJTaGlmdFRvKG4scikge1xuICBmb3IodmFyIGkgPSBuOyBpIDwgdGhpcy50OyArK2kpIHJbaS1uXSA9IHRoaXNbaV07XG4gIHIudCA9IE1hdGgubWF4KHRoaXMudC1uLDApO1xuICByLnMgPSB0aGlzLnM7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzIDw8IG5cbmZ1bmN0aW9uIGJucExTaGlmdFRvKG4scikge1xuICB2YXIgYnMgPSBuJXRoaXMuREI7XG4gIHZhciBjYnMgPSB0aGlzLkRCLWJzO1xuICB2YXIgYm0gPSAoMTw8Y2JzKS0xO1xuICB2YXIgZHMgPSBNYXRoLmZsb29yKG4vdGhpcy5EQiksIGMgPSAodGhpcy5zPDxicykmdGhpcy5ETSwgaTtcbiAgZm9yKGkgPSB0aGlzLnQtMTsgaSA+PSAwOyAtLWkpIHtcbiAgICByW2krZHMrMV0gPSAodGhpc1tpXT4+Y2JzKXxjO1xuICAgIGMgPSAodGhpc1tpXSZibSk8PGJzO1xuICB9XG4gIGZvcihpID0gZHMtMTsgaSA+PSAwOyAtLWkpIHJbaV0gPSAwO1xuICByW2RzXSA9IGM7XG4gIHIudCA9IHRoaXMudCtkcysxO1xuICByLnMgPSB0aGlzLnM7XG4gIHIuY2xhbXAoKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgPj4gblxuZnVuY3Rpb24gYm5wUlNoaWZ0VG8obixyKSB7XG4gIHIucyA9IHRoaXMucztcbiAgdmFyIGRzID0gTWF0aC5mbG9vcihuL3RoaXMuREIpO1xuICBpZihkcyA+PSB0aGlzLnQpIHsgci50ID0gMDsgcmV0dXJuOyB9XG4gIHZhciBicyA9IG4ldGhpcy5EQjtcbiAgdmFyIGNicyA9IHRoaXMuREItYnM7XG4gIHZhciBibSA9ICgxPDxicyktMTtcbiAgclswXSA9IHRoaXNbZHNdPj5icztcbiAgZm9yKHZhciBpID0gZHMrMTsgaSA8IHRoaXMudDsgKytpKSB7XG4gICAgcltpLWRzLTFdIHw9ICh0aGlzW2ldJmJtKTw8Y2JzO1xuICAgIHJbaS1kc10gPSB0aGlzW2ldPj5icztcbiAgfVxuICBpZihicyA+IDApIHJbdGhpcy50LWRzLTFdIHw9ICh0aGlzLnMmYm0pPDxjYnM7XG4gIHIudCA9IHRoaXMudC1kcztcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyAtIGFcbmZ1bmN0aW9uIGJucFN1YlRvKGEscikge1xuICB2YXIgaSA9IDAsIGMgPSAwLCBtID0gTWF0aC5taW4oYS50LHRoaXMudCk7XG4gIHdoaWxlKGkgPCBtKSB7XG4gICAgYyArPSB0aGlzW2ldLWFbaV07XG4gICAgcltpKytdID0gYyZ0aGlzLkRNO1xuICAgIGMgPj49IHRoaXMuREI7XG4gIH1cbiAgaWYoYS50IDwgdGhpcy50KSB7XG4gICAgYyAtPSBhLnM7XG4gICAgd2hpbGUoaSA8IHRoaXMudCkge1xuICAgICAgYyArPSB0aGlzW2ldO1xuICAgICAgcltpKytdID0gYyZ0aGlzLkRNO1xuICAgICAgYyA+Pj0gdGhpcy5EQjtcbiAgICB9XG4gICAgYyArPSB0aGlzLnM7XG4gIH1cbiAgZWxzZSB7XG4gICAgYyArPSB0aGlzLnM7XG4gICAgd2hpbGUoaSA8IGEudCkge1xuICAgICAgYyAtPSBhW2ldO1xuICAgICAgcltpKytdID0gYyZ0aGlzLkRNO1xuICAgICAgYyA+Pj0gdGhpcy5EQjtcbiAgICB9XG4gICAgYyAtPSBhLnM7XG4gIH1cbiAgci5zID0gKGM8MCk/LTE6MDtcbiAgaWYoYyA8IC0xKSByW2krK10gPSB0aGlzLkRWK2M7XG4gIGVsc2UgaWYoYyA+IDApIHJbaSsrXSA9IGM7XG4gIHIudCA9IGk7XG4gIHIuY2xhbXAoKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgKiBhLCByICE9IHRoaXMsYSAoSEFDIDE0LjEyKVxuLy8gXCJ0aGlzXCIgc2hvdWxkIGJlIHRoZSBsYXJnZXIgb25lIGlmIGFwcHJvcHJpYXRlLlxuZnVuY3Rpb24gYm5wTXVsdGlwbHlUbyhhLHIpIHtcbiAgdmFyIHggPSB0aGlzLmFicygpLCB5ID0gYS5hYnMoKTtcbiAgdmFyIGkgPSB4LnQ7XG4gIHIudCA9IGkreS50O1xuICB3aGlsZSgtLWkgPj0gMCkgcltpXSA9IDA7XG4gIGZvcihpID0gMDsgaSA8IHkudDsgKytpKSByW2kreC50XSA9IHguYW0oMCx5W2ldLHIsaSwwLHgudCk7XG4gIHIucyA9IDA7XG4gIHIuY2xhbXAoKTtcbiAgaWYodGhpcy5zICE9IGEucykgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHIscik7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzXjIsIHIgIT0gdGhpcyAoSEFDIDE0LjE2KVxuZnVuY3Rpb24gYm5wU3F1YXJlVG8ocikge1xuICB2YXIgeCA9IHRoaXMuYWJzKCk7XG4gIHZhciBpID0gci50ID0gMip4LnQ7XG4gIHdoaWxlKC0taSA+PSAwKSByW2ldID0gMDtcbiAgZm9yKGkgPSAwOyBpIDwgeC50LTE7ICsraSkge1xuICAgIHZhciBjID0geC5hbShpLHhbaV0sciwyKmksMCwxKTtcbiAgICBpZigocltpK3gudF0rPXguYW0oaSsxLDIqeFtpXSxyLDIqaSsxLGMseC50LWktMSkpID49IHguRFYpIHtcbiAgICAgIHJbaSt4LnRdIC09IHguRFY7XG4gICAgICByW2kreC50KzFdID0gMTtcbiAgICB9XG4gIH1cbiAgaWYoci50ID4gMCkgcltyLnQtMV0gKz0geC5hbShpLHhbaV0sciwyKmksMCwxKTtcbiAgci5zID0gMDtcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHJvdGVjdGVkKSBkaXZpZGUgdGhpcyBieSBtLCBxdW90aWVudCBhbmQgcmVtYWluZGVyIHRvIHEsIHIgKEhBQyAxNC4yMClcbi8vIHIgIT0gcSwgdGhpcyAhPSBtLiAgcSBvciByIG1heSBiZSBudWxsLlxuZnVuY3Rpb24gYm5wRGl2UmVtVG8obSxxLHIpIHtcbiAgdmFyIHBtID0gbS5hYnMoKTtcbiAgaWYocG0udCA8PSAwKSByZXR1cm47XG4gIHZhciBwdCA9IHRoaXMuYWJzKCk7XG4gIGlmKHB0LnQgPCBwbS50KSB7XG4gICAgaWYocSAhPSBudWxsKSBxLmZyb21JbnQoMCk7XG4gICAgaWYociAhPSBudWxsKSB0aGlzLmNvcHlUbyhyKTtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYociA9PSBudWxsKSByID0gbmJpKCk7XG4gIHZhciB5ID0gbmJpKCksIHRzID0gdGhpcy5zLCBtcyA9IG0ucztcbiAgdmFyIG5zaCA9IHRoaXMuREItbmJpdHMocG1bcG0udC0xXSk7XHQvLyBub3JtYWxpemUgbW9kdWx1c1xuICBpZihuc2ggPiAwKSB7IHBtLmxTaGlmdFRvKG5zaCx5KTsgcHQubFNoaWZ0VG8obnNoLHIpOyB9XG4gIGVsc2UgeyBwbS5jb3B5VG8oeSk7IHB0LmNvcHlUbyhyKTsgfVxuICB2YXIgeXMgPSB5LnQ7XG4gIHZhciB5MCA9IHlbeXMtMV07XG4gIGlmKHkwID09IDApIHJldHVybjtcbiAgdmFyIHl0ID0geTAqKDE8PHRoaXMuRjEpKygoeXM+MSk/eVt5cy0yXT4+dGhpcy5GMjowKTtcbiAgdmFyIGQxID0gdGhpcy5GVi95dCwgZDIgPSAoMTw8dGhpcy5GMSkveXQsIGUgPSAxPDx0aGlzLkYyO1xuICB2YXIgaSA9IHIudCwgaiA9IGkteXMsIHQgPSAocT09bnVsbCk/bmJpKCk6cTtcbiAgeS5kbFNoaWZ0VG8oaix0KTtcbiAgaWYoci5jb21wYXJlVG8odCkgPj0gMCkge1xuICAgIHJbci50KytdID0gMTtcbiAgICByLnN1YlRvKHQscik7XG4gIH1cbiAgQmlnSW50ZWdlci5PTkUuZGxTaGlmdFRvKHlzLHQpO1xuICB0LnN1YlRvKHkseSk7XHQvLyBcIm5lZ2F0aXZlXCIgeSBzbyB3ZSBjYW4gcmVwbGFjZSBzdWIgd2l0aCBhbSBsYXRlclxuICB3aGlsZSh5LnQgPCB5cykgeVt5LnQrK10gPSAwO1xuICB3aGlsZSgtLWogPj0gMCkge1xuICAgIC8vIEVzdGltYXRlIHF1b3RpZW50IGRpZ2l0XG4gICAgdmFyIHFkID0gKHJbLS1pXT09eTApP3RoaXMuRE06TWF0aC5mbG9vcihyW2ldKmQxKyhyW2ktMV0rZSkqZDIpO1xuICAgIGlmKChyW2ldKz15LmFtKDAscWQscixqLDAseXMpKSA8IHFkKSB7XHQvLyBUcnkgaXQgb3V0XG4gICAgICB5LmRsU2hpZnRUbyhqLHQpO1xuICAgICAgci5zdWJUbyh0LHIpO1xuICAgICAgd2hpbGUocltpXSA8IC0tcWQpIHIuc3ViVG8odCxyKTtcbiAgICB9XG4gIH1cbiAgaWYocSAhPSBudWxsKSB7XG4gICAgci5kclNoaWZ0VG8oeXMscSk7XG4gICAgaWYodHMgIT0gbXMpIEJpZ0ludGVnZXIuWkVSTy5zdWJUbyhxLHEpO1xuICB9XG4gIHIudCA9IHlzO1xuICByLmNsYW1wKCk7XG4gIGlmKG5zaCA+IDApIHIuclNoaWZ0VG8obnNoLHIpO1x0Ly8gRGVub3JtYWxpemUgcmVtYWluZGVyXG4gIGlmKHRzIDwgMCkgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHIscik7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgbW9kIGFcbmZ1bmN0aW9uIGJuTW9kKGEpIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgdGhpcy5hYnMoKS5kaXZSZW1UbyhhLG51bGwscik7XG4gIGlmKHRoaXMucyA8IDAgJiYgci5jb21wYXJlVG8oQmlnSW50ZWdlci5aRVJPKSA+IDApIGEuc3ViVG8ocixyKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIE1vZHVsYXIgcmVkdWN0aW9uIHVzaW5nIFwiY2xhc3NpY1wiIGFsZ29yaXRobVxuZnVuY3Rpb24gQ2xhc3NpYyhtKSB7IHRoaXMubSA9IG07IH1cbmZ1bmN0aW9uIGNDb252ZXJ0KHgpIHtcbiAgaWYoeC5zIDwgMCB8fCB4LmNvbXBhcmVUbyh0aGlzLm0pID49IDApIHJldHVybiB4Lm1vZCh0aGlzLm0pO1xuICBlbHNlIHJldHVybiB4O1xufVxuZnVuY3Rpb24gY1JldmVydCh4KSB7IHJldHVybiB4OyB9XG5mdW5jdGlvbiBjUmVkdWNlKHgpIHsgeC5kaXZSZW1Ubyh0aGlzLm0sbnVsbCx4KTsgfVxuZnVuY3Rpb24gY011bFRvKHgseSxyKSB7IHgubXVsdGlwbHlUbyh5LHIpOyB0aGlzLnJlZHVjZShyKTsgfVxuZnVuY3Rpb24gY1NxclRvKHgscikgeyB4LnNxdWFyZVRvKHIpOyB0aGlzLnJlZHVjZShyKTsgfVxuXG5DbGFzc2ljLnByb3RvdHlwZS5jb252ZXJ0ID0gY0NvbnZlcnQ7XG5DbGFzc2ljLnByb3RvdHlwZS5yZXZlcnQgPSBjUmV2ZXJ0O1xuQ2xhc3NpYy5wcm90b3R5cGUucmVkdWNlID0gY1JlZHVjZTtcbkNsYXNzaWMucHJvdG90eXBlLm11bFRvID0gY011bFRvO1xuQ2xhc3NpYy5wcm90b3R5cGUuc3FyVG8gPSBjU3FyVG87XG5cbi8vIChwcm90ZWN0ZWQpIHJldHVybiBcIi0xL3RoaXMgJSAyXkRCXCI7IHVzZWZ1bCBmb3IgTW9udC4gcmVkdWN0aW9uXG4vLyBqdXN0aWZpY2F0aW9uOlxuLy8gICAgICAgICB4eSA9PSAxIChtb2QgbSlcbi8vICAgICAgICAgeHkgPSAgMStrbVxuLy8gICB4eSgyLXh5KSA9ICgxK2ttKSgxLWttKVxuLy8geFt5KDIteHkpXSA9IDEta14ybV4yXG4vLyB4W3koMi14eSldID09IDEgKG1vZCBtXjIpXG4vLyBpZiB5IGlzIDEveCBtb2QgbSwgdGhlbiB5KDIteHkpIGlzIDEveCBtb2QgbV4yXG4vLyBzaG91bGQgcmVkdWNlIHggYW5kIHkoMi14eSkgYnkgbV4yIGF0IGVhY2ggc3RlcCB0byBrZWVwIHNpemUgYm91bmRlZC5cbi8vIEpTIG11bHRpcGx5IFwib3ZlcmZsb3dzXCIgZGlmZmVyZW50bHkgZnJvbSBDL0MrKywgc28gY2FyZSBpcyBuZWVkZWQgaGVyZS5cbmZ1bmN0aW9uIGJucEludkRpZ2l0KCkge1xuICBpZih0aGlzLnQgPCAxKSByZXR1cm4gMDtcbiAgdmFyIHggPSB0aGlzWzBdO1xuICBpZigoeCYxKSA9PSAwKSByZXR1cm4gMDtcbiAgdmFyIHkgPSB4JjM7XHRcdC8vIHkgPT0gMS94IG1vZCAyXjJcbiAgeSA9ICh5KigyLSh4JjB4ZikqeSkpJjB4ZjtcdC8vIHkgPT0gMS94IG1vZCAyXjRcbiAgeSA9ICh5KigyLSh4JjB4ZmYpKnkpKSYweGZmO1x0Ly8geSA9PSAxL3ggbW9kIDJeOFxuICB5ID0gKHkqKDItKCgoeCYweGZmZmYpKnkpJjB4ZmZmZikpKSYweGZmZmY7XHQvLyB5ID09IDEveCBtb2QgMl4xNlxuICAvLyBsYXN0IHN0ZXAgLSBjYWxjdWxhdGUgaW52ZXJzZSBtb2QgRFYgZGlyZWN0bHk7XG4gIC8vIGFzc3VtZXMgMTYgPCBEQiA8PSAzMiBhbmQgYXNzdW1lcyBhYmlsaXR5IHRvIGhhbmRsZSA0OC1iaXQgaW50c1xuICB5ID0gKHkqKDIteCp5JXRoaXMuRFYpKSV0aGlzLkRWO1x0XHQvLyB5ID09IDEveCBtb2QgMl5kYml0c1xuICAvLyB3ZSByZWFsbHkgd2FudCB0aGUgbmVnYXRpdmUgaW52ZXJzZSwgYW5kIC1EViA8IHkgPCBEVlxuICByZXR1cm4gKHk+MCk/dGhpcy5EVi15Oi15O1xufVxuXG4vLyBNb250Z29tZXJ5IHJlZHVjdGlvblxuZnVuY3Rpb24gTW9udGdvbWVyeShtKSB7XG4gIHRoaXMubSA9IG07XG4gIHRoaXMubXAgPSBtLmludkRpZ2l0KCk7XG4gIHRoaXMubXBsID0gdGhpcy5tcCYweDdmZmY7XG4gIHRoaXMubXBoID0gdGhpcy5tcD4+MTU7XG4gIHRoaXMudW0gPSAoMTw8KG0uREItMTUpKS0xO1xuICB0aGlzLm10MiA9IDIqbS50O1xufVxuXG4vLyB4UiBtb2QgbVxuZnVuY3Rpb24gbW9udENvbnZlcnQoeCkge1xuICB2YXIgciA9IG5iaSgpO1xuICB4LmFicygpLmRsU2hpZnRUbyh0aGlzLm0udCxyKTtcbiAgci5kaXZSZW1Ubyh0aGlzLm0sbnVsbCxyKTtcbiAgaWYoeC5zIDwgMCAmJiByLmNvbXBhcmVUbyhCaWdJbnRlZ2VyLlpFUk8pID4gMCkgdGhpcy5tLnN1YlRvKHIscik7XG4gIHJldHVybiByO1xufVxuXG4vLyB4L1IgbW9kIG1cbmZ1bmN0aW9uIG1vbnRSZXZlcnQoeCkge1xuICB2YXIgciA9IG5iaSgpO1xuICB4LmNvcHlUbyhyKTtcbiAgdGhpcy5yZWR1Y2Uocik7XG4gIHJldHVybiByO1xufVxuXG4vLyB4ID0geC9SIG1vZCBtIChIQUMgMTQuMzIpXG5mdW5jdGlvbiBtb250UmVkdWNlKHgpIHtcbiAgd2hpbGUoeC50IDw9IHRoaXMubXQyKVx0Ly8gcGFkIHggc28gYW0gaGFzIGVub3VnaCByb29tIGxhdGVyXG4gICAgeFt4LnQrK10gPSAwO1xuICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5tLnQ7ICsraSkge1xuICAgIC8vIGZhc3RlciB3YXkgb2YgY2FsY3VsYXRpbmcgdTAgPSB4W2ldKm1wIG1vZCBEVlxuICAgIHZhciBqID0geFtpXSYweDdmZmY7XG4gICAgdmFyIHUwID0gKGoqdGhpcy5tcGwrKCgoaip0aGlzLm1waCsoeFtpXT4+MTUpKnRoaXMubXBsKSZ0aGlzLnVtKTw8MTUpKSZ4LkRNO1xuICAgIC8vIHVzZSBhbSB0byBjb21iaW5lIHRoZSBtdWx0aXBseS1zaGlmdC1hZGQgaW50byBvbmUgY2FsbFxuICAgIGogPSBpK3RoaXMubS50O1xuICAgIHhbal0gKz0gdGhpcy5tLmFtKDAsdTAseCxpLDAsdGhpcy5tLnQpO1xuICAgIC8vIHByb3BhZ2F0ZSBjYXJyeVxuICAgIHdoaWxlKHhbal0gPj0geC5EVikgeyB4W2pdIC09IHguRFY7IHhbKytqXSsrOyB9XG4gIH1cbiAgeC5jbGFtcCgpO1xuICB4LmRyU2hpZnRUbyh0aGlzLm0udCx4KTtcbiAgaWYoeC5jb21wYXJlVG8odGhpcy5tKSA+PSAwKSB4LnN1YlRvKHRoaXMubSx4KTtcbn1cblxuLy8gciA9IFwieF4yL1IgbW9kIG1cIjsgeCAhPSByXG5mdW5jdGlvbiBtb250U3FyVG8oeCxyKSB7IHguc3F1YXJlVG8ocik7IHRoaXMucmVkdWNlKHIpOyB9XG5cbi8vIHIgPSBcInh5L1IgbW9kIG1cIjsgeCx5ICE9IHJcbmZ1bmN0aW9uIG1vbnRNdWxUbyh4LHkscikgeyB4Lm11bHRpcGx5VG8oeSxyKTsgdGhpcy5yZWR1Y2Uocik7IH1cblxuTW9udGdvbWVyeS5wcm90b3R5cGUuY29udmVydCA9IG1vbnRDb252ZXJ0O1xuTW9udGdvbWVyeS5wcm90b3R5cGUucmV2ZXJ0ID0gbW9udFJldmVydDtcbk1vbnRnb21lcnkucHJvdG90eXBlLnJlZHVjZSA9IG1vbnRSZWR1Y2U7XG5Nb250Z29tZXJ5LnByb3RvdHlwZS5tdWxUbyA9IG1vbnRNdWxUbztcbk1vbnRnb21lcnkucHJvdG90eXBlLnNxclRvID0gbW9udFNxclRvO1xuXG4vLyAocHJvdGVjdGVkKSB0cnVlIGlmZiB0aGlzIGlzIGV2ZW5cbmZ1bmN0aW9uIGJucElzRXZlbigpIHsgcmV0dXJuICgodGhpcy50PjApPyh0aGlzWzBdJjEpOnRoaXMucykgPT0gMDsgfVxuXG4vLyAocHJvdGVjdGVkKSB0aGlzXmUsIGUgPCAyXjMyLCBkb2luZyBzcXIgYW5kIG11bCB3aXRoIFwiclwiIChIQUMgMTQuNzkpXG5mdW5jdGlvbiBibnBFeHAoZSx6KSB7XG4gIGlmKGUgPiAweGZmZmZmZmZmIHx8IGUgPCAxKSByZXR1cm4gQmlnSW50ZWdlci5PTkU7XG4gIHZhciByID0gbmJpKCksIHIyID0gbmJpKCksIGcgPSB6LmNvbnZlcnQodGhpcyksIGkgPSBuYml0cyhlKS0xO1xuICBnLmNvcHlUbyhyKTtcbiAgd2hpbGUoLS1pID49IDApIHtcbiAgICB6LnNxclRvKHIscjIpO1xuICAgIGlmKChlJigxPDxpKSkgPiAwKSB6Lm11bFRvKHIyLGcscik7XG4gICAgZWxzZSB7IHZhciB0ID0gcjsgciA9IHIyOyByMiA9IHQ7IH1cbiAgfVxuICByZXR1cm4gei5yZXZlcnQocik7XG59XG5cbi8vIChwdWJsaWMpIHRoaXNeZSAlIG0sIDAgPD0gZSA8IDJeMzJcbmZ1bmN0aW9uIGJuTW9kUG93SW50KGUsbSkge1xuICB2YXIgejtcbiAgaWYoZSA8IDI1NiB8fCBtLmlzRXZlbigpKSB6ID0gbmV3IENsYXNzaWMobSk7IGVsc2UgeiA9IG5ldyBNb250Z29tZXJ5KG0pO1xuICByZXR1cm4gdGhpcy5leHAoZSx6KTtcbn1cblxuLy8gcHJvdGVjdGVkXG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5jb3B5VG8gPSBibnBDb3B5VG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5mcm9tSW50ID0gYm5wRnJvbUludDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmZyb21TdHJpbmcgPSBibnBGcm9tU3RyaW5nO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuY2xhbXAgPSBibnBDbGFtcDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmRsU2hpZnRUbyA9IGJucERMU2hpZnRUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmRyU2hpZnRUbyA9IGJucERSU2hpZnRUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmxTaGlmdFRvID0gYm5wTFNoaWZ0VG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5yU2hpZnRUbyA9IGJucFJTaGlmdFRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc3ViVG8gPSBibnBTdWJUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5VG8gPSBibnBNdWx0aXBseVRvO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc3F1YXJlVG8gPSBibnBTcXVhcmVUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmRpdlJlbVRvID0gYm5wRGl2UmVtVG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5pbnZEaWdpdCA9IGJucEludkRpZ2l0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuaXNFdmVuID0gYm5wSXNFdmVuO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZXhwID0gYm5wRXhwO1xuXG4vLyBwdWJsaWNcbkJpZ0ludGVnZXIucHJvdG90eXBlLnRvU3RyaW5nID0gYm5Ub1N0cmluZztcbkJpZ0ludGVnZXIucHJvdG90eXBlLm5lZ2F0ZSA9IGJuTmVnYXRlO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYWJzID0gYm5BYnM7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5jb21wYXJlVG8gPSBibkNvbXBhcmVUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmJpdExlbmd0aCA9IGJuQml0TGVuZ3RoO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubW9kID0gYm5Nb2Q7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RQb3dJbnQgPSBibk1vZFBvd0ludDtcblxuLy8gXCJjb25zdGFudHNcIlxuQmlnSW50ZWdlci5aRVJPID0gbmJ2KDApO1xuQmlnSW50ZWdlci5PTkUgPSBuYnYoMSk7XG5cblxuLy8vIEJFR0lOIGpzYm4yLmpzXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMDMtMjAwNSAgVG9tIFd1XG4gKiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZ1xuICogYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4gKiBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbiAqIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbiAqIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0b1xuICogcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvXG4gKiB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmVcbiAqIGluY2x1ZGVkIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTLUlTXCIgQU5EIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIFxuICogRVhQUkVTUywgSU1QTElFRCBPUiBPVEhFUldJU0UsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04sIEFOWSBcbiAqIFdBUlJBTlRZIE9GIE1FUkNIQU5UQUJJTElUWSBPUiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFxuICpcbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRPTSBXVSBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBJTkNJREVOVEFMLFxuICogSU5ESVJFQ1QgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9GIEFOWSBLSU5ELCBPUiBBTlkgREFNQUdFUyBXSEFUU09FVkVSXG4gKiBSRVNVTFRJTkcgRlJPTSBMT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIE9SIE5PVCBBRFZJU0VEIE9GXG4gKiBUSEUgUE9TU0lCSUxJVFkgT0YgREFNQUdFLCBBTkQgT04gQU5ZIFRIRU9SWSBPRiBMSUFCSUxJVFksIEFSSVNJTkcgT1VUXG4gKiBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUiBQRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxuICpcbiAqIEluIGFkZGl0aW9uLCB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbiBhcHBsaWVzOlxuICpcbiAqIEFsbCByZWRpc3RyaWJ1dGlvbnMgbXVzdCByZXRhaW4gYW4gaW50YWN0IGNvcHkgb2YgdGhpcyBjb3B5cmlnaHQgbm90aWNlXG4gKiBhbmQgZGlzY2xhaW1lci5cbiAqL1xuXG4vLyBFeHRlbmRlZCBKYXZhU2NyaXB0IEJOIGZ1bmN0aW9ucywgcmVxdWlyZWQgZm9yIFJTQSBwcml2YXRlIG9wcy5cblxuLy8gKHB1YmxpYylcbmZ1bmN0aW9uIGJuQ2xvbmUoKSB7IHZhciByID0gbmJpKCk7IHRoaXMuY29weVRvKHIpOyByZXR1cm4gcjsgfVxuXG4vLyAocHVibGljKSByZXR1cm4gdmFsdWUgYXMgaW50ZWdlclxuZnVuY3Rpb24gYm5JbnRWYWx1ZSgpIHtcbiAgaWYodGhpcy5zIDwgMCkge1xuICAgIGlmKHRoaXMudCA9PSAxKSByZXR1cm4gdGhpc1swXS10aGlzLkRWO1xuICAgIGVsc2UgaWYodGhpcy50ID09IDApIHJldHVybiAtMTtcbiAgfVxuICBlbHNlIGlmKHRoaXMudCA9PSAxKSByZXR1cm4gdGhpc1swXTtcbiAgZWxzZSBpZih0aGlzLnQgPT0gMCkgcmV0dXJuIDA7XG4gIC8vIGFzc3VtZXMgMTYgPCBEQiA8IDMyXG4gIHJldHVybiAoKHRoaXNbMV0mKCgxPDwoMzItdGhpcy5EQikpLTEpKTw8dGhpcy5EQil8dGhpc1swXTtcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJuIHZhbHVlIGFzIGJ5dGVcbmZ1bmN0aW9uIGJuQnl0ZVZhbHVlKCkgeyByZXR1cm4gKHRoaXMudD09MCk/dGhpcy5zOih0aGlzWzBdPDwyNCk+PjI0OyB9XG5cbi8vIChwdWJsaWMpIHJldHVybiB2YWx1ZSBhcyBzaG9ydCAoYXNzdW1lcyBEQj49MTYpXG5mdW5jdGlvbiBiblNob3J0VmFsdWUoKSB7IHJldHVybiAodGhpcy50PT0wKT90aGlzLnM6KHRoaXNbMF08PDE2KT4+MTY7IH1cblxuLy8gKHByb3RlY3RlZCkgcmV0dXJuIHggcy50LiByXnggPCBEVlxuZnVuY3Rpb24gYm5wQ2h1bmtTaXplKHIpIHsgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5MTjIqdGhpcy5EQi9NYXRoLmxvZyhyKSk7IH1cblxuLy8gKHB1YmxpYykgMCBpZiB0aGlzID09IDAsIDEgaWYgdGhpcyA+IDBcbmZ1bmN0aW9uIGJuU2lnTnVtKCkge1xuICBpZih0aGlzLnMgPCAwKSByZXR1cm4gLTE7XG4gIGVsc2UgaWYodGhpcy50IDw9IDAgfHwgKHRoaXMudCA9PSAxICYmIHRoaXNbMF0gPD0gMCkpIHJldHVybiAwO1xuICBlbHNlIHJldHVybiAxO1xufVxuXG4vLyAocHJvdGVjdGVkKSBjb252ZXJ0IHRvIHJhZGl4IHN0cmluZ1xuZnVuY3Rpb24gYm5wVG9SYWRpeChiKSB7XG4gIGlmKGIgPT0gbnVsbCkgYiA9IDEwO1xuICBpZih0aGlzLnNpZ251bSgpID09IDAgfHwgYiA8IDIgfHwgYiA+IDM2KSByZXR1cm4gXCIwXCI7XG4gIHZhciBjcyA9IHRoaXMuY2h1bmtTaXplKGIpO1xuICB2YXIgYSA9IE1hdGgucG93KGIsY3MpO1xuICB2YXIgZCA9IG5idihhKSwgeSA9IG5iaSgpLCB6ID0gbmJpKCksIHIgPSBcIlwiO1xuICB0aGlzLmRpdlJlbVRvKGQseSx6KTtcbiAgd2hpbGUoeS5zaWdudW0oKSA+IDApIHtcbiAgICByID0gKGErei5pbnRWYWx1ZSgpKS50b1N0cmluZyhiKS5zdWJzdHIoMSkgKyByO1xuICAgIHkuZGl2UmVtVG8oZCx5LHopO1xuICB9XG4gIHJldHVybiB6LmludFZhbHVlKCkudG9TdHJpbmcoYikgKyByO1xufVxuXG4vLyAocHJvdGVjdGVkKSBjb252ZXJ0IGZyb20gcmFkaXggc3RyaW5nXG5mdW5jdGlvbiBibnBGcm9tUmFkaXgocyxiKSB7XG4gIHRoaXMuZnJvbUludCgwKTtcbiAgaWYoYiA9PSBudWxsKSBiID0gMTA7XG4gIHZhciBjcyA9IHRoaXMuY2h1bmtTaXplKGIpO1xuICB2YXIgZCA9IE1hdGgucG93KGIsY3MpLCBtaSA9IGZhbHNlLCBqID0gMCwgdyA9IDA7XG4gIGZvcih2YXIgaSA9IDA7IGkgPCBzLmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHggPSBpbnRBdChzLGkpO1xuICAgIGlmKHggPCAwKSB7XG4gICAgICBpZihzLmNoYXJBdChpKSA9PSBcIi1cIiAmJiB0aGlzLnNpZ251bSgpID09IDApIG1pID0gdHJ1ZTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICB3ID0gYip3K3g7XG4gICAgaWYoKytqID49IGNzKSB7XG4gICAgICB0aGlzLmRNdWx0aXBseShkKTtcbiAgICAgIHRoaXMuZEFkZE9mZnNldCh3LDApO1xuICAgICAgaiA9IDA7XG4gICAgICB3ID0gMDtcbiAgICB9XG4gIH1cbiAgaWYoaiA+IDApIHtcbiAgICB0aGlzLmRNdWx0aXBseShNYXRoLnBvdyhiLGopKTtcbiAgICB0aGlzLmRBZGRPZmZzZXQodywwKTtcbiAgfVxuICBpZihtaSkgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHRoaXMsdGhpcyk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIGFsdGVybmF0ZSBjb25zdHJ1Y3RvclxuZnVuY3Rpb24gYm5wRnJvbU51bWJlcihhLGIsYykge1xuICBpZihcIm51bWJlclwiID09IHR5cGVvZiBiKSB7XG4gICAgLy8gbmV3IEJpZ0ludGVnZXIoaW50LGludCxSTkcpXG4gICAgaWYoYSA8IDIpIHRoaXMuZnJvbUludCgxKTtcbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuZnJvbU51bWJlcihhLGMpO1xuICAgICAgaWYoIXRoaXMudGVzdEJpdChhLTEpKVx0Ly8gZm9yY2UgTVNCIHNldFxuICAgICAgICB0aGlzLmJpdHdpc2VUbyhCaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQoYS0xKSxvcF9vcix0aGlzKTtcbiAgICAgIGlmKHRoaXMuaXNFdmVuKCkpIHRoaXMuZEFkZE9mZnNldCgxLDApOyAvLyBmb3JjZSBvZGRcbiAgICAgIHdoaWxlKCF0aGlzLmlzUHJvYmFibGVQcmltZShiKSkge1xuICAgICAgICB0aGlzLmRBZGRPZmZzZXQoMiwwKTtcbiAgICAgICAgaWYodGhpcy5iaXRMZW5ndGgoKSA+IGEpIHRoaXMuc3ViVG8oQmlnSW50ZWdlci5PTkUuc2hpZnRMZWZ0KGEtMSksdGhpcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGVsc2Uge1xuICAgIC8vIG5ldyBCaWdJbnRlZ2VyKGludCxSTkcpXG4gICAgdmFyIHggPSBuZXcgQXJyYXkoKSwgdCA9IGEmNztcbiAgICB4Lmxlbmd0aCA9IChhPj4zKSsxO1xuICAgIGIubmV4dEJ5dGVzKHgpO1xuICAgIGlmKHQgPiAwKSB4WzBdICY9ICgoMTw8dCktMSk7IGVsc2UgeFswXSA9IDA7XG4gICAgdGhpcy5mcm9tU3RyaW5nKHgsMjU2KTtcbiAgfVxufVxuXG4vLyAocHVibGljKSBjb252ZXJ0IHRvIGJpZ2VuZGlhbiBieXRlIGFycmF5XG5mdW5jdGlvbiBiblRvQnl0ZUFycmF5KCkge1xuICB2YXIgaSA9IHRoaXMudCwgciA9IG5ldyBBcnJheSgpO1xuICByWzBdID0gdGhpcy5zO1xuICB2YXIgcCA9IHRoaXMuREItKGkqdGhpcy5EQiklOCwgZCwgayA9IDA7XG4gIGlmKGktLSA+IDApIHtcbiAgICBpZihwIDwgdGhpcy5EQiAmJiAoZCA9IHRoaXNbaV0+PnApICE9ICh0aGlzLnMmdGhpcy5ETSk+PnApXG4gICAgICByW2srK10gPSBkfCh0aGlzLnM8PCh0aGlzLkRCLXApKTtcbiAgICB3aGlsZShpID49IDApIHtcbiAgICAgIGlmKHAgPCA4KSB7XG4gICAgICAgIGQgPSAodGhpc1tpXSYoKDE8PHApLTEpKTw8KDgtcCk7XG4gICAgICAgIGQgfD0gdGhpc1stLWldPj4ocCs9dGhpcy5EQi04KTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBkID0gKHRoaXNbaV0+PihwLT04KSkmMHhmZjtcbiAgICAgICAgaWYocCA8PSAwKSB7IHAgKz0gdGhpcy5EQjsgLS1pOyB9XG4gICAgICB9XG4gICAgICBpZigoZCYweDgwKSAhPSAwKSBkIHw9IC0yNTY7XG4gICAgICBpZihrID09IDAgJiYgKHRoaXMucyYweDgwKSAhPSAoZCYweDgwKSkgKytrO1xuICAgICAgaWYoayA+IDAgfHwgZCAhPSB0aGlzLnMpIHJbaysrXSA9IGQ7XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufVxuXG5mdW5jdGlvbiBibkVxdWFscyhhKSB7IHJldHVybih0aGlzLmNvbXBhcmVUbyhhKT09MCk7IH1cbmZ1bmN0aW9uIGJuTWluKGEpIHsgcmV0dXJuKHRoaXMuY29tcGFyZVRvKGEpPDApP3RoaXM6YTsgfVxuZnVuY3Rpb24gYm5NYXgoYSkgeyByZXR1cm4odGhpcy5jb21wYXJlVG8oYSk+MCk/dGhpczphOyB9XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzIG9wIGEgKGJpdHdpc2UpXG5mdW5jdGlvbiBibnBCaXR3aXNlVG8oYSxvcCxyKSB7XG4gIHZhciBpLCBmLCBtID0gTWF0aC5taW4oYS50LHRoaXMudCk7XG4gIGZvcihpID0gMDsgaSA8IG07ICsraSkgcltpXSA9IG9wKHRoaXNbaV0sYVtpXSk7XG4gIGlmKGEudCA8IHRoaXMudCkge1xuICAgIGYgPSBhLnMmdGhpcy5ETTtcbiAgICBmb3IoaSA9IG07IGkgPCB0aGlzLnQ7ICsraSkgcltpXSA9IG9wKHRoaXNbaV0sZik7XG4gICAgci50ID0gdGhpcy50O1xuICB9XG4gIGVsc2Uge1xuICAgIGYgPSB0aGlzLnMmdGhpcy5ETTtcbiAgICBmb3IoaSA9IG07IGkgPCBhLnQ7ICsraSkgcltpXSA9IG9wKGYsYVtpXSk7XG4gICAgci50ID0gYS50O1xuICB9XG4gIHIucyA9IG9wKHRoaXMucyxhLnMpO1xuICByLmNsYW1wKCk7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgJiBhXG5mdW5jdGlvbiBvcF9hbmQoeCx5KSB7IHJldHVybiB4Jnk7IH1cbmZ1bmN0aW9uIGJuQW5kKGEpIHsgdmFyIHIgPSBuYmkoKTsgdGhpcy5iaXR3aXNlVG8oYSxvcF9hbmQscik7IHJldHVybiByOyB9XG5cbi8vIChwdWJsaWMpIHRoaXMgfCBhXG5mdW5jdGlvbiBvcF9vcih4LHkpIHsgcmV0dXJuIHh8eTsgfVxuZnVuY3Rpb24gYm5PcihhKSB7IHZhciByID0gbmJpKCk7IHRoaXMuYml0d2lzZVRvKGEsb3Bfb3Iscik7IHJldHVybiByOyB9XG5cbi8vIChwdWJsaWMpIHRoaXMgXiBhXG5mdW5jdGlvbiBvcF94b3IoeCx5KSB7IHJldHVybiB4Xnk7IH1cbmZ1bmN0aW9uIGJuWG9yKGEpIHsgdmFyIHIgPSBuYmkoKTsgdGhpcy5iaXR3aXNlVG8oYSxvcF94b3Iscik7IHJldHVybiByOyB9XG5cbi8vIChwdWJsaWMpIHRoaXMgJiB+YVxuZnVuY3Rpb24gb3BfYW5kbm90KHgseSkgeyByZXR1cm4geCZ+eTsgfVxuZnVuY3Rpb24gYm5BbmROb3QoYSkgeyB2YXIgciA9IG5iaSgpOyB0aGlzLmJpdHdpc2VUbyhhLG9wX2FuZG5vdCxyKTsgcmV0dXJuIHI7IH1cblxuLy8gKHB1YmxpYykgfnRoaXNcbmZ1bmN0aW9uIGJuTm90KCkge1xuICB2YXIgciA9IG5iaSgpO1xuICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy50OyArK2kpIHJbaV0gPSB0aGlzLkRNJn50aGlzW2ldO1xuICByLnQgPSB0aGlzLnQ7XG4gIHIucyA9IH50aGlzLnM7XG4gIHJldHVybiByO1xufVxuXG4vLyAocHVibGljKSB0aGlzIDw8IG5cbmZ1bmN0aW9uIGJuU2hpZnRMZWZ0KG4pIHtcbiAgdmFyIHIgPSBuYmkoKTtcbiAgaWYobiA8IDApIHRoaXMuclNoaWZ0VG8oLW4scik7IGVsc2UgdGhpcy5sU2hpZnRUbyhuLHIpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdGhpcyA+PiBuXG5mdW5jdGlvbiBiblNoaWZ0UmlnaHQobikge1xuICB2YXIgciA9IG5iaSgpO1xuICBpZihuIDwgMCkgdGhpcy5sU2hpZnRUbygtbixyKTsgZWxzZSB0aGlzLnJTaGlmdFRvKG4scik7XG4gIHJldHVybiByO1xufVxuXG4vLyByZXR1cm4gaW5kZXggb2YgbG93ZXN0IDEtYml0IGluIHgsIHggPCAyXjMxXG5mdW5jdGlvbiBsYml0KHgpIHtcbiAgaWYoeCA9PSAwKSByZXR1cm4gLTE7XG4gIHZhciByID0gMDtcbiAgaWYoKHgmMHhmZmZmKSA9PSAwKSB7IHggPj49IDE2OyByICs9IDE2OyB9XG4gIGlmKCh4JjB4ZmYpID09IDApIHsgeCA+Pj0gODsgciArPSA4OyB9XG4gIGlmKCh4JjB4ZikgPT0gMCkgeyB4ID4+PSA0OyByICs9IDQ7IH1cbiAgaWYoKHgmMykgPT0gMCkgeyB4ID4+PSAyOyByICs9IDI7IH1cbiAgaWYoKHgmMSkgPT0gMCkgKytyO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJucyBpbmRleCBvZiBsb3dlc3QgMS1iaXQgKG9yIC0xIGlmIG5vbmUpXG5mdW5jdGlvbiBibkdldExvd2VzdFNldEJpdCgpIHtcbiAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMudDsgKytpKVxuICAgIGlmKHRoaXNbaV0gIT0gMCkgcmV0dXJuIGkqdGhpcy5EQitsYml0KHRoaXNbaV0pO1xuICBpZih0aGlzLnMgPCAwKSByZXR1cm4gdGhpcy50KnRoaXMuREI7XG4gIHJldHVybiAtMTtcbn1cblxuLy8gcmV0dXJuIG51bWJlciBvZiAxIGJpdHMgaW4geFxuZnVuY3Rpb24gY2JpdCh4KSB7XG4gIHZhciByID0gMDtcbiAgd2hpbGUoeCAhPSAwKSB7IHggJj0geC0xOyArK3I7IH1cbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHJldHVybiBudW1iZXIgb2Ygc2V0IGJpdHNcbmZ1bmN0aW9uIGJuQml0Q291bnQoKSB7XG4gIHZhciByID0gMCwgeCA9IHRoaXMucyZ0aGlzLkRNO1xuICBmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy50OyArK2kpIHIgKz0gY2JpdCh0aGlzW2ldXngpO1xuICByZXR1cm4gcjtcbn1cblxuLy8gKHB1YmxpYykgdHJ1ZSBpZmYgbnRoIGJpdCBpcyBzZXRcbmZ1bmN0aW9uIGJuVGVzdEJpdChuKSB7XG4gIHZhciBqID0gTWF0aC5mbG9vcihuL3RoaXMuREIpO1xuICBpZihqID49IHRoaXMudCkgcmV0dXJuKHRoaXMucyE9MCk7XG4gIHJldHVybigodGhpc1tqXSYoMTw8KG4ldGhpcy5EQikpKSE9MCk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHRoaXMgb3AgKDE8PG4pXG5mdW5jdGlvbiBibnBDaGFuZ2VCaXQobixvcCkge1xuICB2YXIgciA9IEJpZ0ludGVnZXIuT05FLnNoaWZ0TGVmdChuKTtcbiAgdGhpcy5iaXR3aXNlVG8ocixvcCxyKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIHRoaXMgfCAoMTw8bilcbmZ1bmN0aW9uIGJuU2V0Qml0KG4pIHsgcmV0dXJuIHRoaXMuY2hhbmdlQml0KG4sb3Bfb3IpOyB9XG5cbi8vIChwdWJsaWMpIHRoaXMgJiB+KDE8PG4pXG5mdW5jdGlvbiBibkNsZWFyQml0KG4pIHsgcmV0dXJuIHRoaXMuY2hhbmdlQml0KG4sb3BfYW5kbm90KTsgfVxuXG4vLyAocHVibGljKSB0aGlzIF4gKDE8PG4pXG5mdW5jdGlvbiBibkZsaXBCaXQobikgeyByZXR1cm4gdGhpcy5jaGFuZ2VCaXQobixvcF94b3IpOyB9XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzICsgYVxuZnVuY3Rpb24gYm5wQWRkVG8oYSxyKSB7XG4gIHZhciBpID0gMCwgYyA9IDAsIG0gPSBNYXRoLm1pbihhLnQsdGhpcy50KTtcbiAgd2hpbGUoaSA8IG0pIHtcbiAgICBjICs9IHRoaXNbaV0rYVtpXTtcbiAgICByW2krK10gPSBjJnRoaXMuRE07XG4gICAgYyA+Pj0gdGhpcy5EQjtcbiAgfVxuICBpZihhLnQgPCB0aGlzLnQpIHtcbiAgICBjICs9IGEucztcbiAgICB3aGlsZShpIDwgdGhpcy50KSB7XG4gICAgICBjICs9IHRoaXNbaV07XG4gICAgICByW2krK10gPSBjJnRoaXMuRE07XG4gICAgICBjID4+PSB0aGlzLkRCO1xuICAgIH1cbiAgICBjICs9IHRoaXMucztcbiAgfVxuICBlbHNlIHtcbiAgICBjICs9IHRoaXMucztcbiAgICB3aGlsZShpIDwgYS50KSB7XG4gICAgICBjICs9IGFbaV07XG4gICAgICByW2krK10gPSBjJnRoaXMuRE07XG4gICAgICBjID4+PSB0aGlzLkRCO1xuICAgIH1cbiAgICBjICs9IGEucztcbiAgfVxuICByLnMgPSAoYzwwKT8tMTowO1xuICBpZihjID4gMCkgcltpKytdID0gYztcbiAgZWxzZSBpZihjIDwgLTEpIHJbaSsrXSA9IHRoaXMuRFYrYztcbiAgci50ID0gaTtcbiAgci5jbGFtcCgpO1xufVxuXG4vLyAocHVibGljKSB0aGlzICsgYVxuZnVuY3Rpb24gYm5BZGQoYSkgeyB2YXIgciA9IG5iaSgpOyB0aGlzLmFkZFRvKGEscik7IHJldHVybiByOyB9XG5cbi8vIChwdWJsaWMpIHRoaXMgLSBhXG5mdW5jdGlvbiBiblN1YnRyYWN0KGEpIHsgdmFyIHIgPSBuYmkoKTsgdGhpcy5zdWJUbyhhLHIpOyByZXR1cm4gcjsgfVxuXG4vLyAocHVibGljKSB0aGlzICogYVxuZnVuY3Rpb24gYm5NdWx0aXBseShhKSB7IHZhciByID0gbmJpKCk7IHRoaXMubXVsdGlwbHlUbyhhLHIpOyByZXR1cm4gcjsgfVxuXG4vLyAocHVibGljKSB0aGlzIC8gYVxuZnVuY3Rpb24gYm5EaXZpZGUoYSkgeyB2YXIgciA9IG5iaSgpOyB0aGlzLmRpdlJlbVRvKGEscixudWxsKTsgcmV0dXJuIHI7IH1cblxuLy8gKHB1YmxpYykgdGhpcyAlIGFcbmZ1bmN0aW9uIGJuUmVtYWluZGVyKGEpIHsgdmFyIHIgPSBuYmkoKTsgdGhpcy5kaXZSZW1UbyhhLG51bGwscik7IHJldHVybiByOyB9XG5cbi8vIChwdWJsaWMpIFt0aGlzL2EsdGhpcyVhXVxuZnVuY3Rpb24gYm5EaXZpZGVBbmRSZW1haW5kZXIoYSkge1xuICB2YXIgcSA9IG5iaSgpLCByID0gbmJpKCk7XG4gIHRoaXMuZGl2UmVtVG8oYSxxLHIpO1xuICByZXR1cm4gbmV3IEFycmF5KHEscik7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHRoaXMgKj0gbiwgdGhpcyA+PSAwLCAxIDwgbiA8IERWXG5mdW5jdGlvbiBibnBETXVsdGlwbHkobikge1xuICB0aGlzW3RoaXMudF0gPSB0aGlzLmFtKDAsbi0xLHRoaXMsMCwwLHRoaXMudCk7XG4gICsrdGhpcy50O1xuICB0aGlzLmNsYW1wKCk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHRoaXMgKz0gbiA8PCB3IHdvcmRzLCB0aGlzID49IDBcbmZ1bmN0aW9uIGJucERBZGRPZmZzZXQobix3KSB7XG4gIHdoaWxlKHRoaXMudCA8PSB3KSB0aGlzW3RoaXMudCsrXSA9IDA7XG4gIHRoaXNbd10gKz0gbjtcbiAgd2hpbGUodGhpc1t3XSA+PSB0aGlzLkRWKSB7XG4gICAgdGhpc1t3XSAtPSB0aGlzLkRWO1xuICAgIGlmKCsrdyA+PSB0aGlzLnQpIHRoaXNbdGhpcy50KytdID0gMDtcbiAgICArK3RoaXNbd107XG4gIH1cbn1cblxuLy8gQSBcIm51bGxcIiByZWR1Y2VyXG5mdW5jdGlvbiBOdWxsRXhwKCkge31cbmZ1bmN0aW9uIG5Ob3AoeCkgeyByZXR1cm4geDsgfVxuZnVuY3Rpb24gbk11bFRvKHgseSxyKSB7IHgubXVsdGlwbHlUbyh5LHIpOyB9XG5mdW5jdGlvbiBuU3FyVG8oeCxyKSB7IHguc3F1YXJlVG8ocik7IH1cblxuTnVsbEV4cC5wcm90b3R5cGUuY29udmVydCA9IG5Ob3A7XG5OdWxsRXhwLnByb3RvdHlwZS5yZXZlcnQgPSBuTm9wO1xuTnVsbEV4cC5wcm90b3R5cGUubXVsVG8gPSBuTXVsVG87XG5OdWxsRXhwLnByb3RvdHlwZS5zcXJUbyA9IG5TcXJUbztcblxuLy8gKHB1YmxpYykgdGhpc15lXG5mdW5jdGlvbiBiblBvdyhlKSB7IHJldHVybiB0aGlzLmV4cChlLG5ldyBOdWxsRXhwKCkpOyB9XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSBsb3dlciBuIHdvcmRzIG9mIFwidGhpcyAqIGFcIiwgYS50IDw9IG5cbi8vIFwidGhpc1wiIHNob3VsZCBiZSB0aGUgbGFyZ2VyIG9uZSBpZiBhcHByb3ByaWF0ZS5cbmZ1bmN0aW9uIGJucE11bHRpcGx5TG93ZXJUbyhhLG4scikge1xuICB2YXIgaSA9IE1hdGgubWluKHRoaXMudCthLnQsbik7XG4gIHIucyA9IDA7IC8vIGFzc3VtZXMgYSx0aGlzID49IDBcbiAgci50ID0gaTtcbiAgd2hpbGUoaSA+IDApIHJbLS1pXSA9IDA7XG4gIHZhciBqO1xuICBmb3IoaiA9IHIudC10aGlzLnQ7IGkgPCBqOyArK2kpIHJbaSt0aGlzLnRdID0gdGhpcy5hbSgwLGFbaV0scixpLDAsdGhpcy50KTtcbiAgZm9yKGogPSBNYXRoLm1pbihhLnQsbik7IGkgPCBqOyArK2kpIHRoaXMuYW0oMCxhW2ldLHIsaSwwLG4taSk7XG4gIHIuY2xhbXAoKTtcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IFwidGhpcyAqIGFcIiB3aXRob3V0IGxvd2VyIG4gd29yZHMsIG4gPiAwXG4vLyBcInRoaXNcIiBzaG91bGQgYmUgdGhlIGxhcmdlciBvbmUgaWYgYXBwcm9wcmlhdGUuXG5mdW5jdGlvbiBibnBNdWx0aXBseVVwcGVyVG8oYSxuLHIpIHtcbiAgLS1uO1xuICB2YXIgaSA9IHIudCA9IHRoaXMudCthLnQtbjtcbiAgci5zID0gMDsgLy8gYXNzdW1lcyBhLHRoaXMgPj0gMFxuICB3aGlsZSgtLWkgPj0gMCkgcltpXSA9IDA7XG4gIGZvcihpID0gTWF0aC5tYXgobi10aGlzLnQsMCk7IGkgPCBhLnQ7ICsraSlcbiAgICByW3RoaXMudCtpLW5dID0gdGhpcy5hbShuLWksYVtpXSxyLDAsMCx0aGlzLnQraS1uKTtcbiAgci5jbGFtcCgpO1xuICByLmRyU2hpZnRUbygxLHIpO1xufVxuXG4vLyBCYXJyZXR0IG1vZHVsYXIgcmVkdWN0aW9uXG5mdW5jdGlvbiBCYXJyZXR0KG0pIHtcbiAgLy8gc2V0dXAgQmFycmV0dFxuICB0aGlzLnIyID0gbmJpKCk7XG4gIHRoaXMucTMgPSBuYmkoKTtcbiAgQmlnSW50ZWdlci5PTkUuZGxTaGlmdFRvKDIqbS50LHRoaXMucjIpO1xuICB0aGlzLm11ID0gdGhpcy5yMi5kaXZpZGUobSk7XG4gIHRoaXMubSA9IG07XG59XG5cbmZ1bmN0aW9uIGJhcnJldHRDb252ZXJ0KHgpIHtcbiAgaWYoeC5zIDwgMCB8fCB4LnQgPiAyKnRoaXMubS50KSByZXR1cm4geC5tb2QodGhpcy5tKTtcbiAgZWxzZSBpZih4LmNvbXBhcmVUbyh0aGlzLm0pIDwgMCkgcmV0dXJuIHg7XG4gIGVsc2UgeyB2YXIgciA9IG5iaSgpOyB4LmNvcHlUbyhyKTsgdGhpcy5yZWR1Y2Uocik7IHJldHVybiByOyB9XG59XG5cbmZ1bmN0aW9uIGJhcnJldHRSZXZlcnQoeCkgeyByZXR1cm4geDsgfVxuXG4vLyB4ID0geCBtb2QgbSAoSEFDIDE0LjQyKVxuZnVuY3Rpb24gYmFycmV0dFJlZHVjZSh4KSB7XG4gIHguZHJTaGlmdFRvKHRoaXMubS50LTEsdGhpcy5yMik7XG4gIGlmKHgudCA+IHRoaXMubS50KzEpIHsgeC50ID0gdGhpcy5tLnQrMTsgeC5jbGFtcCgpOyB9XG4gIHRoaXMubXUubXVsdGlwbHlVcHBlclRvKHRoaXMucjIsdGhpcy5tLnQrMSx0aGlzLnEzKTtcbiAgdGhpcy5tLm11bHRpcGx5TG93ZXJUbyh0aGlzLnEzLHRoaXMubS50KzEsdGhpcy5yMik7XG4gIHdoaWxlKHguY29tcGFyZVRvKHRoaXMucjIpIDwgMCkgeC5kQWRkT2Zmc2V0KDEsdGhpcy5tLnQrMSk7XG4gIHguc3ViVG8odGhpcy5yMix4KTtcbiAgd2hpbGUoeC5jb21wYXJlVG8odGhpcy5tKSA+PSAwKSB4LnN1YlRvKHRoaXMubSx4KTtcbn1cblxuLy8gciA9IHheMiBtb2QgbTsgeCAhPSByXG5mdW5jdGlvbiBiYXJyZXR0U3FyVG8oeCxyKSB7IHguc3F1YXJlVG8ocik7IHRoaXMucmVkdWNlKHIpOyB9XG5cbi8vIHIgPSB4KnkgbW9kIG07IHgseSAhPSByXG5mdW5jdGlvbiBiYXJyZXR0TXVsVG8oeCx5LHIpIHsgeC5tdWx0aXBseVRvKHkscik7IHRoaXMucmVkdWNlKHIpOyB9XG5cbkJhcnJldHQucHJvdG90eXBlLmNvbnZlcnQgPSBiYXJyZXR0Q29udmVydDtcbkJhcnJldHQucHJvdG90eXBlLnJldmVydCA9IGJhcnJldHRSZXZlcnQ7XG5CYXJyZXR0LnByb3RvdHlwZS5yZWR1Y2UgPSBiYXJyZXR0UmVkdWNlO1xuQmFycmV0dC5wcm90b3R5cGUubXVsVG8gPSBiYXJyZXR0TXVsVG87XG5CYXJyZXR0LnByb3RvdHlwZS5zcXJUbyA9IGJhcnJldHRTcXJUbztcblxuLy8gKHB1YmxpYykgdGhpc15lICUgbSAoSEFDIDE0Ljg1KVxuZnVuY3Rpb24gYm5Nb2RQb3coZSxtKSB7XG4gIHZhciBpID0gZS5iaXRMZW5ndGgoKSwgaywgciA9IG5idigxKSwgejtcbiAgaWYoaSA8PSAwKSByZXR1cm4gcjtcbiAgZWxzZSBpZihpIDwgMTgpIGsgPSAxO1xuICBlbHNlIGlmKGkgPCA0OCkgayA9IDM7XG4gIGVsc2UgaWYoaSA8IDE0NCkgayA9IDQ7XG4gIGVsc2UgaWYoaSA8IDc2OCkgayA9IDU7XG4gIGVsc2UgayA9IDY7XG4gIGlmKGkgPCA4KVxuICAgIHogPSBuZXcgQ2xhc3NpYyhtKTtcbiAgZWxzZSBpZihtLmlzRXZlbigpKVxuICAgIHogPSBuZXcgQmFycmV0dChtKTtcbiAgZWxzZVxuICAgIHogPSBuZXcgTW9udGdvbWVyeShtKTtcblxuICAvLyBwcmVjb21wdXRhdGlvblxuICB2YXIgZyA9IG5ldyBBcnJheSgpLCBuID0gMywgazEgPSBrLTEsIGttID0gKDE8PGspLTE7XG4gIGdbMV0gPSB6LmNvbnZlcnQodGhpcyk7XG4gIGlmKGsgPiAxKSB7XG4gICAgdmFyIGcyID0gbmJpKCk7XG4gICAgei5zcXJUbyhnWzFdLGcyKTtcbiAgICB3aGlsZShuIDw9IGttKSB7XG4gICAgICBnW25dID0gbmJpKCk7XG4gICAgICB6Lm11bFRvKGcyLGdbbi0yXSxnW25dKTtcbiAgICAgIG4gKz0gMjtcbiAgICB9XG4gIH1cblxuICB2YXIgaiA9IGUudC0xLCB3LCBpczEgPSB0cnVlLCByMiA9IG5iaSgpLCB0O1xuICBpID0gbmJpdHMoZVtqXSktMTtcbiAgd2hpbGUoaiA+PSAwKSB7XG4gICAgaWYoaSA+PSBrMSkgdyA9IChlW2pdPj4oaS1rMSkpJmttO1xuICAgIGVsc2Uge1xuICAgICAgdyA9IChlW2pdJigoMTw8KGkrMSkpLTEpKTw8KGsxLWkpO1xuICAgICAgaWYoaiA+IDApIHcgfD0gZVtqLTFdPj4odGhpcy5EQitpLWsxKTtcbiAgICB9XG5cbiAgICBuID0gaztcbiAgICB3aGlsZSgodyYxKSA9PSAwKSB7IHcgPj49IDE7IC0tbjsgfVxuICAgIGlmKChpIC09IG4pIDwgMCkgeyBpICs9IHRoaXMuREI7IC0tajsgfVxuICAgIGlmKGlzMSkge1x0Ly8gcmV0ID09IDEsIGRvbid0IGJvdGhlciBzcXVhcmluZyBvciBtdWx0aXBseWluZyBpdFxuICAgICAgZ1t3XS5jb3B5VG8ocik7XG4gICAgICBpczEgPSBmYWxzZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB3aGlsZShuID4gMSkgeyB6LnNxclRvKHIscjIpOyB6LnNxclRvKHIyLHIpOyBuIC09IDI7IH1cbiAgICAgIGlmKG4gPiAwKSB6LnNxclRvKHIscjIpOyBlbHNlIHsgdCA9IHI7IHIgPSByMjsgcjIgPSB0OyB9XG4gICAgICB6Lm11bFRvKHIyLGdbd10scik7XG4gICAgfVxuXG4gICAgd2hpbGUoaiA+PSAwICYmIChlW2pdJigxPDxpKSkgPT0gMCkge1xuICAgICAgei5zcXJUbyhyLHIyKTsgdCA9IHI7IHIgPSByMjsgcjIgPSB0O1xuICAgICAgaWYoLS1pIDwgMCkgeyBpID0gdGhpcy5EQi0xOyAtLWo7IH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHoucmV2ZXJ0KHIpO1xufVxuXG4vLyAocHVibGljKSBnY2QodGhpcyxhKSAoSEFDIDE0LjU0KVxuZnVuY3Rpb24gYm5HQ0QoYSkge1xuICB2YXIgeCA9ICh0aGlzLnM8MCk/dGhpcy5uZWdhdGUoKTp0aGlzLmNsb25lKCk7XG4gIHZhciB5ID0gKGEuczwwKT9hLm5lZ2F0ZSgpOmEuY2xvbmUoKTtcbiAgaWYoeC5jb21wYXJlVG8oeSkgPCAwKSB7IHZhciB0ID0geDsgeCA9IHk7IHkgPSB0OyB9XG4gIHZhciBpID0geC5nZXRMb3dlc3RTZXRCaXQoKSwgZyA9IHkuZ2V0TG93ZXN0U2V0Qml0KCk7XG4gIGlmKGcgPCAwKSByZXR1cm4geDtcbiAgaWYoaSA8IGcpIGcgPSBpO1xuICBpZihnID4gMCkge1xuICAgIHguclNoaWZ0VG8oZyx4KTtcbiAgICB5LnJTaGlmdFRvKGcseSk7XG4gIH1cbiAgd2hpbGUoeC5zaWdudW0oKSA+IDApIHtcbiAgICBpZigoaSA9IHguZ2V0TG93ZXN0U2V0Qml0KCkpID4gMCkgeC5yU2hpZnRUbyhpLHgpO1xuICAgIGlmKChpID0geS5nZXRMb3dlc3RTZXRCaXQoKSkgPiAwKSB5LnJTaGlmdFRvKGkseSk7XG4gICAgaWYoeC5jb21wYXJlVG8oeSkgPj0gMCkge1xuICAgICAgeC5zdWJUbyh5LHgpO1xuICAgICAgeC5yU2hpZnRUbygxLHgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHkuc3ViVG8oeCx5KTtcbiAgICAgIHkuclNoaWZ0VG8oMSx5KTtcbiAgICB9XG4gIH1cbiAgaWYoZyA+IDApIHkubFNoaWZ0VG8oZyx5KTtcbiAgcmV0dXJuIHk7XG59XG5cbi8vIChwcm90ZWN0ZWQpIHRoaXMgJSBuLCBuIDwgMl4yNlxuZnVuY3Rpb24gYm5wTW9kSW50KG4pIHtcbiAgaWYobiA8PSAwKSByZXR1cm4gMDtcbiAgdmFyIGQgPSB0aGlzLkRWJW4sIHIgPSAodGhpcy5zPDApP24tMTowO1xuICBpZih0aGlzLnQgPiAwKVxuICAgIGlmKGQgPT0gMCkgciA9IHRoaXNbMF0lbjtcbiAgICBlbHNlIGZvcih2YXIgaSA9IHRoaXMudC0xOyBpID49IDA7IC0taSkgciA9IChkKnIrdGhpc1tpXSklbjtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIChwdWJsaWMpIDEvdGhpcyAlIG0gKEhBQyAxNC42MSlcbmZ1bmN0aW9uIGJuTW9kSW52ZXJzZShtKSB7XG4gIHZhciBhYyA9IG0uaXNFdmVuKCk7XG4gIGlmKCh0aGlzLmlzRXZlbigpICYmIGFjKSB8fCBtLnNpZ251bSgpID09IDApIHJldHVybiBCaWdJbnRlZ2VyLlpFUk87XG4gIHZhciB1ID0gbS5jbG9uZSgpLCB2ID0gdGhpcy5jbG9uZSgpO1xuICB2YXIgYSA9IG5idigxKSwgYiA9IG5idigwKSwgYyA9IG5idigwKSwgZCA9IG5idigxKTtcbiAgd2hpbGUodS5zaWdudW0oKSAhPSAwKSB7XG4gICAgd2hpbGUodS5pc0V2ZW4oKSkge1xuICAgICAgdS5yU2hpZnRUbygxLHUpO1xuICAgICAgaWYoYWMpIHtcbiAgICAgICAgaWYoIWEuaXNFdmVuKCkgfHwgIWIuaXNFdmVuKCkpIHsgYS5hZGRUbyh0aGlzLGEpOyBiLnN1YlRvKG0sYik7IH1cbiAgICAgICAgYS5yU2hpZnRUbygxLGEpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZighYi5pc0V2ZW4oKSkgYi5zdWJUbyhtLGIpO1xuICAgICAgYi5yU2hpZnRUbygxLGIpO1xuICAgIH1cbiAgICB3aGlsZSh2LmlzRXZlbigpKSB7XG4gICAgICB2LnJTaGlmdFRvKDEsdik7XG4gICAgICBpZihhYykge1xuICAgICAgICBpZighYy5pc0V2ZW4oKSB8fCAhZC5pc0V2ZW4oKSkgeyBjLmFkZFRvKHRoaXMsYyk7IGQuc3ViVG8obSxkKTsgfVxuICAgICAgICBjLnJTaGlmdFRvKDEsYyk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKCFkLmlzRXZlbigpKSBkLnN1YlRvKG0sZCk7XG4gICAgICBkLnJTaGlmdFRvKDEsZCk7XG4gICAgfVxuICAgIGlmKHUuY29tcGFyZVRvKHYpID49IDApIHtcbiAgICAgIHUuc3ViVG8odix1KTtcbiAgICAgIGlmKGFjKSBhLnN1YlRvKGMsYSk7XG4gICAgICBiLnN1YlRvKGQsYik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdi5zdWJUbyh1LHYpO1xuICAgICAgaWYoYWMpIGMuc3ViVG8oYSxjKTtcbiAgICAgIGQuc3ViVG8oYixkKTtcbiAgICB9XG4gIH1cbiAgaWYodi5jb21wYXJlVG8oQmlnSW50ZWdlci5PTkUpICE9IDApIHJldHVybiBCaWdJbnRlZ2VyLlpFUk87XG4gIGlmKGQuY29tcGFyZVRvKG0pID49IDApIHJldHVybiBkLnN1YnRyYWN0KG0pO1xuICBpZihkLnNpZ251bSgpIDwgMCkgZC5hZGRUbyhtLGQpOyBlbHNlIHJldHVybiBkO1xuICBpZihkLnNpZ251bSgpIDwgMCkgcmV0dXJuIGQuYWRkKG0pOyBlbHNlIHJldHVybiBkO1xufVxuXG52YXIgbG93cHJpbWVzID0gWzIsMyw1LDcsMTEsMTMsMTcsMTksMjMsMjksMzEsMzcsNDEsNDMsNDcsNTMsNTksNjEsNjcsNzEsNzMsNzksODMsODksOTcsMTAxLDEwMywxMDcsMTA5LDExMywxMjcsMTMxLDEzNywxMzksMTQ5LDE1MSwxNTcsMTYzLDE2NywxNzMsMTc5LDE4MSwxOTEsMTkzLDE5NywxOTksMjExLDIyMywyMjcsMjI5LDIzMywyMzksMjQxLDI1MSwyNTcsMjYzLDI2OSwyNzEsMjc3LDI4MSwyODMsMjkzLDMwNywzMTEsMzEzLDMxNywzMzEsMzM3LDM0NywzNDksMzUzLDM1OSwzNjcsMzczLDM3OSwzODMsMzg5LDM5Nyw0MDEsNDA5LDQxOSw0MjEsNDMxLDQzMyw0MzksNDQzLDQ0OSw0NTcsNDYxLDQ2Myw0NjcsNDc5LDQ4Nyw0OTEsNDk5LDUwMyw1MDldO1xudmFyIGxwbGltID0gKDE8PDI2KS9sb3dwcmltZXNbbG93cHJpbWVzLmxlbmd0aC0xXTtcblxuLy8gKHB1YmxpYykgdGVzdCBwcmltYWxpdHkgd2l0aCBjZXJ0YWludHkgPj0gMS0uNV50XG5mdW5jdGlvbiBibklzUHJvYmFibGVQcmltZSh0KSB7XG4gIHZhciBpLCB4ID0gdGhpcy5hYnMoKTtcbiAgaWYoeC50ID09IDEgJiYgeFswXSA8PSBsb3dwcmltZXNbbG93cHJpbWVzLmxlbmd0aC0xXSkge1xuICAgIGZvcihpID0gMDsgaSA8IGxvd3ByaW1lcy5sZW5ndGg7ICsraSlcbiAgICAgIGlmKHhbMF0gPT0gbG93cHJpbWVzW2ldKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYoeC5pc0V2ZW4oKSkgcmV0dXJuIGZhbHNlO1xuICBpID0gMTtcbiAgd2hpbGUoaSA8IGxvd3ByaW1lcy5sZW5ndGgpIHtcbiAgICB2YXIgbSA9IGxvd3ByaW1lc1tpXSwgaiA9IGkrMTtcbiAgICB3aGlsZShqIDwgbG93cHJpbWVzLmxlbmd0aCAmJiBtIDwgbHBsaW0pIG0gKj0gbG93cHJpbWVzW2orK107XG4gICAgbSA9IHgubW9kSW50KG0pO1xuICAgIHdoaWxlKGkgPCBqKSBpZihtJWxvd3ByaW1lc1tpKytdID09IDApIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4geC5taWxsZXJSYWJpbih0KTtcbn1cblxuLy8gKHByb3RlY3RlZCkgdHJ1ZSBpZiBwcm9iYWJseSBwcmltZSAoSEFDIDQuMjQsIE1pbGxlci1SYWJpbilcbmZ1bmN0aW9uIGJucE1pbGxlclJhYmluKHQpIHtcbiAgdmFyIG4xID0gdGhpcy5zdWJ0cmFjdChCaWdJbnRlZ2VyLk9ORSk7XG4gIHZhciBrID0gbjEuZ2V0TG93ZXN0U2V0Qml0KCk7XG4gIGlmKGsgPD0gMCkgcmV0dXJuIGZhbHNlO1xuICB2YXIgciA9IG4xLnNoaWZ0UmlnaHQoayk7XG4gIHQgPSAodCsxKT4+MTtcbiAgaWYodCA+IGxvd3ByaW1lcy5sZW5ndGgpIHQgPSBsb3dwcmltZXMubGVuZ3RoO1xuICB2YXIgYSA9IG5iaSgpO1xuICBmb3IodmFyIGkgPSAwOyBpIDwgdDsgKytpKSB7XG4gICAgYS5mcm9tSW50KGxvd3ByaW1lc1tpXSk7XG4gICAgdmFyIHkgPSBhLm1vZFBvdyhyLHRoaXMpO1xuICAgIGlmKHkuY29tcGFyZVRvKEJpZ0ludGVnZXIuT05FKSAhPSAwICYmIHkuY29tcGFyZVRvKG4xKSAhPSAwKSB7XG4gICAgICB2YXIgaiA9IDE7XG4gICAgICB3aGlsZShqKysgPCBrICYmIHkuY29tcGFyZVRvKG4xKSAhPSAwKSB7XG4gICAgICAgIHkgPSB5Lm1vZFBvd0ludCgyLHRoaXMpO1xuICAgICAgICBpZih5LmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSkgPT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYoeS5jb21wYXJlVG8objEpICE9IDApIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIHByb3RlY3RlZFxuQmlnSW50ZWdlci5wcm90b3R5cGUuY2h1bmtTaXplID0gYm5wQ2h1bmtTaXplO1xuQmlnSW50ZWdlci5wcm90b3R5cGUudG9SYWRpeCA9IGJucFRvUmFkaXg7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5mcm9tUmFkaXggPSBibnBGcm9tUmFkaXg7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5mcm9tTnVtYmVyID0gYm5wRnJvbU51bWJlcjtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmJpdHdpc2VUbyA9IGJucEJpdHdpc2VUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLmNoYW5nZUJpdCA9IGJucENoYW5nZUJpdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmFkZFRvID0gYm5wQWRkVG87XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5kTXVsdGlwbHkgPSBibnBETXVsdGlwbHk7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5kQWRkT2Zmc2V0ID0gYm5wREFkZE9mZnNldDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5TG93ZXJUbyA9IGJucE11bHRpcGx5TG93ZXJUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLm11bHRpcGx5VXBwZXJUbyA9IGJucE11bHRpcGx5VXBwZXJUbztcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1vZEludCA9IGJucE1vZEludDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1pbGxlclJhYmluID0gYm5wTWlsbGVyUmFiaW47XG5cbi8vIHB1YmxpY1xuQmlnSW50ZWdlci5wcm90b3R5cGUuY2xvbmUgPSBibkNsb25lO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuaW50VmFsdWUgPSBibkludFZhbHVlO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYnl0ZVZhbHVlID0gYm5CeXRlVmFsdWU7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5zaG9ydFZhbHVlID0gYm5TaG9ydFZhbHVlO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc2lnbnVtID0gYm5TaWdOdW07XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS50b0J5dGVBcnJheSA9IGJuVG9CeXRlQXJyYXk7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5lcXVhbHMgPSBibkVxdWFscztcbkJpZ0ludGVnZXIucHJvdG90eXBlLm1pbiA9IGJuTWluO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubWF4ID0gYm5NYXg7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5hbmQgPSBibkFuZDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLm9yID0gYm5PcjtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnhvciA9IGJuWG9yO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYW5kTm90ID0gYm5BbmROb3Q7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5ub3QgPSBibk5vdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnNoaWZ0TGVmdCA9IGJuU2hpZnRMZWZ0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc2hpZnRSaWdodCA9IGJuU2hpZnRSaWdodDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmdldExvd2VzdFNldEJpdCA9IGJuR2V0TG93ZXN0U2V0Qml0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuYml0Q291bnQgPSBibkJpdENvdW50O1xuQmlnSW50ZWdlci5wcm90b3R5cGUudGVzdEJpdCA9IGJuVGVzdEJpdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLnNldEJpdCA9IGJuU2V0Qml0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuY2xlYXJCaXQgPSBibkNsZWFyQml0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZmxpcEJpdCA9IGJuRmxpcEJpdDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmFkZCA9IGJuQWRkO1xuQmlnSW50ZWdlci5wcm90b3R5cGUuc3VidHJhY3QgPSBiblN1YnRyYWN0O1xuQmlnSW50ZWdlci5wcm90b3R5cGUubXVsdGlwbHkgPSBibk11bHRpcGx5O1xuQmlnSW50ZWdlci5wcm90b3R5cGUuZGl2aWRlID0gYm5EaXZpZGU7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5yZW1haW5kZXIgPSBiblJlbWFpbmRlcjtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmRpdmlkZUFuZFJlbWFpbmRlciA9IGJuRGl2aWRlQW5kUmVtYWluZGVyO1xuQmlnSW50ZWdlci5wcm90b3R5cGUubW9kUG93ID0gYm5Nb2RQb3c7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5tb2RJbnZlcnNlID0gYm5Nb2RJbnZlcnNlO1xuQmlnSW50ZWdlci5wcm90b3R5cGUucG93ID0gYm5Qb3c7XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5nY2QgPSBibkdDRDtcbkJpZ0ludGVnZXIucHJvdG90eXBlLmlzUHJvYmFibGVQcmltZSA9IGJuSXNQcm9iYWJsZVByaW1lO1xuXG4vLyBCaWdJbnRlZ2VyIGludGVyZmFjZXMgbm90IGltcGxlbWVudGVkIGluIGpzYm46XG5cbi8vIEJpZ0ludGVnZXIoaW50IHNpZ251bSwgYnl0ZVtdIG1hZ25pdHVkZSlcbi8vIGRvdWJsZSBkb3VibGVWYWx1ZSgpXG4vLyBmbG9hdCBmbG9hdFZhbHVlKClcbi8vIGludCBoYXNoQ29kZSgpXG4vLyBsb25nIGxvbmdWYWx1ZSgpXG4vLyBzdGF0aWMgQmlnSW50ZWdlciB2YWx1ZU9mKGxvbmcgdmFsKVxuXG4vLy8gTUVURU9SIFdSQVBQRVJcbnJldHVybiBCaWdJbnRlZ2VyO1xufSkoKTtcbiIsIi8vIFRoaXMgcGFja2FnZSBjb250YWlucyBqdXN0IGVub3VnaCBvZiB0aGUgb3JpZ2luYWwgU1JQIGNvZGUgdG9cbi8vIHN1cHBvcnQgdGhlIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5IHVwZ3JhZGUgcGF0aC5cbi8vXG4vLyBBbiBTUlAgKGFuZCBwb3NzaWJseSBhbHNvIGFjY291bnRzLXNycCkgcGFja2FnZSBzaG91bGQgZXZlbnR1YWxseSBiZVxuLy8gYXZhaWxhYmxlIGluIEF0bW9zcGhlcmUgc28gdGhhdCB1c2VycyBjYW4gY29udGludWUgdG8gdXNlIFNSUCBpZiB0aGV5XG4vLyB3YW50IHRvLlxuXG5TUlAgPSB7fTtcblxuLyoqXG4gKiBHZW5lcmF0ZSBhIG5ldyBTUlAgdmVyaWZpZXIuIFBhc3N3b3JkIGlzIHRoZSBwbGFpbnRleHQgcGFzc3dvcmQuXG4gKlxuICogb3B0aW9ucyBpcyBvcHRpb25hbCBhbmQgY2FuIGluY2x1ZGU6XG4gKiAtIGlkZW50aXR5OiBTdHJpbmcuIFRoZSBTUlAgdXNlcm5hbWUgdG8gdXNlci4gTW9zdGx5IHRoaXMgaXMgcGFzc2VkXG4gKiAgIGluIGZvciB0ZXN0aW5nLiAgUmFuZG9tIFVVSUQgaWYgbm90IHByb3ZpZGVkLlxuICogLSBoYXNoZWRJZGVudGl0eUFuZFBhc3N3b3JkOiBjb21iaW5lZCBpZGVudGl0eSBhbmQgcGFzc3dvcmQsIGFscmVhZHkgaGFzaGVkLCBmb3IgdGhlIFNSUCB0byBiY3J5cHQgdXBncmFkZSBwYXRoLlxuICogLSBzYWx0OiBTdHJpbmcuIEEgc2FsdCB0byB1c2UuICBNb3N0bHkgdGhpcyBpcyBwYXNzZWQgaW4gZm9yXG4gKiAgIHRlc3RpbmcuICBSYW5kb20gVVVJRCBpZiBub3QgcHJvdmlkZWQuXG4gKiAtIFNSUCBwYXJhbWV0ZXJzIChzZWUgX2RlZmF1bHRzIGFuZCBwYXJhbXNGcm9tT3B0aW9ucyBiZWxvdylcbiAqL1xuU1JQLmdlbmVyYXRlVmVyaWZpZXIgPSBmdW5jdGlvbiAocGFzc3dvcmQsIG9wdGlvbnMpIHtcbiAgdmFyIHBhcmFtcyA9IHBhcmFtc0Zyb21PcHRpb25zKG9wdGlvbnMpO1xuXG4gIHZhciBzYWx0ID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5zYWx0KSB8fCBSYW5kb20uc2VjcmV0KCk7XG5cbiAgdmFyIGlkZW50aXR5O1xuICB2YXIgaGFzaGVkSWRlbnRpdHlBbmRQYXNzd29yZCA9IG9wdGlvbnMgJiYgb3B0aW9ucy5oYXNoZWRJZGVudGl0eUFuZFBhc3N3b3JkO1xuICBpZiAoIWhhc2hlZElkZW50aXR5QW5kUGFzc3dvcmQpIHtcbiAgICBpZGVudGl0eSA9IChvcHRpb25zICYmIG9wdGlvbnMuaWRlbnRpdHkpIHx8IFJhbmRvbS5zZWNyZXQoKTtcbiAgICBoYXNoZWRJZGVudGl0eUFuZFBhc3N3b3JkID0gcGFyYW1zLmhhc2goaWRlbnRpdHkgKyBcIjpcIiArIHBhc3N3b3JkKTtcbiAgfVxuXG4gIHZhciB4ID0gcGFyYW1zLmhhc2goc2FsdCArIGhhc2hlZElkZW50aXR5QW5kUGFzc3dvcmQpO1xuICB2YXIgeGkgPSBuZXcgQmlnSW50ZWdlcih4LCAxNik7XG4gIHZhciB2ID0gcGFyYW1zLmcubW9kUG93KHhpLCBwYXJhbXMuTik7XG5cbiAgcmV0dXJuIHtcbiAgICBpZGVudGl0eTogaWRlbnRpdHksXG4gICAgc2FsdDogc2FsdCxcbiAgICB2ZXJpZmllcjogdi50b1N0cmluZygxNilcbiAgfTtcbn07XG5cbi8vIEZvciB1c2Ugd2l0aCBjaGVjaygpLlxuU1JQLm1hdGNoVmVyaWZpZXIgPSB7XG4gIGlkZW50aXR5OiBTdHJpbmcsXG4gIHNhbHQ6IFN0cmluZyxcbiAgdmVyaWZpZXI6IFN0cmluZ1xufTtcblxuXG4vKipcbiAqIERlZmF1bHQgcGFyYW1ldGVyIHZhbHVlcyBmb3IgU1JQLlxuICpcbiAqL1xudmFyIF9kZWZhdWx0cyA9IHtcbiAgaGFzaDogZnVuY3Rpb24gKHgpIHsgcmV0dXJuIFNIQTI1Nih4KS50b0xvd2VyQ2FzZSgpOyB9LFxuICBOOiBuZXcgQmlnSW50ZWdlcihcIkVFQUYwQUI5QURCMzhERDY5QzMzRjgwQUZBOEZDNUU4NjA3MjYxODc3NUZGM0MwQjlFQTIzMTRDOUMyNTY1NzZENjc0REY3NDk2RUE4MUQzMzgzQjQ4MTNENjkyQzZFMEUwRDVEOEUyNTBCOThCRTQ4RTQ5NUMxRDYwODlEQUQxNURDN0Q3QjQ2MTU0RDZCNkNFOEVGNEFENjlCMTVENDk4MjU1OUIyOTdCQ0YxODg1QzUyOUY1NjY2NjBFNTdFQzY4RURCQzNDMDU3MjZDQzAyRkQ0Q0JGNDk3NkVBQTlBRkQ1MTM4RkU4Mzc2NDM1QjlGQzYxRDJGQzBFQjA2RTNcIiwgMTYpLFxuICBnOiBuZXcgQmlnSW50ZWdlcihcIjJcIilcbn07XG5fZGVmYXVsdHMuayA9IG5ldyBCaWdJbnRlZ2VyKFxuICBfZGVmYXVsdHMuaGFzaChcbiAgICBfZGVmYXVsdHMuTi50b1N0cmluZygxNikgK1xuICAgICAgX2RlZmF1bHRzLmcudG9TdHJpbmcoMTYpKSxcbiAgMTYpO1xuXG4vKipcbiAqIFByb2Nlc3MgYW4gb3B0aW9ucyBoYXNoIHRvIGNyZWF0ZSBTUlAgcGFyYW1ldGVycy5cbiAqXG4gKiBPcHRpb25zIGNhbiBpbmNsdWRlOlxuICogLSBoYXNoOiBGdW5jdGlvbi4gRGVmYXVsdHMgdG8gU0hBMjU2LlxuICogLSBOOiBTdHJpbmcgb3IgQmlnSW50ZWdlci4gRGVmYXVsdHMgdG8gMTAyNCBiaXQgdmFsdWUgZnJvbSBSRkMgNTA1NFxuICogLSBnOiBTdHJpbmcgb3IgQmlnSW50ZWdlci4gRGVmYXVsdHMgdG8gMi5cbiAqIC0gazogU3RyaW5nIG9yIEJpZ0ludGVnZXIuIERlZmF1bHRzIHRvIGhhc2goTiwgZylcbiAqL1xudmFyIHBhcmFtc0Zyb21PcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSAvLyBmYXN0IHBhdGhcbiAgICByZXR1cm4gX2RlZmF1bHRzO1xuXG4gIHZhciByZXQgPSB7IC4uLl9kZWZhdWx0cyB9O1xuXG4gIFsnTicsICdnJywgJ2snXS5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XG4gICAgaWYgKG9wdGlvbnNbcF0pIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uc1twXSA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgcmV0W3BdID0gbmV3IEJpZ0ludGVnZXIob3B0aW9uc1twXSwgMTYpO1xuICAgICAgZWxzZSBpZiAob3B0aW9uc1twXSBpbnN0YW5jZW9mIEJpZ0ludGVnZXIpXG4gICAgICAgIHJldFtwXSA9IG9wdGlvbnNbcF07XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgcGFyYW1ldGVyOiBcIiArIHApO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKG9wdGlvbnMuaGFzaClcbiAgICByZXQuaGFzaCA9IGZ1bmN0aW9uICh4KSB7IHJldHVybiBvcHRpb25zLmhhc2goeCkudG9Mb3dlckNhc2UoKTsgfTtcblxuICBpZiAoIW9wdGlvbnMuayAmJiAob3B0aW9ucy5OIHx8IG9wdGlvbnMuZyB8fCBvcHRpb25zLmhhc2gpKSB7XG4gICAgcmV0LmsgPSByZXQuaGFzaChyZXQuTi50b1N0cmluZygxNikgKyByZXQuZy50b1N0cmluZygxNikpO1xuICB9XG5cbiAgcmV0dXJuIHJldDtcbn07XG4iXX0=
