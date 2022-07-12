import express from 'express';
import auth from '#middleware/auth.js';
import wms from '#wms/wmsDatabase.js';
import { outputGsheet } from '#bin/gsheet/gsheet.js';
import { OperationApi } from '../../query/utilities';
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

router.post('/inventoryReceive/updateRecOnTracking', (req, res) => {
    const { uploadFile } = req.body;
    console.log(`receive file: ${JSON.stringify(uploadFile, null, 4)}\n`)
    updateRecOnTracking(uploadFile)
        .then(() => { res.json({ msg: 'sucess' }) })
        .catch(e => {
            res.status(400).json({ msg: `Upload File contains Invalid Input\n${e}` })
        })
})

const updateRecOnTracking = async (file) => {
    let api = new OperationApi();
    file.shift();
    return Promise.allSettled(file.map(row => {
        let tracking = row[0];
        let orgNm = row[1];
        return;
    }))
}


export default router;