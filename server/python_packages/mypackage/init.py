from mypackage.fun import get_Chrome_driver_path
from mypackage.module import webdriver,Options
import mypackage.config

# init set up chrome driver
def init_chrome_driver():
    user_agent = mypackage.config.HEADERS
    chrome_driver_path = get_Chrome_driver_path()
    
    chrome_options = Options() 
    chrome_options.add_experimental_option("detach",True)                                   #Run Chrome driver without closing when finished
    chrome_options.add_argument(f'user-agent={user_agent}')                                 #Set user agent headers for Chrome driver
    chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])
    chrome_options.add_argument('headless')                                               #Run Chrome driver without opening browser 
    driver = webdriver.Chrome(executable_path=chrome_driver_path, options=chrome_options)

    return driver