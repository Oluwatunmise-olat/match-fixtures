#!/bin/bash

set -e
chmod +x "$0"
source /etc/profile
cd /home/ubuntu/app
yarn install
npm install -g pm2

pm2 start yarn --name="$APP_NAME" --restart-delay=5000 -- start

echo "⚡️ Application Deployed ⚡️"
