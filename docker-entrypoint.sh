#!/bin/sh

npm install

npm i -g @adonisjs/cli

npm i -g pm2

npm run build

npm run migration:run -y

npm run dev

# pm2-runtime start ./build/server.js
