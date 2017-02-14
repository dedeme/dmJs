/*
 * Copyright 05-Feb-2017 ºDeme
 *
 * This file is part of 'js17compiler'
 * 'js17compiler' is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License.
 *
 * 'js17compiler' is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with 'js17compiler'. If not, see <http://www.gnu.org/licenses/>.
 */

#include <dm/dm.h>
#include <fcntl.h>

void help () {
  puts("\nUse:\n"
    "js17compiler path_to_js-project\n"
    "For example:\n"
    "  js17compiler /home/john/my_project\n"
  );
}

Arr *readRoots (It *f) {
  Arr *r = arr_new();
  while (it_has_next(f)) {
    char *l = str_trim(it_next(f));
    if (*l) {
      if (*l == '-') {
        return r;
      }
      if (!file_is_directory(l)) {
        error_generic(str_printf("Directory '%s' not found", l),ERROR_DATA);
      }
      arr_add(r, l);
    }
  }
  error_generic("Firs '-' is missing", ERROR_DATA);
  return r;
}

char *readSource (It *f, char *base) {
  while (it_has_next(f)) {
    char *l = str_trim(it_next(f));
    if (!*l) {
      continue;
    }
    l = str_printf("%s/%s", base, l);
    if (!file_exists(l)) {
      error_generic(str_printf("File '%s' not found", l),ERROR_DATA);
      return "";
    }
    if (file_is_directory(l)) {
      error_generic(str_printf("'%s' is a directory", l),ERROR_DATA);
      return "";
    }
    return l;
  }
  error_generic("Source is missing", ERROR_DATA);
  return "";
}

char *readTarget (It *f, char *base) {
  while (it_has_next(f)) {
    char *l = str_trim(it_next(f));
    if (!*l) {
      continue;
    }
    l = str_printf("%s/%s", base, l);

    if (file_write(l, "")) {
      error_generic(str_printf("File '%s' can not be written", l),ERROR_DATA);
      return "";
    }

    return l;
  }
  error_generic("Target is missing", ERROR_DATA);
  return "";
}

void readEnd (It *f) {
  while (it_has_next(f)) {
    char *l = str_trim(it_next(f));
    if (!*l) {
      continue;
    }
    error_generic(str_printf("Extra line: '%s'", l),ERROR_DATA);
  }
}

