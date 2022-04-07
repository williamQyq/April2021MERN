# RockyStone ERP - William

## If you found this project is helpful, please star me. Thank you! 💙

*status*: under development...  
*latest update: 4/7/2022*  

author: Yuqing (William) Qiao  
description: MERN stack project



## What is this project for?
---
This project has access to the **Mongo database** of the warehouse, the Amazon Seller Central via **Selling Partner API** and the **Walmart Open I/O**. Make it easier for small to medium company to maintain track and manage assets. 

## Getting Started
---

## Pre-requested config files - ***not provided***:
### 1. **#root/server/.env** contains Mongo URI, WMS credentials, Amazon credentials, and jwtSecret.  
<br/>
Environment variables are exported from #root/config.js, Otherwise, you might need to config dotenv.config(/PATH_TO_.ENV) to get access to process.env.KEY


Note: You may also store relative sensitive information in config.json. Personally, config.json files might be used to store data particular to the application as a whole.

### 2. To connect to ***local database*** using ssh(or other existing local services...) 

```c
        import tunnel from 'tunnel-ssh';
        import fs from 'fs';

        const config = {
                agent: <AGENT>, //optional
                username: <USERNAME>,
                password: <PASSWORD>,
                host: <HOST PUBLIC IP ADDRESS OR PIVATE IP ADDRESS>,
                port: <DEFAULT PORT:22>,
                dstPort: <DEFAULT PORT:27017>,
                privateKey:fs.readFileSync('/path/to/key'),
                passphrase:<PASS_PHRASE>,
                localPort: process.env.PORT || <YOUR_PORT>,
                keepAlive: true
        }

        const connect = (config, callback)=>{

                tunnel(config,(error,server)=>{
                        if (error) {
                                console.log("SSH connection error: " + error);
                        }

                        //db connection...
                        //callback()
                });
        }
        
```

*tips: you probably need to set up **port forwarding** or configure remote access for Local MongoDB.*  

**generate RSA ssh keys**:
- command: ssh-keygen
- save the public key

Using openssl
- $openssl genrsa -out my_rsa_key_pair.pem 2048

To extract public key from the generated private key:
- $openssl rsa -in my_rsa_key_pair.pem -pubout > mykey.pub

## To build
---

>1. ~~download & save lastest *chromedriver.exe* to: ***server/bin/mypackage/***~~
(`No longer needed, already switched to puppeteer.`)  
>2. `npm run server-install` & `npm run client-install` to install required dependency
>3. `npm run dev`


## Deploy to Heroku (latest version is supported on AMZ EC2):

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
>3. follow the heroku deployment guide...
>

## Deploy to AWS EC2 (latest supported version):
>1. deploy all build files to ec2 ~/client/deploy  
>2. deploy all server files to ec2 ~/server  
>3. install dependencies  
>4. setup Nginx proxing config(for front-end web and proxying request to server)  
>5. $sudo pm2 start ***server.js***  
> commands might be helpful:
>- $scp -i MY_AWS_RSA_KEY.pem ubuntu@DNS.compute-1.amazonaws.com
>- $sudo apt-get install (nodejs, nginx, pm2)
>- $scp -i PATH\rockystone.pem -r <PATH>\mern-project\build\* ubuntu@DNS.compute-1.amazonaws.com:~/client/deploy
>- $scp -i PATH\rockystone.pem -r ./server\* ubuntu@DNS.compute-1.amazonaws.com:~/server/server
>- ***tips: Don't forget the pacakge.json for first time setup. npm install***

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

## FAQ：
---
### Q: Unable to git push to repository using **SourceTree** because of git auth token expired?  

Reset and regenerate git tokens. Edit project files: ***/.git/config/origin***.  
Replace the token part of url with regenerated tokens from github developer setting.

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
>
>**mern-project->src->component->reducers:**  
>...Redux reducers
>
>***store.js & index.js***:  
> - wrap App.js with Redux Provider in index.js, to connect the redux store and App.js.
>make redux store persist that all browsers will sync the store and update when changes happened.
---

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
>Save Item in database procedure
>1. $setOnInsert item.
>2. check if db has documet and price changed.
>3. push to price_timestamps array field

**EsModule vs CommonJs**
```c
        import ...from...  
        const {...} = require('.../')
```
---
## Amazon Selling Partner API
**setup**
```c
        import SellingPartnerAPI from 'amazon-sp-api';

        const sp = new SellingPartnerAPI({
                region: <REGION>
                credentials: {
                        "SELLING_PARTNER_APP_CLIENT_ID": <YOUR_CREDENTIAL>,
                        "AWS_ACCESS_KEY_ID": <YOUR_CREDENTIAL>,
                        "AWS_SECRET_ACCESS_KEY": <YOUR_CREDENTIAL>,
                        "AWS_SELLING_PARTNER_ROLE": <YOUR_CREDENTIAL>
                },
                refresh_token: <YOUR_TOKEN>      
        })

        //To call
        sp.callAPI(PARAM).then(result=>{
                //...
                //console.log(result)
        })
```
---
## Walmart I/O
[walmart.io quick start](https://www.walmart.io/docs/affiliate/quick-start-guide)  
**To create signed signature using crypto** - Attn: ***node-rsa module not working-encoding too long error***

-- The crypto module provides cryptographic functionality that includes a set of wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign, and verify functions.

```c
import fs from 'fs';
import crypto from 'crypto';
import fetch from 'node-fetch'

let pem = fs.readFileSync('./wm_rsa_key_pair.pem')
let key = pem.toString('ascii')
let privatekey = crypto.createPrivateKey({
        'key': key,
        'format': 'pem',
        'passphrase': <YOUR_PASS_PHRASE>
})

const sign = (identifier) => {
    let sign = crypto.createSign('RSA-SHA256');
    sign.update(identifier);
    let signature = sign.sign(privatekey, 'base64');
    return signature;
}

const getProductById = async (productId) => {
        const options = {
                method: "GET",
                headers: generateWalmartHeaders(),
        };

        const res = await fetch(
                `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items/${productId}?publisherId=${keyData.impactId}`,
                options
        );

        let detail = await res.json()
        //console.log(detail)
        return detail
};
```


## Software Architecture that can be improved in future
---
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
### Working on Bulk Data with MongoDB

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
1. exports, export default, module.exports  
To solve the error "The requested module does not provide an export named 'default'", be consistent with your ES6 imports and exports. If a value is exported as a default export, it has to be imported as a default import and if it's exported as a named export, it has to be imported as a named import.

2. use "real" destructuring after importing the object:

```c
        import model from './.*.js'; //for export default module
        const {...} = model;
```
3. below does not work in es6, ***path must include full file name-file type**
```c
        module.exports = {
                'name': {object}
        }

        import {name} from './path'; //wrong, cannot find module
```