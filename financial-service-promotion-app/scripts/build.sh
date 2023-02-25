#!/bin/bash

# Move dir
cd fincomun-app-asociado-api-backend-nodejs

# Get new develop branch version
git pull

# Build project
npm run build

# PM2 start process
pm2 restart fincomun