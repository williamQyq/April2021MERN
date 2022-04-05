import express from 'express';
import auth from '../../middleware/auth.js';
import { getKeepaStat } from '../../bin/keepa.js';
const router = express.Router();

// @route GET api/items
router.get('/', (req, res) => {

    getKeepaStat(req.query.searchTerm).then(stat => {
        console.log(`keepa routes : ${JSON.stringify(stat)}`);
        res.json(stat);
    })
        .catch(err => {
            console.error(err);
        })

});
export default router;