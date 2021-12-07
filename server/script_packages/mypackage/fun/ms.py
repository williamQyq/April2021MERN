import os
from mypackage.module import WebDriverWait, EC, By
from random import seed, randint
import re
import time
import json


def get_sku_items_num(driver, sku_item_link):

    result = {'total_num': 0, 'num_per_page': 0}
    driver.get(sku_item_link)

    try:
        totalProductsOutput = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "p[class='c-paragraph-3']")
            )
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


def get_sku_items(driver, link, pages_num):
    skip_items = 0
    driver.get(link+str(skip_items))

    close_dialog(driver)
    # get items for each page
    for i in range(pages_num):
        try:
            sku_items = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located(
                    (By.XPATH, "//div[@class='m-channel-placement-item f-wide f-full-bleed-image']/a"))
            )
            cur_item_list = get_cur_page_items(sku_items)
        except:
            return False

        # if has next page, click next and wait until page refresh
        has_next_page = i < pages_num - 1
        if has_next_page:
            seed()
            time.sleep(randint(10, 15))
            navigate_next_page(driver, link, i)
            wait_until_page_refresh(driver, cur_item_list)


def close_dialog(driver):
    try:
        dialog_close_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable(
                (By.XPATH,
                 "//div[@class='sfw-dialog']/div[@class='c-glyph glyph-cancel']")
            )
        )
        dialog_close_btn.click()
    except:
        return


def get_cur_page_items(sku_items):
    cur_item_list = []

    for item_element in sku_items:
        item = {}
        data = json.loads(item_element.get_attribute("data-m"))
        prd_id = data['pid']
        prd_name = data['tags']['prdName']

        item['link'] = 'https://www.microsoft.com/en-us/d/' + \
            prd_name.replace(" ", "-").replace('"', "").lower()+'/'+prd_id
        item['sku'] = prd_id
        item['currentPrice'] = get_sku_item_price(item_element)
        item['name'] = prd_name

        # print out item, caught by process listen data.
        print(json.dumps(item))
        cur_item_list.append(prd_id)

    return cur_item_list


def get_sku_item_price(driver):
    price = None
    try:
        price_element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "span[itemprop='price']")
            )
        )
        price = price_element.get_attribute(
            "content").strip().lstrip("$").replace(',', '')
    except:
        return False
    finally:
        return price


def navigate_next_page(driver, link, index):
    editURL = link + str((index+1)*20)
    try:
        driver.get(editURL)
    except:
        return False


def wait_until_page_refresh(driver, cur_item_list):
    try:
        WebDriverWait(driver, 20).until(
            (lambda x: sku_attribute_changed(driver, cur_item_list))
        )
        return True
    except:
        return False


def sku_attribute_changed(driver, skus_before_changed):
    try:
        sku_items = WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located(
                (By.XPATH,
                 "//div[@class='m-channel-placement-item f-wide f-full-bleed-image']/a")
            )
        )
        index = 0
        for item_element in sku_items:
            data = json.loads(item_element.get_attribute("data-m"))
            item_sku = data['pid']

            # check if list elements being refreshed
            if(item_sku == skus_before_changed[index] or item_sku == None):
                # print(f'sku_item not refreshed')
                return False
            index += 1
        return sku_items
    except:
        return False
