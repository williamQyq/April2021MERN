import express from 'express';
import Bestbuy from '#bin/helper/BB.js';
import Model from '#models/BBItem.js';
import { getItemConfiguration } from '#bin/scraper.js';
import {
    saveItemConfiguration,
    getStoreItemDetailById,
    getStoreItems,
    findItemConfigDocumentOnSku
} from '#query/utilities.js';
import { getMostViewedOnCategoryId, getViewedUltimatelyBought } from '#bin/bestbuyIO/bestbuyIO.js';
import { getAlsoBoughtOnSku } from '#bin/bestbuyIO/bestbuyIO.js';
import auth from '#middleware/auth.js';

const router = express.Router();

// @route GET api/items
router.get('/', auth, (req, res) => {
    getStoreItems(Model)
        .then(items => res.json(items));

});

// @route GET api/items
router.get('/detail/:_id', (req, res) => {
    getStoreItemDetailById(Model, req.params._id)
        .then(items => {
            res.json(items)
        });
});

router.put('/itemSpec/add', auth, (req, res) => {
    const { link, sku } = req.body;
    let bestbuy = new Bestbuy();
    let message = { status: undefined, msg: undefined, id: undefined };


    findItemConfigDocumentOnSku(sku)
        .then(doc => {
            if (doc) {
                message = {
                    status: 409,
                    msg: "Item config already exists.",
                    id: doc.upc
                }
                throw message
            }
        })
        .then(() => getItemConfiguration(bestbuy, link)
            .catch(e => {
                message = {
                    status: 502,
                    msg: "Get item spec failed.",
                    id: null
                }
                throw message;
            }))
        .then((itemConfig) => saveItemConfiguration(itemConfig, sku))
        .then((doc) => res.json({ status: 200, msg: "Upsert item config finished.", id: doc.upc }))
        .catch(errorMsg => {
            console.error(`[ERROR] Get item config error\n`, errorMsg)
            res.json(errorMsg)
        })
})

router.get('/mostViewed/:categoryId', (req, res) => {
    console.log(`\nbestbuy api most viewed request received...`)
    getMostViewedOnCategoryId(req.params.categoryId)
        .then(result => {
            res.json(result)
        })
});

router.get('/viewedUltimatelyBought/:sku', (req, res) => {
    console.log(`\nbestbuy api ultimately bought request received...`)
    getViewedUltimatelyBought(req.params.sku)
        .then(result => {
            res.json(result)
        })
})

router.get('/alsoBought/:sku', (req, res) => {
    console.log(`\nbestbuy api also bought request received...`)
    getAlsoBoughtOnSku(req.params.sku)
        .then(result => {
            res.json(result)
        })
})

export default router;