# script.py
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun.bb import get_sku_items_num


def main():

    link = json.loads(sys.argv[1])

    # init chrome driver for selenium
    driver = init_chrome_driver()
    driver.get(link)

    # get page num and item num of each page
    num_per_page, total_num = get_sku_items_num(driver)
    
    res = {
        "num_per_page": num_per_page,
        "total_num": total_num
    }

    print(json.dumps(res))
    driver.quit()
    sys.stdout.flush()


main()
