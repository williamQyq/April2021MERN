const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.js');
const { getSellingPartnerProdPricing } = require('../../amazonSP/amazonSchedule.js');
const { findAllProdPricing, upsertProdPricingNewAsin } = require('../../query/utitlities.js');

// @route GET api/amazonSP
// @desc: get all amazon seller central sync product pricing offers 
router.get('/', (req, res) => {
    findAllProdPricing().then(products => res.json(products));
});

// @route POST api/amazonSP
// @desc: save upc asin mapping Schema for ProductPricing API
router.post('/upload/asins-mapping', (req, res) => {
    const { uploadFile } = req.body
    console.log(`received file:======${JSON.stringify(uploadFile)}`)
    processMappingFile(uploadFile)
        .then(res.json('success'))
        .then(() => { getSellingPartnerProdPricing() })
        .catch(e => {
            console.log(`error:`, e)
            res.json('err')
        })
})

const processMappingFile = (file) => {
    file.shift();
    return Promise.all(
        file.map(row => {
            let upc = row[0];
            let asin = row[1];
            return upsertProdPricingNewAsin({ upc, asin })
        })
    )
}


module.exports = router;