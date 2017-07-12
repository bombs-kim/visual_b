#! /bin/bash

if [ ! -x asts ]
then mkdir asts
fi

for f in $(ls examples)
do  outpath=asts/${f%.b}.js
    # echo "ast=" > $outpath
    ./run examples/$f | tail -n +2 > $outpath;
done