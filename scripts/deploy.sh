#!/bin/sh
REV=`git rev-parse --short HEAD | awk '{print $0}'`
CDN="https://resources.hacknical.com"
FILE="webpack-assets.json"
HOME="/home/ecmadao"

WEB_ROOT="$HOME/www/hacknical"
BUCKET="hacknical/$REV"
OSSUTIL="$HOME/ossutil64"

cd $WEB_ROOT

deploy_frontend() {
  echo " =====  deploy frontend ===== "
  NODE_ENV=production npm run build-static

  ASSETS_DIR="$WEB_ROOT/public"
  $OSSUTIL cp $ASSETS_DIR oss://$BUCKET -r -f -u
}

download_file() {
  echo " =====  download file ===== "
  # download webpack.json
  JSON_URL="$CDN/$REV/assets/$FILE"
  wget $JSON_URL

  if [ ! -f "./$FILE" ]; then
    deploy_frontend
    wget $JSON_URL
  fi
  mv -f $FILE "$WEB_ROOT/app/config/"
}

download_file

echo " =====  deploy backend ===== "
npm run build-app
npm run stop
npm run start

echo " =====  done ===== "
