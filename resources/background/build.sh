#!/usr/bin/env bash

echo Creating a 50% version...
convert background@2x.png -resize 50% background@1x.png

echo Packing your 2 backgrounds into a multitiff
tiffutil -cathidpicheck background@1x.png background@2x.png -out background.tiff

echo Copy multi-tiff to the build folder 
cp -f background.tiff ../../build/
