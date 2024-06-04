#!/bin/bash

chmod +x "$0"

rm ./.env

docker stop $(docker ps -aqf "name=test-mongodb") &> /dev/null && docker rm $(docker ps -aqf "name=test-mongodb") &> /dev/null
docker stop $(docker ps -aqf "name=test-redis") &> /dev/null && docker rm $(docker ps -aqf "name=test-redis") &> /dev/null