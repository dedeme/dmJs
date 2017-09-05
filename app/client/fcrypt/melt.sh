#!/bin/bash
DIR=$(pwd)
cd /deme/dmjs17/app/client/fcrypt/www
SCRIPT=$(cat index.js)
HTML0=$(cat indexTemplate0.html)
HTML1=$(cat indexTemplate1.html)
echo "$HTML0$SCRIPT$HTML1" > fcrypt.html
rm index2.js
cd $DIR
