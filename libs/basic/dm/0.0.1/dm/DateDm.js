//- dm/str.js
/*
 * Copyright 11-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */

/// Class to manipulate dates, specially in spanish format.<p>

(function () {
  "use strict";

  var str = dm.str;

  /// Note: Jan is 1, Dec is 12.
  //# num - num - num - DateDm
  dm.DateDm = function (day, month, year) {
    var date = new Date(year, month - 1, day, 12, 0, 0);

    //# Date
    this.date = date;

    /// In range 1-31
    //# num
    this.day = date.getDate();

    /// In range 1-12
    //# num
    this.month = date.getMonth() + 1;

    ///
    //# num
    this.year = date.getFullYear();
  };

  var DateDm = dm.DateDm;
  var dateDm = DateDm.prototype;


  ///
  //# DateDm - bool
  dateDm.eq = function (d) {
    return this.day === d.day &&
      this.month === d.month &&
      this.year === d.year;
  };

  ///
  //# DateDm - num
  dateDm.compare = function (d) {
    return this.year === d.year
      ? this.month === d.month
        ? this.day - d.day
        : this.month - d.month
      : this.year - d.year;
  };

  /// Returns a new DataDm equals to [this] + [days]
  //# num - !DateDm
  dateDm.add = function (days) {
    return DateDm.fromTime(this.toTime() + days * 86400000);
  };

  /// Returns [this] - [d] in days.
  //# !DateDm - num
  dateDm.df = function (d) {
    return Math.round((this.toTime() - d.toTime()) / 86400000);
  };

  /**
   * Returns a string that represents to [this]. <p>
   * [template] is a kind <tt>printf</tt> with next sustitution
   * variables:
   *   %d  Day in number 06 -> 6
   *   %D  Day with tow digits 06 -> 06
   *   %m  Month in number 03 -> 3
   *   %M  Month with two digits 03 -> 03
   *   %y  Year with two digits 2010 -> 10
   *   %Y  Year with four digits 2010 -> 2010
   *   %b  Month with three characters.
   *   %B  Month with all characters.
   *   %1  Week day with one character: L M X J V S D
   *   %a  Week day with tree characters.
   *   %A  Week day withd all characters.
   *   %%  The sign %
   */
  //# str - str
  dateDm.format = function (template) {
    var r = function (code, value) {
      template = str.replace(template, code, value);
    };

    var d = "" + this.day;
    var dw = this.date.getDay();
    var w = DateDm.week[dw];
    var mn = this.date.getMonth();
    var m = "" + (mn + 1);
    var ms = DateDm.months[mn];
    var y = "0000" + this.year;

    r("%d", d);
    r("%D", d.length === 1 ? "0" + d : d);
    r("%m", m);
    r("%M", m.length === 1 ? "0" + m : m);
    r("%y", str.sub(y, -2));
    r("%Y", str.sub(y, -4));
    r("%b", ms.substring(0, 3));
    r("%B", ms);
    r("%1", DateDm.week1.charAt(dw));
    r("%a", w.substring(0, 3));
    r("%A", w);
    r("%%", "%");

    return template;
  };

  /// Returns [this] in format "yyyymmdd"
  //# - str
  dateDm.base = function () {
    var y = "0000" + this.year;
    var m = "00" + this.month;
    var d = "00" + this.day;
    return str.sub(y, -4) +
      str.sub(m, -2) +
      str.sub(d, -2);
  };

  ///
  //# - !Date
  dateDm.toDate = function () { return this.date; };

  ///
  //# - num
  dateDm.toTime = function () { return this.date.getTime(); };

  /// Spanish format
  //# - str
  dateDm.toString = function () {
    var y = "0000" + this.year;
    var m = "00" + this.month;
    var d = "00" + this.day;
    return str.sub(d, -2) + "/" +
      str.sub(m, -2) + "/" +
      str.sub(y, -4);
  };

  ///
  //# - Arr<*>
  dateDm.serialize = function () { return [this.day, this.month, this.year]; };

// ----------------------------------------------- //

  /// Inicializated as ["enero", "febrero", "marzo", "abril", "mayo", "junio",
  /// "julio", "agosto", "septiembre", "octubre", "noviembre",  "diciembre"]
  //# Arr<str>
  DateDm.months = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  /// Inicializated as ["domingo", "lunes", "martes", "miércoles", "jueves",
  /// "viernes", "sábado"]
  //# Arr<str>
  DateDm.week = ["domingo", "lunes", "martes", "miércoles", "jueves",
    "viernes", "sábado"];

  /// Inicializated as "DLMXJVS"
  //# str
  DateDm.week1 = "DLMXJVS";

  ///
  //# !Date - !DateDm
  DateDm.fromDate = function (date) {
    return new DateDm(date.getDate(), date.getMonth() + 1, date.getFullYear());
  };

  /// [s] is in format yyyymmdd (mm in range 01-12)
  //# str - !DateDm
  DateDm.fromStr = function (s) {
    return new DateDm(+s.substring(6), +s.substring(4, 6), +s.substring(0, 4));
  };

  /// [s] is in format dd-mm-yyyy or dd-mm-yy or dd/mm/yyyy or dd/mm/yy
  /// (mm in range 01-12)
  //# str - !DateDm
  DateDm.fromEu = function (s) {
    var ps = s.split("/");
    if (ps.length === 1) {
      ps = s.split("-");
    }
    var y = +ps[2];
    return new DateDm(+ps[0], +ps[1], ps[2].length === 2 ? 2000 + y : y);
  };

  /// [s] is in format mm-dd-yyyy or mm-dd-yy or mm/dd/yyyy or mm/dd/yy
  /// (mm in range 01-12)
  //# str - !DateDm
  DateDm.fromEn = function (s) {
    var ps = s.split("/");
    if (ps.length === 1) {
      ps = s.split("-");
    }
    var y = +ps[2];
    return new DateDm(+ps[1], +ps[0], ps[2].length === 2 ? 2000 + y : y);
  };

  ///
  //# num - !DateDm
  DateDm.fromTime = function (time) { return DateDm.fromDate(new Date(time)); };

  /// Returns the date-hour actual.
  //# - !DateDm
  DateDm.now = function () { return DateDm.fromTime(Date.now()); };

  ///
  //# !Arr<?> - !DateDm
  DateDm.restore = function (serial) {
    return new DateDm(serial[0], serial[1], serial[2]);
  };

  ///
  //# num - bool
  DateDm.isLeap = function (year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  };

}());
