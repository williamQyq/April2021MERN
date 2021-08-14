import os
from typing import final
from mypackage.module import WebDriverWait, EC, By


def get_Chrome_driver_path():
    cwd = os.getcwd()
    driver_path = "\python_packages\mypackage\chromedriver.exe"
    chrome_driver_path = cwd+driver_path
    return chrome_driver_path

# modify mutable list of dictionary link_list


def track_instock_info(link_list, driver):
    for product in link_list:
        driver.get(product["link"])
        product["name"] = get_product_name(driver)
        product["price"] = get_product_price(driver)


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
            EC.presence_of_element_located((By.CLASS_NAME, "priceView-customer-price"))
        )
        dollar_price = WebDriverWait(element, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "span"))
        ).text

        price = dollar_price.strip().lstrip("$")
    except:
        price = "NA"
    return price
