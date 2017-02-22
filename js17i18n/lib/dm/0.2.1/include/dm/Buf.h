/*
 *Copyright 24-Aug-2015 ºDeme
 *
 *This file is part of 'dm'
 *'dm' is free software: you can redistribute it and/or modify
 *it under the terms of the GNU General Public License as published by
 *the Free Software Foundation, either version 3 of the License.
 *
 *'dm' is distributed in the hope that it will be useful,
 *but WITHOUT ANY WARRANTY; without even the implied warranty of
 *MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *GNU General Public License for more details.
 *
 *You should have received a copy of the GNU General Public License
 *along with 'dm'.  If not, see <http://www.gnu.org/licenses/>.
 */

///String constructor structure

#ifndef DM_BUF_H
  #define DM_BUF_H

#include <stddef.h>

/**
Struct for making strings. Example:
  const char *s1 = "01abc";
  Buf *bf = buf_new();
  buf_add(bf, s1);
  assert(!strcmp(bf->str, "01abc"));
*/
typedef struct {
    char *str;     // R
    size_t length; // R Length of string in str.
    size_t _size;  // - Buffer size
} Buf;


/// Initializes a 'buf' with size 150 and length 0
Buf *buf_new (void);

/**
Adds 'length bytes of 'data' to 'buf'.<br>
'length' must be less or equals to 'strlen(data)'.<br>
It is not necessary that 'data' be a null-terminated string, but it must
no have characters \0
*/
void buf_add_buf (Buf *this, const char *data, size_t length);

/// Adds 'data' to 'buf'.
void buf_add (Buf *this, const char *data);

/// Adds a character
void buf_cadd (Buf *this, char data);

#endif
