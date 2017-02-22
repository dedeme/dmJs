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

extern Arr *files_list(char *root);
extern Map *reader_read(char *root, Arr *files);
extern void dic_write (Arr *dics, char* dir, Map *entries);
extern void i18n_write (Arr *dics, char* i18n, char *src);

Arr *dictionaries () {
  Arr *r = arr_new();
  arr_add(r, "en");
  arr_add(r, "es");
  return r;
}

void help () {
  puts("\nUse:\n"
    "js17i18n path_to_js-project\n"
    "For example:\n"
    "  js17i18n /home/john/my_project\n"
  );
}

int main (int argc, char **argv) {
  if (argc != 2) {
    help();
    return 0;
  }

  char *root = argv[1];
  char *src = path_cat(root, "src", NULL);
  char *i18n = path_cat(root, "i18n", NULL);

  if (!file_is_directory(src)) {
    printf("'src' is missing in '%s'", root);
    help();
    return 0;
  }

  if (!file_is_directory(i18n)) {
    file_mkdir(i18n);
    file_write(path_cat(i18n, "en", NULL), "\n");
    file_write(path_cat(i18n, "es", NULL), "\n");
  }

  // Arr<str>
  Arr *flist = files_list(root);
  // Map<str, Arr<str>>
  Map *entries = reader_read(root, flist);
  dic_write(dictionaries(), i18n, entries);

  i18n_write(dictionaries(), i18n, src);

  return 0;
}

