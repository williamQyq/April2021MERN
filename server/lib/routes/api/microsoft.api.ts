import express from 'express';
import auth from '#middleware/auth';
import { DealsAlert, Deals } from 'lib/query/deals.query';
import Microsoft from 'bin/bot/microsoft.bot';
import { MyMessage } from '#root/bin/bot';

const router: express.Router = express.Router();
const logger = new MyMessage();
const deals = new DealsAlert({ storeName: Deals.Microsoft, logger })
// @route GET api/items
router.get('/v1/deals', (req, res) => {
    let model = DealsAlert._MicrosoftDeal;
    deals.getDeals(model)
        .then(items => res.json(items))
        .catch(err => res.status(202).json({ msg: err }));
});

router.get<{ _id: string }>('/peek/v0/getProductDetail/id/:_id', (req, res) => {
    let model = DealsAlert._MicrosoftDeal;
    const { _id } = req.params;
    deals.getDealById(model, _id)
        .then(items => res.json(items))
        .catch((_) => res.status(202).json({ msg: `[${_id}] Deal detail not found.` }));
});

router.get('/crawl/v1/laptop/prices', auth, (req, res) => {
    let bot = new Microsoft();
    bot.getAndSaveLaptopsPrice()
    res.status(202).json({ msg: "Now Retrieving the Deals..." });
})

export default router;