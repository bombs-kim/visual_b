#! /bin/bash

if [ ! -x asts ]
then mkdir asts
fi

rm asts/*

for f in $(ls examples)
do  outpath=asts/${f%.b}.js
    # echo "ast=" > $outpath
    ./run examples/$f > $outpath;
done