import matplotlib.pyplot as plt
import sys
import json
# import asyncio
import keepa
import numpy as np
import datetime
import pandas as pd
import mypackage.config as config


class Laptops:
    asins = []

    def __init__(self, search_term) -> object:
        self.api = keepa.Keepa(config.KEEPA_ACCESS_KEY)
        self.product_parms = {
            'categories_include': [
                config.LAPTOPS_CODE,
                config.TRADITIONAL_LAPTOPS_CODE,
                config.TABLET_LAPTOPS_CODE
            ],
            'title': search_term,
            'current_SALES_lte': config.DEFAULT_SALES_RANK_LIMITS
        }

    def get_asins(self):
        self.asins = self.api.product_finder(self.product_parms)
        return self.asins

    def get_products(self, asins):
        return self.api.query(asins, offers=20)

    def get_sales_rank(self, products):
        return products['data']['df_SALES']

    def get_offers(self, product):
        offers = product['offers']

        # each offer contains the price history of each offer
        offer = offers[0]
        csv = offer['offerCSV']

        # convert these values to numpy arrays
        times, prices = keepa.convert_offer_history(csv)

        # for a list of active offers, see
        indices = product['liveOffersOrder']

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
            plt.scatter(offer_times[i], offer_prices[i])
        plt.show()


def get_keepa_statistics():
    # search_term = json.loads(sys.argv[1])
    search_term = "HP ENVY Ryzen 5 5500U"

    laptop = Laptops(search_term)
    # asins = laptop.get_asins()
    asins = ['B09234WZPX']
    products = laptop.get_products(asins)

    laptop.get_offers(products[0])
    # keepa.plot_product(products[0])
    # print(products[0]['liveOffersOrder'])


get_keepa_statistics()
