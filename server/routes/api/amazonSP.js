const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.js');
const config = require('config');
const { ProdPricing } = require('../../models/Amz.js');
const { amazonSellingPartner } = require('../../amazonSP/RateLimiter.js');


//@route GET api/amazonSP/productPricing
router.post('/prod_pricing', async (req, res) => {
    const { asins } = req.body

    const amzSP = await amazonSellingPartner();
    try {
        let items = await amzSP.callAPI({
            operation: 'getPricing',
            endpoint: 'productPricing',
            query: {
                MarketplaceId: 'ATVPDKIKX0DER',
                Asins: asins,
                ItemType: 'Asin'
            },
        });
        // items.forEach(item => {
        //     console.log(`${JSON.stringify(item)}\n`)
        // });
        res.json(items)

    } catch (e) {
        console.error(`AWS SP API ERROR:\n${e}`)
    }
});

router.get('/', (req, res) => {

    ProdPricing.find()
        .then(products => res.json(products));
});

router.post('/', (req, res) => {
    const prodLst = req.body;
    prodLst.forEach(prod => {
        const newProd = new ProdPricing({
            upc: prod.upc,
            identifiers: []
        })
        prod.asins.forEach(asin => {
            const identifier = {
                asin: asin,
            }
            newProd.identifiers.push(identifier)
        })
        newProd.save().then(result => res.json(result));
    })

});

module.exports = router;