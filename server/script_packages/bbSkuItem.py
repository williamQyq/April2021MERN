# script.py
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun import get_sku_items


def main():

    # item_link_info = json.loads(sys.argv[1])
    # item_link_info = {
    #     "link":'https://www.bestbuy.com/site/laptop-computers/all-laptops/pcmcat138500050001.c?id=pcmcat138500050001&qp=parent_operatingsystem_facet%3DParent%20Operating%20System~Windows',
    #     "link_index": 1
    # }

    # link = item_link_info["link"]
    # index = item_link_info["link_index"]

    # # init chrome driver for selenium
    # driver = init_chrome_driver()
    # # do something
    # sku_items = get_sku_items(driver, link, index)
    # print(sku_items)

    # driver.quit()
    # sys.stdout.flush()

    sku_items = {'link': 'https://www.bestbuy.com/site/6447112.p?skuId=6447112',
                  'sku': '6447112',
                  'currentPrice': '429.99',
                  'name': 'Dell - Inspiron 15.6" FHD Touch-Screen Laptop -AMD Ryzen 5 - 8GB Memory - 256GB SSD - Black'
                  }

    for i in range(2):
        print(sku_items)
main()
