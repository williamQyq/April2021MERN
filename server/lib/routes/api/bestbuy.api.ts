import express, { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import io from '#root/index';
import { AxiosError } from 'axios';
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
router.get('/v1/deal/detail/id/:_id', (req: Request<{ _id: string }>, res: Response) => {
    const { _id } = req.params
    let deals = new DealsAlert();
    const model = DealsAlert._BestbuyDeal;

    deals.getDealById(model, _id)
        .then(items => res.json(items))
        .catch(err => {
            res.status(202).json({ msg: `[${_id}] Deal detail not found.` })
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
            res.json(result)
        })
        .catch((err: AxiosError<{ errorCode: string, errorMessage: string }>) => {
            let errorCode = err.response ? Number(err.response!.data.errorCode) : 400;
            res.status(errorCode).json({ msg: err.response?.data.errorMessage });
        })
});

// @access private
router.get('/peek/v0/getViewedUltimatelyBought/sku/:sku', auth, (req, res) => {
    getViewedUltimatelyBought(req.params.sku)
        .then(result => {
            console.log(`\nbestbuy api ultimately bought request received...`)
            res.json(result)
        })
        .catch((err: AxiosError<{ errorCode: string, errorMessage: string }>) => {
            let errorCode = err.response ? Number(err.response!.data.errorCode) : 400;
            res.status(errorCode).json({ msg: err.response?.data.errorMessage });
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
    res.status(202).json({ msg: "Now Retrieving the Deals..." });
})

export default router;