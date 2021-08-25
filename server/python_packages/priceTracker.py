# script.py
import sys
import json
from mypackage.init import init_chrome_driver
from mypackage.fun import track_instock_info

def main():

    # retrieve py_process argument product_price_list JSON string to array of dictionary
    product_link_list = json.loads(sys.argv[1])
    
    # product_link_list = [{
    #     "_id": "611431d814c6b148f0fc0bb4", 
    #     # "link": "https://www.bestbuy.com/site/nvidia-geforce-rtx-3080-10gb-gddr6x-pci-express-4-0-graphics-card-titanium-and-black/6429440.p?skuId=6429440",
    #     "link": "https://www.bestbuy.com/site/asus-tuf-gaming-17-3-laptop-intel-core-i5-8gb-memory-nvidia-geforce-gtx-1650-ti-512gb-ssd-bonfire-black/6466906.p?skuId=6466906",
    #     "name": "loading...",
    #     "price_timestamp":{
    #         "price": "loading...", 
    #         "date": "2021-08-11T20:23:52.159Z"
    #     }
    #     }]

    driver = init_chrome_driver()                           # init chrome driver for selenium

    track_instock_info(product_link_list, driver)           # modify mutable list of dictionay: product_link_list

    jsonString = json.dumps(product_link_list)              # convert dic to json string then print
    print(jsonString)

    driver.quit()
    sys.stdout.flush()

main()
