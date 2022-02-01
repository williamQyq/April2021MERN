# script.py
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun.ms import get_sku_items_num


def main():

    link = json.loads(sys.argv[1])
    # link = 'https://www.microsoft.com/en-us/store/b/shop-all-pcs?categories=2+in+1||Laptops||Desktops||PC+Gaming&s=store&skipitems='

    driver = init_chrome_driver()         # init chrome driver for selenium
    driver.get(link+'0')

    # do something
    num_per_page, total_num = get_sku_items_num(driver)
    res = {
        "num_per_page": num_per_page,
        "total_num": total_num
    }
    print(json.dumps(res))
    driver.quit()
    sys.stdout.flush()


main()
