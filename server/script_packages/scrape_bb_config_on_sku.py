# script.py
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun.bb import get_product_specification


def main():

    # link = json.loads(sys.argv[1])
    link = "https://www.bestbuy.com/site/hp-15-6-touch-screen-laptops-amd-ryzen-3-8gb-memory-256gb-ssd-natural-silver/6477886.p?skuId=6477886"
    driver = init_chrome_driver()
    driver.get(link)

    spec = get_product_specification(driver)

    # convert dic to json string then print
    res = json.dumps(spec)
    print(res)

    driver.quit()
    sys.stdout.flush()


main()
