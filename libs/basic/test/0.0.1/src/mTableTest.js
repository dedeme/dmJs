//- dm/Test.js
//- dm/MTable.js
/*
 * Copyright 14-Feb-2017 ºDeme
 * GNU General Public License - V3 <http://www.gnu.org/licenses/>
 */
/*global dm */

const mTableTest = () => {
  const MTable = dm.MTable;

  const t = new dm.Test("MTable");

  t.mark("readArray");

  let tb = new MTable(["name", "age"]);
  t.eq(0, tb.readArray().size());
  t.eq(0, tb.read().size());
  tb.addArray(["Peter", 23]);
  t.eq(1, tb.readArray().size());
  t.eq(1, tb.read().size());
  t.eq("[[0,\"Peter\",23]]", JSON.stringify(tb.readArray().to()));
  t.eq("[{\"rowId\":0,\"name\":\"Peter\",\"age\":23}]",
    JSON.stringify(tb.read().to()));
  tb.add({"name" : "Clare", "age" : 25});
  tb.add({"name" : "John"});

  t.mark("getArray");

  t.eq(0, tb.getArray(0)[0]);
  t.eq("Peter", tb.getArray(0)[1]);
  t.eq(23, tb.getArray(0)[2]);
  t.eq(1, tb.getArray(1)[0]);
  t.eq("Clare", tb.getArray(1)[1]);
  t.eq(25, tb.getArray(1)[2]);
  t.eq(undefined, tb.getArray(1)[33]);
  t.eq("John", tb.getArray(2)[1]);
  t.eq(undefined, tb.getArray(2)[2]);

  t.mark("get");

  t.eq(0, tb.get(0)["rowId"]);
  t.eq("Peter", tb.get(0)["name"]);
  t.eq(23, tb.get(0)["age"]);
  t.eq(1, tb.get(1)["rowId"]);
  t.eq("Clare", tb.get(1)["name"]);
  t.eq(25, tb.get(1)["age"]);
  t.eq(undefined, tb.get(1)["ae"]);
  t.eq("John", tb.get(2)["name"]);
  t.eq(undefined, tb.get(2)["age"]);

  t.mark("modify");

  tb.modify(10, {"name" : "Frank"});
  t.eq(null, tb.get(10));

  tb.modify(0, {"name" : "Frank"});
  t.eq(0, tb.getArray(0)[0]);
  t.eq("Frank", tb.getArray(0)[1]);
  t.eq(23, tb.getArray(0)[2]);
  t.eq(1, tb.getArray(1)[0]);
  t.eq("Clare", tb.getArray(1)[1]);
  t.eq(25, tb.getArray(1)[2]);
  t.eq(2, tb.getArray(2)[0]);
  t.eq("John", tb.getArray(2)[1]);
  t.eq(undefined, tb.getArray(2)[2]);
  t.eq("Frank", tb.get(0)["name"]);
  t.eq(23, tb.get(0)["age"]);
  t.eq(1, tb.get(1)["rowId"]);
  t.eq("Clare", tb.get(1)["name"]);
  t.eq(25, tb.get(1)["age"]);
  t.eq(2, tb.get(2)["rowId"]);
  t.eq("John", tb.get(2)["name"]);
  t.eq(undefined, tb.get(2)["age"]);

  t.mark("del");

  tb.del(10);
  t.eq(0, tb.getArray(0)[0]);
  t.eq("Frank", tb.getArray(0)[1]);
  t.eq(23, tb.getArray(0)[2]);
  t.eq(1, tb.getArray(1)[0]);
  t.eq("Clare", tb.getArray(1)[1]);
  t.eq(25, tb.getArray(1)[2]);
  t.eq(2, tb.getArray(2)[0]);
  t.eq("John", tb.getArray(2)[1]);
  t.eq(undefined, tb.getArray(2)[2]);

  tb.del(0);
  t.eq(2, tb.data.length);
  t.eq(1, tb.getArray(1)[0]);
  t.eq("Clare", tb.getArray(1)[1]);
  t.eq(25, tb.getArray(1)[2]);
  t.eq(2, tb.getArray(2)[0]);
  t.eq("John", tb.getArray(2)[1]);
  t.eq(undefined, tb.getArray(2)[2]);

  t.mark("serialization");

  let tb2 = MTable.restore(tb.serialize());
  t.eq(2, tb2.data.length);
  t.eq(1, tb2.getArray(1)[0]);
  t.eq("Clare", tb2.getArray(1)[1]);
  t.eq(25, tb2.getArray(1)[2]);
  t.eq(2, tb2.getArray(2)[0]);
  t.eq("John", tb2.getArray(2)[1]);
  t.eq(undefined, tb2.getArray(2)[2]);

  let tb3 = new MTable(["client", "amount"]);
  tb3.addArray(["Peter", new dm.Dec(45.67, 3)]);
  let tb4 = MTable.restore(
    tb3.serialize(function (r) { return [r[0], r[1], r[2].serialize()]; }),
    r => [r[0], r[1], dm.Dec.restore(r[2])]
  );
  t.eq(0, tb3.getArray(0)[0]);
  t.eq("Peter", tb3.getArray(0)[1]);
  t.eq(new dm.Dec(45.67, 3).toString(), tb3.getArray(0)[2].toString());
  t.eq(0, tb4.getArray(0)[0]);
  t.eq("Peter", tb4.getArray(0)[1]);
  t.eq(new dm.Dec(45.67, 3).toString(), tb4.getArray(0)[2].toString());

  t.log();
};


