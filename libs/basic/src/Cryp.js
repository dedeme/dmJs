// Copyright 03-Sep-2017 ºDeme
// GNU General Public License - V3 <http://www.gnu.org/licenses/>

/// Cryptographic functions

goog.provide("github.dedeme.Cryp")
goog.require("github.dedeme.B64")

github.dedeme.Cryp = class {

  /**
   * Generates a B64 random key of a length 'lg'
   * @param {number} lg
   * @return {string}
   */
  static genK (lg) {
    let arr = new Uint8Array(lg);
    for (let i = 0; i < lg; ++i) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return github.dedeme.B64.encodeBytes(arr).substring(0, lg);
  }

  /**
   * Returns 'k' codified in irreversible way, using 'lg' B64 digits.
   * @param {string} k String to codify
   * @param {number} lg Length of result
   * @return {string} 'lg' B64 digits
   */
  static key (k, lg) {
    /** @type {number} */
    let lg2 = k.length * 2;
    if (lg2 < lg * 2) {
      lg2 = lg * 2;
    }

    k = k + "codified in irreversibleDeme is good, very good!\n\r8@@";
    while (k.length < lg2) {
      k += k;
    }

    /** @type {!Uint8Array} */
    let dt = github.dedeme.B64.decodeBytes(github.dedeme.B64.encode(k));
    lg2 = dt.length;

    let sum = 0;
    let i = 0;
    while (i < lg2) {
      sum = (sum + dt[i]) % 256;
      dt[i] = (sum + i + dt[i]);
      ++i;
    }
    while (i > 0) {
      --i;
      sum = (sum + dt[i]) % 256;
      dt[i] = (sum + i + dt[i]);
    }

    return github.dedeme.B64.encodeBytes(dt).substring(0, lg);
  }

  /**
   * Encodes 'm' with key 'k'.
   * @param {string} k Key for encoding
   * @param {string} m Message to encode
   * @return {string} 'm' codified in B64 digits.
   */
  static cryp (k, m) {
    m = github.dedeme.B64.encode(m);
    let lg = m.length;
    k = github.dedeme.Cryp.key(k, lg);
    let r = new Uint8Array(lg);
    for (let i = 0; i < lg; ++i) {
      r[i] = m.charCodeAt(i) + k.charCodeAt(i)
    }

    return github.dedeme.B64.encodeBytes(r);
  }

  /**
   * Decodes 'c' using key 'k'. 'c' was codified with cryp().
   * @param {string} k Key for decoding
   * @param {string} c Text codified with cryp()
   * @return {string} 'c' decoded.
   */
  static decryp(k, c) {
    let bs = github.dedeme.B64.decodeBytes(c);
    let lg = bs.length;
    k = github.dedeme.Cryp.key(k, lg);
    let r = "";
    for (let i = 0; i < lg; ++i) {
      r += String.fromCharCode(bs[i] - k.charCodeAt(i));
    }

    return github.dedeme.B64.decode(r);
  }

}


