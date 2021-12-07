# script.py
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun.lego import get_lego_themes


def main():

    # item_link_info = json.loads(sys.argv[1])
    link = "https://www.lego.com/en-us/themes"

    # init chrome driver for selenium
    driver = init_chrome_driver()
    # do something
    themes = get_lego_themes(driver, link)

    print(themes)

    driver.quit()
    sys.stdout.flush()


main()
