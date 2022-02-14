# RockyStone ERP - William
*status*: under development...  
*latest update: 1/27/2022*  

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
                localPort: process.env.PORT || <YOUR_PORT>,
                keepAlive: true
        }
*tips: you probably need to set up **port forwarding** or configure remote access for MongoDB.*  

## To build

>1. download & save lastest *chromedriver.exe* to:  
***server/script_packages/mypackage/***
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

## Deploy to AWS:

 >*comming soon...*

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
> - axios make http request from client browser to express router endpoints(URIs) in server.
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

*Scripts.js*

I used nodejs to spawn a python process and listen on the stdout standard streams on 'data' to retrieve the result.
However, I just found a better way which is using Puppeteer,an Nodejs library developed by Google, used for html parsing, getting screen shot and so on.

The Class Scripts
A class that defines all the functionalities that are needed for spawing a python selenium script process.

On receiving data JSONstream, invoke callback function that is defined inside the outer function to process the receiving data. (In concern of the callback hell, promise chain probably won't fit here, since not waiting for the completion of child process close. )

quite complicated, probably not the best practice.
        
        const {Store} = require('./scripts.js');
        const {model} = require('./models/**.js);

        let store = new Store(model);
        cosnt operation = (store,callback)=>{
                store.exec(SCRIPT_PATH, argvs, (data)=>{
                        (...data handling code here)
                        callback(data)
                })

        }

Save Item in database procedure
>1. $setOnInsert item.
>2. check if db has documet and price changed.
>3. push to price_timestamps array field

**ESM vs CommonJs**
        
        import ... ***vs*** const {...} = require('.../')
