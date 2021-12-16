const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.js');
const config = require('config');
const { ProdPricing } = require('../../models/Amz.js');

const amazonSellingPartner = async () => {
    const CREDENTIALS = config.get('amazonCredentials');
    const IAM = config.get('amazonIAMRole');
    const SellingPartnerAPI = require('amazon-sp-api');

    let sellingPartner = new SellingPartnerAPI({
        region: "na",
        credentials: CREDENTIALS,
        refresh_token: IAM.REFRESH_TOKEN

    });

    return sellingPartner;
}

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
        items.forEach(item => {
            console.log(`${JSON.stringify(item)}\n`)
        });
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
    const { prodLst } = req.body;

    // const newProd = new ProdPricing({
    //     upc: '194721625779',
    //     identifiers: [
    //         {
    //             asin: 'B08B1QY2HY'
    //         },
    //         {
    //             asin: 'B08B8JQRZY'
    //         },

    //     ]
    // })

    prodLst.forEach(prod => {
        pord.asins.forEach(asin => {
            let query = { 'upc': prod.upc, 'identifiers.asin': asin };
            let update = { 'identifiers.asin': asin }
            let options = { upsert: true, new: true, setDefaultsOnInsert: true }

            ProdPricing.findOneAndUpdate(query, update, options).then(item => {
                console.log(`Upc:${item.upc}\nInserted Asin:${asin}`)
                res.json("update ")
            })
        })
    })

});

module.exports = router;