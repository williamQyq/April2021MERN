import express from 'express';
const router = express.Router();
import auth from '#middleware/auth.js';
import { updateProdPricingCatalogItems } from '#bin/amazonSP/SPAPI/SP.js';
import { OperationApi } from '#query/utilities.js';

// @route GET api/amazonSP
// @desc: get all amazon seller central sync product pricing offers 
router.get('/products/pricing/v0/price', (req, res) => {
    let api = new OperationApi();
    api.findAllProdPricing()
        .then(products => { res.json(products) });
});

// @route POST api/amazonSP
// @desc: save upc asin mapping Schema for ProductPricing API
router.post('/upload/v0/asinsMapping', auth, (req, res) => {
    const { uploadFile } = req.body
    console.log(`=======received file:======\n${JSON.stringify(uploadFile)}\n\n`)
    processMappingFile(uploadFile)
        .then(() => { res.json({ msg: 'success' }) })
        .then(() => updateProdPricingCatalogItems())
        .catch(e => {
            res.status(400).json({ msg: `Upload File contains Invalid Input\n\n${e}` })
        })
        .finally(() => console.log('Upload Finished'))
})

/* 
@attention: can be improve later, grouping upc asin, reduce I/O
@param: file: Array<Array<upc:string,asin:string>>
@return: Promise.allSettled
*/
const processMappingFile = async (file) => {
    let api = new OperationApi();
    file.shift();

    return Promise.allSettled(file.map(row => {
        let upc = row[0];
        let asin = row[1];
        return api.upsertProdPricingNewAsin(upc, asin)
    })
    )
}

export default router;