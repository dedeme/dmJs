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

Map *reader_read(char *root, Arr *files) {
  // Map<char, Arr<char>>
  Map *r = map_new();

  void read_file(char *f, char* relative) {
    int IN_CODE = 0;
    int IN_LCOMMENT = 1;
    int IN_QUOTE = 2;
    int IN_I18 = 3;

    int NONE = 0;
    int LCOMMENT = 1;
    int SCOMMENT = 2;
    int QUOTE = 3;
    int I18 = 4;

    char *tx = file_read(f);
    Arr *lines = str_csplit(tx, '\n');
    int nline = 0;
    int status = IN_CODE;

    FNX(read_line, char, l) {
      ++nline;
      while (1) {
        if (status == IN_CODE) {
          int result = NONE;

          int ix = str_index(l, "/*");
          if (ix != -1) result = LCOMMENT;

          int ix2 = str_index(l, "//");
          if (ix2 != -1 && (ix == -1 || ix2 < ix)) {
            ix = ix2;
            result = SCOMMENT;
          }

          ix2 = str_cindex(l, '"');
          if (ix2 != -1 && (ix == -1 || ix2 < ix)) {
            ix = ix2;
            result = QUOTE;
          }

          ix2 = str_index(l, "_(");
          if (ix2 != -1 && (ix == -1 || ix2 < ix)) {
            ix = ix2;
            result = I18;
          }

          if (result == LCOMMENT) {
            l = str_sub(l, ix + 2, strlen(l));
            status = IN_LCOMMENT;
            continue;
          } else if (result == SCOMMENT) {
            break;
          } else if (result == QUOTE) {
            l = str_sub(l, ix + 1, strlen(l));
            status = IN_QUOTE;
            continue;
          } else if (result == I18) {
            l = str_sub(l, ix + 2, strlen(l));
            status = IN_I18;
            continue;
          }
          break;
        } else if (status == IN_LCOMMENT) {
          int ix = str_index(l, "*/");

          if (ix == -1) break;

          l = str_sub(l, ix + 2, strlen(l));
          status = IN_CODE;
          continue;
        } else if (status == IN_QUOTE) {
          int ix = str_index(l, "\\\"");
          int ix2 = str_cindex(l, '"');

          if (ix2 == -1) {
            status = IN_CODE;
            break;
          }

          if (ix != -1 && ix < ix2) {
            l = str_sub(l, ix + 2, strlen(l));
            continue;
          }

          l = str_sub(l, ix + 1, strlen(l));
          status = IN_CODE;
          continue;
        } else if (status == IN_I18) {
          int ix = str_cindex(l, '"');
          if (ix != -1) {
            l = str_sub(l, ix + 1, strlen(l));
            ix = str_cindex(l, '"');
            if (ix != -1) {
              char *key = str_sub(l, 0, ix);
              char *v = str_printf("%s: %d", relative, nline);
              Arr *value = map_get(r, key);
              if (!value) {
                value = arr_new();
              }
              arr_add(value, v);
              map_put(r, key, value);
            }
          }
          l = str_sub(l, ix + 1, strlen(l));
          status = IN_CODE;
          continue;
        } else {
          error_generic(str_printf(
            "Unknown status %d\n", status
          ), ERROR_DATA);
        }
      }
    }_FN

    it_each(it_from(lines), read_line);
  }

  FNX(read_entries, char, f) {
    read_file(path_cat(root, f, NULL), f);
  }_FN

  it_each(it_from(files), read_entries);
  return r;
}
