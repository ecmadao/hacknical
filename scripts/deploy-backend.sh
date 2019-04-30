#!/bin/sh

WEB_ROOT=`echo $HACKNICAL_ROOT`

echo " ==========  deploy backend ========== "
cd $WEB_ROOT
npm run build-app
npm run stop
npm run start
echo " ==========  backend deploy finished ========== "
