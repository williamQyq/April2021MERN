const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.js');
const { ProdPricing, Identifier } = require('../../models/Amz.js');

// @route GET api/amazonSP
// @desc: get all amazon seller central sync product pricing offers 
router.get('/', (req, res) => {
    ProdPricing.find().then(products => res.json(products));
});

// @route POST api/amazonSP
// @desc: save upc asin mapping Schema for ProductPricing API
router.post('/upload/asins-mapping', (req, res) => {
    const { uploadFile } = req.body
    uploadFile.shift();
    console.log(`received file:======${JSON.stringify(uploadFile)}`)
    processMappingFile(uploadFile).then(() => {
        res.json('success')
    }).catch(e => {
        console.log(`error:`, e)
        res.json('err')
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
//upsert new asin into identifiers if not exist
const upsertNewAsin = ({ upc, asin }) => {
    let newIdentifier = new Identifier({
        asin: asin,
    })
    let newProd = new ProdPricing({
        upc: upc,
        identifiers: []
    })
    newProd.identifiers.push(newIdentifier)

    const query = { 'upc': upc }
    const update = { $push: { identifiers: newIdentifier }, $setOnInsert: { newProd } }
    const option = { upsert: true, new: true, useFindAndModify: false };
    return ProdPricing.findOneAndUpdate(query, update, option)
}

module.exports = router;