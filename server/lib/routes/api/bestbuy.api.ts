import express, { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import io from '#root/index';
import auth from '#middleware/auth';
import { DealsAlert } from 'lib/query/deals.query';
import {
    getMostViewedOnCategoryId,
    getViewedUltimatelyBought,
    getAlsoBoughtOnSku
} from '#bin/bestbuyIO/bestbuyIO.js';
import { ItemSpecDocument } from '#models/Specification.model'
import Bestbuy from 'bin/bot/bestbuy.bot';

const router: Router = express.Router();

// @route GET api/items
// @access private
router.get('/v1/deals', auth, (req, res) => {
    let deals = new DealsAlert();
    const model = DealsAlert._BestbuyDeal;

    deals.getDeals(model)
        .then(items => res.json(items))
        .catch(err => res.status(202).json({
            msg: "Service Unavailable",
            reason: err.message
        }));
});

// @route GET api/items
// @access public
router.get('/v1/deal/detail/id/:_id', (req: Request<{ _id: mongoose.ObjectId }>, res: Response) => {
    const { _id } = req.params
    let deals = new DealsAlert();
    const model = DealsAlert._BestbuyDeal;

    deals.getDealById(model, _id).then(items => {
        res.json(items)
    }).catch(err => {
        res.status(202).json({ msg: `[${_id}]Deal detail not found.` })
    });
});

// @access private
router.put('/item-specification/', auth, (req, res) => {
    const { link, sku } = req.body as { link: URL | string, sku: string };
    let bestbuy = new Bestbuy();
    let deals = new DealsAlert();

    deals.findItemSpecOnSku(sku).then((doc: ItemSpecDocument) => {
        if (doc) {
            return res.status(202).json({ msg: `${doc.upc}[upc] Item config already exists.` })
        }
    })
        .then(() => { bestbuy.fetchAndSaveItemSpecification(link as string, sku); })
        .then(() => res.json({ msg: `Request received and being processed.\n\n [URL]:${link}` }))
        .catch(errorMsg => {
            console.error(`[ERROR] Get item config error\n`, errorMsg)
            res.status(202).json({ msg: "Get item spec failed." })
        })
})

// @access private
router.get('/peek/v0/getMostViewed/categoryId/:categoryId', auth, (req, res) => {
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
router.get('/peek/v0/getViewedUltimatelyBought/sku/:sku', auth, (req, res) => {
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
router.get('/peek/v0/getAlsoBought/sku/:sku', auth, (req, res) => {
    getAlsoBoughtOnSku(req.params.sku)
        .then(result => {
            console.log(`\nbestbuy api also bought request received...`)
            if (result === undefined) {
                res.status(400).json({ msg: "Bestbuy api also bought no available data" })
            }
            res.json(result)
        })
})

router.get('/crawl/v1/laptop/prices', auth, (req, res) => {
    let bestbuy = new Bestbuy();
    bestbuy.getAndSaveLaptopsPrice()
        .then(() => {
            res.json({ msg: "get online price success" });
            io.sockets.emit("ON_RETRIEVED_BB_ITEMS_ONLINE_PRICE", { msg: "get online price success" });
        })
        .catch(err => {
            res.status(500).json({ msg: `Fail to retrive Bestbuy Laptop Price \n\n${err}` })
            io.sockets.emit("RETRIEVE_BB_ITEMS_ONLINE_PRICE_ERROR", { msg: `Fail to retrive Bestbuy Laptop Price \n\n${err}` })
        })
})

export default router;