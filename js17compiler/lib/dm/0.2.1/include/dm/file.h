/*
 *Copyright 24-Jul-2015 ºDeme
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

/// Utilities for managing files

#ifndef DM_FILE_H
# define DM_FILE_H

#include "Arr.h"

///
#define LckFile Tp2

/**
Makes a directory with 0755 permissions.<br>
If parent directory does not exist it creates it.<br>
If 'path' already exists it does nothing.<br>
If everything go well it returns 1, elsewere it returns '0'. Error can be
accessed by 'errno'.
*/
int file_mkdir (char *path);

/**
Returns Arr[char *] with paths of files and directories existing in 'path'<br>
Values '.' and '..' are not in the return.<br>
If 'path' can not be read, it returns NULL.
*/

Arr *file_dir (char *path);

/**
Deletes file or directory named 'path' although it is a directory not empty.
  If 'path' does not exists it does nothing.
  If there is no fail returns 0.
*/
int file_del (char *path);

/**
Returns 1 if 'path' exists in the file system, -1 if an error happened
and 0 otherwise.
*/
int file_exists (char *path);

/**
Returns 1 if file is a directory
*/
int file_is_directory (char *path);

/**
Reads data from 'path', including ends of line.<br>
If there is some fail it restuns NULL<br>
This function opens, reads and closes file.
*/
char *file_read (char *path);

/**
Writes 'data' on 'path'.<br>
If there is some fail it returns 1. Otherwise it returns 0.<br>
This function opens, writes and closes file.
*/
int file_write (char *path, char *text);

/**
Appens 'data' on 'path'.<br>
If there is some fail it returns 1. Otherwise it returns 0.<br>
This function opens, writes and closes file.
*/
int file_append (char *path, char *text);

/// Binary copy source to target
void file_copy (char *source_path, char *target_path);

/// Open a file to use with file_to_it or file_to_it_bin.
LckFile *file_open_it (char *path);

/// Closes a file open with file_open_it
void file_close_it (LckFile *file);

/**
Reads a text file.<br>
Iterator opens, reads and closes file.<br>
It does not delete ends of line.
If there is a error, returns NULL.
*/
It *file_to_it (LckFile *file);

/**
Writes a text file from a It[char *].<br>
It does not add ends of line.<br>
If an error returns 1.
*/
int file_from_it (char *path, It *it);

/**
Reads a binary file.<br>
Iterator opens, reads and closes file.<br>
It does not delete ends of line.
If there is a error, returns NULL.
*/
It *file_to_it_bin (LckFile *file);

/**
Writes a binary file from a It[char *].<br>
It does not add ends of line.<br>
If an error returns 1.
*/
int file_from_it_bin (char *path, It *it);

#endif
