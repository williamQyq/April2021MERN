import os
from typing import final

from selenium.webdriver.support.expected_conditions import element_located_selection_state_to_be
from mypackage.module import WebDriverWait, EC, By
import re


def get_Chrome_driver_path():
    cwd = os.getcwd()
    driver_path = '\script_packages\mypackage\chromedriver.exe'
    # driver_path = '\mypackage\chromedriver.exe'
    chrome_driver_path = cwd+driver_path

    return chrome_driver_path

# modify mutable list of dictionary link_list


def track_instock_info(product, driver):
    driver.get(product["link"])
    product["name"] = get_product_name(driver)

    isInstock = check_product_instock(driver)
    if isInstock:
        product["currentPrice"] = get_product_price(driver)
    else:
        product["currentPrice"] = -1


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
                (By.CLASS_NAME, "item-count"))
        ).text

    except:
        return False
    return re.sub('[^0-9]', '', item_count)


def get_sku_items(driver, sku_item_link):
    driver.get(sku_item_link)
    sku_items_list = list()

    try:
        sku_items = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located(
                (By.CLASS_NAME, "sku-item")
            )
        )
        for item_element in sku_items:
            item = dict()
            item_price = get_sku_item_price(item_element)
            item_name = get_sku_item_name(item_element)
            
            item["sku"] = item_element.get_attribute("data-sku-id")
            item["currentPrice"] = item_price
            item["name"] = item_name

            sku_items_list.append(item)
    except:
        return False

    return sku_items_list


def get_sku_item_price(driver):
    try:
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.CLASS_NAME, "price-block")
            )
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

def get_sku_item_name(driver):
    try:
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "sku-title"))
        )
        name = WebDriverWait(element, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "a"))
        ).text
    except:
        name = "NA"

    return name
