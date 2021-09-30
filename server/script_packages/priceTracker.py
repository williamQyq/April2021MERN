# script.py
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun.bb import track_instock_info

def main():

    # retrieve py_process argument product_price_list JSON string to array of dictionary
    product = json.loads(sys.argv[1])
    # product = {"id":"6148db7cb753067b1878e81e","link":"https://www.bestbuy.com/site/lenovo-yoga-6-13-2-in-1-13-3-touch-screen-laptop-amd-ryzen-5-8gb-memory-256gb-ssd-abyss-blue-with-fabric-cover/6455181.p?skuId=6455181"}
    driver = init_chrome_driver()                           # init chrome driver for selenium
    
    track_instock_info(product, driver)           # modify mutable list of dictionay: product_link_list

    jsonString = json.dumps(product)              # convert dic to json string then print
    print(jsonString)

    driver.quit()
    sys.stdout.flush()

main()