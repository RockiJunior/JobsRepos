#!/bin/bash
cp -r dist deploy/.
cp package*.json deploy/.
cp -r .env deploy/.env
cp -r src/config deploy/src/config
cp sqlnet.ora deploy/sqlnet.ora
cp tnsnames.ora deploy/tnsnames.ora
cp listener.ora deploy/listener.ora
cp scripts/install.sh deploy/install.sh
cp scripts/environment.sh deploy/environment.sh
cp scripts/service.sh deploy/service.js
cp -r migrations deploy/.
#### NGINX Deploy
cp scripts/nginx_api.txt deploy/api-fincomun.conf
cp scripts/nginx_cms.txt deploy/cms-fincomun.conf
cp scripts/nginx_default.txt deploy/default.conf
cp scripts/nginx.sh deploy/nginx.sh
