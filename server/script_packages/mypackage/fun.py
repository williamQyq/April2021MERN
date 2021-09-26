import os
from selenium.webdriver.support.expected_conditions import element_located_selection_state_to_be
from mypackage.module import WebDriverWait, EC, By
import re
import time


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

# get all Laptops New sku items


def get_sku_items(driver, link, index):
    driver.get(link)
    result_list = list()
    count = 0

    for i in range(index):
        skus_before_changed = list()
        
        # for each page index, get sku items in sku item list
        try:
            sku_items = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located(
                    (By.XPATH, "//li[@class='sku-item']"))
            )
            for item_element in sku_items:
                item = dict()
                item_sku = item_element.get_attribute("data-sku-id")

                item["link"] = 'https://www.bestbuy.com/site/' + \
                    item_sku+'.p?skuId='+item_sku
                item["sku"] = item_sku
                item["currentPrice"] = get_sku_item_price(item_element)
                item["name"] = get_sku_item_name(item_element)

                result_list.append(item)
                # print(f'[{i}]-{count} item-sku = {item_sku}')
                skus_before_changed.append(item_sku)
                count += 1
        except:
            # print(f"[Error--sku-item]: ===Failure unable to get sku items info===\n\n")
            return False
        # click next page until reach last page
        if(i < index-1):
            click_next_page(driver)
            # sleep 20 sec
            time.sleep(20)
            # wait until sku item list refreshed
            try:
                WebDriverWait(driver, 20).until(
                    (lambda x: sku_attribute_changed(driver, skus_before_changed))
                )
            except:
                # print("wait for sku id attribute change error")
                return False
    return result_list


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

    return validate_sku_item_name(name)


def validate_sku_item_name(name):
    only_ascii_string = ""
    for char in name:
        if char.isascii():
            only_ascii_string += char

    return only_ascii_string


def click_next_page(driver):
    try:
        element = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CLASS_NAME, "sku-list-page-next")))
        element.click()
    except:
        # print(f"[Error--sku-list-page-next]: ===Failure unable to click next ===\n\n")
        return False


def sku_attribute_changed(driver, skus_before_changed):
    try:
        sku_items = WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located(
                (By.XPATH, "//li[@class='sku-item']")
            )
        )
        count = 0
        for item_element in sku_items:

            item_sku = item_element.get_attribute("data-sku-id")

            # print(f'item_sku: {item_sku} ==? {skus_before_changed[count]} item_sku before')
            # check if list elements being refreshed
            if(item_sku == skus_before_changed[count] or item_sku == None):
                # print(f'sku_item not refreshed')
                return False
            count += 1
        return sku_items
    except:
        return False
