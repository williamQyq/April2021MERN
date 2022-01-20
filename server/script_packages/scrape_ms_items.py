# script.py
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun.ms import get_sku_items


def main():

    item_link_info = json.loads(sys.argv[1])
    # item_link_info = {
    #     "link":'https://www.microsoft.com/en-us/store/b/shop-all-pcs?categories=2+in+1%7c%7cLaptops%7c%7cDesktops%7c%7cPC+Gaming&s=store&skipitems=',
    #     "pages": 3
    # }

    link = item_link_info["link"]
    pages_num = item_link_info["pages"]

    # init chrome driver for selenium
    driver = init_chrome_driver()
    # do something
    get_sku_items(driver, link, pages_num)

    sys.stdout.flush()
    driver.quit()

main()
