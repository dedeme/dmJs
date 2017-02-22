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

/// Utilities for converting between bytes or unigned arrays to strings

#ifndef DM_B41_H
  #define DM_B41_H

#include "dm/Bytes.h"

/// Returns number of b41_code
int b41_b2n (char b41_code);
/// Return the b41 code which index is 'ix'
char b41_n2b (unsigned int ix);
/// Endodes a string in B41 code
char *b41_encode (char *s);
/// Dedodes a string codified in B41 code
char *b41_decode (char *b41);
/// Endodes a string in B41 code and then compresses it
char *b41_compress (char *s);
/// Dedodes a string codified in B41 code and compressed
char *b41_decompress (char *b41);
/// Encodes a bytes in B41 code
char *b41_encodeBytes (Bytes *bs);
/// Decodes a bytes codified with B41 code
Bytes *b41_decodeBytes (char *b41);

#endif
