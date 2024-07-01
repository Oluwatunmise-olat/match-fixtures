#!/bin.bash

chmod +x "$0"

mkdir -p app 2>/dev/null

source /etc/profile
cd app 
yarn install 
npm install -g pm2
pm2 start yarn --name=$APP_NAME --restart-delay=5000 -- start
