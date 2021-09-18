# script.py
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun import track_instock_info

def main():

    # retrieve py_process argument product_price_list JSON string to array of dictionary
    product = json.loads(sys.argv[1])
    # product = {"_id":"613f6897bc8cd142286b4f30","link":"https://www.bestbuy.com/site/lenovo-legion-5-15-gaming-laptop-amd-ryzen-7-5800h-nvidia-geforce-rtx-3050-ti-8gb-memory-512gb-ssd-phantom-blue/6455136.p?skuId=6455136"}

    driver = init_chrome_driver()                           # init chrome driver for selenium
    
    track_instock_info(product, driver)           # modify mutable list of dictionay: product_link_list

    jsonString = json.dumps(product)              # convert dic to json string then print
    print(jsonString)

    # driver.quit()
    sys.stdout.flush()

main()