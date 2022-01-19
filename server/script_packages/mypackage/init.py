from mypackage.module import webdriver, Options
import mypackage.config
import os

# init set up chrome driver


def init_chrome_driver():
    user_agent = mypackage.config.HEADERS
    chrome_driver_path = get_Chrome_driver_path()
    chrome_options = Options()

    chrome_prefs = {"profile.managed_default_content_settings.images": 2}

    """   
    *For Prod Heroku use*
    
    chrome_options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--window-size=1920x1080")
    driver = webdriver.Chrome(executable_path= os.environ.get("CHROMEDRIVER_PATH"), options=chrome_options)
    """

    # chrome_options.add_experimental_option("detach",True)                                   #Run Chrome driver without closing when finished
    # Set user agent headers for Chrome driver
    chrome_options.add_argument(f'user-agent={user_agent}')
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--log-level=3")
    # chrome_options.add_experimental_option("excludeSwitches", ["enable-logging"])
    chrome_options.add_argument("--window-size=1920x1080")
    chrome_options.add_experimental_option("prefs", chrome_prefs)

    driver = webdriver.Chrome(
        executable_path=chrome_driver_path, options=chrome_options)
    return driver


def get_Chrome_driver_path():
    cwd = os.getcwd()
    driver_path = '\script_packages\mypackage\chromedriver.exe'
    chrome_driver_path = cwd+driver_path

    return chrome_driver_path
