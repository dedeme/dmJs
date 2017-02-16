//- dm/dm.js
//- dm/It.js
/*
 * Copyright 14-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global dm */

(() => {
  const It = dm.It;

  class MTable {
    /**
     * <p>Little memory table.</p>
     * <p>This table consists in rows of strings. Authomaticaly MTable supplies
     *  a id field called "rowId" which can be accessed with the index 0. The
     * "rowId" field must no be modified by hand.</p>
     *   fieldNames: They can be accessed by its order number, having the first
     *               field the number 1. The field 0 matchs with the id number,
     *               which can be accessed by the name "rowId" too. Therefore,
     *               you can not use "rowId" as name for another field.
     */
    //# Arr<str> - MTable
    constructor (fieldNames) {
      //# Arr<str>
      this.fieldNames = fieldNames;

      //# Arr<Arr<*>>
      this.data = [];

      /// New valor for rowId. Modified automatically.
      //- num
      this.nextId = 0;
    }

    /// Returns MTable row number
    //# - num
    size () {
      return this.data.length;
    }

    /**
     * Adds a row to MTable.
     *   row: A row of values that must mach with fields. It does not include
     *        the field "rowId" which is generated automatically.
     */
    //# Arr<*> -
    addArray (row) {
      if (row.length !== this.fieldNames.length) {
        throw ("Field number is not coincident");
      }
      row.unshift(this.nextId++);
      this.data.push(row);
    }

    /**
     * Adds a row to MTable.
     *   row: A row of values that must mach with fields. It does not include
     *        the field "rowId" which is generated automaticaly. Fields not
     *        intialized will have value null.
     */
    //# Obj<str, *> -
    add (row) {
      let r = [];
      It.from(this.fieldNames).eachIx((e, ix) => {
        r[ix] = row[e];
      });
      this.addArray(r);
    }

    /// Returns an It with all values of MTable. "rowId" is in field 0.
    //# - It<Arr<*>>
    readArray () {
      return It.from(this.data);
    }

    /// Returns an It with all values with fieldNames plus "rowId"
    //# - It<Obj<str, *>>
    read () {
      const self = this;
      return this.readArray().map(row => {
        let m = {};
        m["rowId"] = row[0];
        It.range(self.fieldNames.length).each(ix => {
          m[self.fieldNames[ix]] = row[ix + 1];
        });
        return m;
      });
    }

    /// Returns the index of record with the identifier 'row' or -1
    //# num - num
    index (row) {
      return It.from(this.data).indexf(e => e[0] === row);
    }

    /// Returns the row with identifier "row", or null if "row" does not exist.
    /// <p>Modifying that row data base is also modified.
    //# num - Arr<?>
    getArray (row) {
      const rs = this.readArray().find(r => r[0] === row);
      return rs.length === 0 ? null : rs[0];
    }

    /// Returns a copy of the row with identifier "row" or null if "row" does
    /// not exist.
    //# num - Obj<?>
    get (row) {
      const self = this;
      const rs = this.readArray().find(r => r[0] === row);
      if (rs.length === 0) return null;
      let m = {};
      m["rowId"] = row;
      It.range(this.fieldNames.length).each(ix => {
        m[self.fieldNames[ix]] = rs[0][ix + 1];
      });
      return m;
    }

    /// Deletes a row with identifier row
    //# num -
    del (row) {
      const ix = this.index(row);
      if (ix !== -1) this.data.splice(ix, 1);
    }

    /// Modify a row.
    ///   rowId: Row to modify
    ///   row  : Complete row without "rowId"
    //# num - Arr<*> -
    modifyArray (rowId, row) {
      const ix = this.index(rowId);
      if (ix !== -1) this.data[ix] = row;
    }

    /// Modify a row.
    ///   rowId: Row to modify
    ///   row  : Map with fields to modify
    //# num - !Obj<str, ?> -
    modify (rowId, row) {
      const ix = this.index(rowId);
      if (ix === -1) return;
      const mrow = this.data[ix];
      It.from(this.fieldNames).eachIx((e, i) => {
        const v = row[e];
        if (v !== undefined) mrow[i + 1] = v;
      });
    }

    /**
     * Returns a field value.
     *   rowId: Row to read
     *   field: Field to read
     */
    //# num - str - *
    getField (rowId, field) {
      return this.get(rowId)[field];
    }

    /**
     * Sets a field value.
     *   rowId: Row to read
     *   field: Field to read
     */
    //# num - str - ? -
    setField (rowId, field, value) {
      const rc = {};
      rc[field] = value;
      this.modify(rowId, rc);
    }

    /// Serializes a MTable
    ///   rowSer: Optional. Convert to "Jsonizable" row, including "rowId".
    ///           Usually it will be necessary to make a copy of row.
    ///           If is 'undefined' this.data is returned.
    //# ?(Arr<*>) - Arr<*>) - Arr<*>
    serialize (rowSer) {
      return [
        this.nextId,
        this.fieldNames,
        rowSer === undefined
          ? this.data
          : It.from(this.data).map(row => rowSer(row)).to()
      ];
    }
  }
  dm.MTable = MTable;

  /// Restores a MTable.
  ///   serial: Array created with serialize
  ///   rowSer: Optional. It is the inverse to "rowSer" of serialize()
  //# Arr<*> - ?(Arr<*> - Arr<*>) - MTable
  MTable.restore = (serial, rowSer) => {
    const r = new MTable(serial[1]);
    r.nextId = serial[0];
    r.data = rowSer === undefined
      ? serial[2]
      : It.from(serial[2]).map(row => rowSer(row)).to();
    return r;
  };

})();


