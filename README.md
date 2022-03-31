# RockyStone ERP - William
*status*: under development...  
*latest update: 3/2/2022*  

author: Yuqing (William) Qiao  
description: MERN stack project

## What is this project for?
---
This project has access to the mongo database of the warehouse and the Amazon Seller Central via Selling Partner API. Make it easier for small to medium company to maintain track and manage assets. 


## Pre-requested config file( not provided ):
1. ***server/config/default.json*** which contains **Mongo URI**, **Amazon Credentials**, and **jwtSecrete** for auth. Sample:

        {
                "mongoURI": <YOUR_MONGO_URI>,
                "jwtSecret": <YOUR_JWT_SECRET>,
                "amazonCredentials": {
                        "SELLING_PARTNER_APP_CLIENT_ID": <YOUR_CREDENTIAL>,
                        "AWS_ACCESS_KEY_ID": <YOUR_CREDENTIAL>,
                        "AWS_SECRET_ACCESS_KEY": <YOUR_CREDENTIAL>,
                        "AWS_SELLING_PARTNER_ROLE": <YOUR_CREDENTIAL>
                },
                "amazonIAMRole": {
                        "ROLE_ARN": <YOUR_CREDENTIAL>,
                        "REFRESH_TOKEN": <YOUR_TOKEN>
                }
        }

2. ***server/config/wmsConfig.js*** which contains **wms**, **ssh keys**, and **config info** for ssh connection. Sample:

        module.exports = {
                agent: process.env.SSH_AUTH_SOCK,
                username: <IF_ANY>,
                password: <IF_ANY>,
                host: <HOST PUBLIC IP ADDRESS OR PIVATE IP ADDRESS>,
                port: <DEFAULT PORT:22>,
                dstPort: <DEFAULT PORT:27017>,
                privateKey:require(fs).readFileSync('/path/to/key'),
                passphrase:''
                localPort: process.env.PORT || <YOUR_PORT>,
                keepAlive: true
        }
*tips: you probably need to set up **port forwarding** or configure remote access for MongoDB.*  

**generate RSA ssh keys**:
- command: ssh-keygen
- save the public key

## To build

