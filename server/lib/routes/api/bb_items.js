import express from 'express';
import Bestbuy from '#bin/helper/BB.js';
import { getItemConfiguration } from '#bin/scraper.js';
import { getMostViewedOnCategoryId, getViewedUltimatelyBought } from '#bin/bestbuyIO/bestbuyIO.js';
import { getAlsoBoughtOnSku } from '#bin/bestbuyIO/bestbuyIO.js';
import auth from '#middleware/auth.js';
import { getBestbuyLaptops } from '#bin/scraper.js';
import { AlertApi } from '../../query/utilities.js';

const router = express.Router();

// @route GET api/items
// @access private
router.get('/', auth, (req, res) => {
    let alertApi = new AlertApi();
    let model = alertApi.getBestbuyAlertModel();

    alertApi.getStoreItems(model)
        .then(items => res.json(items))
        .catch(err => res.status(503).json({ msg: "Service Unavailable" }));
});

// @route GET api/items
// @access public
router.get('/detail/:_id', (req, res) => {
    let alertApi = new AlertApi();
    let model = alertApi.getBestbuyAlertModel();
    alertApi.getStoreItemDetailById(model, req.params._id)
        .then(items => {
            res.json(items)
        })
        .catch(err => {
            res.status(400).json({ msg: "Item detail not exists" })
        });
});

// @access private
router.put('/itemSpec/add', auth, (req, res) => {
    const { link, sku } = req.body;
    let bestbuy = new Bestbuy();
    let alertApi = new AlertApi();
    let model = alertApi.getBestbuyAlertModel();

    alertApi.findItemConfigDocumentOnSku(sku)
        .then(doc => {
            if (doc) {
                res.status(400).json({ msg: `${doc.upc}[upc] Item config already exists.` })
            }
        })
        .then(() => getItemConfiguration(bestbuy, link))
        .then((itemConfig) => alertApi.saveItemConfiguration(itemConfig, sku))
        .then((doc) => res.json({ msg: `Upsert ${doc.upc} item config finished.` }))
        .catch(errorMsg => {
            console.error(`[ERROR] Get item config error\n`, errorMsg)
            res.status(502).json({ msg: "Get item spec failed." })
        })
})

// @access private
router.get('/mostViewed/:categoryId', auth, (req, res) => {
    getMostViewedOnCategoryId(req.params.categoryId)
        .then(result => {
            console.log(`\nbestbuy api most viewed request received...`)
            if (result === undefined) {
                res.status(400).json({ msg: "Bestbuy api most viewed no available data" })
            }
            res.json(result)
        })
});

// @access private
router.get('/viewedUltimatelyBought/:sku', auth, (req, res) => {
    getViewedUltimatelyBought(req.params.sku)
        .then(result => {
            console.log(`\nbestbuy api ultimately bought request received...`)
            if (result === undefined) {
                res.status(400).json({ msg: "Bestbuy api ultimately bought no available data" })
            }
            res.json(result)
        })
})

// @access private
router.get('/alsoBought/:sku', auth, (req, res) => {
    getAlsoBoughtOnSku(req.params.sku)
        .then(result => {
            console.log(`\nbestbuy api also bought request received...`)
            if (result === undefined) {
                res.status(400).json({ msg: "Bestbuy api also bought no available data" })
            }
            res.json(result)
        })
})

router.get('/onlinePrice', auth, (req, res) => {
    getBestbuyLaptops()
        .then(() => res.json("success"))
        .catch(err => res.status(500).json({ msg: "Fail to retrive Bestbuy Laptop Price " }))
})

export default router;