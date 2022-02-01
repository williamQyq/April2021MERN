# script.py
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun.ms import get_sku_items


def main():

    pages_info = json.loads(sys.argv[1])
    # pages_info = {
    #     "link":'https://www.microsoft.com/en-us/store/b/shop-all-pcs?categories=2+in+1%7c%7cLaptops%7c%7cDesktops%7c%7cPC+Gaming&s=store&skipitems=',
    #     "pages": 1
    # }

    link = pages_info["link"]
    pages = pages_info["pages"]

    # init chrome driver for selenium
    driver = init_chrome_driver()
    # do something
    get_sku_items(driver, link, pages)

    sys.stdout.flush()
    driver.quit()


main()
