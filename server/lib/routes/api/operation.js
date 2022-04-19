import express from 'express';
const router = express.Router();
import auth from '#middleware/auth.js';
import { upsertProdPricingNewAsin, findAllProdPricing } from '#query/utilities.js';
import { updateProdPricingCatalogItems } from '#amz/SPAPI/SP.js';
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
        .then(() => { res.json('success') })
        .then(() => updateProdPricingCatalogItems())
        .catch(e => {
            console.log(`error:`, e)
            res.status(400).json({ msg: 'Upload File contains Invalid Input' })
        })
        .finally(() => console.log('Upload Finished'))
})

/* 
@attention: can be improve later, grouping upc asin, reduce I/O
@param: file: Array<Array<upc:string,asin:string>>
@return: Promise.allSettled
*/
const processMappingFile = async (file) => {
    file.shift();
    return Promise.allSettled(file.map(row => {
        let upc = row[0];
        let asin = row[1];
        return upsertProdPricingNewAsin(upc, asin)
    })
    )
}


export default router;