const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.js');
const { ProdPricing, Identifier } = require('../../models/Amz.js');
const { amazonSellingPartner } = require('../../amazonSP/RateLimiter.js');


//@route GET api/amazonSP/productPricing
// desc: Deprecated!
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

// @route GET api/amazonSP
// desc: get all amazon seller central sync product pricing offers 
router.get('/', (req, res) => {
    ProdPricing.find()
        .then(products => res.json(products));
});

// @route POST api/amazonSP
// desc: save upc asin mapping Schema for ProductPricing API
router.post('/upload/mapping/asins', (req, res) => {
    const prodLst = req.body;
    processNewUpcAsins(prodLst).then(result => res.json(result))
})

const processNewUpcAsins = (prods) => {
    return Promise.all(prods.map(prod =>
        ProdPricing.findOne({ "upc": prod.upc }).then(prodPreExist =>
            prodPreExist ? upsertNewAsin(prod) : insertNewProd(prod)
        )
    ))
}

const insertNewProd = async (prod) => {

    let newProd = new ProdPricing({
        upc: prod.upc,
        identifiers: []
    })
    prod.asins.forEach(asin => {
        let identifier = new Identifier({
            asin: asin,
        })
        newProd.identifiers.push(identifier)
    })
    return newProd.save();
}
//upsert new asin into identifiers if not exist
const upsertNewAsin = async (product) => {
    let { asins, upc } = product;
    for (const asin of asins) {
        let isAsinMappingExist = await ProdPricing.findOne({ "upc": upc, "identifiers.asin": asin })
        if (!isAsinMappingExist) {
            let newIdentifier = new Identifier({
                asin: asin,
            })
            let result = await ProdPricing.updateOne(
                { "upc": upc }, { $push: { "identifiers": newIdentifier } })
        }
    }
    return { msg: "upsert new asins finished" }
}

module.exports = router;