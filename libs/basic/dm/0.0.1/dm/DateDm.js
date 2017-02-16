//- dm/str.js
/*
 * Copyright 11-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global dm */

/// Class to manipulate dates, specially in spanish format.<p>

(() => {
  const str = dm.str;

  class DateDm {
    /// Note: Jan is 1, Dec is 12.
    //# num - num - num - DateDm
    constructor (day, month, year) {
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
    }

    //# DateDm - bool
    eq (d) {
      return this.day === d.day &&
             this.month === d.month &&
             this.year === d.year;
    }

    //# DateDm - num
    compare (d) {
      return this.year === d.year
        ? this.month === d.month
          ? this.day - d.day
          : this.month - d.month
        : this.year - d.year;
    }

    /// Returns a new DataDm equals to [this] + [days]
    //# num - !DateDm
    add (days) {
      return DateDm.fromTime(this.toTime() + days * 86400000);
    }

    /// Returns [this] - [d] in days.
    //# DateDm - num
    df (d) {
      return Math.round((this.toTime() - d.toTime()) / 86400000);
    }

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
    format (template) {
      const r = (code, value) => {
        template = str.replace(template, code, value);
      };

      const d = "" + this.day;
      const dw = this.date.getDay();
      const w = DateDm.week[dw];
      const mn = this.date.getMonth();
      const m = "" + (mn + 1);
      const ms = DateDm.months[mn];
      const y = "0000" + this.year;

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
    }

    /// Returns [this] in format "yyyymmdd"
    //# - str
    base () {
      return str.sub("0000" + this.year, -4) +
             str.sub("00" + this.month, -2) +
             str.sub("00" + this.day, -2);
    }
    //# - Date
    toDate () {
      return this.date;
    }

    //# - num
    toTime () {
      return this.date.getTime();
    }

    /// Spanish format
    //# - str
    toString () {
      return str.sub("00" + this.day, -2) + "/" +
             str.sub("00" + this.month, -2) + "/" +
             str.sub("0000" + this.year, -4);
    }
    //# - Arr<*>
    serialize () {
      return [this.day, this.month, this.year];
    }
  }
  dm.DateDm = DateDm;

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

  //# Date - DateDm
  DateDm.fromDate = d =>
    new DateDm(d.getDate(), d.getMonth() + 1, d.getFullYear());

  /// [s] is in format yyyymmdd (mm in range 01-12)
  //# str - DateDm
  DateDm.fromStr = s =>
    new DateDm(+s.substring(6), +s.substring(4, 6), +s.substring(0, 4));

  /// [s] is in format dd-mm-yyyy or dd-mm-yy or dd/mm/yyyy or dd/mm/yy
  /// (mm in range 01-12)
  //# str - DateDm
  DateDm.fromEu = s => {
    let ps = s.split("/");
    if (ps.length === 1) {
      ps = s.split("-");
    }
    const y = +ps[2];
    return new DateDm(+ps[0], +ps[1], ps[2].length === 2 ? 2000 + y : y);
  };

  /// [s] is in format mm-dd-yyyy or mm-dd-yy or mm/dd/yyyy or mm/dd/yy
  /// (mm in range 01-12)
  //# str - DateDm
  DateDm.fromEn = s => {
    let ps = s.split("/");
    if (ps.length === 1) {
      ps = s.split("-");
    }
    const y = +ps[2];
    return new DateDm(+ps[1], +ps[0], ps[2].length === 2 ? 2000 + y : y);
  };

  //# num - DateDm
  DateDm.fromTime = time => DateDm.fromDate(new Date(time));

  /// Returns the date-hour actual.
  //# - DateDm
  DateDm.now = () => DateDm.fromTime(Date.now());

  //# Arr<num> - DateDm
  DateDm.restore = serial => new DateDm(serial[0], serial[1], serial[2]);

  // [y] is the complete year (e.g. 2014)
  //# num - bool
  DateDm.isLeap = y => ((y % 4 === 0) && (y % 100 !== 0)) || (y % 400 === 0);

})();
