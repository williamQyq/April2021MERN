# script.py
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun.cc import get_sku_items_num
def main():

    sku_item_link = json.loads(sys.argv[1])
    # sku_item_link = 'https://www.costco.com/laptops.html'
    driver = init_chrome_driver()         # init chrome driver for selenium
    
    # do something
    num = get_sku_items_num(driver,sku_item_link)

    print(num)
    driver.quit()
    sys.stdout.flush()
    
main()