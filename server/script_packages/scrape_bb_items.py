# script.py
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun.bb import get_sku_items


def main():

    item_link_info = json.loads(sys.argv[1])
    # item_link_info = {
    #     "link":'https://www.bestbuy.com/site/laptop-computers/all-laptops/pcmcat138500050001.c?id=pcmcat138500050001&qp=parent_operatingsystem_facet%3DParent%20Operating%20System~Windows',
    #     "pages": 1
    # }

    link = item_link_info["link"]
    pages_num = item_link_info["pages"]

    # init chrome driver for selenium
    driver = init_chrome_driver()
    
    # @return: link, sku, currentPrice, name of items
    get_sku_items(driver, link, pages_num)

    driver.quit()
    sys.stdout.flush()
    
main()
