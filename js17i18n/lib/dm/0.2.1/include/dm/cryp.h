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

/// Cryptographic utilities

#ifndef DM_CRYP_H
  #define DM_CRYP_H

/// Encodes a string to B41
char *cryp_s2b (char *s);

/// Decodes a string codified with cryp_s2b(void)
char *cryp_b2s (char *b41);

/// Generates a B41 random key of a length 'lg'
char *cryp_genK (int lg);

/**
Returns 'k' codified in irreversible way, using 'lg' B41 digits.
  k   : String to codify
  lg  : Length of result
*/
char *cryp_key (char *k, int lg);

/**
Encodes 's' with key 'k'.
  k   : Key for encoding
  s   : Message to encode
*/
char *cryp_cryp (char *k, char *s);

/**
Decodes 'b41' using key 'k'. 'b41' was codified with cryp()
  k   : Key for decoding
  b41 : Text codified with cryp()
*/
char *cryp_decryp (char *k, char *b41);

/**
Encodes automatically 's' with a random key of 'nk' digits.
  nK  : Number of digits for random key (1 to 40 both inclusive)
  s   : Text for enconding
*/
char *cryp_auto_cryp (int nK, char *s);

/**
Decodes a text codified with autoCryp()
  b41 : Codified text
*/
char *cryp_auto_decryp (char *b41);

/**
Encodes 's' whith key 'k' and an autoKey of length 'nK'
  k   : Key for encoding
  mK  : Digits to generate autoKey (1 to 40 both inclusive)
  s   : Message to encode
*/
char *cryp_encode (char *k, int nK, char *s);

/**
Decodes a string codified with encode()
  k   : Key for encoding
  b41 : Message encoded with encode()
*/
char *cryp_decode (char *k, char *b41);

#endif

