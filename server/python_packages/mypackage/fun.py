import os

def get_Chrome_driver_path():
    cwd = os.getcwd()
    driver_path = "\chromedriver.exe"
    chrome_driver_path = cwd+driver_path
    return chrome_driver_path

def track_instock_info(link_list,driver):
    for product in link_list:
        print(product)
        # if status:
        #     for i in range(needQuantity):  
                 
        #         try:
        #             driver.get(url)
        #             info = get_info(driver)
        #         except:
        #             print(f"[Failure]: *** Failed to get Product info No.{index} ***\n")
                
        #         if auto_purchase(driver):
        #             order_count+=1
        #             driver.delete_all_cookies()
        #             print(f"[Success] *** Successful Placed Order No.{index} -- {i+1} times *** \n")
        #         else:
        #             print(f"[Failure]: *** Failed auto purchase No.{index} -- {i+1} times ***\n")
        #             record_result(config.filename,index,order_count,info,"fail")
        #             driver.delete_all_cookies()

        #         #write order_count to result excel  
        #         record_result(config.filename,index,order_count,info,"pass")

        #     print("[Status]: === Finished result===\n")