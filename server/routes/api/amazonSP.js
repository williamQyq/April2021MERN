const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.js');
const config = require('config');

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
router.post('/productPricing', async (req, res) => {
    console.log(`req.body:${JSON.stringify(req.body)}`)

    const amzSP = await amazonSellingPartner();
    try {
        let items = await amzSP.callAPI({
            operation: 'getPricing',
            endpoint: 'productPricing',
            query: {
                MarketplaceId: 'ATVPDKIKX0DER',
                Asins: req.body.asins,
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

router.post('/upcAsinMapping', (req, res) => {
    const newItem = new ProdPricing({
        upc: '194721625779',
        identifiers: [
            {
                asin: 'B08B1QY2HY'
            },
            {
                asin: 'B08B8JQRZY'
            },

        ]
    })
    newItem.save().then(item => res.json(item))
})


module.exports = router;