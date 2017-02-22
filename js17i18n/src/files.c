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

Arr *files_list (char *root) {
  Arr *r = arr_new();
  char *src = path_cat(root, "src", NULL);
  int root_len = strlen(root) + 1;

  void read(char *relative) {
    FNX(anotate, char, f) {
      if (file_is_directory(f)) {
        if (*relative) read(path_cat(relative, path_name(f), NULL));
        else read(path_name(f));
      } else if (str_ends(f, ".js")) {
        arr_add(r, str_sub(f, root_len, strlen(f)));
      }
    }_FN

    char *dir;
    if (*relative) dir = path_cat(src, relative, NULL);
    else dir = src;

    Arr* fs = file_dir(dir);
    it_each(it_from(fs), anotate);
  }

  read("");

  return r;
}
