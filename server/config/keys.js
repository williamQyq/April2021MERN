const { Collection } = require("mongoose");

module.exports = {
    mongoURL: "mongodb+srv://w:q@cluster0.lkscp.mongodb.net/DB?retryWrites=true&w=majority",
    db:"DB",
    collections:{
        productsPriceListings:"product_price_listings",
        itemListingsBB:"bb_item_listings"
    }
};