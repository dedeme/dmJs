INCL_LIB1 = lib/dm/0.2.1/include
PATH_LIB1 = lib/dm/0.2.1/lib
LIB1 = dm

CFLAGS = -Wall
C_CODE = $(wildcard src/*.c)
H_CODE = $(wildcard src/*.h)
CODE = $(C_CODE) $(H_CODE)

bin/js17compiler : $(CODE) $(PATH_LIB1)/lib$(LIB1).a
	gcc $(CFLAGS) $(CODE) -o bin/js17compiler -I$(INCL_LIB1) \
	 -L$(PATH_LIB1) -l$(LIB1) -lgc

