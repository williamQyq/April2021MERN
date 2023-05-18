import express from 'express';
import auth from '#middleware/auth';
import { DealsAlert } from 'lib/query/deals.query';
import io from '#root/index';
import Microsoft from 'bin/bot/microsoft.bot';
import { ObjectId } from 'mongoose';

const router = express.Router();

// @route GET api/items
router.get('/v1/deals', (req, res) => {
    let alert = new DealsAlert();
    let model = DealsAlert._MicrosoftDeal;
    alert.getDeals(model)
        .then(items => res.json(items))
        .catch(err => res.status(503).json({ msg: err }));
});

router.get<{ _id: ObjectId }>('/peek/v0/getProductDetail/id/:_id', (req, res) => {
    let alert = new DealsAlert();
    let model = DealsAlert._MicrosoftDeal;
    alert.getDealById(model, req.params._id)
        .then(items => res.json(items))
        .catch(err => res.status(503).json({ msg: err }));
});

router.get('/crawl/v1/laptop/prices', auth, (req, res) => {
    // setTimeout(() => {
    //     res.json({ msg: "get online price success" })
    //     // io.on('connection', (socket) => {
    //     //     socket.emit("ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE", { msg: " online price success" })
    //     // })
    //     io.sockets.emit("ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE", { msg: " online price success" })
    // }, 3000)
    let puppeteer = new Microsoft();
    puppeteer.getAndSaveLaptopsPrice()
        .then(() => {
            res.json({ msg: "get online price success" })
            io.sockets.emit("ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE", { msg: "get online price success" });
        })
        .catch(err => {
            res.status(500).json({ msg: `Fail to retrive Microsoft Laptop Price \n\n${err}` });
            io.sockets.emit("RETRIEVE_MS_ITEMS_ONLINE_PRICE_ERROR", { msg: `Fail to retrive Microsoft Laptop Price \n\n${err}` });
        })
})

export default router;