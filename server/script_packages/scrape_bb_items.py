# script.py
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun.bb import get_sku_items


def main():

    item_link_info = json.loads(sys.argv[1])
    # item_link_info = {
    #     "link":'https://www.bestbuy.com/site/searchpage.jsp?_dyncharset=UTF-8&browsedCategory=pcmcat138500050001&id=pcat17071&iht=n&ks=960&list=y&qp=condition_facet%3DCondition~New&sc=Global&st=categoryid%24pcmcat138500050001&type=page&usc=All%20Categories',
    #     "pages": 2
    # }

    link = item_link_info["link"]
    pages = item_link_info["pages"]

    # init chrome driver for selenium
    driver = init_chrome_driver()
    driver.get(link)

    # @return items; item{link, sku, currentPrice, name}
    for item in get_sku_items(driver, link, pages):
        # output item to stdout, listened by process.on data
        print(json.dumps(item))
        sys.stdout.flush()

    driver.quit()


main()
