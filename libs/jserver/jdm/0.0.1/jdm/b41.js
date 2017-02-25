//- jdm/jdm.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global jdm */

(function () {
  "use strict";

  jdm.b41 = {};
  var b41 = jdm.b41;

  var chars = "RSTUVWXYZa" +
              "bcdefghijk" +
              "lmnopqrstu" +
              "vwxyzABCDE" +
              "F";

  /// Returns the number of code B41 'b'
  //# str - num
  b41.b2n = function (b) { return chars.indexOf(b); };

  /// Returns the B41 code whose number is 'n'
  //# num - str
  b41.n2b = function (n) { return chars.charAt(n); };

  /// Encodes a string in B41
  //# str - str
  b41.encode = function (s) {
    var i;
    var n;
    var n1;
    var r = "";
    for (i = 0; i < s.length; ++i) {
      n = s.charCodeAt(i);
      n1 = Math.floor(n / 41);
      r += chars.charAt(Math.floor(n1 / 41)) +
        chars.charAt(n1 % 41) +
        chars.charAt(n % 41);
    }
    return r;
  };

  /// Decodes a string codified with encode
  //# str - str
  b41.decode = function (c) {
    var n1;
    var n2;
    var n3;
    var r = "";
    var i = 0;
    while (i < c.length) {
      n1 = chars.indexOf(c.charAt(i++));
      n2 = chars.indexOf(c.charAt(i++));
      n3 = chars.indexOf(c.charAt(i++));
      r += String.fromCharCode(1681 * n1 + 41 * n2 + n3);
    }
    return r;
  };

  /// Encodes an Array<Int> in B41
  //# Arr<num> - str
  b41.encodeBytes = function (bs) {
    var lg = bs.length;
    var odd = false;
    if (lg % 2 !== 0) {
      odd = true;
      --lg;
    }
    var n;
    var n1;
    var r = "";
    var i = 0;
    while (i < lg) {
      n = bs[i]  * 256 + bs[i + 1];
      n1 = Math.floor(n / 41);
      r += chars.charAt(Math.floor(n1 / 41)) +
        chars.charAt(n1 % 41) +
        chars.charAt(n % 41);
      i += 2;
    }
    if (odd) {
      n = bs[i];
      r += chars.charAt(Math.floor(n / 41)) + chars.charAt(n % 41);
    }
    return r;
  };

  /// Decodes an Array<Int> codified with encodeBytes
  //# str - Arr<num>
  b41.decodeBytes = function (c) {
    var lg = c.length;
    var odd = false;
    if (lg % 3 !== 0) {
      odd = true;
      lg -= 2;
    }
    var n;
    var n1;
    var n2;
    var n3;
    var r = [];
    var i = 0;
    while (i < lg) {
      n1 = chars.indexOf(c.charAt(i++));
      n2 = chars.indexOf(c.charAt(i++));
      n3 = chars.indexOf(c.charAt(i++));
      n = 1681 * n1 + 41 * n2 + n3;
      r.push(Math.floor(n / 256));
      r.push(n % 256);
    }
    if (odd) {
      n1 = chars.indexOf(c.charAt(i++));
      n2 = chars.indexOf(c.charAt(i++));
      n = 41 * n1 + n2;
      r.push(n);
    }
    return r;
  };


  /// Compressing a B41 code. It is usefull to codify strings.
  //# str - str
  b41.compress = function (s) {
    var c = b41.encode(s);
    var n = 0;
    var i = 0;
    var tmp = "";
    var r = "";
    while (i < c.length) {
      if (c.substring(i, i + 2) === "RT") {
        ++n;
        tmp += c.charAt(i + 2);
        if (n === 10) {
          r += (n - 1) + tmp;
          tmp = "";
          n = 0;
        }
      } else {
        if (n > 0) {
          r += (n - 1) + tmp;
          tmp = "";
          n = 0;
        }
        r += c.substring(i, i + 3);
      }
      i += 3;
    }
    if (n > 0) {
      r += (n - 1) + tmp;
    }
    return r;
  };

  /// Decompress a B41 code compressed with compress
  //# str - str
  b41.decompress = function (c) {
    var n;
    var r = "";
    var ch;
    var j;
    var i = 0;
    while (i < c.length) {
      ch = c.charAt(i++);
      if (ch >= "0" && ch <= "9") {
        n = +ch + 1;
        for (j = 0; j < n; ++j) {
          ch = c.charAt(i++);
          r += "RT" + ch;
        }
      } else {
        r += ch;
        for (j = 0; j < 2; ++j) {
          ch = c.charAt(i++);
          r += ch;
        }
      }
    }
    return b41.decode(r);
  };

}());
