import express from 'express';
import auth from '../../middleware/auth.js';
import wms from '../../wms/wmsDatabase.js';
import { outputGsheet } from '../../script_packages/gsheet/gsheet.js';
const router = express.Router();

//@route GET api/wms
router.get('/inv-receive/wrongadds', (req, res) => {
    const collection = wms.getDatabase().collection('inventoryReceive')
    collection.find({ 'orgNm': 'wrongadds' }).toArray()
        .then(docs => {
            console.log(`[routes] receive inventoryReceive wrongadds GET request...`)
            res.json(docs)
            return docs;
        }).then(docs => {
            outputGsheet(docs)
        })
});

export default router;