# April2021MERN

Rockystone ERP & analytics systems
author: Yuqing (William) Qiao

*Pre request:
1. request server/config/default.json which contains mongo URI from the project administrator
2. request server/config/wmsConfig.js which contains wms ssh keys and config info

Commands and how to build:

*For local on dev:
>1. download & save lastest chromedriver.exe to: server/script_packages/mypackage/
>2. npm run server-install & npm run client-install to install required dependency
>3. npm run dev (or edit root package.json)

Build on Heroku:

*On production:
>1. set Config Vars:
        CHROMEDRIVER_PATH           /app/.chromedriver/bin/chromedriver
        GOOGLE_CHROME_BIN           /app/.apt/usr/bin/google-chrome
>2. set buildpack:
        https://github.com/heroku/heroku-buildpack-google-chrome
        https://github.com/heroku/heroku-buildpack-chromedriver
        nodejs
        python
>3. follow heroku deployment process

Build on AWS:

*comming soon