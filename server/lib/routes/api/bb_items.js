import express from 'express';
import Bestbuy from '#bin/helper/BB.js';
import Model from '#models/BBItem.js';
import { getItemConfiguration } from '#bin/scraper.js';
import {
    saveItemConfiguration,
    getStoreItemDetailById,
    getStoreItems,
    itemConfigHasDocument
} from '#query/utilities.js';
import { getMostViewedOnCategoryId, getViewedUltimatelyBought } from '#bin/bestbuyIO/bestbuyIO.js';


const router = express.Router();

// @route GET api/items
router.get('/', (req, res) => {
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

router.put('/itemSpec/add', (req, res) => {
    const { link, sku } = req.body;
    let bestbuy = new Bestbuy();
    let message = { status: undefined, msg: undefined, id: undefined };


    itemConfigHasDocument(sku)
        .then(hasDoc => {
            if (hasDoc) {
                message = {
                    status: "warning",
                    msg: "Item config already exists.",
                    id: doc.upc
                }
                throw message
            }
        })
        .then(() => getItemConfiguration(bestbuy, link).catch(e => {
            message = {
                status: "error",
                msg: "Get item spec failed.",
                id: null
            }
            throw message;
        }))
        .then((config) => saveItemConfiguration(config, sku).then(() => {
            return config.UPC
        }))
        .then((upc) => res.json({ status: "success", msg: "Upsert item config finished.", id: upc }))
        .catch(errorMsg => {
            console.error(`[ERROR] Get item config error\n`, errorMsg)
            res.json(errorMsg)
        })
})

router.get('/mostViewed/:categoryId', (req, res) => {
    getMostViewedOnCategoryId(req.params.categoryId)
        .then(result => {
            res.json(result)
        })
});

router.get('/viewedUltimatelyBought/:sku', (req, res) => {
    getViewedUltimatelyBought(req.params.sku)
        .then(result => {
            res.json(result)
        })
})

export default router;