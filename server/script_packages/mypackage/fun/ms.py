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
        cur_item_list = list()
        try:
            sku_items = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located(
                    (By.XPATH, "//div[@class='m-channel-placement-item f-wide f-full-bleed-image']/a"))
            )
            for item_element in sku_items:
                item = {}
                data = json.loads(item_element.get_attribute("data-m"))
                prd_id = data['pid']
                prd_name = data['tags']['prdName']

                item['link'] = 'https://www.microsoft.com/en-us/d/' + \
                    prd_name.replace(" ", "-").replace('"',"").lower()+'/'+prd_id
                item['sku'] = prd_id
                item['currentPrice'] = get_sku_item_price(item_element)
                item['name'] = prd_name

                print(json.dumps(item))
                cur_item_list.append(prd_id)
        except:
            return False

        has_next_page = i < index - 1
        if has_next_page:
            click_next_page(driver)
            seed()
            time.sleep(randint(10, 15))
            try:
                WebDriverWait(driver, 20).until(
                    (lambda x: sku_attribute_changed(driver, cur_item_list))
                )
            except:
                return False


def get_sku_item_price(driver):
    price = None
    try:
        price_element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "span[itemprop='price']")
            )
        )
        price = price_element.get_attribute("content")
    except:
        return False
    finally:
        return price


def click_next_page(driver):
    return


def sku_attribute_changed(driver, skus_before_changed):
    return