void append (Arr *roots, Arr *sourcesAdded, char *source, FILE *target) {
  int START = 0;
  int CODE = START + 1;
  int COMMENT = CODE + 1;
  int DQUOTE = COMMENT + 1;
  int SQUOTE = DQUOTE + 1;
  int BQUOTE = SQUOTE + 1;

  int rstart (char *l) {
    FNM(findFile, char, s) {
      char *r = "";
      FNX(find, char, root) {
        if (*r) {
          return;
        }
        char *f = str_printf("%s/%s", root, s);
        if (file_exists(f) && !file_is_directory(f)) {
          r = f;
        }
      }_FN

      it_each(it_from(roots), find);

      if (!*r) {
        error_generic(str_printf("Js file '%s' not found", l),ERROR_DATA);
      }
      return r;
    }_FN

    FNP(filter, char, s) {
      return !it_contains_str(it_from(sourcesAdded), s);
    }_FN
    FNX(importAppend, char, f) {
      arr_add(sourcesAdded, f);
      append (roots, sourcesAdded, f, target);
    }_FN

    if (str_starts(l, "//-")) {
      l = str_trim(str_sub(l, 3, strlen(l)));
      Arr *files = str_csplit_trim(l, ';');
      it_each(
        it_filter(
          it_map(
            it_from(files),
            findFile),
          filter),
        importAppend
      );
      return START;
    }
    return CODE;
  }

  char *buf = "";
  void wcode (char *l) {
    buf = str_printf("%s%s", buf, l);

    if (*buf && buf[strlen(buf) - 1] != '\n') {
      return;
    }
    if (!strcmp(buf, "\n")) {
      buf = "";
      return;
    }
    int error;
    error = fputs(buf, target);
    if (error == EOF || error < 0) {
      error_generic(
        str_printf("File '%s' can not be written", target),ERROR_DATA);
    }
    buf = "";
  }

  LckFile *lck = file_open_it(source);
  It *fit = file_to_it(lck);

  int status = START;
  while (it_has_next(fit)) {
    char *l = str_trim(it_next(fit));
    if (!*l) {
      continue;
    }
    while (1) {
      if (status == START) {
        status = rstart (l);
        if (status == START) {
          break;
        }
      } else if (status == CODE) {
        char ch = ' ';
        int ix = str_cindex(l, '"');
        if (ix > -1) {
          ch = '"';
        }
        int ix1 = str_cindex(l, '\'');
        if (ix1 > -1) {
          if (ix == -1 || ix1 < ix) {
            ix = ix1;
            ch = '\'';
          }
        }
        ix1 = str_cindex(l, '`');
        if (ix1 > -1) {
          if (ix == -1 || ix1 < ix) {
            ix = ix1;
            ch = '`';
          }
        }
        ix1 = str_index(l, "//");
        if (ix1 > -1) {
          if (ix == -1 || ix1 < ix) {
            ix = ix1;
            ch = '/';
          }
        }
        ix1 = str_index(l, "/*");
        if (ix1 > -1) {
          if (ix == -1 || ix1 < ix) {
            ix = ix1;
            ch = '*';
          }
        }

        if (ix == -1) {
          wcode(str_printf("%s\n", l));
          break;
        } else {
          char *l0 = str_sub(l, 0, ix);
          l = str_sub(l, ix + 1, strlen(l));
          if (ch == '"') {
            wcode(str_printf("%s\"", l0));
            status = DQUOTE;
          } else if (ch == '\'') {
            wcode(str_printf("%s'", l0));
            status = SQUOTE;
          } else if (ch == '`') {
            wcode(str_printf("%s`", l0));
            status = BQUOTE;
          } else if (ch == '/') {
            wcode(str_printf("%s\n", l0));
            status = CODE;
            break;
          } else if (ch == '*') {
            wcode(l0);
            status = COMMENT;
          }
        }

      } else if (status == COMMENT){
        int ix = str_index(l, "*/");
        if (ix == -1) {
          break;
        } else {
          l = str_sub(l, ix + 2, strlen(l));
          status = CODE;
        }

      } else if (status == DQUOTE){
        int ix = str_cindex(l, '"');
        if (ix == -1) {
          wcode(str_printf("%s\n", l));
          status = CODE;
          break;
        }
        int ix1 = str_index(l, "\\\"");
        if (ix1 == -1 || ix < ix1) {
          char *l0 = str_sub(l, 0, ix);
          l = str_sub(l, ix + 1, strlen(l));
          wcode(str_printf("%s\"", l0));
          status = CODE;
        } else {
          char *l0 = str_sub(l, 0, ix1);
          l = str_sub(l, ix1 + 2, strlen(l));
          wcode(str_printf("%s\\\"", l0));
        }
      } else if (status == SQUOTE){
        int ix = str_cindex(l, '\'');
        if (ix == -1) {
          wcode(str_printf("%s\n", l));
          status = CODE;
          break;
        }
        int ix1 = str_index(l, "\\'");
        if (ix1 == -1 || ix < ix1) {
          char *l0 = str_sub(l, 0, ix);
          l = str_sub(l, ix + 1, strlen(l));
          wcode(str_printf("%s'", l0));
          status = CODE;
        } else {
          char *l0 = str_sub(l, 0, ix1);
          l = str_sub(l, ix1 + 2, strlen(l));
          wcode(str_printf("%s\\'", l0));
        }
      } else if (status == BQUOTE){
        int ix = str_cindex(l, '`');
        if (ix == -1) {
          wcode(str_printf("%s\n", l));
          status = CODE;
          break;
        }
        int ix1 = str_index(l, "\\`");
        if (ix1 == -1 || ix < ix1) {
          char *l0 = str_sub(l, 0, ix);
          l = str_sub(l, ix + 1, strlen(l));
          wcode(str_printf("%s`", l0));
          status = CODE;
        } else {
          char *l0 = str_sub(l, 0, ix1);
          l = str_sub(l, ix1 + 2, strlen(l));
          wcode(str_printf("%s\\`", l0));
        }
      }
    }

  }
  wcode("\n");
  file_close_it(lck);
}

int main (int argc, char **argv) {
  if (argc != 2) {
    help();
    return 0;
  }

  char *base = argv[1];

  char *fconf = str_printf("%s/js-project.txt", base);
//  puts(fconf);

  LckFile *lck = file_open_it(fconf);
  It *fit = file_to_it(lck);

  Arr *roots = readRoots(fit);
  arr_add(roots, str_printf("%s/src", base));
//  printf("%s\n", (char *)roots->os[1]);

  while (it_has_next(fit)) {
    char *l = str_trim(it_next(fit));
    if (!*l) {
      continue;
    }

    FNM(scopy, char, o) {
      return str_copy(o);
    }_FN
    Arr *roots2 = it_to(it_map(it_from(roots), scopy));

    Arr *s_t = str_split_trim(l, "->");
    if (s_t->size != 2) {
      error_generic(str_printf("'->' is missing in '%s'", l),ERROR_DATA);
    }

    char *source  = str_printf("%s/%s", base, s_t->os[0]);
//  puts(source);
    if (!file_exists(source)) {
      error_generic(str_printf("File '%s' not found", source),ERROR_DATA);
    }
    if (file_is_directory(source)) {
      error_generic(str_printf("'%s' is a directory", source),ERROR_DATA);
    }

    char *target = str_printf("%s/%s", base, s_t->os[1]);
//  puts(target);
    if (file_write(target, "")) {
      error_generic(
        str_printf("File '%s' can not be written", target),ERROR_DATA);
    }

    Arr *sourcesAdded = arr_new();

    FILE *ftarget;
    struct flock flck = {
      .l_whence = SEEK_SET,
      .l_start = 0,
      .l_len = 0,
    };

    ftarget = fopen(target, "a");
    if (!ftarget) {
      return -1;
    }

    flck.l_type = F_WRLCK;
    fcntl (fileno(ftarget), F_SETLKW, &flck);

    arr_add(sourcesAdded, source);
    append (roots2, sourcesAdded, source, ftarget);

    flck.l_type = F_UNLCK;
    fcntl (fileno(ftarget), F_SETLK, &lck);

    fclose(ftarget);
  }

  file_close_it(lck);

  puts ("Compilation successfully finished");
  return 0;
}

