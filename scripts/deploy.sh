#!/bin/sh
REV=`git rev-parse --short HEAD | awk '{print $0}'`
CDN="https://resources.hacknical.com"
FILE="webpack-assets.json"

WEB_ROOT=`echo $HACKNICAL_ROOT`
BUCKET="hacknical/$REV"
OSSUTIL=`echo $OSSUTIL`

cd $WEB_ROOT

deploy_frontend() {
  echo " ==========  deploy frontend ========== "
  NODE_ENV=production npm run build-static

  ASSETS_DIR="$WEB_ROOT/public"
  $OSSUTIL cp $ASSETS_DIR oss://$BUCKET -r -f -u
  echo " ==========  frontend deploy finished ========== "
}

download_file() {
  echo " ==========  download file ========== "
  # download webpack.json
  JSON_URL="$CDN/$REV/assets/$FILE"
  wget $JSON_URL

  if [ ! -f "./$FILE" ]; then
    deploy_frontend
    wget $JSON_URL
  fi
  mv -f $FILE "$WEB_ROOT/app/config/"
}

(cd $WEB_ROOT && download_file)
(cd $WEB_ROOT && bash ./scripts/deploy-backend.sh)

echo " ==========  done ========== "
