#!/bin/sh
REV=`git rev-parse --short HEAD | awk '{print $0}'`
ASSETS="https://assets.hacknical.com/hacknical"
FILE="webpack-assets.json"
ROOT="/home/ecmadao/www/hacknical"

# check if file exist in local
dirpath=$(dirname $0)
filepath="$ROOT/app/config/$FILE"

cd $ROOT

deploy_frontend() {
  echo " =====  deploy frontend ===== "
  NODE_ENV=production npm run build-static && node ./scripts/deploy/deploy-cdn.js
}

download_file() {
  echo " =====  download file ===== "
  # download webpack.json
  JSON_URL="$ASSETS/$REV/assets/$FILE"
  wget $JSON_URL
  mv -f $FILE "$ROOT/app/config/"
}

download_file
if [ ! -f "./$FILE" ]; then
  deploy_frontend
  download_file
fi

echo " =====  deploy backend ===== "
# start app backend
npm run build-app
npm run restart
bash ./scripts/opbeat.sh

echo " =====  done ===== "
