const { Collection } = require("mongoose");

module.exports = {
    mongoURI: "mongodb+srv://w:q@cluster0.lkscp.mongodb.net/DB?retryWrites=true&w=majority",
    DB:"DB",
    Collections:{
        ProductsPriceListings:"product_price_listings",
        BBItemListings:"bb_item_listings"
    }
};