#! /bin/bash
#push to github

git add -A 
git commit -m "maj"
git push origin master

if [ -n "$1" ]
then
    if [ $1 = "archive" ]
    then
        rm -rf public/build
        npm run build
    fi
fi