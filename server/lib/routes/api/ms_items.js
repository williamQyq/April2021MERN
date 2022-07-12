import express from 'express';
import auth from '#middleware/auth.js';
import { AlertApi } from '../../query/utilities.js';
import io from '../../../index.js';

const router = express.Router();

// @route GET api/items
router.get('/', (req, res) => {
    let alertApi = new AlertApi();
    let model = alertApi.getMicrosoftAlertModel();
    alertApi.getStoreItems(model)
        .then(items => res.json(items))
        .catch(err => res.status(503).json({ msg: err }));
});

router.get('/detail/:_id', (req, res) => {
    let alertApi = new AlertApi();
    let model = alertApi.getMicrosoftAlertModel();
    alertApi.getStoreItemDetailById(model, req.params._id)
        .then(items => res.json(items))
        .catch(err => res.status(503).json({ msg: err }));
});

router.get('/getOnlinePrice', auth, (req, res) => {
    setTimeout(() => {
        res.json({ msg: "get online price success" })
        io.sockets.emit("ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE", { msg: " online price success" });
    }, 3000)
    // let puppeteer = new Microsoft();
    // puppeteer.getAndSaveMicrosoftLaptopsPrice()
    //     .then(() => {
    //         res.json({ msg: "get online price success" })
    //         io.sockets.emit("ON_RETRIEVED_MS_ITEMS_ONLINE_PRICE", { msg: "get online price success" });
    //     })
    //     .catch(err => {
    //         res.status(500).json({ msg: `Fail to retrive Microsoft Laptop Price \n\n${err}` });
    //         io.sockets.emit("FAILED_RETRIEVED_MS_ITEMS_ONLINE_PRICE", { msg: `Fail to retrive Microsoft Laptop Price \n\n${err}` });
    //     })
})

export default router;