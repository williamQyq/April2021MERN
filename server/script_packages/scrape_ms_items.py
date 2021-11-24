# script.py
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun.ms import get_sku_items


def main():

    item_link_info = json.loads(sys.argv[1])
    # item_link_info = {
    #     "link":'https://www.microsoft.com/en-us/store/b/shop-all-pcs?categories=2+in+1%7c%7cLaptops%7c%7cDesktops%7c%7cPC+Gaming&s=store&skipitems=',
    #     "link_index": 2
    # }

    link = item_link_info["link"]
    index = item_link_info["link_index"]

    # init chrome driver for selenium
    driver = init_chrome_driver()
    # do something
    get_sku_items(driver, link, index)

    driver.quit()
    sys.stdout.flush()

    
main()
