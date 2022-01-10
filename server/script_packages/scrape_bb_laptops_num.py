# script.py
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun.bb import get_sku_items_num


def main():

    sku_item_link = json.loads(sys.argv[1])
    # sku_item_link = 'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories'
    # init chrome driver for selenium
    driver = init_chrome_driver()

    # get page num and item num of each page
    num_per_page, total_num = get_sku_items_num(driver, sku_item_link)
    
    res = {
        "num_per_page": num_per_page,
        "total_num": total_num
    }

    print(json.dumps(res))
    driver.quit()
    sys.stdout.flush()


main()
