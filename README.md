# RockyStone ERP - William

## If you found this project is helpful, please star me. Thank you! 😃

*status*: under development...  
*latest update: 4/12/2023*  

author: Yuqing (William) Qiao  
description: MERN stack project
<br/>
<br/>

## What is this project for?
---
This project has access to the `MongoDB database` of the warehouse, the Amazon Seller Central via the `Selling Partner API`, the `Walmart Open I/O`, `Google services`, and `OpenAI`. It makes it easier for small to medium companies to maintain, track, and manage assets, with support for Typescript and ESNext modules.
<br/>
## Getting Started
---

1. ### Create your own `.env` - ***not provided***:  
   `.env` contains Mongo URI, WMS credentials, Amazon credentials, and google secrets...  

2. ### Connect to the `legacy mongo wms db` using tunnel-ssh
        ```c
                import mongodb from 'mongodb';
                import tunnel from 'tunnel-ssh';
                import fs from 'fs';

                const {MongoClient} = mongodb;

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

                const connect = new Promise((resolve, _) => {
                        tunnel(sshConfig, async (error, server) => {

                                const client = new MongoClient(
                                `mongodb://127.0.0.1:27017/${DB}`,
                                {
                                        useUnifiedTopology: true,
                                        socketTimeoutMS: 360000,
                                        connectTimeoutMS: 360000,
                                        keepAlive: true
                                }
                                );
                                await client.connect();
                                const db = client.db(DATABASE);
                                resolve({ db });    //db connection built.

                                client.on('error', console.error.bind(console, "***mongodb error***"))
                                client.on('error', (err) => {
                                console.error(`******mongodb client connection closed**********`)
                                client.close();
                                })
                        })
                });

                const { db } = await connect;
                
        ```

        *Note: check `port forwarding` or configure remote access for Local MongoDB.*  

        **generate RSA ssh keys**:
        - command: ssh-keygen
        - save the public key

        Using openssl
        - $openssl genrsa -out my_rsa_key_pair.pem 2048

        To extract public key from the generated private key:
        - $openssl rsa -in my_rsa_key_pair.pem -pubout > mykey.pub

3. ## Generate EC2 Key pair  
   * create new key pair .pem
   * change file read permision  
        `Icacls "william-dev-linux.pem" /Inheritance:r`  
        `Icacls "william-dev-linux.pem" /Grant:r "%Username%":"(R)"`  
   * get public key from .pem:  
        `ssh-keygen -y -f "C:\Users\h2s\Desktop\AWS EC2.pem"`  
   * add public key to EC2 from AWS console:  
        `sudo nano .ssh/authorized_keys`  

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

## Deploy to AWS EC2:
>1. deploy all build files to ec2 ~/client/deploy  
>2. deploy all server files to ec2 ~/server  
>3. install dependencies  
>4. setup Nginx proxing config(for front-end web and proxying request to server)  
>5. $sudo pm2 start ***server.js***  
> commands might be helpful:
>- $ssh -i MY_AWS_RSA_KEY.pem ubuntu@DNS.compute-1.amazonaws.com
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
- `sudo npm install -g puppeteer --unsafe-perm=true -allow-root && sudo apt install chromium-browser -y`

- `sudo apt update && sudo apt install -y gconf-service libgbm-dev libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget`

## FAQ：
---
### Q: Unable to git push to repository using `SourceTree` because PAT is expired?  

manually clear stored credentials by emptying those files:

        %LocalAppData%\Atlassian\SourceTree\passwd  
        %LocalAppData%\Atlassian\SourceTree\userhost

## Docker

| Docker Action         | CMD                                                                                   |
| ----------------------| --------------------------------------------------------------------------------------|
| build image           | docker build -t NAME:VERSION .                                                        |
| list containers       | docker ps -a                                                                          |
| list images           | docker images                                                                         |
| run images            | docker run --name ASIGNED_NAME IMAGE -d -p LOCAL_PORT:CONTAINER_PORT --restart always |
| rm all images         | docker rm -f $(docker ps -aq)                                                         |
| rm single image       | docker rmi IMAGE_NAME                                                                 |
| tag image             | docker image tag myimage registry-host:5000/myname/myimage:latest                     |
| push image            | docker image push --all-tags registry-host:5000/myname/myimage                        |
| enter containers      | docker exec -it <container_name> bash                                                 |  

</br>

Docker Procedure example:  
`docker build -t node-server:latest`  
`docker tag node-server:latest dockerwilliamqiao/mern_server:latest`  
`docker push dockerwilliamqiao/mern_server:latest`  

`docker run --name ASSIGN_CTR_NAME -p 5000:5000 -d IMAGE:TAG(default: latest) --restart always`

## Note 03/01/22:  
- elastic search (AWS OpenSearch derived from elasticsearch)
- Ngram search
- hexo.io  - npm framework for creating blog page
- smart bidding Reading Wechat blog: PID Control fundamental and implementation on Python

### Note 03/02/22:  
Working on change stream with MongoDB

## Note 03/22/22:  
* `exports`, `export default`, `module.exports`  
To solve the error "The requested module does not provide an export named 'default'", be consistent with your ES6 imports and exports. If a value is exported as a default export, it has to be imported as a default import and if it's exported as a named export, it has to be imported as a named import.

* use "real" destructuring after importing the object:

```c
        import model from './.*.js'; //for export default module
        const {...} = model;
```
* below does not work in es6, ***path must include full file name-file type**
```c
        module.exports = {
                'name': {object}
        }

        import {name} from './path'; //wrong, cannot find module
```

### Note 09/26/22:  
Upgraded to latest `React 18` & `react-router-dom v6`.

## Note 01/12/23:
NFS server & client:

on Windows:  
* `netsh interface portproxy show all`
* `ip addr show | grep eth0`  
 
* `netsh interface portproxy add v4tov4 listenport=443 listenaddress=0.0.0.0 connectport=443 connectaddress=<inet>`
* `netsh interface portproxy add v4tov4 listenport=2049 listenaddress=0.0.0.0 connectport=2049 connectaddress=`
* `netsh interface portproxy add v4tov4 listenport=111 listenaddress=0.0.0.0 connectport=111 connectaddress=`  

* `netsh advfirewall firewall delete rule name="TCP Port 6624" protocol=TCP localport=6624`  

on Linux:
* edit `/etc/exports`  
* `sudo exportfs -a`  
* `sudo service nfs-kernel-server start`  

on Ubuntu Client:  
* `sudo mount -t nfs4 192.168.1.24:/partimg /home/partimg -o noatime`

* `ifconfig eth0 169.254.7.44 broadcast 169.254.255.255 netmask 255.255.0.0`

start nfs deamon:  
`sudo service rpcbind start`  
`sudo service nfs-kernel-server restart`

restart network:  
`sudo /etc/init.d/networking start`

config network:  
`sudo vi /etc/network/interfaces`