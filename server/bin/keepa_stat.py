from typing import List
from keepa.plotting import plot_product
import matplotlib.pyplot as plt
import sys
import json
# import asyncio
import keepa
import numpy as np
import datetime
from numpy.core.fromnumeric import prod
import pandas as pd
import mypackage.config as config


class Product:
    def __init__(self, search_term) -> object:
        self.api = keepa.Keepa(config.KEEPA_ACCESS_KEY)
        self.product_parms = None
        self.asins = None

    def get_asins(self) -> list:
        self.asins = self.api.product_finder(self.product_parms)
        return self.asins

    def get_products(self, asins) -> list:
        return self.api.query(asins, offers=20)

    def get_sales_rank(self, products) -> dict:
        return products['data']['df_SALES']

    def get_offers(self, product) -> None:
        offers = product['offers']

        # each offer contains the price history of each offer
        offer = offers[0]
        csv = offer['offerCSV']

        # convert these values to numpy arrays
        times, prices = keepa.convert_offer_history(csv)
        # for a list of active offers, see
        indices = product['liveOffersOrder']
        print(indices)
        print(product['offers'])
        # with this you can loop through active offers:
        indices = product['liveOffersOrder']
        offer_times = []
        offer_prices = []
        for index in indices:
            csv = offers[index]['offerCSV']
            times, prices = keepa.convert_offer_history(csv)
            offer_times.append(times)
            offer_prices.append(prices)

        # you can aggregate these using np.hstack or plot at the history individually
        for i in range(len(offer_prices)):
            plt.step(offer_times[i], offer_prices[i])
        plt.show()

    def get_product_price_history(self, indices, offers):
        offer_times = []
        offer_prices = []
        for index in indices:
            csv = offers[index]['offerCSV']
            times, prices = keepa.convert_offer_history(csv)
            offer_prices.append(prices)
            offer_times.append(times)

        return offer_prices, offer_times,

    def plot_time_price_chart(self, offer_times, offer_prices):
        # you can aggregate these using np.hstack or plot at the history individually
        for i in range(len(offer_prices)):
            plt.step(offer_times[i], offer_prices[i])
        plt.show()

    def show_products_price_trend(self, products) -> None:
        offer_times = []
        offer_prices = []

        for product in products:
            print(product['liveOfferOrder'])
        #     offers = product['offers']
        #     # for a list of active offers, you can loop through active offers:
        #     # the index of current live offer
        #     indices = product['liveOffersOrder']

        #     product_offer_times, product_offer_prices = self.get_product_price_history(
        #         indices, offers)
        #     offer_times.append(product_offer_times)
        #     offer_prices.append(product_offer_prices)

        # self.plot_time_price_chart(offer_times, offer_prices)


class Laptops (Product):
    def __init__(self, search_term) -> None:
        super().__init__(search_term)

        self.product_parms = {
            'categories_include': [
                config.LAPTOPS_CODE,
                config.TRADITIONAL_LAPTOPS_CODE,
                config.TABLET_LAPTOPS_CODE
            ],
            'title': search_term,
            'current_SALES_lte': config.DEFAULT_SALES_RANK_LIMITS
        }


class CableClip (Product):
    def __init__(self, search_term) -> None:
        super().__init__(search_term)

        self.product_parms = {
            'categories_include': [
                config.ELECTRONICS_CODE,
                config.CABLE_STRAPS,
            ],
            'title': search_term,
            'current_SALES_lte': config.DEFAULT_SALES_RANK_LIMITS
        }


# keepa.plot_product: SALESRANK PLOT chart
# useage: keepa.plot_product(products[0])

# CATEGORY.get_offers: price chart

def get_keepa_statistics():
    # search_term = json.loads(sys.argv[1])
    # search_term = "HP ENVY Ryzen 5 5500U"
    # laptop = Laptops(search_term)
    # asins = ['B08966H6XJ']
    # laptop.get_offers(products[0])
    # products = laptop.get_products(asins)

    cable_clip = CableClip(search_term="cable clip")
    asins = cable_clip.get_asins()
    products = cable_clip.get_products(asins)
    cable_clip.show_products_price_trend(products)


get_keepa_statistics()
