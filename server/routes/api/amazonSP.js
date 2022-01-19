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
    ProdPricing.find().then(products => res.json(products));
});

// @route POST api/amazonSP
// desc: save upc asin mapping Schema for ProductPricing API
router.post('/upload/asins-mapping', (req, res) => {
    const { uploadFile } = req.body
    uploadFile.shift();
    console.log(`received file:======${JSON.stringify(uploadFile)}`)
    processMappingFile(uploadFile).then(result => {
        console.log(`process finished: ${result}`)
        res.json(result)
    })
})

const processMappingFile = (file) => {
    return Promise.all(
        file.map(row => {
            let upc = row[0];
            let asin = row[1];
            return upsertNewAsin({ upc, asin })
        })
    )
}

const insertNewProd = prod => {

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
const upsertNewAsin = ({ upc, asin }) => {
    let newIdentifier = new Identifier({
        asin: asin,
    })
    let newProd = new ProdPricing({
        _id: false,
        upc: upc,
        identifiers: [newIdentifier]
    })
    return ProdPricing.updateOne(
        { 'upc': upc, 'identifiers.asin': asin },
        { newProd },
        { upsert: true }
    ).then(doc => {
        console.log(`doc======\n${JSON.stringify(doc, null, 4)}`)
    })
}

module.exports = router;