>1. ~~download & save lastest *chromedriver.exe* to: ***server/script_packages/mypackage/***~~
(`no longer needed, already switched to puppeteer.`)  
>2. `npm run server-install` & `npm run client-install` to install required dependency
>3. `npm run dev`


## Deploy to Heroku:

>1. set Config Vars:  
> CHROMEDRIVER_PATH:/app/.chromedriver/bin/chromedriver  
> GOOGLE_CHROME_BIN
> /app/.apt/usr/bin/google-chrome
>
>2. set buildpack:
>
> - https://github.com/heroku/heroku-buildpack-google-chrome
> - https://github.com/heroku/heroku-buildpack-chromedriver
> - nodejs
> - python
>
>3. follow heroku deployment process...
>

## Deploy to AWS EC2:
- scp -i MY_AWS_RSA_KEY.pem ubuntu@DNS.compute-1.amazonaws.com
- sudo apt-get install (nodejs, nginx, pm2)
- scp -i PATH\rockystone.pem -r <PATH>\mern-project\build\* ubuntu@DNS.compute-1.amazonaws.com:~/client/deploy
- scp -i PATH\rockystone.pem -r ./server\* ubuntu@DNS.compute-1.amazonaws.com:~/server/server

After installed nginx, edit below files.

**/etc/nginx/nginx.conf:**

        user ubuntu;
        worker_processes  1;

        error_log  /var/log/nginx/error.log warn;
        pid        /var/run/nginx.pid;

        events {
        worker_connections  1024;
        }

        http {
        include       /etc/nginx/mime.types;
        default_type  application/octet-stream;

        log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                        '$status $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" "$http_x_forwarded_for"';

        access_log  /var/log/nginx/access.log  main;

        sendfile        on;
        #tcp_nopush     on;

        client_body_buffer_size 100k;
        client_header_buffer_size 1k;
        client_max_body_size 100k;
        large_client_header_buffers 2 1k;
        client_body_timeout 10;
        client_header_timeout 10;
        keepalive_timeout 5 5;
        send_timeout 10;
        server_tokens off;
        #gzip  on; on;

        include /etc/nginx/conf.d/*.conf;
        }

**/etc/nginx/conf.d/default:**

        server {
                #listen       80;
                listen 80 default_server;
                listen [::]:80 default_server;
                server_name  yourdomain.com;

                access_log /home/ubuntu/client/server_logs/host.access.log main;

                location / {
                        root   /home/ubuntu/client/deploy;
                        index  index.html index.htm;
                        try_files $uri /index.html;
                        add_header X-Frame-Options SAMEORIGIN;
                        add_header X-Content-Type-Options nosniff;
                        add_header X-XSS-Protection "1; mode=block";
                        add_header Strict-Transport-Security "max-age=31536000; includeSubdomains;";
                }

                error_page   500 502 503 504  /50x.html;
                location = /50x.html {
                        root   /usr/share/nginx/html;
                }

                #server_tokens off;
                # node api reverse proxy
                location /api/ {
                        proxy_pass http://localhost:5000;
                }

                #socket.io proxy settings
                location /socket.io/ {
                        proxy_http_version 1.1;
                        proxy_set_header Upgrade $http_upgrade;
                        proxy_set_header Connection "Upgrade";
                        proxy_set_header Host $host;
                        proxy_hide_header 'Access-Control-Allow-Origin';
                        proxy_pass http://localhost:5000;
                }

                location ~ /\.ht {
                        deny  all;
                }

        }

**To use Puppeteer on EC2**
- sudo npm install -g puppeteer --unsafe-perm=true -allow-root && sudo apt install chromium-browser -y

- sudo apt update && sudo apt install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

## Common issues：
>1. Unable to git push to repository using **SourceTree** because of git auth token expired? Solve:  
>
>       Reset and regenerate git tokens. Edit project files: ***/.git/config/origin***.  
>       Replace the token part of url with regenerated tokens from github developer setting.

        ...
        [remote "origin"]
	        url = https://<username>:<NEW_TOKEN>@github.com/./.*.git
	        fetch = +refs/heads/*:refs/remotes/origin/*
	        pushurl = https://<username>:<NEW_TOKEN>@github.com/.*/.*.git
        ...


# GUIDE
## Client - front end

**src->component->auth:**  
Components that need authentication, are added to ***AuthenticatedRoutes.js***

        import { lazy } from 'react';

        const routes = [
                {
                        path: 'app/bestbuy-list',
                        component: lazy(() => import('component/SourceStore/StoreBB')),
                        exact: true
                }
                        ...
        ]
        export default routes



## Connect Redux
Redux store maintains a global state that all components can access via ***Connect***

>**mern-project->src->component->reducers->actions:**
> - ...Redux actions
> - axios make Promise based http request from client browser to express router endpoints(URIs) in server.
> - proxy http request made in client which change ip address to server ip address. ***package.json***  

>**mern-project->src->component->reducers:**  
>...Redux reducers
>
>***store.js & index.js***:  
> - wrap App.js with Redux Provider in index.js, to connect the redux store and App.js.
>make redux store persist that all browsers will sync the store and update when changes happened.


## Server - back end
>**server-> amazonSP:**
> - node cron schedule selling partner tasks here.
>
> - Implemented **Leaky Bucket Rate Limiter** to prevent reaching the threshold.
>
>**server-> models**:
> - All the mongoose schema...
>
>**server-> routes->api:**
> - the endpoints respond to the proxy request made from client browsers.

**Script packages**

Save Item in database procedure
>1. $setOnInsert item.
>2. check if db has documet and price changed.
>3. push to price_timestamps array field

**EsModule vs CommonJs**
        
        import ...from...  
        const {...} = require('.../')

## Software Architecture that can be improved in future
-  Migrate the authentication & authorization implementation from a legacy improvised mechanism to standard OAuth 2.0 protocol, securing data access management for users, third party business partners and REST calls between services.
- Migrate the nodejs to Java(Jersey based backend services)
- docker cluster
- PID control algorithm based smart bidding strategy

## New knowledge today 03/01/22:

- elastic search (AWS OpenSearch derived from elasticsearch)
- Ngram search
- hexo.io  - npm framework for creating blog page
- smart bidding Reading Wechat blog: PID Control fundamental and implementation on Python

## New knowledge today 03/02/22:

        collection.find(query).stream()
        .on('data', function(doc){
        // handle doc
        })
        .on('error', function(err){
        // handle error
        })
        .on('end', function(){
        // final callback
        });

## New knowledge today 03/22/22:
>1. exports, export default, module.exports
- To solve the error "The requested module does not provide an export named 'default'", be consistent with your ES6 imports and exports. If a value is exported as a default export, it has to be imported as a default import and if it's exported as a named export, it has to be imported as a named import.

>2. use "real" destructuring after importing the object:


        import model from './.*.js';
        const {...} = model;

>3. below does not work in es6, ***path must include full file name-file type**
        
        module.exports = {
                'name': {object}
        }

        import {name} from './path';