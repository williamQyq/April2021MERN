from mypackage.module import WebDriverWait, EC, By
from random import seed, randint
import re
import time
import json


def get_lego_themes(driver, link) -> list:
    driver.get(link)

    handle_dialog(driver)

    try:
        themes_ul = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located(
                (By.XPATH,
                 "//li[@class='CategoryListingPagestyle__ListItemAlternate-sc-880qxz-7 etrOdt']")
            )
        )
        themes = parse_themes_lists(themes_ul)
        return themes

    except:
        return False


def handle_dialog(driver) -> None:
    handle_continue_to_shop_dialog(driver)
    handle_cookies_dialog(driver)

    return


def handle_continue_to_shop_dialog(driver) -> None:
    try:
        continue_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable(
                (By.XPATH, "//button[text()='Continue']")
            )
        ).click()
    except:
        return


def handle_cookies_dialog(driver) -> None:
    try:
        just_necessary_btn = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable(
                (By.XPATH, "//button[text()='Just Necessary']")
            )
        ).click()
    except:
        return


def parse_themes_lists(ul) -> list:
    themes = []
    for li in ul:
        try:
            anchor = WebDriverWait(li, 10).until(
                EC.presence_of_element_located(
                    (By.TAG_NAME, "a")
                )
            )
            theme_link = anchor.get_attribute('href')
            pattern_theme = 'themes/(.*)'
            theme = re.search(pattern_theme, theme_link).group(1)

            themes.append(theme)
        except:
            return False

    return themes
