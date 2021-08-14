# script.py
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun import track_instock_info

def main():

    # retrieve py_process argument product_price_list JSON string to array of dictionary
    product_link_list = json.loads(sys.argv[1])
    
    # product_link_list = [{"_id": "611431d814c6b148f0fc0bb4", "link": "https://www.bestbuy.com/site/hp-pavilion-x360-2-in-1-14-touch-screen-laptop-intel-core-i3-8gb-memory-128gb-ssd-natural-silver/6428667.p?skuId=6428667", "name": "HP OMEN - 16.1\" Laptop - AMD Ryzen 7 - 16GB Memory - AMD Radeon™ RX 6600M - 1TB SSD",
    #          "price": 999, "date": "2021-08-11T20:23:52.159Z", "__v": 0}]

    driver = init_chrome_driver()                           # init chrome driver for selenium

    track_instock_info(product_link_list, driver)           # modify mutable list of dictionay: product_link_list

    jsonString = json.dumps(product_link_list)              # convert dic to json string then print
    print(jsonString)

    driver.quit()
    sys.stdout.flush()


main()
