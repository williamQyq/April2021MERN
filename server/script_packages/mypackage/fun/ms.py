import os
from mypackage.module import WebDriverWait, EC, By
import re
import time
import json
from random import seed
from random import randint


def get_sku_items_num(driver, sku_item_link):

    result = {'total_num': 0, 'num_per_page': 0}
    driver.get(sku_item_link)

    try:
        totalProductsOutput = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "p[class='c-paragraph-3']"))
        ).text

        pattern_total_num = 'Showing.*of\s(\d*).*'
        pattern_num_per_page = 'Showing\s\d*\s-\s(\d*)\sof\s\d*.*'
        result['total_num'] = re.search(
            pattern_total_num, totalProductsOutput).group(1)
        result['num_per_page'] = re.search(
            pattern_num_per_page, totalProductsOutput).group(1)
    except:
        return False
    finally:
        return result

# get all Laptops New sku items


def get_sku_items(driver, link, index):
    driver.get(link)

    for i in range(index):
        skus_before_clicked_next = list()
        try:
            sku_items = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located(
                    (By.XPATH, "//div[@class='m-channel-placement-item f-wide f-full-bleed-image']/a"))
            )
            for item_element in sku_items:
                item = {}
                data = json.loads(item_element.get_attribute("data-m"))
                prd_id = data['pid']
                prdName = data['tags']['prdName'].replace(" ","-").replace('"',"").lower()
                
                item['link'] = 'https://www.microsoft.com/en-us/d/'+prdName+'/'+prd_id
                
                print(prdName)
                # item["link"] = 'https://www.microsoft.com/en-us/d/'+item_data.

        except:
            return False
