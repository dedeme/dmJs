//- dm/dm.js
/*
 * Copyright 14-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */

(function () {
  "use strict";

  /// Operates with numbers using a precision of
  /// 1/Math.pow(10, 14 - Math.log10(Math.abs(value)))
  //# ?num - ?num - Dec
  dm.Dec = function (value, scale) {
    value = value || 0;
    scale = scale || 0;

    var lg = Math.log10(Math.abs(value));
    lg = lg < 0 ? 0 : lg;
    this._precision = 1 / Math.pow(10, 14 - lg);
    var _value = value < 0 ? value - this._precision : value + this._precision;

    //# num
    this.scale = scale < 0 ? 0 : scale;

    var _scale = Math.pow(10, scale);

    //# num
    this.value = Math.round(_value * _scale) / _scale;
  };

  var Dec = dm.Dec;
  var dec = dm.Dec.prototype;

  /// Returns if [this] and [d] have the same value and scale
  //# Dec - bool
  dec.eq = function (d) {
    return Dec.eq(this.scale, d.scale, 0.000001) &&
           Dec.eq(this.value, d.value, this._precision);
  };

  /// Returns if [this] and [d] have the same value. (Doesn't take into account
  /// their scales and uses precision of [this])
  //# Dec - bool
  dec.eqValue = function (d) {
    return Dec.eq(this.value, d.value, this._precision);
  };

  /// Returns 1, 0 or -1 depending on [this] was greater, equal or lesser than
  /// [d]. (Doesn't take into account their scales)
  //# Dec - num
  dec.compare = function (d) {
    return this.eqValue(d) ? 0 : this.value - d.value;
  };

  dec._format = function (thousand, decimal) {
    var vs = Math.abs(this.value).toFixed(this.scale);
    var left = vs;
    var right = "";
    var ix = 0;
    if (this.scale) {
      ix = vs.indexOf(".");
      left = vs.substring(0, ix);
      right = decimal + vs.substring(ix + 1);
    }
    var size = 3;
    while (left.length > size) {
      ix = left.length - size;
      left = left.substring(0, ix) + thousand + left.substring(ix);
      size += 4;
    }
    return (this.value < 0 ? "-" : "") + left + right;
  };

  /// European format, with point of thousand and decimal comma.
  //# - str
  dec.toEs = function () { return this._format(".", ","); };

  /// English format, with comma of thousand  and decimal point.
  //# - str
  dec.toEn = function () { return this._format(",", "."); };

  /// Return [this] in base format.
  //# - str
  dec.toString = function () { return this.value.toFixed(this.scale); };

  //# - Arr<num>
  dec.serialize = function () { return [this.value, this.scale]; };

// ----------------------------------------------- //

  /// Indicates if two numbers are equals +- dif
  //# num - num - num - bool
  Dec.eq = function (n1, n2, dif) { return Math.abs(n1 - n2) < dif; };

  /// [s] must be in base format.
  //# str - bool
  Dec.isNumber = function (s) { return !(s === null || s === "" || isNaN(s)); };

  /// Test if [s] is in English format
  //# str - bool
  Dec.isNumberEn = function (s) { return Dec.isNumber(s.replace(/,/g, "")); };

  /// Test if [s] is in Spanish format
  //# str - bool
  Dec.isNumberEs = function (s) {
    return Dec.isNumber(s.replace(/\./g, "").replace(",", "."));
  };

  /// Returns 's' (English format) converted to Float o null if 's' is not a
  /// number
  //# str - num
  Dec.toFloatEn = function (s) { return parseFloat(s.replace(/,/g, "")); };

  /// Returns 's' (Spanish format) converted to Float o null if 's' is not a
  /// number
  //# str - num
  Dec.toFloatEs = function (s) {
    return parseFloat(s.replace(/\./g, "").replace(",", "."));
  };

  /// [s] must be in English format.
  //# str - num - Dec
  Dec.newEn = function (s, scale) {
    var d = Dec.toFloatEn(s);
    return d === null ? null : new Dec(d, scale);
  };

  /// [s] must be in Spanish format.
  //# str - num - Dec
  Dec.newEs = function (s, scale) {
    var d = Dec.toFloatEs(s);
    return d === null ? null : new Dec(d, scale);
  };

  /// [s] must be in base format.
  //# str - num - Dec
  Dec.newStr = function (s, scale) {
    var d = parseFloat(s);
    return d === null ? null : new Dec(d, scale);
  };

  //# Arr<num> - Dec
  Dec.restore = function (s) { return new Dec(s[0], s[1]); };

  /// With no argument returns a number between [0-1) <p>
  /// With one arguments returns a random integer between 0 included and
  /// n excluded <p>
  /// With two arguments returns a random integer between n1 included and n2
  /// included. n1 can be upper or lower than n2.
  //# ?num - ?num - num
  Dec.rnd = function (n1, n2) {
    if (n2) {
      var dif = n2 - n1;
      return dif > 0 ? n1 + Dec.rnd(dif + 1) : n2 + Dec.rnd(1 - dif);
    }
    if (n1) {
      return n1 < 0 ? Math.ceil(Math.random() * n1)
        : Math.floor(Math.random() * n1);
    }
    return Math.random();
  };

  /// Return a random number between n1 included and n2 included.
  ///   n1 can be upper or lower than n2.
  ///   Result has the bigest sacale of both
  //# Dec - Dec - Dec
  Dec.rndDec = function (n1, n2) {
    var sc = n1.scale > n2.scale ? n1.scale : n2.scale;
    var dif = n2.value - n1.value;
    return new Dec(n1.value + Math.random() * dif, sc);
  };

}());

