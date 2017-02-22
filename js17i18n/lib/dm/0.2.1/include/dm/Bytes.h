/*
 *Copyright 25-Aug-2015 ºDeme
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

/// Bytes structure

#ifndef DM_BYTES_H
  #define DM_BYTES_H

#include <stddef.h>

/**
Structure for working with bytes. Example:
  Bytes *bs = bytes_new();
  const unsigned char bss[] = {0, 23, 116, 225};
  bytes_add_bytes(bs, bss, 4);
  char b41 = b41_encodeBytes(bs);

  assert(!strcmp("RRoixx", b41));
*/
typedef struct {
  unsigned char *bs; // R
  size_t length;     // R
} Bytes;

///
Bytes *bytes_new(void);

/// Returns a new allocated 'Bytes' whitch is copy of 'bs'
Bytes *bytes_from_bytes (unsigned char *bs, size_t length);

/// Returns a 'Bytes' whitch is copy of 's' without the ending zero.
Bytes *bytes_from_str (char *s);

/// Adds to 'this' a new copy of 'bs'
void bytes_add_bytes (Bytes *this, unsigned char *bs, size_t length);

/// Adds to 'this' a new copy of 'another'
void bytes_add (Bytes *this, Bytes *another);

/// Adds to 'this' a copy of 's' without the ending zero
void bytes_add_str (Bytes *this, char *s);

#endif
