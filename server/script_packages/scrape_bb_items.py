# script.py
import re
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun.bb import get_sku_items,sleep_random_sec

def main():

    item_link_info = json.loads(sys.argv[1])
    # item_link_info = {
    #     "link": 'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&cp=1&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories',
    #     "pages": 2
    # }

    link = item_link_info["link"]
    pattern_url_head = "(.*&cp=)\d.*"
    pattern_url_tail = ".*&cp=\d(.*)"
    base_url_head = re.search(pattern_url_head, link).group(1)
    base_url_tail = re.search(pattern_url_tail, link).group(1)
    pages = item_link_info["pages"]

    driver = init_chrome_driver() # init chrome driver for selenium

    for page in range(pages):
        page_url = base_url_head + str(page+1) + base_url_tail
        driver.get(page_url)
        for item in get_sku_items(driver):
            print(json.dumps(item)) # output item to stdout, listened by process.on data
            sys.stdout.flush()
        
        sleep_random_sec(7,10)

    driver.quit()

main()
