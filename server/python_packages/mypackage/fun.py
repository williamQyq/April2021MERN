import os
from typing import final

from selenium.webdriver.support.expected_conditions import element_located_selection_state_to_be
from mypackage.module import WebDriverWait, EC, By


def get_Chrome_driver_path():
    cwd = os.getcwd()
    driver_path = '\python_packages\mypackage\chromedriver.exe'
    chrome_driver_path = cwd+driver_path
    
    return chrome_driver_path

# modify mutable list of dictionary link_list
def track_instock_info(link_list, driver):
    for product in link_list:
        driver.get(product["link"])
        product["name"] = get_product_name(driver)

        isInstock = check_product_instock(driver)
        if isInstock:
            product["price_timestamp"]["price"] = get_product_price(driver)
        else:
            product["price_timestamp"]["price"] = "Out of Stock"


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
        price = dollar_price.strip().lstrip("$")
    except:
        price = "NA"
    return price


def check_product_instock(driver):
    try:
        element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.CLASS_NAME, "fulfillment-add-to-cart-button"))
        )
        add_to_cart_element = WebDriverWait(element, 10).until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "button[data-button-state='ADD_TO_CART'"))
        )
        return True
    except:
            return False
        
 