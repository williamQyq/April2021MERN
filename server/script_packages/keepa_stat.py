import sys
import json
import keepa
import numpy as np
import datetime
from numpy.core.fromnumeric import product
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

    def get_sales_rank(self, products):
        return products['data']['df_SALES']

    def get_products(self, asins):
        return self.api.query(asins)


def get_keepa_statistics():
    # search_term = json.loads(sys.argv[1])
    search_term = "HP ENVY Ryzen 5 5500U"

    laptop = Laptops(search_term)
    asins = laptop.get_asins()
    products = laptop.get_products(asins)

    df = pd.DataFrame(products[0]['data']['df_SALES'])
    print(df.tail(3))
    # print(laptop.get_asins())


get_keepa_statistics()
