/*
 * Copyright 17-Feb-2017 ºDeme
 *
 * This file is part of 'js17i18n'
 * 'js17i18n' is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License.
 *
 * 'js17i18n' is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with 'js17i18n'. If not, see <http://www.gnu.org/licenses/>.
 */

#include <dm/dm.h>

// Arr<char> - char * - Map<char, Arr<char>> -
void dic_write (Arr *dics, char* dir, Map *js_entries) {

  FNX(make_dic, char, lang) {
    // Map<char, Arr<char>>
    Map *entries = map_new();
    FNX(copy_entries, Kv, kv) {
      arr_add(entries, kv);
    }_FN
    it_each(it_from(js_entries), copy_entries);

    char *f = path_cat(dir, lang, NULL);
    // Map<char, char>
    Map *old = map_new();
    char *tx = file_read(f);
    Arr *lines = str_csplit_trim(tx, '\n');

    FNX(make_old, char, l) {
      if (*l && *l != '#') {
        int ix = str_cindex(l, '=');
        if (ix != -1) {
          char *key = str_rtrim(str_sub(l, 0, ix));
          char *value = str_ltrim(str_sub(l, ix + 1, strlen(l)));
          if (*key && *value) {
            map_put(old, key, value);
          }
        }
      }
    }_FN
    it_each(it_from(lines), make_old);

    // Map<char, char>
    Map *orphans = map_new();
    // Map<char, Tp2<char, Arr<char>>>
    Map *ok = map_new();

    FNX(make_maps, Kv, kv) {
      FNP(search, Kv, k_pos) {
        return !strcmp(kv->key, k_pos->key);
      }_FN
      Kv *entry = it_find(it_from(entries), search);

      if (entry) {
        map_put(ok, kv->key, tp2_new(kv->value, entry->value));
        map_remove(entries, kv->key);
        return;
      }
      map_put(orphans, kv->key, kv->value);
    }_FN
    it_each(it_from(old), make_maps);

    FNE(sort, Kv, e1, e2) {
      return strcmp(e1->key, e2->key);
    }_FN
    orphans = it_to(it_sort(it_from(orphans), sort));
    entries = it_to(it_sort(it_from(entries), sort));
    ok = it_to(it_sort(it_from(ok), sort));

    Buf *bf = buf_new();
    buf_add(bf, "# File generated file by js17i18n\n\n");

    if (orphans->size) {
      FNX(write, Kv, kv) {
        buf_add(bf, "# ORPHAN\n");
        buf_add(bf, str_printf("%s = %s\n\n", kv->key, kv->value));
      }_FN
      it_each(it_from(orphans), write);
    }

    FNX(write_poss, Arr, pos) {
      buf_add(bf, str_printf("# %s\n", pos));
    }_FN

    if (entries->size) {
      FNX(write, Kv, kv) {
        buf_add(bf, "# TODO\n");
        it_each(it_from(kv->value), write_poss);
        buf_add(bf, str_printf("%s =\n\n", kv->key));
      }_FN
      it_each(it_from(entries), write);
    }
    if (ok->size) {
      FNX(write, Kv, kv) {
        Tp2 *value = kv->value;
        it_each(it_from(value->o2), write_poss);
        buf_add(bf, str_printf("%s = %s\n\n", kv->key, value->o1));
      }_FN
      it_each(it_from(ok), write);
    }

    file_write(f, bf->str);
  }_FN
  it_each(it_from(dics), make_dic);

}

