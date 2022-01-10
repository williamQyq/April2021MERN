import os
from mypackage.module import WebDriverWait, EC, By
import re
import time
import json
from random import seed
from random import randint

# modify mutable list of dictionary link_list


def track_instock_info(product, driver):
    driver.get(product["link"])

    name = get_product_name(driver)
    currentPrice = -1

    isInstock = check_product_instock(driver)
    if isInstock:
        currentPrice = get_product_price(driver)

    return name, currentPrice


def get_product_name(driver):
    try:
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "sku-title"))
        )
        name = WebDriverWait(element, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "h1"))
        ).text
    except:
        name = "NA"

    return name


def get_product_price(driver):

    try:
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "div[data-context='Product-Page']"))
        )

        price_element = WebDriverWait(element, 10).until(
            EC.presence_of_element_located(
                (By.CLASS_NAME, "priceView-customer-price"))
        )
        dollar_price = WebDriverWait(price_element, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "span"))
        ).text
        price = dollar_price.strip().lstrip("$").replace(',', '')
    except:
        price = None
    return price


def check_product_instock(driver):
    try:
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.CLASS_NAME, "fulfillment-add-to-cart-button"))
        )
        add_to_cart_element = WebDriverWait(element, 10).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "button[data-button-state='ADD_TO_CART']"))
        )
    except:
        return False

    return True


def get_sku_items_num(driver, sku_item_link):

    driver.get(sku_item_link)

    try:
        item_count = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, "//div[@class='footer top-border wrapper']//span"))
        ).text

        pattern_total_num = ".* of (\d*) items"
        pattern_num_per_page = "\d*-(\d*) of \d*"
        num_per_page = re.search(
            pattern_num_per_page, item_count).group(1)
        total_num = re.search(
            pattern_total_num, item_count).group(1)
    except:
        return False
    finally:
        return num_per_page, total_num

# get all Laptops New sku items


def get_sku_items(driver, link, pages_num):
    driver.get(link)

    for i in range(pages_num):
        try:
            sku_items = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located(
                    (By.XPATH, "//li[@class='sku-item']"))
            )
            cur_items_sku = get_cur_page_items(sku_items)
        except:
            return False

        # click next page until reach last page and no matched sku in current items sku lst
        if(i < pages_num-1):
            seed()
            time.sleep(randint(10, 15))
            click_next(driver)
            wait_until_page_refresh(driver, cur_items_sku)


def get_cur_page_items(sku_items):
    items_sku = []
    for item_element in sku_items:
        item = {}
        sku = item_element.get_attribute("data-sku-id")
        item["link"] = 'https://www.bestbuy.com/site/' + \
            sku+'.p?skuId='+sku
        item["sku"] = sku
        item["currentPrice"] = get_sku_item_price(item_element)
        item["name"] = get_sku_item_name(item_element)

        # output item to stdout, listened by process.on data
        print(json.dumps(item))
        items_sku.append(sku)

    return items_sku

# get item price, if failed try again and wait til 20s.


def get_sku_item_price(driver):
    price = None
    price = parse_price(driver)
    if not price:
        price = parse_price(driver)

    return price


def parse_price(driver) -> str:
    try:
        dollar_price = WebDriverWait(driver, 15).until(
            EC.presence_of_element_located(
                (By.XPATH,
                 ".//div[@class='priceView-hero-price priceView-customer-price']/span")
            )
        ).text
        price = dollar_price.strip().lstrip("$").replace(',', '')
        return price
    except:
        return False


def get_sku_item_name(driver):
    sku_header = None
    try:
        sku_header = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, ".//h4[@class='sku-header']/a")
            )
        ).text
    except:
        return False
    finally:
        return validate_sku_item_name(sku_header)


def validate_sku_item_name(header):
    only_ascii_string = ""
    for char in header:
        if char.isascii():
            only_ascii_string += char

    return only_ascii_string


def click_next(driver):
    try:
        element = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CLASS_NAME, "sku-list-page-next")))
        element.click()
    except:
        return False


def wait_until_page_refresh(driver, cur_items_sku):
    try:
        WebDriverWait(driver, 20).until(
            (lambda x: sku_attribute_changed(driver, cur_items_sku))
        )
        return True
    except:
        return False


def sku_attribute_changed(driver, cur_page_skus):
    try:
        sku_items = WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located(
                (By.XPATH, "//li[@class='sku-item']")
            )
        )

        index = 0
        for item_element in sku_items:
            item_sku = item_element.get_attribute("data-sku-id")
            # check if list elements being refreshed
            if(item_sku == cur_page_skus[index] or item_sku == None):
                # print(f'sku_item not refreshed')
                return False
            index += 1
        return sku_items
    except:
        return False
