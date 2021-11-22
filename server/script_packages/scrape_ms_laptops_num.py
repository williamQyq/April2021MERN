# script.py
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun.ms import get_sku_items_num
def main():

    sku_item_link = json.loads(sys.argv[1])
    # sku_item_link = 'https://www.microsoft.com/en-us/store/b/shop-all-pcs?categories=2+in+1||Laptops||Desktops||PC+Gaming'
    driver = init_chrome_driver()         # init chrome driver for selenium
    
    # do something
    result = get_sku_items_num(driver,sku_item_link)

    print(result)
    driver.quit()
    sys.stdout.flush()
    
main()