class Product {
    constructor(_id,link){
        this._id = _id;
        this.link = link;
        this.name = null;
        this.price_timestamp = {
            price:null
        }
    }
}

module.exports = { Product}