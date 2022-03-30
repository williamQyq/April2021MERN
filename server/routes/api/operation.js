import express from 'express';
const router = express.Router();
import auth from '../../middleware/auth.js';
import { getSellingPartnerProdPricing } from '../../amazonSP/amazonSchedule.js';
import { findAllProdPricing, upsertProdPricingNewAsin } from '../../query/utilities.js';

// @route GET api/amazonSP
// @desc: get all amazon seller central sync product pricing offers 
router.get('/', (req, res) => {
    findAllProdPricing().then(products => res.json(products));
});

// @route POST api/amazonSP
// @desc: save upc asin mapping Schema for ProductPricing API
router.post('/upload/asins-mapping', (req, res) => {
    const { uploadFile } = req.body
    console.log(`=======received file:======\n${JSON.stringify(uploadFile)}\n\n`)
    processMappingFile(uploadFile)
        .then(() => res.json('success'))
        .then(() => findAllProdPricing())
        .then(prods => getSellingPartnerProdPricing(prods))
        .catch(e => {
            console.log(`error:`, e)
            res.status(400).json({ msg: 'Upload File contains Invalid Input' })
        })
})

const processMappingFile = (file) => {
    file.shift();
    return Promise.allSettled(file.map(row => {
        let upc = row[0];
        let asin = row[1];
        return upsertProdPricingNewAsin(upc, asin)
    })
    )
}


export default router;