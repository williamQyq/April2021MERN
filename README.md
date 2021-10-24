# April2021MERN

Rockystone ERP & analytics systems

Commands and how to build:

mongodb connection key is located at: server/config/keys.js

>on Dev: download & save chromedriver.exe to path: server/python_packages/mypackage/
>pip install -r requirements.txt

>Run command:
    npm run dev

>on Prod: set Config Vars:
            CHROMEDRIVER_PATH           /app/.chromedriver/bin/chromedriver
            GOOGLE_CHROME_BIN           /app/.apt/usr/bin/google-chrome
            
            buildpack:
            https://github.com/heroku/heroku-buildpack-google-chrome
            https://github.com/heroku/heroku-buildpack-chromedriver
            nodejs
            python
