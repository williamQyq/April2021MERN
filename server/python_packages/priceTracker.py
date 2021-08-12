# script.py
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun import track_instock_info

def main():

    # retrieve py_process argument product_price_list JSON string to array of dictionary
    # product_list = json.loads(sys.argv[1])
    
    product_link_list = [{"_id": "611431d814c6b148f0fc0bb4", "link": "4", "name": "HP OMEN - 16.1\" Laptop - AMD Ryzen 7 - 16GB Memory - AMD Radeon™ RX 6600M - 1TB SSD",
             "price": 999, "date": "2021-08-11T20:23:52.159Z", "__v": 0}]

    # init chrome driver for selenium
    driver = init_chrome_driver()

    product_list = track_instock_info(product_link_list, driver)


    # convert dic to json string then print
    jsonString = json.dumps(product_list)
    print(jsonString)

    sys.stdout.flush()


main()
