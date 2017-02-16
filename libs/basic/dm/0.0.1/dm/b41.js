//- dm/dm.js
/*
 * Copyright 05-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global dm */

(() => {
  dm.b41 = {};
  const b41 = dm.b41;

  const chars = "RSTUVWXYZa" +
                "bcdefghijk" +
                "lmnopqrstu" +
                "vwxyzABCDE" +
                "F";

  /// Returns the number of code B41 'b'
  //# str - num
  b41.b2n = b => chars.indexOf(b);

  /// Returns the B41 code whose number is 'n'
  //# num - str
  b41.n2b = n => chars.charAt(n);

  /// Encodes a string in B41
  //# str - str
  b41.encode = s => {
    let r = "";
    for (let i = 0; i < s.length; ++i) {
      let n = s.charCodeAt(i);
      let n1 = Math.floor(n / 41);
      r += chars.charAt(Math.floor(n1 / 41)) +
        chars.charAt(n1 % 41) +
        chars.charAt(n % 41);
    }
    return r;
  };

  /// Decodes a string codified with encode
  //# str - str
  b41.decode = c => {
    let r = "";
    let i = 0;
    while (i < c.length) {
      let n1 = chars.indexOf(c.charAt(i++));
      let n2 = chars.indexOf(c.charAt(i++));
      let n3 = chars.indexOf(c.charAt(i++));
      r += String.fromCharCode(1681 * n1 + 41 * n2 + n3);
    }
    return r;
  };

  /// Encodes an Array<Int> in B41
  //# Arr<num> - str
  b41.encodeBytes = bs => {
    let lg = bs.length;
    let odd = false;
    if (lg % 2 !== 0) {
      odd = true;
      --lg;
    }
    let r = "";
    let i = 0;
    while (i < lg) {
      let n = bs[i]  * 256 + bs[i + 1];
      let n1 = Math.floor(n / 41);
      r += chars.charAt(Math.floor(n1 / 41)) +
        chars.charAt(n1 % 41) +
        chars.charAt(n % 41);
      i += 2;
    }
    if (odd) {
      let n = bs[i];
      r += chars.charAt(Math.floor(n / 41)) + chars.charAt(n % 41);
    }
    return r;
  };

  /// Decodes an Array<Int> codified with encodeBytes
  //# str - Arr<num>
  b41.decodeBytes = c => {
    let lg = c.length;
    let odd = false;
    if (lg % 3 !== 0) {
      odd = true;
      lg -= 2;
    }
    let r = [];
    let i = 0;
    while (i < lg) {
      let n1 = chars.indexOf(c.charAt(i++));
      let n2 = chars.indexOf(c.charAt(i++));
      let n3 = chars.indexOf(c.charAt(i++));
      let n = 1681 * n1 + 41 * n2 + n3;
      r.push(Math.floor(n / 256));
      r.push(n % 256);
    }
    if (odd) {
      let n1 = chars.indexOf(c.charAt(i++));
      let n2 = chars.indexOf(c.charAt(i++));
      let n = 41 * n1 + n2;
      r.push(n);
    }
    return r;
  };


  /// Compressing a B41 code. It is usefull to codify strings.
  //# str - str
  b41.compress = s => {
    const c = b41.encode(s);
    let n = 0;
    let tmp = "";
    let r = "";
    let i = 0;
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
  b41.decompress = c => {
    let r = "";
    let i = 0;
    while (i < c.length) {
      let ch = c.charAt(i++);
      if (ch >= "0" && ch <= "9") {
        let n = +ch + 1;
        for (let j = 0; j < n; ++j) {
          ch = c.charAt(i++);
          r += "RT" + ch;
        }
      } else {
        r += ch;
        for (let j = 0; j < 2; ++j) {
          ch = c.charAt(i++);
          r += ch;
        }
      }
    }
    return b41.decode(r);
  };

})();

