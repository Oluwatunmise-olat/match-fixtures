#!/bin/bash

chmod +x "$0"

docker build --platform linux/amd64 -t match_fixtures .
docker tag match_fixtures:latest oluwatunmiseolat/match_fixtures
docker login
docker push oluwatunmiseolat/match_fixtures
