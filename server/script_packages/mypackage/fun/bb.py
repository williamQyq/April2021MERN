import webbrowser
from mypackage.module import WebDriverWait, EC, By
import re
import time
from random import seed
from random import randint


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


def get_sku_items_num(driver):

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

    return num_per_page, total_num

# get all Laptops New sku items


def get_sku_items(driver):
    # driver.manage().delete_all_cookies()
    sku_items = None
    searched_items = []
    try:
        sku_items = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located(
                (By.XPATH, "//li[@class='sku-item']")
            )
        )

        for searched_item in get_page_items(sku_items):
            searched_items.append(searched_item)
            yield searched_item
    except Exception as e:
        return False

    # click next page until reach last page and no matched sku in current items sku lst
    # has_next_page = i < pages - 1
    # if(has_next_page):
    #     click_next(driver)
    #     wait_until_page_refresh(driver, searched_items)


def sleep_random_sec(min, max):
    seed()
    randomSec = randint(7, 10)
    time.sleep(randomSec)


def get_page_items(sku_items):
    for item_element in sku_items:

        item = {}
        sku = item_element.get_attribute("data-sku-id")
        item["link"] = 'https://www.bestbuy.com/site/' + \
            sku+'.p?skuId='+sku
        item["sku"] = sku
        item["currentPrice"] = get_sku_item_price(item_element)
        item["name"] = get_sku_item_name(item_element)
        yield item

# get item price, if failed try again and wait til 20s.


def get_sku_item_price(element):
    try:
        dollar_price = WebDriverWait(element, 15).until(
            EC.presence_of_element_located(
                (By.XPATH,
                 ".//div[@class='priceView-hero-price priceView-customer-price']/span")
            )
        ).text
        price = parse_price(dollar_price)
    except:
        return False

    return price


def parse_price(dollar_price) -> str:
    return dollar_price.strip().lstrip("$").replace(',', '')


def get_sku_item_name(driver):
    try:
        sku_header = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located(
                (By.XPATH, ".//h4[@class='sku-header']/a")
            )
        ).text
    except:
        return False

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
            EC.element_to_be_clickable((By.CLASS_NAME, "sku-list-page-next"))).click()
        return True
    except:
        return False


def wait_until_page_refresh(driver, searched_items):
    try:
        WebDriverWait(driver, 20).until(
            (lambda x: wait_new_items_loaded(driver, searched_items))
        )
    except Exception as e:
        return


def wait_new_items_loaded(driver, searched_items):
    try:
        new_items = WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located(
                (By.XPATH, "//li[@class='sku-item']")
            )
        )
        index = 0
        for item_element in new_items:
            new_item_sku = item_element.get_attribute("data-sku-id")
            if(new_item_sku == searched_items[index]["sku"] or new_item_sku == None):
                raise Exception('page elements not updated')
            index += 1
        return new_items
    except:
        return False


def get_product_specification(driver):
    spec = {}
    try:
        spec_btn = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located(
                (By.XPATH,
                 '//button[@data-track="Specifications: Accordion Open"]')
            )
        ).click()
    except:
        return

    try:
        row_values = WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located(
                (By.XPATH, '//div[@class="row-value col-xs-6 v-fw-regular"]')
            )
        )

        row_titles = WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located(
                (By.XPATH,
                 '//div[@class="row-title"]')
            )
        )
        index = 0
        for row_title in row_titles:
            print(row_title.text)
            # key = row_title.text
            # value = row_values[index].text
            # spec[key] = value

    except Exception as e:
        return

    # spec['upc'] = upc

    return spec
