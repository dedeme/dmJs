/*
 *Copyright 30-Aug-2015 ºDeme
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

/// Decimal number and numeric utilities

#ifndef DM_DEC_H
# define DM_DEC_H

#include <stddef.h>

///
typedef struct {
  double n;      // R
  size_t scale;  // R
} Dec;

/// Maximum scale is 10
Dec *dec_new (double n, size_t scale);

///
char *dec_to_str (Dec *this);

/// Returns an error gap of +- 0.000001
int dec_eq (double d1, double d2);

/// Returns an error margin of +- gap
int dec_eq_gap (double d1, double d2, double gap);

/// Returns true if all characters of 's' are digits. ("" returns '1')
int dec_digits (char *s);

/// Returns a number without thousand separators and with decimal point.
char *dec_regularize_iso (char *s);

/// Returns a number without thousand separators and with decimal point.
char *dec_regularize_us (char *s);

/// Retursn '1' if "s" is a regularized number. ("" returns '1', "xxx.", "." or
/// ".xxx" also returns '1'.)
int dec_number (char *s);



#endif

