import express from 'express';
import mongoose from 'mongoose';
import auth from '#middleware/auth.js';
import { getMicrosoftLaptops } from '#bin/scraper.js';
import { AlertApi } from '../../query/utilities.js';

const ObjectId = mongoose.Types.ObjectId;
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

router.get('/onlinePrice', auth, (req, res) => {
    getMicrosoftLaptops()
        .then(() => res.json("success"))
        .catch(err => res.status(500).json({ msg: "Fail to retrive Microsoft Laptop Price " }))
})

export default router;