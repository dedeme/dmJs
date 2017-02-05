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

/// Generator of random numbers

#ifndef DM_RND_H
  #define DM_RND_H

#include "Arr.h"
#include "It.h"

/// Intializates the random number generator.
void rnd_init (void);

/// Generates a new double between 0.0 (inclusive) and 1.0 (exclusive)
double rnd_d (void);

/// Generates a new int between 0 (inclusive) and 'top' (exclusive)
int rnd_i (int top);

/// Returns an 'It' that iterates over 'a' elements randomly. When it finishes
/// with every element of 'a', restarts again.
It *rnd_box (Arr *a);

#endif
